import assert from "node:assert/strict";
import fs from "node:fs/promises";

// The application module stays .js; this check does not change the package's
// module type or need a bundler, browser, DOM shim or extra test dependency.
const source = await fs.readFile(
  new URL("../lib/behaviors/work-choreography.js", import.meta.url),
  "utf8",
);
const {
  createMobileWorkGeometry,
  getMobileWorkMotionState,
  getWorkMotionState,
  smoothWorkEntrance,
  workRailTravel,
  WORK_MOTION,
  WORK_STEP_STOPS,
} = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);

function close(actual, expected, tolerance = 1e-8, message = "") {
  assert(
    Math.abs(actual - expected) <= tolerance,
    `${message}: ${actual} must be within ${tolerance} of ${expected}`,
  );
}

const standardViewports = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
];
const poseKeys = [
  "firstX",
  "firstY",
  "firstScale",
  "firstRotation",
  "railX",
  "followingX",
  "underlayOpacity",
  "underlayScale",
];
const boundaries = [
  WORK_MOTION.entryStart,
  WORK_MOTION.entryEnd,
  WORK_MOTION.revealStart,
  WORK_MOTION.revealEnd,
  WORK_MOTION.railStart,
  WORK_MOTION.railEnd,
  0.1,
  0.26,
  ...WORK_STEP_STOPS,
];

assert.equal(WORK_STEP_STOPS.length, 5);
assert(WORK_MOTION.entryEnd < WORK_MOTION.railStart);
assert(WORK_STEP_STOPS[0] > WORK_MOTION.entryEnd);
assert(WORK_STEP_STOPS[0] < WORK_MOTION.railStart);
for (let index = 1; index < WORK_STEP_STOPS.length; index += 1)
  assert(WORK_STEP_STOPS[index] > WORK_STEP_STOPS[index - 1]);

for (const viewport of standardViewports) {
  const geometry = { ...viewport, cardWidth: viewport.height * 0.8 };
  const center = (geometry.width - geometry.cardWidth) / 2;
  const pose = (progress) => getWorkMotionState(progress, geometry);

  // Navigation must use the same mapping as the animation. At all five targets,
  // the chosen card is centered, landed, at full scale, and is the active stage.
  WORK_STEP_STOPS.forEach((stop, index) => {
    const state = pose(stop);
    close(
      state.railX + index * geometry.cardWidth + geometry.cardWidth / 2,
      geometry.width / 2,
      1e-7,
      `card ${index + 1} at ${geometry.width}x${geometry.height}`,
    );
    close(state.firstX, 0);
    close(state.firstY, 0);
    close(state.firstScale, 1);
    close(state.firstRotation, 0);
    assert.equal(state.step, index);
  });

  // First card starts with the intended reference pose. Other cards wait outside
  // the stage; the rail remains stationary throughout the entrance and rest.
  const first = pose(0);
  close(first.firstX, geometry.width * 0.45);
  close(first.firstY, geometry.height * 0.7);
  close(first.firstScale, 0.62);
  close(first.firstRotation, 6);
  close(first.railX, center);
  assert(first.railX + geometry.cardWidth + first.followingX >= geometry.width);
  close(pose(WORK_MOTION.entryEnd).railX, center);
  close(pose(WORK_MOTION.railStart).railX, center);
  close(pose(WORK_MOTION.railStart).followingX, 0);

  // Exit and out-of-range progress keep a stable final pose, rather than a final
  // reset or accumulated offset. Reverse motion is the same path in reverse.
  const last = pose(1);
  close(last.railX, center - geometry.cardWidth * 4);
  close(last.followingX, 0);
  assert.equal(last.step, 4);
  assert.deepEqual(pose(-1), first);
  assert.deepEqual(pose(2), last);
  const trajectory = Array.from({ length: 1001 }, (_, index) =>
    pose(index / 1000),
  );
  trajectory.forEach((state, index) => {
    assert.equal(state.step, Math.max(0, Math.min(4, state.step)));
    if (!index) return;
    const previous = trajectory[index - 1];
    for (const key of [
      "firstX",
      "firstY",
      "firstRotation",
      "railX",
      "followingX",
      "underlayOpacity",
      "underlayScale",
    ])
      assert(
        state[key] <= previous[key] + 1e-8,
        `forward monotonicity: ${key}`,
      );
    assert(state.firstScale >= previous.firstScale - 1e-8);
    assert(state.step >= previous.step);
  });
  for (let index = trajectory.length - 1; index >= 0; index -= 1) {
    const state = pose(index / 1000);
    assert.deepEqual(state, trajectory[index]);
    if (index === trajectory.length - 1) continue;
    const previous = trajectory[index + 1];
    assert(state.railX >= previous.railX - 1e-8);
    assert(state.firstY >= previous.firstY - 1e-8);
    assert(state.step <= previous.step);
  }

  // There is no positional or velocity jump at a phase boundary or navigation
  // target. A finite difference checks the actual composed screen-space poses.
  boundaries.forEach((boundary) => {
    const positionDelta = 1e-7;
    const velocityDelta = 1e-6;
    const at = pose(boundary);
    for (const key of poseKeys) {
      close(
        pose(boundary - positionDelta)[key],
        pose(boundary + positionDelta)[key],
        0.02,
        `position continuity at ${boundary}: ${key}`,
      );
      // Three-point one-sided derivatives cancel the ordinary acceleration
      // term, so a fast but smooth part of the entrance is not a false failure.
      const incoming =
        (3 * at[key] -
          4 * pose(boundary - velocityDelta)[key] +
          pose(boundary - velocityDelta * 2)[key]) /
        (velocityDelta * 2);
      const outgoing =
        (-3 * at[key] +
          4 * pose(boundary + velocityDelta)[key] -
          pose(boundary + velocityDelta * 2)[key]) /
        (velocityDelta * 2);
      close(
        incoming,
        outgoing,
        0.05,
        `velocity continuity at ${boundary}: ${key}`,
      );
    }
  });
}

