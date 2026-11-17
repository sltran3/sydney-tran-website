import type { Metadata } from "next";
import { Instrument_Serif, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// fonts from the master doc
const serif = Instrument_Serif({ variable: "--f-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const sans = Manrope({ variable: "--f-sans", subsets: ["latin"] });
const mono = IBM_Plex_Mono({ variable: "--f-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Sydney Tran — Somewhere Between Sky & Screen",
  description: "Product designer who builds. Computer Science + Advertising at UIUC.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
