"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import DataTable from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getAllJobsAdmin, deleteJob } from "@/lib/api/admin";
import type { JobRow } from "@/lib/api/types";

export default function AdminJobsPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
              <Link
                href="/admin/jobs/new"
                className="px-4 py-2 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 transition-colors"
              >
                Neuer Job
              </Link>
            </div>
            <JobsList />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function JobsList() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    getAllJobsAdmin()
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteJob(deleteId);
      setJobs((prev) => prev.filter((j) => j.id !== deleteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Löschen");
    }
    setDeleteId(null);
  }

  if (loading) return <div className="text-gray-400 text-sm">Lade Jobs...</div>;
  if (error) return <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>;

  return (
    <>
      <DataTable
        columns={[
          {
            key: "title",
            label: "Titel",
            sortable: true,
            render: (j) => (
              <div>
                <p className="font-medium text-gray-900 truncate max-w-xs">{j.title}</p>
                <p className="text-xs text-gray-400">{j.club_name}</p>
              </div>
            ),
          },
          {
            key: "category",
            label: "Kategorie",
            sortable: true,
            render: (j) => (
              <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                {j.category}
              </span>
            ),
          },
          {
            key: "type",
            label: "Typ",
            render: (j) => <span className="text-xs text-gray-500">{j.type}</span>,
          },
          {
            key: "active",
            label: "Status",
            render: (j) => j.active ? (
              <span className="text-forest-green font-medium text-xs">Aktiv</span>
            ) : (
              <span className="text-gray-400 text-xs">Inaktiv</span>
            ),
          },
          {
            key: "published_at",
            label: "Datum",
            sortable: true,
            render: (j) => (
              <span className="text-xs text-gray-500">
                {new Date(j.published_at).toLocaleDateString("de-DE")}
              </span>
            ),
          },
        ]}
        data={jobs}
        searchPlaceholder="Jobs suchen..."
        searchKeys={["title", "club_name", "category"] as (keyof JobRow)[]}
        onRowClick={(j) => router.push(`/admin/jobs/edit?id=${j.id}`)}
        actions={(j) => (
          <div className="flex gap-2">
            <Link
              href={`/admin/jobs/edit?id=${j.id}`}
              className="px-2 py-1 text-xs font-medium text-forest-green hover:bg-forest-green/10 rounded transition-colors"
            >
              Bearbeiten
            </Link>
            <button
              onClick={() => setDeleteId(j.id)}
              className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Löschen
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Job löschen"
        message="Möchtest du diesen Job wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
