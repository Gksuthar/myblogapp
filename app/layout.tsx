import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Suspense, lazy } from "react";
import ComponentLoader from "@/components/ComponentLoader";
import NextTopLoader from "nextjs-toploader";

// Font
const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

// Lazy imports
const ConditionalHeader = lazy(() =>
  import("@/components/layout/ConditionalHeader")
);
const ConditionalFooter = lazy(() =>
  import("@/components/layout/ConditionalFooter")
);

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sbaccounting.us"),
  title: {
    default: "SB Accounting - Professional Accounting & Bookkeeping Services",
    template: "%s | SB Accounting",
  },
  description:
    "SB Accounting provides seamless outsourcing solutions for accounting firms, enabling them to scale operations, reduce workload, and deliver accurate reports.",
  keywords: [
    "accounting",
    "bookkeeping",
    "tax filing",
    "CFO services",
    "financial reporting",
    "outsourced accounting",
    "accounting services",
    "professional bookkeeping",
  ],
  authors: [{ name: "SB Accounting", url: "https://www.sbaccounting.us" }],
  creator: "SB Accounting",
  publisher: "SB Accounting",

  verification: {
    google: "OilkVtmaBnVXLpDJzZ7wcJD5lSl7OJl6i8pjRGhkEwM",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.png", sizes: "94x94", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [{ url: "/favicon.ico" }],
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.sbaccounting.us",
    siteName: "SB Accounting",
    title: "SB Accounting - Professional Accounting & Bookkeeping Services",
    description:
      "Professional outsourced accounting and bookkeeping services for accounting firms",
    images: [
      {
        url: "https://www.sbaccounting.us/icon.png",
        width: 1200,
        height: 1200,
        alt: "SB Accounting Logo",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@sbaccounting",
    creator: "@sbaccounting",
    title: "SB Accounting - Professional Accounting Services",
    description:
      "Professional outsourced accounting and bookkeeping services",
    images: ["https://www.sbaccounting.us/icon.png"],
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

  alternates: {
    canonical: "https://www.sbaccounting.us",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
      </head>

      <body
        className={`${lexend.variable} antialiased font-lexend`}
        suppressHydrationWarning
      >
        <NextTopLoader
          color="#6366f1"
          height={3}
          showSpinner={false}
          speed={200}
          shadow="0 0 10px #6366f1,0 0 5px #6366f1"
        />

        {/* === ORGANIZATION LOGO SCHEMA FOR GOOGLE === */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SB Accounting",
              alternateName: "SB Accounting & Consulting",
              legalName: "SB Accounting",
              url: "https://www.sbaccounting.us",
              
              // CRITICAL: Logo for Google Search Knowledge Panel
              // Requirements: 112x112px minimum, square aspect ratio, PNG/JPG/SVG
              logo: {
                "@type": "ImageObject",
                url: "https://www.sbaccounting.us/icon.png",
                width: 512,
                height: 512,
                contentUrl: "https://www.sbaccounting.us/icon.png",
              },
              
              // Additional image for rich results
              image: "https://www.sbaccounting.us/icon.png",
              
              description:
                "SB Accounting provides seamless outsourcing solutions for accounting firms, enabling them to scale operations, reduce workload, and deliver accurate reports.",
              
              // Contact information helps Google understand legitimacy
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                availableLanguage: ["English"],
              },
              
              // Social media profiles (verified accounts boost trust)
              sameAs: [
                "https://www.facebook.com/SBGlobalAccounting/",
                "https://www.linkedin.com/company/sb-accounting/",
              ],
            }),
          }}
        />

        {/* === WEBSITE SCHEMA === */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SB Accounting",
              url: "https://www.sbaccounting.us",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.sbaccounting.us/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <Suspense
          fallback={<ComponentLoader height="h-16" message="Loading header..." />}
        >
          <ConditionalHeader />
        </Suspense>

        <main>{children}</main>

        <Suspense
          fallback={<ComponentLoader height="h-32" message="Loading footer..." />}
        >
          <ConditionalFooter />
        </Suspense>
      </body>
    </html>
  );
}
