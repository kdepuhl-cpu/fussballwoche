import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PWAInstallPrompt from "@/components/ui/PWAInstallPrompt";
import CrowdfundingCTA from "@/components/crowdfunding/CrowdfundingCTA";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Fußball-Woche - Berliner Amateurfußball News",
  description: "Deine News-App für Berliner Amateurfußball und mehr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="c9a343b9-3884-49d1-8d1f-ba8954cb3afc"
          strategy="afterInteractive"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:ital,wght@0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#144B23" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="antialiased pb-14">
        <Providers>
          {children}
          <CrowdfundingCTA />
          <ScrollToTop />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
