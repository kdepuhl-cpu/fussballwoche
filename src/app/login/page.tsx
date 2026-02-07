"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user/auth";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useUser();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === "login") {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Check if onboarding needed — handled by redirect after profile load
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
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/onboarding");
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        {/* Tab Toggle */}
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 mb-8">
          <button
            onClick={() => { setTab("login"); setError(null); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              tab === "login"
                ? "bg-white dark:bg-gray-600 text-off-black dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => { setTab("register"); setError(null); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              tab === "register"
                ? "bg-white dark:bg-gray-600 text-off-black dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Registrieren
          </button>
        </div>

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
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
      </div>
    </div>
  );
}
