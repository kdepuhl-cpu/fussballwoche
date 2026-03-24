"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import TagInput from "@/components/admin/TagInput";
import InfoTooltip from "@/components/admin/InfoTooltip";
import ImageUpload from "@/components/admin/ImageUpload";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { createJob, type JobInput, getAllClubsAdmin } from "@/lib/api/admin";
import { LIGEN } from "@/lib/types";

const JOB_CATEGORIES = [
  { value: "trainer", label: "Trainer/in" },
  { value: "spieler", label: "Spieler/in" },
  { value: "schiedsrichter", label: "Schiedsrichter/in" },
  { value: "testspiel", label: "Testspiel-Partner" },
];

const JOB_TYPES = [
  { value: "vollzeit", label: "Vollzeit" },
  { value: "teilzeit", label: "Teilzeit" },
  { value: "ehrenamtlich", label: "Ehrenamtlich" },
  { value: "minijob", label: "Minijob" },
];


export default function NewJobPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Neuer Job</h1>
            <JobForm />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

interface ClubOption {
  name: string;
  logo_url: string | null;
  league_id: string | null;
  bezirk: string | null;
}

function JobForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Vereine aus DB laden
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  useEffect(() => {
    getAllClubsAdmin().then((data) =>
      setClubs(data.map((c) => ({ name: c.name, logo_url: c.logo_url, league_id: c.league_id, bezirk: c.bezirk })))
    ).catch(() => {});
  }, []);

  // Pflichtfelder
  const [title, setTitle] = useState("");
  const [clubName, setClubName] = useState("");
  const [category, setCategory] = useState("trainer");
  const [type, setType] = useState("ehrenamtlich");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Optionale Felder
  const [clubLogoUrl, setClubLogoUrl] = useState("");
  const [district] = useState("");
  const [league, setLeague] = useState("");
  const [requirements, setRequirements] = useState("");
  const [tasks, setTasks] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [compensation, setCompensation] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  // Auto-fill wenn Verein aus Liste gewählt wird
  useEffect(() => {
    const club = clubs.find((c) => c.name === clubName);
    if (club) {
      if (club.logo_url) setClubLogoUrl(club.logo_url);
      if (club.league_id) {
        const liga = LIGEN.find((l) => l.id === club.league_id);
        if (liga) setLeague(liga.name);
      }
    }
  }, [clubName, clubs]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const input: JobInput = {
        title,
        club_name: clubName,
        club_logo_url: clubLogoUrl || null,
        district: district || null,
        league: league || null,
        category,
        type,
        description: description || null,
        requirements: requirements.split("\n").filter(Boolean),
        tasks: tasks.split("\n").filter(Boolean),
        contact_name: contactName || null,
        contact_email: contactEmail || null,
        contact_phone: contactPhone || null,
        compensation: compensation || null,
        published_at: new Date().toISOString(),
        is_featured: isFeatured,
        tags,
        active,
      };

      await createJob(input);
      router.push("/admin/jobs");
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titel <span className="text-red-500">*</span>
            <InfoTooltip text="Z.B. 'Cheftrainer 1. Herren' oder 'Torwart für Landesliga-Team gesucht'" />
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Cheftrainer 1. Herren gesucht"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
        </div>

        {/* Verein */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verein <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            placeholder="Vereinsname eingeben"
            list="club-suggestions"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
          <datalist id="club-suggestions">
            {clubs.map((c) => (
              <option key={c.name} value={c.name} />
            ))}
          </datalist>
          {clubs.find((c) => c.name === clubName) && (
            <p className="text-xs text-forest-green mt-1">
              ✓ Verein erkannt — Logo und Liga werden übernommen
            </p>
          )}
        </div>

        {/* Logo */}
        {clubName && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vereins-Logo</label>
            <ImageUpload value={clubLogoUrl} onChange={setClubLogoUrl} folder="club-logos" compact />
          </div>
        )}

        {/* Kategorie + Typ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategorie <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {JOB_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Typ <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Liga + Vergütung */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Liga</label>
            <select
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              <option value="">— Auswählen —</option>
              {LIGEN.map((l) => (
                <option key={l.id} value={l.name}>{l.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vergütung
              <InfoTooltip text="Z.B. '400 €/Monat', 'Aufwandsentschädigung' oder 'ehrenamtlich'" />
            </label>
            <input
              type="text"
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              placeholder="z.B. 400 €/Monat"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
        </div>

        {/* Checkboxen */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-gray-300 text-forest-green focus:ring-forest-green"
            />
            <span className="text-sm text-gray-700">Aktiv</span>
            <InfoTooltip text="Inaktive Jobs werden nicht öffentlich angezeigt." />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-gray-300 text-forest-green focus:ring-forest-green"
            />
            <span className="text-sm text-gray-700">Featured</span>
            <InfoTooltip text="Wird auf der Startseite hervorgehoben angezeigt." />
          </label>
        </div>
      </div>

      {/* === Beschreibung === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Beschreibung <span className="text-red-500">*</span>
        </h2>
        <MarkdownEditor
          value={description}
          onChange={setDescription}
          required
          placeholder="Beschreibe die Stelle, den Verein und was ihr bietet..."
          rows={8}
        />
      </div>

      {/* === Anforderungen & Aufgaben === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Anforderungen & Aufgaben</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anforderungen
            <InfoTooltip text="Eine Anforderung pro Zeile. Z.B. Trainerlizenz, Erfahrung etc." />
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={4}
            placeholder={"Trainer-B-Lizenz\nErfahrung im Amateurfußball\n..."}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aufgaben
            <InfoTooltip text="Eine Aufgabe pro Zeile. Was erwartet die Person in dieser Rolle?" />
          </label>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            rows={4}
            placeholder={"Leitung des Trainingsbetriebs\nSpielvorbereitung\n..."}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
        </div>
      </div>

      {/* === Kontakt === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Kontakt</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ansprechpartner/in</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Max Mustermann"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="kontakt@verein.de"
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
        </div>
      </div>

      {/* === Tags === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {/* === Aktionen === */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 disabled:opacity-50 transition-colors"
        >
          {saving ? "Speichern..." : "Veröffentlichen"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/jobs")}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
