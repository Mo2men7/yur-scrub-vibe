import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "yur.scrub — Medical Scrubs",
  description: "Premium medical scrubs for healthcare professionals in Egypt",
};

// Root layout is minimal — locale layout handles html/body with proper lang + dir
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
