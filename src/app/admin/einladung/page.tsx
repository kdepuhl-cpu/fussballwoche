"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function EinladungPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <EinladungContent />
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green" />
    </div>
  );
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  used: boolean;
}

function EinladungContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Kein Einladungstoken gefunden.");
      setLoading(false);
      return;
    }

    supabase
      .from("invitations")
      .select("id, email, role, used")
      .eq("token", token)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError("Einladung nicht gefunden oder ungültig.");
        } else if (data.used) {
          setError("Diese Einladung wurde bereits verwendet.");
        } else {
          setInvitation(data as Invitation);
        }
        setLoading(false);
      });
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!invitation || !token) return;
    setError("");
    setSubmitting(true);

    // 1. Registrieren
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: { data: { display_name: name } },
    });

    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }

    // 2. Rolle setzen
    if (authData.user) {
      await supabase
        .from("profiles")
        .update({ role: invitation.role })
        .eq("id", authData.user.id);
    }

    // 3. Einladung als verwendet markieren
    await supabase
      .from("invitations")
      .update({ used: true })
      .eq("id", invitation.id);

    setSuccess(true);
    setSubmitting(false);

    // Nach 2s zum Admin weiterleiten
    setTimeout(() => router.push("/admin"), 2000);
  }

  if (loading) return <LoadingScreen />;

  if (error && !invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Einladung ungültig</h1>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <svg className="w-12 h-12 mx-auto mb-4 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Willkommen im Team!</h1>
            <p className="text-sm text-gray-500">
              Dein Account wurde als <strong>{invitation?.role === "admin" ? "Admin" : "Redakteur"}</strong> erstellt. Du wirst gleich weitergeleitet...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <Image
              src="/icons/fuwo.svg"
              alt="FuWo"
              width={60}
              height={24}
              className="mx-auto mb-3"
            />
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Du wurdest eingeladen!
            </h1>
            <p className="text-sm text-gray-500">
              Erstelle deinen Account als{" "}
              <span className={`inline-flex px-1.5 py-0.5 text-xs font-bold uppercase rounded ${
                invitation?.role === "admin"
                  ? "bg-electric-orange/10 text-electric-orange"
                  : "bg-forest-green/10 text-forest-green"
              }`}>
                {invitation?.role === "admin" ? "Admin" : "Redakteur"}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
              <input
                type="email"
                readOnly
                value={invitation?.email ?? ""}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein Name"
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mind. 6 Zeichen"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Account wird erstellt..." : "Account erstellen"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
