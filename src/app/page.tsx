"use client";

import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import HeroSection from "@/components/artikel/HeroSection";
import MostPopular from "@/components/artikel/MostPopular";
import LiveTicker from "@/components/LiveTicker";
import VideoReels from "@/components/VideoReels";
import FavoritesSection from "@/components/user/FavoritesSection";
import { artikel } from "@/lib/data";

export default function Home() {
  // Gruppiere Artikel nach Liga
  const bundesligaArtikel = artikel.filter((a) => a.ligaId === "bundesliga-1");
  const zweiteLigaArtikel = artikel.filter((a) => a.ligaId === "bundesliga-2");
  const dritteLigaArtikel = artikel.filter((a) => a.ligaId === "liga-3");
  const regionalArtikel = artikel.filter((a) => a.ligaId === "regionalliga-nordost");
  const oberligaArtikel = artikel.filter((a) => a.ligaId === "oberliga-nofv-nord");
  const berlinLigaArtikel = artikel.filter((a) => a.ligaId === "berlin-liga");

  // Top 5 Artikel für "Meistgelesen" (hier: erste 5 Artikel als Platzhalter)
  const mostPopularArtikel = [
    bundesligaArtikel[0],
    zweiteLigaArtikel[0],
    regionalArtikel[0],
    berlinLigaArtikel[0],
    dritteLigaArtikel[0],
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* Live Ticker */}
      <LiveTicker />

      <main className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        {/* Personalisierte Sektion für eingeloggte User */}
        <FavoritesSection artikel={artikel} />

        {/* Bundesliga Section */}
        {bundesligaArtikel.length > 0 && (
          <HeroSection
            sectionTitle="Bundesliga"
            hero={bundesligaArtikel[0]}
            sidebar={bundesligaArtikel.slice(1, 5)}
          />
        )}

        {/* 2. Liga + Meistgelesen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 border-b border-gray-200 dark:border-gray-700 pb-8 mb-8">
          {/* 2. Liga Section (ohne eigene Border) */}
          <div>
            {zweiteLigaArtikel.length > 0 && (
              <HeroSection
                sectionTitle="2. Bundesliga"
                hero={zweiteLigaArtikel[0]}
                sidebar={zweiteLigaArtikel.slice(1, 5)}
                isLast={true}
              />
            )}
          </div>

          {/* Meistgelesen Sidebar */}
          <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-8">
            <MostPopular articles={mostPopularArtikel} />
          </div>
        </div>

        {/* Video Reels Section */}
        <VideoReels />

        {/* 3. Liga Section */}
        {dritteLigaArtikel.length > 0 && (
          <HeroSection
            sectionTitle="3. Liga"
            hero={dritteLigaArtikel[0]}
            sidebar={dritteLigaArtikel.slice(1, 5)}
          />
        )}

        {/* Regionalliga Section */}
        {regionalArtikel.length > 0 && (
          <HeroSection
            sectionTitle="Regionalliga Nordost"
            hero={regionalArtikel[0]}
            sidebar={regionalArtikel.slice(1, 5)}
          />
        )}

        {/* Oberliga Section */}
        {oberligaArtikel.length > 0 && (
          <HeroSection
            sectionTitle="Oberliga NOFV Nord"
            hero={oberligaArtikel[0]}
            sidebar={oberligaArtikel.slice(1, 5)}
          />
        )}

        {/* Berlin-Liga Section */}
        {berlinLigaArtikel.length > 0 && (
          <HeroSection
            sectionTitle="Berlin-Liga"
            hero={berlinLigaArtikel[0]}
            sidebar={berlinLigaArtikel.slice(1, 5)}
            isLast={true}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
