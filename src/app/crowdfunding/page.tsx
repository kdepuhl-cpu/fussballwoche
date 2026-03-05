"use client";

import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";

const FUNDING_GOAL = 50000;
const FUNDING_CURRENT = 0;
const SUPPORTER_COUNT = 0;

interface TierProps {
  name: string;
  price: number;
  description: string;
}

const TIERS: TierProps[] = [
  {
    name: "Anpfiff",
    price: 10,
    description: "Dein Name auf unserer Unterstützer-Wand",
  },
  {
    name: "Dauerkarte",
    price: 50,
    description: "6 Monate FuWo Dauerkarte + Nennung",
  },
  {
    name: "Ehrentribüne",
    price: 150,
    description: "12 Monate FuWo Ehrentribüne + Print-Erstausgabe + Nennung",
  },
];

function TierCard({ name, price, description }: TierProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col">
      <h3 className="font-headline text-xl text-off-black dark:text-white mb-1">
        {name}
      </h3>
      <p className="text-2xl font-bold text-forest-green dark:text-green-400 mb-3">
        {price}&euro;
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
        {description}
      </p>
      <button className="mt-6 w-full py-3 min-h-[44px] bg-forest-green text-white rounded-lg text-sm font-semibold hover:bg-forest-green/90 transition-colors">
        Unterstützen
      </button>
    </div>
  );
}

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-2xl font-bold text-off-black dark:text-white">
            {current.toLocaleString("de-DE")}&euro;
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            von {goal.toLocaleString("de-DE")}&euro;
          </span>
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-forest-green rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function CrowdfundingPage() {
  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main>
        {/* Hero */}
        <section className="bg-off-black text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl md:text-6xl leading-tight mb-4">
              Die Fußball-Woche ist zurück
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Über 100 Jahre Berliner Fußball-Kultur. Hilf uns, sie in die Zukunft zu tragen.
            </p>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="max-w-3xl mx-auto px-4 -mt-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <ProgressBar current={FUNDING_CURRENT} goal={FUNDING_GOAL} />
          </div>
        </section>

        {/* Support Tiers */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="font-headline text-2xl md:text-3xl text-off-black dark:text-white text-center mb-10">
            Wähle deine Unterstützung
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <TierCard key={tier.name} {...tier} />
            ))}
          </div>
        </section>

        {/* Warum die FuWo? */}
        <section className="bg-gray-50 dark:bg-gray-800/50 py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-headline text-2xl md:text-3xl text-off-black dark:text-white text-center mb-8">
              Warum die FuWo?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-electric-orange mt-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Die Fußball-Woche war über 100 Jahre die Stimme des Berliner Amateurfußballs — dieses Erbe verdient eine digitale Zukunft.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-electric-orange mt-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Von der Kreisliga bis zur Berlin-Liga: Kein anderes Medium berichtet so nah über den lokalen Fußball in Berlin.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-electric-orange mt-2 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Mit deiner Unterstützung ermöglichst du unabhängigen Fußball-Journalismus — für alle, die den Berliner Amateurfußball lieben.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Supporter Count */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-4xl font-bold text-off-black dark:text-white">
              {SUPPORTER_COUNT}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Unterstützer
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-forest-green py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-white text-lg mb-2">
              Fragen? Schreib uns!
            </p>
            <a
              href="mailto:kontakt@fussballwoche.de"
              className="text-white underline underline-offset-4 hover:text-white/80 transition-colors font-medium"
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

