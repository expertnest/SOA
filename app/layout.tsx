// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School for Music Player",
  description: "Learn. Create. Play. — Your journey into sound starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white overflow-x-hidden`}
      >
        {/* 🎵 The Hero section (client behavior handled inside HeroAutoScroll) */}
       

        {/* 🌟 Main app content */}
        <main
          id="main"
          className="relative z-20 bg-black/60 backdrop-blur-md text-white min-h-screen"
        >
          <ClientLayout>{children}</ClientLayout>
        </main>
      </body>
    </html>
  );
}
