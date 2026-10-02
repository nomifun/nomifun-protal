import DocumentLayout, {
  documentMetadata,
  documentViewport,
} from "@/components/i18n/DocumentLayout";
export const metadata = documentMetadata("en");
export const viewport = documentViewport;
export default function EnglishLayout({ children }) {
  return <DocumentLayout locale="en">{children}</DocumentLayout>;
}
