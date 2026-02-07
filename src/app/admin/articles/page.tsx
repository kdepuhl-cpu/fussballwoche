"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getAllArticlesAdmin, deleteArticle } from "@/lib/api/admin";
import type { ArticleRow } from "@/lib/api/types";

export default function AdminArticlesPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Artikel</h1>
              <Link
                href="/admin/articles/new"
                className="px-4 py-2 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 transition-colors"
              >
                Neuer Artikel
              </Link>
            </div>
            <ArticlesList />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function ArticlesList() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      const data = await getAllArticlesAdmin();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteArticle(deleteId);
      setArticles((prev) => prev.filter((a) => a.id !== deleteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
    setDeleteId(null);
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Lade Artikel...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>;
  }

  return (
    <>
      <DataTable
        columns={[
          {
            key: "title",
            label: "Titel",
            sortable: true,
            render: (a) => (
              <div>
                <p className="font-medium text-gray-900 truncate max-w-xs">{a.title}</p>
                <p className="text-xs text-gray-400">{a.slug}</p>
              </div>
            ),
          },
          {
            key: "category",
            label: "Kategorie",
            sortable: true,
            render: (a) => (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                {a.category}
              </span>
            ),
          },
          {
            key: "is_featured",
            label: "Featured",
            render: (a) => a.is_featured ? (
              <span className="text-forest-green font-medium text-xs">Ja</span>
            ) : (
              <span className="text-gray-400 text-xs">Nein</span>
            ),
          },
          {
            key: "published_at",
            label: "Datum",
            sortable: true,
            render: (a) => (
              <span className="text-xs text-gray-500">
                {new Date(a.published_at).toLocaleDateString("de-DE")}
              </span>
            ),
          },
        ]}
        data={articles}
        searchPlaceholder="Artikel suchen..."
        searchKeys={["title", "slug", "category"] as (keyof ArticleRow)[]}
        onRowClick={(a) => router.push(`/admin/articles/edit?id=${a.id}`)}
        actions={(a) => (
          <div className="flex gap-2">
            <Link
              href={`/admin/articles/edit?id=${a.id}`}
              className="px-2 py-1 text-xs font-medium text-forest-green hover:bg-forest-green/10 rounded transition-colors"
            >
              Bearbeiten
            </Link>
            <button
              onClick={() => setDeleteId(a.id)}
              className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Löschen
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Artikel löschen"
        message="Möchtest du diesen Artikel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
