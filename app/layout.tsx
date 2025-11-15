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
    icon: '../public/favicon.ico',
    shortcut: '../public/favicon.ico',
    apple: '../public/favicon.ico',
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