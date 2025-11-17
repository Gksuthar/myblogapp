import type { Metadata } from "next";
// 1. Import the Lexend font
import { Lexend } from "next/font/google";
import "./globals.css";
import { Suspense, lazy } from "react";
import ComponentLoader from "@/components/ComponentLoader";
import NextTopLoader from "nextjs-toploader";

// 2. Define the Lexend font instance
const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend", // Define a CSS variable for Tailwind configuration
});

// Lazy load layout components
const ConditionalHeader = lazy(() => import("@/components/layout/ConditionalHeader"));
const ConditionalFooter = lazy(() => import("@/components/layout/ConditionalFooter"));

export const metadata: Metadata = {
  title: "SB Accounting",
  description: "SB Accounting - Accounting and Outsourcing Services",

  // 1. ADDED YOUR VERIFICATION
  verification: {
    google: "OilkVtmaBnVXLpDJzZ7wcJD5lSl7OJl6i8pjRGhkEwM",
  },

  // 2. KEPT YOUR ORIGINAL, DETAILED ICONS
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.png", sizes: "94x94", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
  },

  // 3. KEPT YOUR ORIGINAL OPEN GRAPH (FOR FACEBOOK, LINKEDIN)
  openGraph: {
    title: "SB Accounting",
    description: "SB Accounting - Accounting and Outsourcing Services",
    url: "https://www.sbaccounting.us",
    siteName: "SB Accounting",
    images: [
      {
        url: "https://www.sbaccounting.us/icon.png", // This uses the 'icon.png' you had
        width: 192,
        height: 192,
        alt: "SB Accounting Logo",
      },
    ],
    type: "website",
  },

  // 4. KEPT YOUR ORIGINAL TWITTER
  twitter: {
    card: "summary_large_image",
    title: "SB Accounting",
    description: "SB Accounting - Accounting and Outsourcing Services",
    images: ["https://www.sbaccounting.us/icon.png"], // This also uses 'icon.png'
  },
};



// === Root Layout ===
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // 3. Apply the font's CSS variable class to the body
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
        {/*
          JSON-LD Organization schema helps search engines (Google) pick up the site logo
          and organization information for rich results / knowledge panels. This won't
          force an instant change in Google search results (indexing delay), but it's
          a recommended step. Replace the URL values below if your production domain
          or logo URL differ.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SB Accounting",
              url: "https://www.sbaccounting.us",
              // Use absolute URL to the site icon (Google requires absolute URLs here)
              logo: "https://www.sbaccounting.us/icon.png",
              sameAs: [
                "https://www.facebook.com/SBGlobalAccounting/",
                "https://www.linkedin.com/company/SB Accounting/"
              ],
            })
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