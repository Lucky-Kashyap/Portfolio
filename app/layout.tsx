import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/content";
import { seo, siteUrl } from "@/lib/seo";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  applicationName: `${site.brand} Portfolio`,
  authors: [{ name: site.brand, url: siteUrl }],
  creator: site.brand,
  publisher: site.brand,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: siteUrl,
    siteName: `${site.brand} Portfolio`,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.brand} — Frontend Engineer portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${kanit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden font-sans">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <JsonLd />
        <Header />
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
