import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BASE_URL, SITE_DESCRIPTION, SITE_NAME, TAGLINE } from "../lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: `${SITE_NAME} — ${TAGLINE}`,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "DEV-TO-DEV",
    "developer community",
    "developer network",
    "connect with developers",
    "developer projects",
    "technology roadmaps",
    "learn to code",
    "developer questions",
    "find collaborators",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

import Link from "next/link";
import NavigationRoot from "../components/Navigation/NavigationRoot";
import { NavigationProvider } from "../components/Navigation/NavigationProvider";
import CookieConsent from "../components/CookieConsent";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  slogan: TAGLINE,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: BASE_URL,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
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
