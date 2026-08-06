import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Header } from "@/components/layout/Header";
import { site } from "@/lib/content";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.brand} — Frontend Engineer`,
  description: `${site.role}. ${site.summary}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${kanit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
