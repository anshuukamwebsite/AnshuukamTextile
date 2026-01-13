import type { Metadata } from "next";
import { Space_Grotesk, DM_Mono, Cormorant_Garamond, Crimson_Pro } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Elegant serif for headings - minimal, sophisticated
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Readable serif for body - pairs beautifully with Cormorant
const crimsonPro = Crimson_Pro({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Anshuukam Textile Pvt Ltd — Where Quality Meets Passion",
    template: "%s | Anshuukam Tex",
  },
  description:
    "Every stitch crafted with care. Premium garment manufacturing from Neemuch, M.P. T-shirts, hoodies, jackets, workwear and more.",
  keywords: [
    "Anshuukam Textile",
    "garment manufacturing",
    "textile manufacturing India",
    "bulk clothing",
    "wholesale apparel",
    "Neemuch textile",
    "Madhya Pradesh garment",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${dmMono.variable} ${cormorantGaramond.variable} ${crimsonPro.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
