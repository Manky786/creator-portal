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
  title: "STAGE Creator Portal",
  description: "Submit your content proposals to STAGE - India's premier regional OTT platform for Haryanvi, Rajasthani, Bhojpuri & Gujarati content",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "STAGE Creator",
  },
  applicationName: "STAGE Creator Portal",
  keywords: ["STAGE", "OTT", "Creator", "Portal", "Content", "Submission", "Regional", "Haryanvi", "Rajasthani", "Bhojpuri", "Gujarati"],
  authors: [{ name: "STAGE OTT Platform" }],
  creator: "STAGE",
  publisher: "STAGE OTT Platform",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "STAGE Creator Portal",
    title: "STAGE Creator Portal - Submit Your Content",
    description: "Submit your content proposals to STAGE - India's premier regional OTT platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "STAGE Creator Portal",
    description: "Submit your content proposals to STAGE - India's premier regional OTT platform",
  },
  icons: {
    icon: "/images/stage-logo-official.png",
    apple: "/images/stage-logo-official.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E11D48" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="STAGE Creator" />
        <meta name="msapplication-TileColor" content="#E11D48" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Splash Screens for iOS */}
        <link rel="apple-touch-icon" href="/images/stage-logo-official.png" />
        <link rel="apple-touch-startup-image" href="/images/stage-logo-official.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
