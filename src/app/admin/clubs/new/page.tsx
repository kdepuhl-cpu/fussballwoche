"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import SlugInput from "@/components/admin/SlugInput";
import InfoTooltip from "@/components/admin/InfoTooltip";
import ImageUpload from "@/components/admin/ImageUpload";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { createClub, type ClubInput } from "@/lib/api/admin";
import { LIGEN } from "@/lib/types";

const BEZIRKE = [
  "Charlottenburg-Wilmersdorf", "Friedrichshain-Kreuzberg", "Lichtenberg",
  "Marzahn-Hellersdorf", "Mitte", "Neukölln", "Pankow", "Reinickendorf",
  "Spandau", "Steglitz-Zehlendorf", "Tempelhof-Schöneberg", "Treptow-Köpenick",
];

export default function NewClubPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Neuer Verein</h1>
            <ClubForm />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function ClubForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Pflicht
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [slug, setSlug] = useState("");
  const [leagueId, setLeagueId] = useState("");

  // Optional — Profil
  const [logoUrl, setLogoUrl] = useState("");
  const [bezirk, setBezirk] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [description, setDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");

  // Kontakt
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWebsite, setContactWebsite] = useState("");

  // Social Media
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const input: ClubInput = {
        name,
        short_name: shortName || name,
        slug,
        logo_url: logoUrl || null,
        league_id: leagueId || null,
        bezirk: bezirk || null,
        founded_year: foundedYear ? Number(foundedYear) : null,
        primary_color: primaryColor || null,
        secondary_color: secondaryColor || null,
        description: description || null,
        profile: {
          kontakt: {
            email: contactEmail || undefined,
            telefon: contactPhone || undefined,
            website: contactWebsite || undefined,
          },
          socialMedia: {
            instagram: instagram || undefined,
            facebook: facebook || undefined,
          },
        },
      };

      await createClub(input);
      router.push("/admin/clubs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>
      )}

      {/* === Grunddaten === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Grunddaten</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Tennis Borussia Berlin"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kurzname
              <InfoTooltip text="Abkürzung oder Spitzname, z.B. 'TeBe' oder 'BFC'. Wird in kompakten Ansichten verwendet." />
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="z.B. TeBe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>

        <SlugInput title={name} slug={slug} onSlugChange={setSlug} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Liga <span className="text-red-500">*</span>
            </label>
            <select
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              <option value="">Liga wählen...</option>
              {LIGEN.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bezirk</label>
            <select
              value={bezirk}
              onChange={(e) => setBezirk(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              <option value="">— Auswählen —</option>
              {BEZIRKE.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gründungsjahr</label>
            <input
              type="number"
              min={1800}
              max={2030}
              value={foundedYear}
              onChange={(e) => setFoundedYear(e.target.value)}
              placeholder="z.B. 1902"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* === Logo === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Vereinswappen</h2>
        <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="club-logos" compact />
      </div>

      {/* === Beschreibung === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Über den Verein
          <InfoTooltip text="Kurzer Text über den Verein — Geschichte, Besonderheiten, was den Club ausmacht." />
        </h2>
        <MarkdownEditor
          value={description}
          onChange={setDescription}
          placeholder="Erzähle etwas über den Verein..."
          rows={6}
        />
      </div>

      {/* === Vereinsfarben === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Vereinsfarben</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primärfarbe</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={primaryColor || "#000000"}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sekundärfarbe</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={secondaryColor || "#ffffff"}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                placeholder="#ffffff"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* === Kontakt === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Kontakt</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="info@verein.de"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="030 12345678"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={contactWebsite}
              onChange={(e) => setContactWebsite(e.target.value)}
              placeholder="https://www.verein.de"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* === Social Media === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Social Media
          <InfoTooltip text="Instagram- und Facebook-Seite des Vereins. Wird auf der Vereinsseite als Feed eingebettet." />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
              <InfoTooltip text="Benutzername ohne @, z.B. 'tennisborussia'" />
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">@</span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value.replace("@", ""))}
                placeholder="vereinsname"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
              <InfoTooltip text="Vollständige URL zur Facebook-Seite des Vereins" />
            </label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/vereinsname"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* === Aktionen === */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 disabled:opacity-50 transition-colors"
        >
          {saving ? "Speichern..." : "Erstellen"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/clubs")}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
