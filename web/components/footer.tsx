import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-20 text-center text-sm text-gray-800 mt-auto">
      <div className="mb-2.5">
        <a href="/about" className="text-gray-800 no-underline mx-2.5">
          About Us
        </a>{" "}
        |
        <a href="/privacy" className="text-gray-800 no-underline mx-2.5">
          Privacy
        </a>{" "}
        |
        <a href="/advertise" className="text-gray-800 no-underline mx-2.5">
          Advertise
        </a>
      </div>
      <div>
        © {year} <span className="font-bold">audio</span>thing
      </div>
    </footer>
  );
}
