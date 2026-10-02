import ProductPage, {
  getProductMetadata,
  generateStaticParams,
} from "@/app/(zh)/products/[slug]/page";
export { generateStaticParams };
export async function generateMetadata({ params }) {
  return getProductMetadata(params, "en");
}
export default function Page({ params }) {
  return <ProductPage params={params} locale="en" />;
}
