import DocumentLayout, {
  documentMetadata,
  documentViewport,
} from "@/components/i18n/DocumentLayout";
export const metadata = documentMetadata("zh");
export const viewport = documentViewport;
export default function ChineseLayout({ children }) {
  return <DocumentLayout locale="zh">{children}</DocumentLayout>;
}
