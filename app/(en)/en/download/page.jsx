import DownloadPage, { getPageMetadata } from "@/app/(zh)/download/page";
export function generateMetadata() {
  return getPageMetadata("en");
}
export default function Page() {
  return <DownloadPage locale="en" />;
}
