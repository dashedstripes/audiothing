import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Banner from "@/components/banner";
import { SanityLive } from "@/sanity/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { ChatButton } from "@/components/chat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "audiothing",
  description: "audio production tips, techniques, reviews and news",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Banner />
        {children}
        <SanityLive />
        {isDraftMode && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
        <Footer />
        <ChatButton />
      </body>
    </html>
  );
}
