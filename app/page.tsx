"use client";

import { Suspense, lazy } from "react";
import PageLoader from "@/components/PageLoader";

// Lazy load the Home component
const Home = lazy(() => import("./home/page"));

export default function page() {
  return (
    <Suspense fallback={<PageLoader message="Loading home page..." />}>
      <Home />
    </Suspense>
  );
}
