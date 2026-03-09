"use client";

import "@/i18n/i18n";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Provider({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}