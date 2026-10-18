import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import React, { Suspense } from "react";
import TrackPage from "@/components/TrackPage";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Simple9999 — Free Online Tools for Everyday Work",
    template: "%s | Simple9999",
  },
  description:
    "Discover practical online tools for documents, productivity, and more. Start with the AI-powered Agentic Resume Builder.",
  metadataBase: new URL("https://simple9999.com"),
  other: {
    "google-adsense-account": "ca-pub-4912040667428623",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("RootLayout rendering");
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <GoogleAnalytics />
        <Suspense fallback={null}>
          <TrackPage />
        </Suspense>

        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>

      </body>
    </html>
  );
}
