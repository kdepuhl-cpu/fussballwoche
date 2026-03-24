"use client";

import { useState, useEffect } from "react";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import Link from "next/link";
import { getCrowdfundingStats, type CrowdfundingStats } from "@/lib/api/crowdfunding";

const STARTNEXT_URL = "https://www.startnext.com/fussballwoche";

interface RewardTier {
  name: string;
  price: string;
  league: string;
  perks: string[];
  highlight?: boolean;
}

const REWARDS: RewardTier[] = [
  {
    name: "Kreisliga-Supporter",
    price: "5",
    league: "Kreisliga",
    perks: ["Dein Name auf der Supporter-Wall (Website)"],
  },
  {
    name: "Bezirksliga-Supporter",
    price: "15",
    league: "Bezirksliga",
    perks: [
      "Name in der Erstausgabe (Sonderheft Saison 26/27)",
      "Digitaler FuWo-Sticker-Pack",
    ],
  },
  {
    name: "Berlin-Liga-Supporter",
    price: "30",
    league: "Berlin-Liga",
    perks: [
      "Sonderheft nach Hause (Saisonstart 26/27)",
      "Exklusives Retro-Poster (FuWo-Archiv-Cover)",
    ],
  },
  {
    name: "Oberliga-Supporter",
    price: "50",
    league: "Oberliga",
    perks: [
      "FuWo-Merch (Schal oder Mutze)",
      "3 Print-Ausgaben (ab Saison 26/27)",
    ],
    highlight: true,
  },
  {
    name: "Regionalliga-Supporter",
    price: "100",
    league: "Regionalliga",
    perks: [
      "Digital-Abo (sofort) + Print-Jahresabo (ab 26/27)",
      "Name prominent auf der Website",
    ],
    highlight: true,
  },
  {
    name: "Bundesliga-Supporter",
    price: "250",
    league: "Bundesliga",
    perks: [
      "Einladung zum Launch-Event",
      "Signierte Erstausgabe",
      "Exklusives Gründer-Trikot (limitiert)",
    ],
  },
  {
    name: "Ehrentribüne",
    price: "500",
    league: "Ehrentribüne",
    perks: [
      "1/4-Seite im Sonderheft",
      "Fur deinen Verein, dein Business, deine Mannschaft",
    ],
  },
  {
    name: "Gründungself",
    price: "1.000",
    league: "Gründungself",
    perks: [
      "Eigene Seite in der FuWo + auf der Website",
      "Portrait mit Foto oder Logo — permanent",
    ],
  },
  {
    name: "Gründungspartner",
    price: "2.500+",
    league: "Gründungspartner",
    perks: [
      "Persönliches Gespräch mit der Redaktion",
      "Dauerhaftes Logo auf der Website",
      "Alles aus der Gründungself",
    ],
  },
];

const FAQ = [
  {
    q: "Wann startet die Kampagne?",
    a: "Die Kampagne startet im April 2026 auf Startnext. Trag dich für den Newsletter ein, um den Launch nicht zu verpassen.",
  },
  {
    q: "Wann kommt die Print-Ausgabe?",
    a: "Das Sonderheft (Herren + ggf. Frauen) erscheint zum Saisonstart 2026/27. Bis dahin gibt es die FuWo digital: App, Website, Newsletter und Social Media.",
  },
  {
    q: "Was passiert mit meinem Geld?",
    a: "Jeder Euro fließt direkt in den Aufbau der FuWo: Redaktion, App-Entwicklung, Content-Produktion und die Print-Erstausgabe.",
  },
  {
    q: "Was passiert, wenn das Ziel nicht erreicht wird?",
    a: "Auf Startnext gilt das Alles-oder-Nichts-Prinzip: Wird das Fundingziel nicht erreicht, bekommt jede:r sein Geld zurück.",
  },
  {
    q: "Kann mein Verein auch unterstützen?",
    a: "Ja! Die Gründungself (1.000 Euro) und Gründungspartner (2.500 Euro+) Stufen sind ideal für Vereine, Unternehmen und Institutionen.",
  },
  {
    q: "Gibt es die FuWo auch digital?",
    a: "Ja — die FuWo startet digital first. App, Website und Newsletter kommen vor dem Print-Produkt. Ab der Regionalliga-Stufe (100 Euro) ist das Digital-Abo inklusive.",
  },
];

const MILESTONES = [
  { amount: "50.000", label: "App-Launch + tagliche News" },
  { amount: "100.000", label: "Chefredakteur:in für 6 Monate" },
  { amount: "150.000", label: "Sonderheft Herren zum Saisonstart" },
  { amount: "200.000", label: "Eigene Jugend-Rubrik" },
  { amount: "250.000", label: "Frauen-Sonderheft + Vereinsprofile" },
];

function ProgressBar({ current, goal, supporters }: { current: number; goal: number; supporters: number }) {
  const percentage = Math.min((current / goal) * 100, 100);
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-3xl font-bold text-off-black dark:text-white">
            {current.toLocaleString("de-DE")}&euro;
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            von {goal.toLocaleString("de-DE")}&euro;
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {percentage.toFixed(0)}%
          </span>
          <p className="text-xs text-gray-400">{supporters} Unterstützer</p>
        </div>
      </div>
      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-electric-orange rounded-full transition-all duration-700"
          style={{ width: `${Math.max(percentage, 1)}%` }}
        />
      </div>
    </div>
  );
}

