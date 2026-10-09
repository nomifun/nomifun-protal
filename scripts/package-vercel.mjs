import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exported = path.join(root, "out");
const output = path.join(root, ".vercel", "output");
const functionDir = path.join(output, "functions", "api", "releases.func");

async function filesWithin(directory, prefix = "") {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      return entry.isDirectory()
        ? filesWithin(path.join(directory, entry.name), relative)
        : [relative];
    }),
  );
  return paths.flat().sort();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Require a complete Next export before replacing the previous generated
// package. All deletes are confined to this repository's .vercel/output.
await Promise.all(
  ["index.html", "404.html"].map((name) =>
    fs.access(path.join(exported, name)),
  ),
);
if (
  !output.startsWith(root + path.sep) ||
  path.relative(root, output) !== path.join(".vercel", "output")
) {
  throw new Error("Refusing to replace output outside this repository.");
}
const files = await filesWithin(exported);
await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(functionDir, { recursive: true });
await fs.cp(exported, path.join(output, "static"), { recursive: true });

// Function files live entirely inside its filesystem mount; no Next runtime,
// package dependencies, credentials, or repository content are bundled.
for (const relative of [
  "api/releases.mjs",
  "lib/release-service.mjs",
  "lib/downloads.mjs",
  "lib/github-release-html.mjs",
]) {
  const destination = path.join(functionDir, relative);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(path.join(root, relative), destination);
}
await fs.writeFile(
  path.join(functionDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs22.x",
      handler: "api/releases.mjs",
      launcherType: "Nodejs",
      maxDuration: 15,
    },
    null,
    2,
  ) + "\n",
);

const pageRoutes = files
  .filter((file) => file.endsWith(".html") && file !== "404.html")
  .map((file) => {
    const cleanPath = file === "index.html" ? "/" : `/${file.slice(0, -5)}`;
    return {
      src: cleanPath === "/" ? "^/$" : `^${escapeRegex(cleanPath)}/?$`,
      dest: `/${file}`,
    };
  });
await fs.writeFile(
  path.join(output, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { src: "^/api/releases/?$", dest: "/api/releases" },
        {
          src: "^/_next/static/(.*)$",
          headers: { "Cache-Control": "public, max-age=31536000, immutable" },
          continue: true,
        },
        ...pageRoutes,
        { handle: "filesystem" },
        { src: "^/.*$", status: 404, dest: "/404.html" },
      ],
    },
    null,
    2,
  ) + "\n",
);

console.log(
  `Vercel Build Output v3 packaged: ${files.length} static files, ${pageRoutes.length} static page routes, one Node release metadata Function.`,
);
