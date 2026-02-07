"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import StatsCard from "@/components/admin/StatsCard";
import { getAdminStats, type AdminStats } from "@/lib/api/admin";

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <DashboardContent />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function DashboardContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">
        Fehler beim Laden: {error}
      </div>
    );
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          label="Artikel"
          value={stats?.articles ?? "..."}
          icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        />
        <StatsCard
          label="Jobs"
          value={stats?.jobs ?? "..."}
          icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
        <StatsCard
          label="Vereine"
          value={stats?.clubs ?? "..."}
          icon="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
        />
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickAction
          href="/admin/articles/new"
          label="Neuer Artikel"
          description="Artikel erstellen und veröffentlichen"
          icon="M12 4v16m8-8H4"
        />
        <QuickAction
          href="/admin/jobs/new"
          label="Neuer Job"
          description="Stellenanzeige erstellen"
          icon="M12 4v16m8-8H4"
        />
        <QuickAction
          href="/admin/clubs/new"
          label="Neuer Verein"
          description="Verein hinzufügen"
          icon="M12 4v16m8-8H4"
        />
      </div>
    </>
  );
}

function QuickAction({
  href,
  label,
  description,
  icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-forest-green hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-forest-green/10 rounded-lg group-hover:bg-forest-green/20 transition-colors">
          <svg className="w-5 h-5 text-forest-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900">{label}</h3>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </Link>
  );
}
