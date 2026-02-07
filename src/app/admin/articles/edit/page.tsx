"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import SlugInput from "@/components/admin/SlugInput";
import TagInput from "@/components/admin/TagInput";
import { getArticleById, updateArticle, type ArticleInput } from "@/lib/api/admin";
import type { ArticleRow } from "@/lib/api/types";

const CATEGORIES = ["spielbericht", "analyse", "transfer", "news", "interview"];

export default function EditArticlePage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Artikel bearbeiten</h1>
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

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorImage, setAuthorImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [readingTime, setReadingTime] = useState<number>(5);
  const [leagueId, setLeagueId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [publishedAt, setPublishedAt] = useState("");

  useEffect(() => {
    if (!id) {
      router.replace("/admin/articles");
      return;
    }

    getArticleById(id)
      .then((article: ArticleRow) => {
        setTitle(article.title);
        setSlug(article.slug);
        setExcerpt(article.excerpt ?? "");
        setContent(article.content ?? "");
        setCategory(article.category);
        setImageUrl(article.image_url ?? "");
        setImageAlt(article.image_alt ?? "");
        setImageCaption(article.image_caption ?? "");
        setImageCredit(article.image_credit ?? "");
        setAuthorName(article.author_name ?? "");
        setAuthorImage(article.author_image ?? "");
        setIsFeatured(article.is_featured);
        setReadingTime(article.reading_time_minutes ?? 5);
        setLeagueId(article.league_id ?? "");
        setTags(article.tags ?? []);
        setPublishedAt(article.published_at);
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
      const input: Partial<ArticleInput> = {
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
        is_featured: isFeatured,
        reading_time_minutes: readingTime || null,
        league_id: leagueId || null,
        tags,
      };

      await updateArticle(id, input);
      router.push("/admin/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern");
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Lade Artikel...</div>;
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

        <SlugInput title={title} slug={slug} onSlugChange={setSlug} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teaser</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Liga-ID</label>
            <input type="text" value={leagueId} onChange={(e) => setLeagueId(e.target.value)}
              placeholder="z.B. berlin-liga"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesezeit (Min)</label>
            <input type="number" min={1} value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded border-gray-300 text-forest-green focus:ring-forest-green" />
          <span className="text-sm text-gray-700">Featured Artikel</span>
        </label>

        {publishedAt && (
          <p className="text-xs text-gray-400">
            Veröffentlicht: {new Date(publishedAt).toLocaleString("de-DE")}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Inhalt</h2>
        <MarkdownEditor value={content} onChange={setContent} placeholder="Artikelinhalt in Markdown..." />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Bild</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bild-URL</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt-Text</label>
            <input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bildunterschrift</label>
            <input type="text" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit</label>
            <input type="text" value={imageCredit} onChange={(e) => setImageCredit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Autor</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bild-URL</label>
            <input type="url" value={authorImage} onChange={(e) => setAuthorImage(e.target.value)}
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
          {saving ? "Speichern..." : "Speichern"}
        </button>
        <button type="button" onClick={() => router.push("/admin/articles")}
          className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
