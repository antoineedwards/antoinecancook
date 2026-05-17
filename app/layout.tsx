import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Antoine Can Cook",
    template: "%s | Antoine Can Cook",
  },
  description:
    "Elevated home cooking recipes — Jamaican, Indian, Italian, Air Fryer, and more. Real food, real flavour.",
  keywords: ["recipes", "cooking", "Jamaican food", "Indian food", "Italian food", "air fryer", "vegetarian"],
  authors: [{ name: "Antoine" }],
  openGraph: {
    type: "website",
    siteName: "Antoine Can Cook",
    title: "Antoine Can Cook",
    description: "Elevated home cooking recipes — real food, real flavour.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
