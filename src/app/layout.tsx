import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PWAInstallPrompt from "@/components/ui/PWAInstallPrompt";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "DIAGO - Berliner Amateurfußball News",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#044110" />
        <link rel="apple-touch-icon" href="/icons/diago_logo_rgb_forest-green_icon.svg" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <ScrollToTop />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
