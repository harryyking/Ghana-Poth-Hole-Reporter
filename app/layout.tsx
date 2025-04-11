import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSEOTags } from "@/lib/seo";

const brandFont = Inter({subsets: ["latin"]})

export const metadata = getSEOTags({
  title: "HK7",
  description: "Boilerplate for African Devs",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={brandFont.className}
      >
        {children}
      </body>
    </html>
  );
}
