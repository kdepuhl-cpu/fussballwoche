"use client";

import { useState, FormEvent } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface NewsletterSignupProps {
  variant?: "inline" | "banner" | "footer";
  className?: string;
}

const LOCALSTORAGE_KEY = "fw_newsletter_subscribers";

function storeEmailLocally(email: string): { success: boolean; alreadyExists: boolean } {
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    const emails: string[] = stored ? JSON.parse(stored) : [];
    if (emails.includes(email)) {
      return { success: false, alreadyExists: true };
    }
    emails.push(email);
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(emails));
    return { success: true, alreadyExists: false };
  } catch {
    return { success: true, alreadyExists: false };
  }
}

export default function NewsletterSignup({
  variant = "banner",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("newsletter_subscribers")
          .insert({ email, source: "website" });

        if (error) {
          // Unique constraint violation (duplicate email)
          if (error.code === "23505") {
            setStatus("error");
            setErrorMessage("Diese E-Mail ist bereits angemeldet.");
            return;
          }
          throw error;
        }
      } else {
        // Fallback: store in localStorage
        const result = storeEmailLocally(email);
        if (result.alreadyExists) {
          setStatus("error");
          setErrorMessage("Diese E-Mail ist bereits angemeldet.");
          return;
        }
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    }
  };

  // ---------- variant="banner" ----------
  if (variant === "banner") {
    return (
      <section
        className={`bg-forest-green rounded-2xl px-6 py-10 sm:px-10 sm:py-12 my-10 ${className}`}
      >
        {status === "success" ? (
          <div className="text-center py-4">
            <p className="text-white text-xl sm:text-2xl font-headline">
              Willkommen an Bord! Check dein Postfach.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
            {/* Left: copy */}
            <div className="lg:max-w-md">
              <h2 className="font-headline text-3xl sm:text-4xl text-white leading-tight">
                Kurzpass
              </h2>
              <p className="text-white/70 mt-2 text-sm sm:text-base leading-relaxed">
                Die wichtigsten Fussball-News aus Berlin &mdash; jeden Freitag in deinem Postfach.
              </p>
            </div>

            {/* Right: form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[380px]"
            >
              <div className="flex-1 flex flex-col">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="deine@email.de"
                  required
                  className="w-full px-4 py-3 min-h-[44px] rounded-lg bg-white text-off-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                />
                {status === "error" && errorMessage && (
                  <p className="text-electric-orange text-xs mt-1.5">{errorMessage}</p>
                )}
                <p className="text-white/60 text-xs mt-2">
                  Kein Spam. Jederzeit abmelden.
                </p>
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 min-h-[44px] rounded-lg bg-off-black text-white font-semibold text-sm hover:bg-off-black/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Laden...
                  </span>
                ) : (
                  "Anmelden"
                )}
              </button>
            </form>
          </div>
        )}
      </section>
    );
  }

  // ---------- variant="inline" ----------
  if (variant === "inline") {
    return (
      <div
        className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 ${className}`}
      >
        {status === "success" ? (
          <div className="text-center py-2">
            <p className="text-forest-green dark:text-green-400 text-sm font-semibold">
              Willkommen an Bord! Check dein Postfach.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-4 h-4 text-forest-green dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="font-headline text-sm text-off-black dark:text-white uppercase tracking-wider">
                Kurzpass
              </span>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="deine@email.de"
                required
                className="flex-1 px-3 py-2 min-h-[40px] rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-off-black dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green/50 transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-4 py-2 min-h-[40px] rounded-lg bg-forest-green text-white font-semibold text-sm hover:bg-forest-green/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              >
                {status === "loading" ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  "Anmelden"
                )}
              </button>
            </form>
            {status === "error" && errorMessage && (
              <p className="text-electric-orange text-xs mt-1.5">{errorMessage}</p>
            )}
          </>
        )}
      </div>
    );
  }

  // ---------- variant="footer" ----------
  return (
    <div className={className}>
      {status === "success" ? (
        <div className="bg-forest-green/20 border border-forest-green/30 rounded-lg p-4">
          <p className="text-forest-green text-sm flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Willkommen an Bord! Check dein Postfach.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="deine@email.de"
            required
            className="w-full px-4 py-3 min-h-[44px] bg-white/10 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green transition-colors"
          />
          {status === "error" && errorMessage && (
            <p className="text-electric-orange text-xs">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-4 py-3 min-h-[44px] bg-forest-green text-white rounded-lg text-sm font-semibold hover:bg-forest-green/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Laden...
              </span>
            ) : (
              "Anmelden"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