function RewardCard({ name, price, league, perks, highlight }: RewardTier) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border rounded-xl p-5 flex flex-col transition-shadow hover:shadow-md ${
        highlight
          ? "border-electric-orange ring-1 ring-electric-orange/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-electric-orange uppercase tracking-wider">
            {league}
          </p>
          <h3 className="font-headline text-lg text-off-black dark:text-white mt-0.5">
            {name}
          </h3>
        </div>
        <span className="text-xl font-bold text-forest-green dark:text-neon-green">
          {price}&euro;
        </span>
      </div>
      <ul className="space-y-1.5 flex-1">
        {perks.map((perk, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-forest-green mt-0.5">+</span>
            <span>{perk}</span>
          </li>
        ))}
      </ul>
      <a
        href={STARTNEXT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full py-2.5 min-h-[44px] bg-forest-green text-white rounded-lg text-sm font-semibold hover:bg-forest-green/90 transition-colors text-center block"
      >
        Auswählen
      </a>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-gray-200 dark:border-gray-700">
      <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
        <h3 className="font-semibold text-off-black dark:text-white text-sm pr-4">
          {q}
        </h3>
        <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl leading-none">
          +
        </span>
      </summary>
      <p className="pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {a}
      </p>
    </details>
  );
}

export default function UnterstuetzenPage() {
  const [stats, setStats] = useState<CrowdfundingStats>({
    funding_current: 0,
    funding_goal: 250000,
    supporter_count: 0,
    campaign_url: "https://www.startnext.com/fussballwoche",
    campaign_live: false,
  });

  useEffect(() => {
    getCrowdfundingStats().then(setStats);
  }, []);

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main>
        {/* Hero */}
        <section className="bg-off-black text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-electric-orange font-semibold text-sm uppercase tracking-wider mb-4">
              Crowdfunding-Kampagne
            </p>
            <h1 className="font-headline text-4xl md:text-6xl leading-tight mb-4">
              Berlin, vereint euch!
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              102 Jahre Tradition. Aus der Insolvenz gerettet. Jetzt baut Berlin
              seine Fußball-Zeitung neu auf. Sei dabei — ab 5 Euro.
            </p>
            {/* Video Placeholder */}
            <div className="max-w-2xl mx-auto aspect-video bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-electric-orange/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-electric-orange ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Kampagnen-Video (bald verfügbar)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <ProgressBar current={stats.funding_current} goal={stats.funding_goal} supporters={stats.supporter_count} />
            <a
              href={stats.campaign_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full py-3 min-h-[44px] bg-electric-orange text-white rounded-lg font-semibold hover:bg-electric-orange/90 transition-colors text-center block"
            >
              Jetzt auf Startnext unterstützen
            </a>
          </div>
        </section>

        {/* Warum? */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="font-headline text-2xl md:text-3xl text-off-black dark:text-white text-center mb-4">
            Warum die FuWo?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Uber 100 Jahre war die Fußball-Woche die Stimme des Berliner
            Amateurfussballs. Von der Kreisliga bis zur Regionalliga — kein anderes
            Medium hat so nah berichtet. Im Oktober 2025 war Schluss. Jetzt kommt
            sie zurück.
          </p>
        </section>

        {/* Was euer Geld bewirkt */}
        <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-headline text-2xl md:text-3xl text-off-black dark:text-white text-center mb-10">
              Was euer Geld bewirkt
            </h2>
            <div className="space-y-4">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="shrink-0 w-24 text-right">
                    <span className="font-bold text-forest-green dark:text-neon-green">
                      {m.amount}&euro;
                    </span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-electric-orange mt-1.5 shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reward-Stufen */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-headline text-2xl md:text-3xl text-off-black dark:text-white text-center mb-3">
            Dankeschöns
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-10">
            Benannt nach dem Berliner Ligasystem. Jede Stufe ist ein Aufstieg.
            <br />
            <span className="text-xs">
              Print-Rewards werden zum Saisonstart 2026/27 geliefert. Digitale Rewards greifen sofort.
            </span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REWARDS.map((r) => (
              <RewardCard key={r.name} {...r} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-headline text-2xl md:text-3xl text-off-black dark:text-white text-center mb-8">
              Häufig gestellte Fragen
            </h2>
            <div>
              {FAQ.map((item, i) => (
                <FAQItem key={i} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="max-w-2xl mx-auto px-4 py-16">
          <h2 className="font-headline text-2xl text-off-black dark:text-white text-center mb-2">
            Kein Update verpassen
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
            Trag dich ein und erfahre als Erste:r, wann die Kampagne startet.
          </p>
          <NewsletterSignup variant="inline" />
        </section>

        {/* Supporter Wall Teaser */}
        <section className="bg-forest-green py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-headline text-2xl text-white mb-3">
              Supporter-Wall
            </h2>
            <p className="text-green-200 mb-6">
              Jede:r Unterstützer:in bekommt einen Platz auf unserer Wall. Sei dabei.
            </p>
            <Link
              href="/supporter-wall"
              className="inline-block px-6 py-3 min-h-[44px] bg-white text-forest-green font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Zur Supporter-Wall
            </Link>
          </div>
        </section>

        {/* Kontakt */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Fragen? Schreib uns!
            </p>
            <a
              href="mailto:kontakt@fussballwoche.de"
              className="text-forest-green dark:text-neon-green underline underline-offset-4 hover:opacity-80 transition-opacity font-medium"
            >
              kontakt@fussballwoche.de
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
