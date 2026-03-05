"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";

// Checkmark icon
function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-forest-green dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Chevron icon for FAQ
function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// FAQ accordion item
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left gap-4"
      >
        <span className="text-sm sm:text-base font-semibold text-off-black dark:text-white">
          {question}
        </span>
        <ChevronDownIcon open={open} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-40 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

const DAUERKARTE_FEATURES = [
  "Alle Artikel unbegrenzt lesen",
  "Werbefreies Erlebnis",
  "Erweiterte Vereinsprofile",
  "Tippspiel Pro (Saisonrangliste)",
  "Push-Notifications für deine Vereine",
];

const EHRENTRIBUENE_EXTRA_FEATURES = [
  "Exklusive Analysen & Scouting-Reports",
  "FuWothek Vollzugang (100 Jahre Archiv)",
  "Print-Ausgabe per Post (monatlich)",
  "Einladungen zu FuWo-Events",
  "Name auf der Unterstützer-Wand",
];

const FAQ_ITEMS = [
  {
    question: "Kann ich jederzeit kündigen?",
    answer: "Ja, monatlich kündbar. Kein Vertrag, kein Risiko.",
  },
  {
    question: "Was passiert mit meinen gespeicherten Artikeln?",
    answer: "Deine Bookmarks bleiben erhalten, auch wenn du kündigst.",
  },
  {
    question: "Gibt es einen Studenten-Rabatt?",
    answer: "Schreib uns — wir finden eine Lösung. kontakt@fussballwoche.de",
  },
  {
    question: "Wie funktioniert die Print-Ausgabe?",
    answer: "Die Ehrentribüne enthält monatlich die gedruckte FuWo per Post.",
  },
];

export default function AboPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const dauerkartePrice = billingCycle === "monthly" ? "4,99" : "49,99";
  const dauerkartePeriod = billingCycle === "monthly" ? "/ Monat" : "/ Jahr";
  const dauerkarteSaving = billingCycle === "yearly" ? "2 Monate gratis" : null;

  const ehrentribuenePrice = billingCycle === "monthly" ? "9,99" : "99,99";
  const ehrentribuenePeriod = billingCycle === "monthly" ? "/ Monat" : "/ Jahr";
  const ehrentribueneSaving = billingCycle === "yearly" ? "2 Monate gratis" : null;

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main>
        {/* Hero Section */}
        <section className="px-4 sm:px-6 pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-4xl mx-auto">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-off-black dark:text-white leading-tight">
            Werde Teil der Fußball-Woche
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Wähle deinen Platz — und unterstütze den Berliner Amateurfußball.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span
              className={`text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "text-off-black dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              Monatlich
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors"
              aria-label="Abrechnungszeitraum wechseln"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-forest-green shadow-md transition-transform duration-200 ${
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "text-off-black dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              Jährlich
            </span>
            {billingCycle === "yearly" && (
              <span className="ml-1 px-2 py-0.5 bg-electric-orange/10 text-electric-orange text-xs font-bold rounded-full">
                Spare 17%
              </span>
            )}
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 sm:px-6 pb-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Dauerkarte */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Top Border */}
              <div className="h-1.5 bg-forest-green" />

              <div className="p-6 sm:p-8">
                <h2 className="font-headline text-2xl text-off-black dark:text-white">
                  Dauerkarte
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Für alle, die immer am Ball bleiben wollen.
                </p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-off-black dark:text-white tabular-nums">
                    {dauerkartePrice}€
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {dauerkartePeriod}
                  </span>
                </div>
                {dauerkarteSaving && (
                  <p className="text-xs text-forest-green dark:text-green-400 font-semibold mt-1">
                    {dauerkarteSaving}
                  </p>
                )}

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {DAUERKARTE_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {/* TODO: Connect to Stripe Checkout when payment integration is ready */}
                <a
                  href="#"
                  className="mt-8 flex items-center justify-center w-full py-3.5 rounded-xl bg-forest-green text-white text-sm font-bold hover:bg-forest-green/90 transition-colors"
                >
                  Dauerkarte sichern
                </a>
              </div>
            </div>

            {/* Ehrentribüne (Recommended) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
              {/* Top Border */}
              <div className="h-1.5 bg-electric-orange" />

              {/* Recommended Badge */}
              <div className="absolute top-5 right-5 sm:top-6 sm:right-6">
                <span className="px-3 py-1 bg-electric-orange text-white text-xs font-bold rounded-full">
                  Beliebteste Wahl
                </span>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="font-headline text-2xl text-off-black dark:text-white">
                  Ehrentribüne
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Das volle Programm — für echte Kenner.
                </p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-off-black dark:text-white tabular-nums">
                    {ehrentribuenePrice}€
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {ehrentribuenePeriod}
                  </span>
                </div>
                {ehrentribueneSaving && (
                  <p className="text-xs text-electric-orange font-semibold mt-1">
                    {ehrentribueneSaving}
                  </p>
                )}

                {/* Features — Dauerkarte included */}
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-6 mb-3">
                  Alles aus der Dauerkarte, plus:
                </p>
                <ul className="space-y-3">
                  {EHRENTRIBUENE_EXTRA_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {/* TODO: Connect to Stripe Checkout when payment integration is ready */}
                <a
                  href="#"
                  className="mt-8 flex items-center justify-center w-full py-4 rounded-xl bg-forest-green text-white font-bold hover:bg-forest-green/90 transition-colors text-base"
                >
                  Ehrentribüne sichern
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 sm:px-6 pb-16 max-w-3xl mx-auto">
          <h2 className="font-headline text-2xl sm:text-3xl text-off-black dark:text-white text-center mb-8">
            Häufige Fragen
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="px-4 sm:px-6 pb-16 text-center max-w-3xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 px-6 py-10">
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Noch unsicher? Starte mit unserem kostenlosen Angebot.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-4 text-forest-green dark:text-green-400 font-semibold text-sm hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zurück zur Startseite
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
