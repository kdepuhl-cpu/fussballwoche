"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user/auth";

function translateError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("rate limit")) {
    return "Zu viele Versuche. Bitte warte 30 Minuten und versuche es dann erneut.";
  }
  if (lower.includes("invalid login")) {
    return "E-Mail oder Passwort ist falsch.";
  }
  if (lower.includes("email not confirmed")) {
    return "E-Mail-Adresse noch nicht bestätigt. Prüfe dein Postfach.";
  }
  if (lower.includes("user not found")) {
    return "Kein Account mit dieser E-Mail gefunden.";
  }
  if (lower.includes("user already registered")) {
    return "Diese E-Mail ist bereits registriert. Versuche dich anzumelden.";
  }
  if (lower.includes("password") && lower.includes("least")) {
    return "Passwort muss mindestens 6 Zeichen lang sein.";
  }
  return msg;
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useUser();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (tab === "login") {
      const result = await signIn(email, password);
      if (result.error) {
        setError(translateError(result.error));
        setLoading(false);
      } else {
        router.push("/");
      }
    } else {
      if (!name.trim()) {
        setError("Bitte gib deinen Namen ein.");
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, name.trim());
      if (result.error) {
        setError(translateError(result.error));
        setLoading(false);
      } else if (result.confirmEmail) {
        setSuccess("Fast geschafft! Prüfe dein Postfach und bestätige deine E-Mail-Adresse.");
        setLoading(false);
      } else {
        router.push("/onboarding");
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="font-headline text-3xl text-off-black dark:text-white text-center mb-6">
        Willkommen bei der Fußball-Woche
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        {/* Tab Toggle */}
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 mb-8">
          <button
            onClick={() => { setTab("login"); setError(null); setSuccess(null); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              tab === "login"
                ? "bg-white dark:bg-gray-600 text-off-black dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => { setTab("register"); setError(null); setSuccess(null); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              tab === "register"
                ? "bg-white dark:bg-gray-600 text-off-black dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Registrieren
          </button>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-forest-green dark:text-green-400 font-medium">{success}</p>
            <button
              onClick={() => { setTab("login"); setSuccess(null); }}
              className="text-sm text-gray-500 hover:text-forest-green transition-colors"
            >
              Zur Anmeldung
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-off-black dark:text-white focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none transition"
                  placeholder="Dein Name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-off-black dark:text-white focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none transition"
                placeholder="deine@email.de"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-off-black dark:text-white focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none transition"
                placeholder="Mindestens 6 Zeichen"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-forest-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Bitte warten..."
                : tab === "login"
                ? "Anmelden"
                : "Registrieren"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
