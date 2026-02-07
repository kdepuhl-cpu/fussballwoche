"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import TagInput from "@/components/admin/TagInput";
import { createJob, type JobInput } from "@/lib/api/admin";

const JOB_CATEGORIES = ["trainer", "spieler", "ehrenamt", "management", "jugend", "schiedsrichter"];
const JOB_TYPES = ["vollzeit", "teilzeit", "ehrenamtlich", "minijob"];
const BEZIRKE = [
  "Charlottenburg-Wilmersdorf", "Friedrichshain-Kreuzberg", "Lichtenberg",
  "Marzahn-Hellersdorf", "Mitte", "Neukölln", "Pankow", "Reinickendorf",
  "Spandau", "Steglitz-Zehlendorf", "Tempelhof-Schöneberg", "Treptow-Köpenick",
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

function JobForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [clubName, setClubName] = useState("");
  const [clubLogoUrl, setClubLogoUrl] = useState("");
  const [district, setDistrict] = useState("");
  const [league, setLeague] = useState("");
  const [category, setCategory] = useState("trainer");
  const [type, setType] = useState("ehrenamtlich");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [tasks, setTasks] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [compensation, setCompensation] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [tags, setTags] = useState<string[]>([]);

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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Grunddaten</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Verein</label>
            <input type="text" required value={clubName} onChange={(e) => setClubName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vereins-Logo URL</label>
            <input type="url" value={clubLogoUrl} onChange={(e) => setClubLogoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bezirk</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent">
              <option value="">-- Auswählen --</option>
              {BEZIRKE.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent">
              {JOB_CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent">
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Liga</label>
            <input type="text" value={league} onChange={(e) => setLeague(e.target.value)}
              placeholder="z.B. Berlin-Liga"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vergütung</label>
            <input type="text" value={compensation} onChange={(e) => setCompensation(e.target.value)}
              placeholder="z.B. 400 EUR/Monat"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-gray-300 text-forest-green focus:ring-forest-green" />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)}
              className="rounded border-gray-300 text-forest-green focus:ring-forest-green" />
            <span className="text-sm text-gray-700">Aktiv</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Beschreibung</h2>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
          placeholder="Stellenbeschreibung..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Anforderungen & Aufgaben</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anforderungen (eine pro Zeile)</label>
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={4}
            placeholder="Trainer-B-Lizenz&#10;Erfahrung im Amateurfußball&#10;..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aufgaben (eine pro Zeile)</label>
          <textarea value={tasks} onChange={(e) => setTasks(e.target.value)} rows={4}
            placeholder="Leitung des Trainingsbetriebs&#10;Spielvorbereitung&#10;..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Kontakt</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 disabled:opacity-50 transition-colors">
          {saving ? "Speichern..." : "Veröffentlichen"}
        </button>
        <button type="button" onClick={() => router.push("/admin/jobs")}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
