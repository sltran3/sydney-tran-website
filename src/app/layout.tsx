import type { Metadata } from "next";
import { Bodoni_Moda, Instrument_Serif, Manrope, Newsreader } from "next/font/google";
import "./globals.css";

// type system:
//   PP Editorial New  main serif: headings, project titles, the about lines (loaded from /public/fonts in globals.css;
//                     Instrument Serif below stands in until those files are added)
//   Bodoni Moda       hero's big words (italic) and Selected WORK (bold)
//   Newsreader        navigation, tools and skills
//   Manrope           body text, labels, and counters
const serif = Instrument_Serif({ variable: "--f-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const sans = Manrope({ variable: "--f-sans", subsets: ["latin"] });
const bodoni = Bodoni_Moda({ variable: "--f-bodoni", subsets: ["latin"], style: ["normal", "italic"] });
const news = Newsreader({ variable: "--f-news", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Sydney Tran",
  description: "Product designer who builds. Computer Science + Advertising at UIUC.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${bodoni.variable} ${news.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* if the sky intro already played this visit, mark it before paint so a refresh doesn't flash the start frame */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem("sky-intro"))document.documentElement.setAttribute("data-sky","seen")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
