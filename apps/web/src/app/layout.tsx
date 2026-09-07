import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DEV-TO-DEV",
  description: "The professional network for developers. Share your projects, find collaborators with complementary skills, and track your growth.",
  openGraph: {
    title: "DEV-TO-DEV",
    description: "The professional network for developers.",
    siteName: "DEV-TO-DEV",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import Link from "next/link";
import NavigationRoot from "../components/Navigation/NavigationRoot";
import { NavigationProvider } from "../components/Navigation/NavigationProvider";
import CookieConsent from "../components/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NavigationProvider>
          <NavigationRoot />
          <main className="page-container">
            {children}
          </main>
          <footer className="site-footer">
            <nav>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms &amp; Conditions</Link>
              <Link href="/cookie-policy">Cookie Policy</Link>
            </nav>
            <p>© {new Date().getFullYear()} DEV-TO-DEV. All rights reserved.</p>
          </footer>
        </NavigationProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
