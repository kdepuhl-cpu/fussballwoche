"use client";

import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import HeroSection from "@/components/artikel/HeroSection";
import MostPopular from "@/components/artikel/MostPopular";
import LiveTicker from "@/components/LiveTicker";
import VideoReels from "@/components/VideoReels";
import FavoritesSection from "@/components/user/FavoritesSection";
import JobHighlights from "@/components/jobs/JobHighlights";
import CultureSection from "@/components/kultur/CultureSection";
import AdSlot from "@/components/ads/AdSlot";
import PartnerSlider from "@/components/ads/PartnerSlider";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import SpielerDerWoche from "@/components/formate/SpielerDerWoche";
import Kolumne from "@/components/formate/Kolumne";
import InterviewDerWoche from "@/components/formate/InterviewDerWoche";
import CrowdfundingBanner from "@/components/crowdfunding/CrowdfundingBanner";
import { useArticles } from "@/hooks/useArticles";
import { useUser } from "@/lib/user/auth";
import type { Artikel } from "@/lib/types";

type LeagueSection = { id: string; title: string; articles: Artikel[] };

export default function Home() {
  const { articles: artikel } = useArticles();
  const { profile } = useUser();

  // === Artikel nach Liga filtern ===
  const regionalArtikel = artikel.filter((a) => a.ligaId === "regionalliga-nordost");
  const oberligaArtikel = artikel.filter((a) => a.ligaId === "oberliga-nofv-nord");
  const berlinLigaArtikel = artikel.filter((a) => a.ligaId === "berlin-liga" && a.kategorie !== "kultur");
  const bundesligaArtikel = artikel.filter((a) => a.ligaId === "bundesliga-1");
  const zweiteLigaArtikel = artikel.filter((a) => a.ligaId === "bundesliga-2");
  const dritteLigaArtikel = artikel.filter((a) => a.ligaId === "liga-3");
  const kulturArtikel = artikel.filter((a) => a.kategorie === "kultur");
  const interviewArtikel = artikel.find((a) => a.kategorie === "interview");

  // Meistgelesen: Mix aus allen Ligen
  const mostPopularArtikel = [
    regionalArtikel[0],
    oberligaArtikel[0],
    berlinLigaArtikel[0],
    bundesligaArtikel[0],
    zweiteLigaArtikel[0],
  ].filter(Boolean);

  // === Personalisierte Liga-Reihenfolge ===
  const allLeagueSections: LeagueSection[] = [
    { id: "regionalliga-nordost", title: "Regionalliga Nordost", articles: regionalArtikel },
    { id: "oberliga-nofv-nord", title: "Oberliga NOFV Nord", articles: oberligaArtikel },
    { id: "berlin-liga", title: "Berlin-Liga", articles: berlinLigaArtikel },
    { id: "bundesliga-1", title: "Bundesliga", articles: bundesligaArtikel },
    { id: "bundesliga-2", title: "2. Bundesliga", articles: zweiteLigaArtikel },
    { id: "liga-3", title: "3. Liga", articles: dritteLigaArtikel },
  ];

  const favIds = profile?.favorite_league_ids ?? [];
  const orderedSections = favIds.length > 0
    ? [
        ...allLeagueSections.filter(s => favIds.includes(s.id)),
        ...allLeagueSections.filter(s => !favIds.includes(s.id)),
      ]
    : allLeagueSections;

  const activeSections = orderedSections.filter(s => s.articles.length > 0);

  // Chunks fuer Interstitial-Content zwischen den Liga-Sektionen
  const chunk1 = activeSections.slice(0, 2);
  const chunk2 = activeSections.slice(2, 3);
  const chunk3 = activeSections.slice(3, 5);
  const chunk4 = activeSections.slice(5);

  const renderSection = (section: LeagueSection) => {
    if (section.id === "bundesliga-1") {
      return (
        <div key={section.id} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 border-b border-gray-200 dark:border-gray-700 pb-10 mb-10">
          <div>
            <HeroSection
              sectionTitle={section.title}
              hero={section.articles[0]}
              sidebar={section.articles.slice(1, 5)}
              isLast={true}
            />
          </div>
          <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-8">
            <MostPopular articles={mostPopularArtikel} />
          </div>
        </div>
      );
    }
    return (
      <HeroSection
        key={section.id}
        sectionTitle={section.title}
        hero={section.articles[0]}
        sidebar={section.articles.slice(1, 5)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <CrowdfundingBanner />
      <LiveTicker />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* 1. Aufmacher — Thema / Spieler der Woche */}
        <SpielerDerWoche />

        {/* Personalisierte Sektion (eingeloggte User mit Favoritenverein) */}
        <FavoritesSection artikel={artikel} />

        {/* === Liga-Sektionen (personalisierte Reihenfolge) === */}
        {chunk1.map(renderSection)}

        {/* Partner Slider */}
        <div className="my-8">
          <PartnerSlider />
        </div>

        {/* Frauen — Placeholder */}
        <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-headline text-3xl text-off-black dark:text-white">Frauen</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-electric-orange/10 text-electric-orange rounded-full">
              Bundesliga &middot; Regionalliga &middot; Berlin-Liga
            </span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Frauen-Content kommt bald — Regionalliga, Berlin-Liga und mehr.
            </p>
          </div>
        </section>

        {chunk2.map(renderSection)}

        {/* Ad: Leaderboard */}
        <div className="my-8">
          <AdSlot variant="leaderboard" />
        </div>

        {chunk3.map(renderSection)}

        {/* Kommentar / Kolumne */}
        <Kolumne />

        {/* Video Reels */}
        <VideoReels />

        {/* Newsletter: Kurzpass */}
        <NewsletterSignup variant="banner" />

        {/* Ad: Mid-Article */}
        <div className="my-8">
          <AdSlot variant="mid-article" />
        </div>

        {chunk4.map(renderSection)}

        {/* Landesliga — Placeholder */}
        <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-3xl text-off-black dark:text-white">Landesliga</h2>
            <a href="/liga/landesliga" className="text-sm text-forest-green hover:underline">Alle Staffeln &rarr;</a>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Spielberichte und Tabellen der Landesliga Staffel 1 &amp; 2 — bald hier.
            </p>
          </div>
        </section>

        {/* Brandenburgliga — Placeholder */}
        <section className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-headline text-3xl text-off-black dark:text-white">Brandenburgliga</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                Brandenburg
              </span>
            </div>
            <a href="/liga/brandenburgliga" className="text-sm text-forest-green hover:underline">Zur Liga &rarr;</a>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Topspiel, Tabelle und Ansetzungen der Brandenburgliga — bald hier.
            </p>
          </div>
        </section>

        {/* Partner Slider */}
        <div className="my-8">
          <PartnerSlider label="Präsentiert von" />
        </div>

        {/* Kultur & Trends */}
        {kulturArtikel.length > 0 && (
          <CultureSection articles={kulturArtikel} />
        )}

        {/* Jobs */}
        <JobHighlights />

        {/* Interview der Woche */}
        <InterviewDerWoche article={interviewArtikel} />

        {/* Ad: Leaderboard */}
        <div className="my-8">
          <AdSlot variant="leaderboard" />
        </div>

        {/* Newsletter */}
        <NewsletterSignup variant="banner" />
      </main>

      <Footer />
    </div>
  );
}
