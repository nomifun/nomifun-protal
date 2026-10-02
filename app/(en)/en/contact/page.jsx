import ContactPage, { getPageMetadata } from "@/app/(zh)/contact/page";
export function generateMetadata() {
  return getPageMetadata("en");
}
export default function Page() {
  return <ContactPage locale="en" />;
}
