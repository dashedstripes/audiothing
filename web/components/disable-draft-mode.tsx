"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";
import Link from "next/link";

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();

  // Only show the button outside of Presentation Tool
  if (environment !== "live" && environment !== "unknown") {
    return null;
  }

  return (
    <Link
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-50 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 rounded-md shadow-lg hover:bg-gray-100 transition-colors"
    >
      Disable Draft Mode
    </Link>
  );
}
