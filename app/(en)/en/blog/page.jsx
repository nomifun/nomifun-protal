import BlogPage, { getBlogMetadata } from "@/app/(zh)/zh/blog/page";
export function generateMetadata() {
  return getBlogMetadata("en");
}
export default function Page() {
  return <BlogPage locale="en" />;
}
