"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import SlugInput from "@/components/admin/SlugInput";
import TagInput from "@/components/admin/TagInput";
import InfoTooltip from "@/components/admin/InfoTooltip";
import ImageUpload from "@/components/admin/ImageUpload";
import AuthorSelect from "@/components/admin/AuthorSelect";
import { createArticle, type ArticleInput } from "@/lib/api/admin";
import { LIGEN } from "@/lib/types";

const CATEGORIES = [
  { value: "spielbericht", label: "Spielbericht" },
  { value: "analyse", label: "Analyse" },
  { value: "transfer", label: "Transfer" },
  { value: "news", label: "News" },
  { value: "interview", label: "Interview" },
  { value: "kultur", label: "Kultur" },
];

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function NewArticlePage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Neuer Artikel</h1>
            <ArticleForm />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function ArticleForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Pflichtfelder
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");
  const [leagueId, setLeagueId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorImage, setAuthorImage] = useState("");

  // Optionale Felder
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [readingTimeOverride, setReadingTimeOverride] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  // Auto-berechnete Lesezeit
  const autoReadingTime = useMemo(() => estimateReadingTime(content), [content]);
  const readingTime = readingTimeOverride ?? autoReadingTime;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const input: ArticleInput = {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        category,
        image_url: imageUrl || null,
        image_alt: imageAlt || null,
        image_caption: imageCaption || null,
        image_credit: imageCredit || null,
        author_name: authorName || null,
        author_image: authorImage || null,
        published_at: new Date().toISOString(),
        is_featured: isFeatured,
        is_premium: isPremium,
        reading_time_minutes: readingTime,
        league_id: leagueId || null,
        club_ids: [],
        tags,
      };

      await createArticle(input);
      router.push("/admin/articles");
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

        {/* Titel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
        </div>

        {/* Slug */}
        <SlugInput title={title} slug={slug} onSlugChange={setSlug} />

        {/* Teaser */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teaser <span className="text-red-500">*</span>
            <InfoTooltip text="Kurze Vorschau (1-2 Sätze). Erscheint auf der Startseite und in der Artikelliste als Anrisstext." />
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={2}
            placeholder="Worum geht es in diesem Artikel?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
        </div>

        {/* Kategorie + Liga + Lesezeit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lesezeit
              <InfoTooltip text="Wird automatisch aus dem Inhalt berechnet (~200 Wörter/Min). Du kannst den Wert manuell überschreiben." />
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={readingTime}
                onChange={(e) => setReadingTimeOverride(Number(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
              <span className="text-sm text-gray-400 whitespace-nowrap">Min.</span>
            </div>
          </div>
        </div>

        {/* Checkboxen */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-gray-300 text-forest-green focus:ring-forest-green"
            />
            <span className="text-sm text-gray-700">Featured Artikel</span>
            <InfoTooltip text="Wird als Aufmacher-Artikel oben auf der Startseite groß angezeigt." />
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="rounded border-gray-300 text-electric-orange focus:ring-electric-orange"
            />
            <span className="text-sm text-gray-700">Premium</span>
            <InfoTooltip text="Artikel ist nur für zahlende Mitglieder sichtbar (Paywall). Aktuell noch nicht aktiv." />
          </label>
        </div>
      </div>

      {/* === Autor === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Autor <span className="text-red-500">*</span>
        </h2>
        <AuthorSelect
          value={authorName}
          onChange={(name, imageUrl) => {
            setAuthorName(name);
            setAuthorImage(imageUrl);
          }}
        />
      </div>

      {/* === Inhalt === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Inhalt <span className="text-red-500">*</span>
        </h2>
        <MarkdownEditor
          value={content}
          onChange={setContent}
          required
          placeholder="Artikelinhalt schreiben... Nutze die Toolbar oben für Formatierung."
        />
        {content && (
          <p className="text-xs text-gray-400">
            ~{content.trim().split(/\s+/).length} Wörter · {readingTime} Min. Lesezeit
          </p>
        )}
      </div>

      {/* === Bild === */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Hauptbild
          <InfoTooltip text="Das Hauptbild erscheint oben im Artikel und als Vorschau auf der Startseite. Weitere Bilder kannst du im Inhalt über die Toolbar (🖼 Button) einfügen." />
        </h2>
        <ImageUpload value={imageUrl} onChange={setImageUrl} />

        {imageUrl && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt-Text
                <InfoTooltip text="Beschreibt das Bild für Screenreader und Suchmaschinen. Z.B. 'Spieler von TeBe feiert Tor gegen BAK'" />
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Was ist auf dem Bild zu sehen?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bildunterschrift
                <InfoTooltip text="Text unter dem Bild im Artikel. Z.B. 'Jubel nach dem 2:1 in der 89. Minute'" />
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Optionaler Text unter dem Bild"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto: Fotograf/in
              </label>
              <input
                type="text"
                value={imageCredit}
                onChange={(e) => setImageCredit(e.target.value)}
                placeholder="z.B. Max Mustermann"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
              />
            </div>
          </div>
        )}
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
          {saving ? "Speichern..." : "Veroeffentlichen"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
