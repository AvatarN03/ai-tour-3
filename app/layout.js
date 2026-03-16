import {
  Noto_Sans,
  Noto_Sans_Tamil,
  Noto_Naskh_Arabic,
  Inter
} from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { AuthProvider } from "@/providers/useAuth";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ['latin'] })

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  variable: "--font-en",
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-ta",
  display: "swap",
});

const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-ar",
  display: "swap",
});

export const metadata = {
  title: "Ai tour",
  description: "version - 2",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${notoSansTamil.variable} ${notoArabic.variable} antialiased scrollbar-gradient`}
      >
      {/* <body
        className={` ${inter.className} antialiased scrollbar-gradient`}
      > */}
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" enableSystem defaultTheme="system">
              <Toaster position="top-center" />
              {children}
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}