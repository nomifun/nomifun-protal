"use client";
import Link from "next/link";
import { useLocale } from "./LocaleProvider";
export default function LocaleLink({ href, ...props }) {
  const { path } = useLocale();
  return <Link href={path(href)} {...props} />;
}
