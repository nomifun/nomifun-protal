import ContactPage, { getPageMetadata } from "@/app/(zh)/zh/contact/page";
export function generateMetadata() {
  return getPageMetadata("en");
}
export default function Page() {
  return <ContactPage locale="en" />;
}
