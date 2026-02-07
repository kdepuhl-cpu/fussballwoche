"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import SlugInput from "@/components/admin/SlugInput";
import { getClubByIdAdmin, updateClub, type ClubRow, type ClubInput } from "@/lib/api/admin";

const BEZIRKE = [
  "Charlottenburg-Wilmersdorf", "Friedrichshain-Kreuzberg", "Lichtenberg",
  "Marzahn-Hellersdorf", "Mitte", "Neukölln", "Pankow", "Reinickendorf",
  "Spandau", "Steglitz-Zehlendorf", "Tempelhof-Schöneberg", "Treptow-Köpenick",
];

export default function EditClubPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Verein bearbeiten</h1>
            <Suspense fallback={<div className="text-gray-400 text-sm">Lade...</div>}>
              <EditForm />
            </Suspense>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function EditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [leagueId, setLeagueId] = useState("");
  const [bezirk, setBezirk] = useState("");
  const [foundedYear, setFoundedYear] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");

  useEffect(() => {
    if (!id) {
      router.replace("/admin/clubs");
      return;
    }

    getClubByIdAdmin(id)
      .then((club: ClubRow) => {
        setName(club.name);
        setShortName(club.short_name);
        setSlug(club.slug);
        setLogoUrl(club.logo_url ?? "");
        setLeagueId(club.league_id ?? "");
        setBezirk(club.bezirk ?? "");
        setFoundedYear(club.founded_year?.toString() ?? "");
        setPrimaryColor(club.primary_color ?? "");
        setSecondaryColor(club.secondary_color ?? "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setError("");
    setSaving(true);

    try {
      const input: Partial<ClubInput> = {
        name,
        short_name: shortName || name,
        slug,
        logo_url: logoUrl || null,
        league_id: leagueId || null,
        bezirk: bezirk || null,
        founded_year: foundedYear ? Number(foundedYear) : null,
        primary_color: primaryColor || null,
        secondary_color: secondaryColor || null,
      };

      await updateClub(id, input);
      router.push("/admin/clubs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern");
      setSaving(false);
    }
  }

  if (loading) return <div className="text-gray-400 text-sm">Lade Verein...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Grunddaten</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kurzname</label>
            <input type="text" value={shortName} onChange={(e) => setShortName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
        </div>

        <SlugInput title={name} slug={slug} onSlugChange={setSlug} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bezirk</label>
            <select value={bezirk} onChange={(e) => setBezirk(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent">
              <option value="">-- Auswählen --</option>
              {BEZIRKE.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Liga-ID</label>
            <input type="text" value={leagueId} onChange={(e) => setLeagueId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gründungsjahr</label>
            <input type="number" min={1800} max={2030} value={foundedYear}
              onChange={(e) => setFoundedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Optik</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <input type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primärfarbe</label>
            <div className="flex gap-2">
              <input type="color" value={primaryColor || "#000000"}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sekundärfarbe</label>
            <div className="flex gap-2">
              <input type="color" value={secondaryColor || "#ffffff"}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
              <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)}
                placeholder="#ffffff"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 disabled:opacity-50 transition-colors">
          {saving ? "Speichern..." : "Speichern"}
        </button>
        <button type="button" onClick={() => router.push("/admin/clubs")}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
