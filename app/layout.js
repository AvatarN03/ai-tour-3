

import "./globals.css";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { AuthProvider } from "@/context/useAuth";

import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"] })



export const metadata = {
  title: "AI TOUR",
  description: "version - 2",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className}  antialiased scrollbar-gradient`}
      >
     
        <AuthProvider>
            <ThemeProvider attribute="class" enableSystem defaultTheme="system">
              <Toaster position="top-center" />
              {children}
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}