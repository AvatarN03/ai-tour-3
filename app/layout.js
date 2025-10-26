import { Noto_Sans, Noto_Sans_Tamil, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import LanguageProvider from "../components/custom/LanguageProvider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/useAuth";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "devanagari"],
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-noto-sans-tamil",
  subsets: ["tamil"],
  display: "swap",
});

const notoArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata = {
  title: "AI_Tour",
  description: "version - 2 ",
  icons: {
    icon: "/favi.png", // path relative to public/ or app/
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${notoSansTamil.variable} ${notoArabic.variable} antialiased scrollbar-gradient`}>
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
