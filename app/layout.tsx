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

// === Metadata ===
export const metadata: Metadata = {
  title: "SB Accounting",
  description: "SB Accounting - Accounting and Outsourcing Services",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "94x94", type: "image/png" }
    ],
    apple: [
      { url: "/favicon.png", sizes: "94x94", type: "image/png" }
    ],
    shortcut: "/favicon.png",
  },
  verification: {
    google: "8_kSthNcE1HNjmB8v0lscfge92Rxo2II9oocrg3Nbd8",
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
              url: "https://sbaccounting.us",
              logo: "/favicon.png",
              sameAs: [
                "https://www.sbaccounting.us/favicon.png",
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