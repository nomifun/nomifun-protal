import ProductsPage, { getPageMetadata } from "@/app/(zh)/zh/products/page";
export function generateMetadata() {
  return getPageMetadata("en");
}
export default function Page() {
  return <ProductsPage locale="en" />;
}
