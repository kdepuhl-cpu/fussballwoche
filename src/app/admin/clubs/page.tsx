"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getAllClubsAdmin, deleteClub, type ClubRow } from "@/lib/api/admin";

export default function AdminClubsPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Vereine</h1>
              <Link
                href="/admin/clubs/new"
                className="px-4 py-2 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 transition-colors"
              >
                Neuer Verein
              </Link>
            </div>
            <ClubsList />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function ClubsList() {
  const router = useRouter();
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    getAllClubsAdmin()
      .then(setClubs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteClub(deleteId);
      setClubs((prev) => prev.filter((c) => c.id !== deleteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
    setDeleteId(null);
  }

  if (loading) return <div className="text-gray-400 text-sm">Lade Vereine...</div>;
  if (error) return <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>;

  return (
    <>
      <DataTable
        columns={[
          {
            key: "name",
            label: "Name",
            sortable: true,
            render: (c) => (
              <div className="flex items-center gap-3">
                {c.primary_color && (
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: c.primary_color }}
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.short_name}</p>
                </div>
              </div>
            ),
          },
          {
            key: "slug",
            label: "Slug",
            render: (c) => <span className="text-xs text-gray-500 font-mono">{c.slug}</span>,
          },
          {
            key: "bezirk",
            label: "Bezirk",
            sortable: true,
            render: (c) => <span className="text-xs text-gray-500">{c.bezirk ?? "—"}</span>,
          },
          {
            key: "league_id",
            label: "Liga",
            render: (c) => <span className="text-xs text-gray-500">{c.league_id ?? "—"}</span>,
          },
          {
            key: "founded_year",
            label: "Gegründet",
            sortable: true,
            render: (c) => <span className="text-xs text-gray-500">{c.founded_year ?? "—"}</span>,
          },
        ]}
        data={clubs}
        searchPlaceholder="Vereine suchen..."
        searchKeys={["name", "short_name", "slug"] as (keyof ClubRow)[]}
        onRowClick={(c) => router.push(`/admin/clubs/edit?id=${c.id}`)}
        actions={(c) => (
          <div className="flex gap-2">
            <Link
              href={`/admin/clubs/edit?id=${c.id}`}
              className="px-2 py-1 text-xs font-medium text-forest-green hover:bg-forest-green/10 rounded transition-colors"
            >
              Bearbeiten
            </Link>
            <button
              onClick={() => setDeleteId(c.id)}
              className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Löschen
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Verein löschen"
        message="Möchtest du diesen Verein wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
