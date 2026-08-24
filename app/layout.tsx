import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import React from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Display face for the Hero and Footer headlines. Loaded once here rather
// than instantiated separately inside each component.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const title = "Stian Gia Huy Ha — Full-Stack Developer";
const description =
  "Full-stack developer in Bergen, Norway. Next.js, TypeScript, Supabase and AWS — with a data science master's at UiB behind it.";

export const metadata: Metadata = {
  // Required for openGraph/twitter image URLs to resolve absolutely; without it
  // the generated OG card is referenced by a relative path and no crawler finds it.
  metadataBase: new URL("https://stianha.com"),
  title,
  description,
  keywords: ["full-stack developer", "Next.js", "TypeScript", "Supabase", "AWS", "Bergen", "Norway"],
  authors: [{ name: "Stian Gia Huy Ha", url: "https://stianha.com" }],
  openGraph: {
    type: "website",
    locale: "en_NO",
    url: "https://stianha.com",
    siteName: "Stian Gia Huy Ha",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable}`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
