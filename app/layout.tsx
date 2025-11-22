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
  title: "SB Accounting",
  description: "SB Accounting - Accounting and Outsourcing Services",

  verification: {
    google: "OilkVtmaBnVXLpDJzZ7wcJD5lSl7OJl6i8pjRGhkEwM",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.ico", sizes: "64x64" },
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

  openGraph: {
    title: "SB Accounting",
    description: "SB Accounting - Accounting and Outsourcing Services",
    url: "https://www.sbaccounting.us",
    siteName: "SB Accounting",
    images: [
      {
        url: "https://www.sbaccounting.us/logo.png", // MAIN LOGO FIXED
        width: 512,
        height: 512,
        alt: "SB Accounting Logo",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SB Accounting",
    description: "SB Accounting - Accounting and Outsourcing Services",
    images: ["https://www.sbaccounting.us/logo.png"], // FIXED
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
        <link rel="icon" href="/favicon.ico" />
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
              url: "https://www.sbaccounting.us",

              // MUST be a clean PNG (Google SERP Logo)
              logo: "https://www.sbaccounting.us/logo.png",

              sameAs: [
                "https://www.facebook.com/SBGlobalAccounting/",
                "https://www.linkedin.com/company/sb-accounting/",
              ],
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
