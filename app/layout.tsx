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
  title: "SB Accounting | Professional Accounting & Outsourcing Services",
  description: "SB Accounting offers expert accounting, bookkeeping, tax filing, financial reporting, and fractional CFO services to help your business grow.",
  keywords: [
    "Accounting",
    "Bookkeeping",
    "Tax Services",
    "Outsourcing",
    "Financial Reporting",
    "CFO Services",
    "SB Accounting",
    "US Accounting",
  ],
  authors: [{ name: "SB Accounting" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://www.sbaccounting.us",
  },
  verification: {
    google: "OilkVtmaBnVXLpDJzZ7wcJD5lSl7OJl6i8pjRGhkEwM",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-main.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",

  openGraph: {
    title: "SB Accounting | Professional Accounting & Outsourcing Services",
    description: "SB Accounting offers expert accounting, bookkeeping, tax filing, financial reporting, and fractional CFO services to help your business grow.",
    url: "https://www.sbaccounting.us",
    siteName: "SB Accounting",
    images: [
      {
        url: "https://www.sbaccounting.us/logo-main.png",
        width: 800,
        height: 800,
        alt: "SB Accounting Logo",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "SB Accounting | Professional Accounting & Outsourcing Services",
    description: "SB Accounting offers expert accounting, bookkeeping, tax filing, financial reporting, and fractional CFO services to help your business grow.",
    images: ["https://www.sbaccounting.us/logo-main.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
              url: "https://www.sbaccounting.us",

              // MUST be a clean PNG (Google SERP Logo)
              logo: {
                "@type": "ImageObject",
                "url": "https://www.sbaccounting.us/logo-main.png",
                "width": 512,
                "height": 512
              },

              sameAs: [
                "https://www.facebook.com/SBGlobalAccounting/",
                "https://www.linkedin.com/company/sb-accounting/",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-555-5555", // Replace with actual number if available
                contactType: "customer service",
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
