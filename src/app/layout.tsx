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

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = "https://anshuukamtextile.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Anshuukam Textile — Garment Manufacturer India",
    template: "%s | Anshuukam Textile",
  },
  description:
    "Premium garment manufacturer in Neemuch, India. T-shirts, hoodies, jackets & workwear. Bulk orders, custom designs, and factory-direct pricing.",
  keywords: [
    "Anshuukam Textile",
    "garment manufacturer India",
    "textile manufacturing",
    "bulk clothing manufacturer",
    "wholesale apparel India",
    "custom garment manufacturing",
    "Neemuch textile factory",
    "Madhya Pradesh garment manufacturer",
    "T-shirt manufacturer India",
    "hoodie manufacturer",
    "workwear manufacturer",
    "private label clothing India",
  ],
  authors: [{ name: "Anshuukam Textile Pvt Ltd" }],
  creator: "Anshuukam Textile Pvt Ltd",
  publisher: "Anshuukam Textile Pvt Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Anshuukam Textile Pvt Ltd",
    title: "Anshuukam Textile — Garment Manufacturer India",
    description:
      "Premium garment manufacturer in Neemuch, India. T-shirts, hoodies, jackets & workwear. Bulk orders, custom designs, factory-direct pricing.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Anshuukam Textile Pvt Ltd Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anshuukam Textile — Garment Manufacturer India",
    description:
      "Premium garment manufacturer in Neemuch, India. T-shirts, hoodies, jackets & workwear. Bulk orders, custom designs, factory-direct pricing.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "your-google-site-verification-code",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Anshuukam Textile Pvt Ltd",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
      description:
        "Premium garment manufacturing company based in Neemuch, Madhya Pradesh, India. Specializing in T-shirts, hoodies, jackets, and workwear.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Industrial Area",
        addressLocality: "Neemuch",
        addressRegion: "Madhya Pradesh",
        postalCode: "458441",
        addressCountry: "IN",
      },
      telephone: "+91-84691-59877",
      email: "info@anshuukam.com",
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-84691-59877",
        contactType: "sales",
        availableLanguage: ["English", "Hindi"],
      },
    },
    {
      "@type": ["LocalBusiness", "Manufacturer"],
      "@id": `${SITE_URL}/#localbusiness`,
      name: "Anshuukam Textile Pvt Ltd",
      image: `${SITE_URL}/logo.png`,
      url: SITE_URL,
      telephone: "+91-84691-59877",
      email: "info@anshuukam.com",
      description:
        "Premium garment manufacturer specializing in T-shirts, hoodies, jackets, and workwear. Bulk orders with factory-direct pricing.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Industrial Area",
        addressLocality: "Neemuch",
        addressRegion: "Madhya Pradesh",
        postalCode: "458441",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 24.543235,
        longitude: 74.935836,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      priceRange: "$$",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Anshuukam Textile Pvt Ltd",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/catalogue?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics - only loads when GA ID is configured */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${spaceGrotesk.variable} ${dmMono.variable} ${cormorantGaramond.variable} ${crimsonPro.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