// The easing primitives join their ramps with continuous velocity; both ends
// have zero velocity. These checks prevent reintroducing a hard linear stop.
for (const [fn, joins] of [
  [smoothWorkEntrance, [0, 1]],
  [workRailTravel, [0, WORK_MOTION.railEdge, 1 - WORK_MOTION.railEdge, 1]],
]) {
  close(fn(0), 0);
  close(fn(1), 1);
  const delta = 1e-6;
  for (const join of joins) {
    const incoming = (fn(join) - fn(join - delta)) / delta;
    const outgoing = (fn(join + delta) - fn(join)) / delta;
    close(incoming, outgoing, 1e-4, `easing velocity at ${join}`);
    if (join === 0 || join === 1) close(incoming, 0, 1e-4);
  }
}

// Variable-height phone tickets must expose both the heading and footer using
// the outer page clock. In particular, changing receipt content must extend
// its reading distance instead of clipping it or creating an inner scroller.
const mobileViewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 844, height: 390 },
  { width: 820, height: 1180 },
];
for (const viewport of mobileViewports) {
  const stageInset =
    viewport.height <= 500 ? (viewport.width >= 600 ? 204 : 250) : 302;
  const stageHeight = viewport.height - stageInset;
  const cardHeights = [880, 970, 915, 1100, 990].map((height) =>
    Math.max(stageHeight, height),
  );
  const geometry = createMobileWorkGeometry({
    ...viewport,
    stageHeight,
    cardWidth: Math.min(850, viewport.width - 24),
    cardHeights,
  });
  const poseAtDistance = (distance) =>
    getMobileWorkMotionState(distance / geometry.totalDistance, geometry);
  geometry.stages.forEach((stage, index) => {
    const top = getMobileWorkMotionState(geometry.stops[index], geometry);
    close(top.cardY[index], 0, 1e-7, `phone card ${index + 1} heading`);
    close(
      top.railX + index * geometry.cardWidth + geometry.cardWidth / 2,
      viewport.width / 2,
      1e-7,
      `phone card ${index + 1} centered navigation`,
    );
    close(top.firstScale, 1);
    close(top.firstRotation, 0);
    assert.equal(top.step, index);
    const bottom = poseAtDistance(stage.readEnd);
    close(
      cardHeights[index] + bottom.cardY[index],
      stageHeight,
      1e-7,
      `phone card ${index + 1} footer fits before rail motion`,
    );
    close(bottom.railX, top.railX);
    close(poseAtDistance(stage.end).railX, top.railX);
    if (stage.overflow) {
      const middle = poseAtDistance((stage.readStart + stage.readEnd) / 2);
      close(middle.cardY[index], -stage.overflow / 2);
      close(middle.railX, top.railX);
    }
    const delta = 1e-5;
    for (const boundary of [
      stage.start,
      stage.readStart,
      stage.readEnd,
      stage.end,
      stage.transitionEnd,
    ]) {
      const before = poseAtDistance(boundary - delta);
      const after = poseAtDistance(boundary + delta);
      close(before.railX, after.railX, 0.001, "phone phase rail continuity");
      close(
        before.cardY[index],
        after.cardY[index],
        0.001,
        "phone reading continuity",
      );
    }
  });
  const receiptGrowth = 243;
  const expanded = createMobileWorkGeometry({
    ...viewport,
    stageHeight,
    cardWidth: geometry.cardWidth,
    cardHeights: cardHeights.map((height, index) =>
      index === 3 ? height + receiptGrowth : height,
    ),
  });
  close(expanded.totalDistance - geometry.totalDistance, receiptGrowth);
  close(expanded.stages[3].start, geometry.stages[3].start);
  close(expanded.stages[4].start - geometry.stages[4].start, receiptGrowth);
  const forward = Array.from({ length: 1001 }, (_, index) =>
    getMobileWorkMotionState(index / 1000, geometry),
  );
  forward.forEach((state, index) => {
    if (!index) return;
    const previous = forward[index - 1];
    assert(state.railX <= previous.railX + 1e-8);
    state.cardY.forEach((value, card) => {
      assert(value <= previous.cardY[card] + 1e-8);
      assert(value >= -geometry.stages[card].overflow - 1e-8);
    });
    assert.equal(
      JSON.stringify(state),
      JSON.stringify(getMobileWorkMotionState(index / 1000, geometry)),
      "reverse traversal uses the same measured path",
    );
  });
}

console.log(
  "Work motion check passed: standard desktop centering, entrance sequencing, continuous phase joins, stable endpoints and reverse traversal.",
);
console.log(
  `Standard desktop viewports: ${standardViewports.map(({ width, height }) => `${width}x${height}`).join(", ")}`,
);
console.log(
  "Phone motion check passed: full-height ticket reading, centered heading navigation, footer access before rail travel, dynamic receipt distance and reversible motion.",
);
