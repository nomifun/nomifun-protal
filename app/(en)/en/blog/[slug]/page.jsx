import BlogPostPage, {
  getBlogPostMetadata,
  getBlogStaticParams,
} from "@/app/(zh)/zh/blog/[slug]/page";
export function generateStaticParams() {
  return getBlogStaticParams("en");
}
export async function generateMetadata(props) {
  return getBlogPostMetadata(props, "en");
}
export default function Page({ params }) {
  return <BlogPostPage params={params} locale="en" />;
}
