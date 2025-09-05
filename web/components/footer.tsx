import Link from "next/link";
import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-20 text-center text-sm text-gray-800 mt-auto">
      <div className="mb-2.5">
        <Link href="/about" className="text-gray-800 no-underline mx-2.5">
          About Us
        </Link>{" "}
        |
        <Link href="/privacy" className="text-gray-800 no-underline mx-2.5">
          Privacy
        </Link>{" "}
        |
        <Link href="/advertise" className="text-gray-800 no-underline mx-2.5">
          Advertise
        </Link>
      </div>
      <div>
        © {year} <span className="font-bold">audio</span>thing
      </div>
    </footer>
  );
}
