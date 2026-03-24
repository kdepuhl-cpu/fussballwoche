"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import { useAdminAuth } from "@/lib/admin/auth";

interface DashboardStats {
  articles: number;
  jobs: number;
  clubs: number;
  users: number;
  newsletterSubscribers: number;
  brevoContacts: number | null;
}

interface NewsletterStats {
  subscribers: number;
  brevoContacts: number | null;
  openRate: number | null;
  clickRate: number | null;
}

interface TopAuthor {
  author_name: string;
  count: number;
}

interface RecentArticle {
  id: string;
  title: string;
  author_name: string | null;
  published_at: string;
  category: string;
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8">
            <DashboardContent />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

function DashboardContent() {
  useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [newsletterStats, setNewsletterStats] = useState<NewsletterStats | null>(null);
  const [topAuthors, setTopAuthors] = useState<TopAuthor[]>([]);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [articles, jobs, clubs, users, newsletter, recent] = await Promise.all([
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("clubs").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id, title, author_name, published_at, category").order("published_at", { ascending: false }).limit(5),
      ]);

      // Brevo Stats abrufen
      let brevoContacts: number | null = null;
      let openRate: number | null = null;
      let clickRate: number | null = null;
      try {
        const brevoKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;
        if (brevoKey) {
          const [contactsRes, campaignsRes] = await Promise.all([
            fetch("https://api.brevo.com/v3/contacts?limit=1&offset=0", {
              headers: { "api-key": brevoKey, "accept": "application/json" },
            }),
            fetch("https://api.brevo.com/v3/emailCampaigns?status=sent&limit=10&offset=0&sort=desc", {
              headers: { "api-key": brevoKey, "accept": "application/json" },
            }),
          ]);
          if (contactsRes.ok) {
            const data = await contactsRes.json();
            brevoContacts = data.count ?? null;
          }
          if (campaignsRes.ok) {
            const data = await campaignsRes.json();
            const campaigns = data.campaigns ?? [];
            if (campaigns.length > 0) {
              const totals = campaigns.reduce(
                (acc: { opens: number; clicks: number; sent: number }, c: Record<string, Record<string, Record<string, number>>>) => {
                  const s = c.statistics?.globalStats;
                  if (s) {
                    acc.opens += s.uniqueOpens ?? 0;
                    acc.clicks += s.uniqueClicks ?? 0;
                    acc.sent += s.sent ?? 0;
                  }
                  return acc;
                },
                { opens: 0, clicks: 0, sent: 0 }
              );
              if (totals.sent > 0) {
                openRate = Math.round((totals.opens / totals.sent) * 100);
                clickRate = Math.round((totals.clicks / totals.sent) * 100);
              }
            }
          }
        }
      } catch { /* Brevo nicht erreichbar */ }

      const newsletterSubs = newsletter.count ?? 0;

      setStats({
        articles: articles.count ?? 0,
        jobs: jobs.count ?? 0,
        clubs: clubs.count ?? 0,
        users: users.count ?? 0,
        newsletterSubscribers: newsletterSubs,
        brevoContacts,
      });

      setNewsletterStats({
        subscribers: newsletterSubs,
        brevoContacts,
        openRate,
        clickRate,
      });

      setRecentArticles((recent.data ?? []) as RecentArticle[]);

      // Top authors
      const { data: allArticles } = await supabase
        .from("articles")
        .select("author_name")
        .not("author_name", "is", null);

      if (allArticles) {
        const counts: Record<string, number> = {};
        for (const a of allArticles) {
          if (a.author_name) counts[a.author_name] = (counts[a.author_name] || 0) + 1;
        }
        const sorted = Object.entries(counts)
          .map(([name, count]) => ({ author_name: name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopAuthors(sorted);
      }

      setLoading(false);
    }
    load();
  }, []);

  const greeting = getGreeting();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
        <p className="text-sm text-gray-500 mt-1">Hier ist dein Überblick über die FuWo-Redaktion.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Artikel" value={stats?.articles ?? 0} color="forest-green" icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        <StatCard label="Jobs" value={stats?.jobs ?? 0} color="forest-green" icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        <StatCard label="Vereine" value={stats?.clubs ?? 0} color="forest-green" icon="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        <StatCard label="User" value={stats?.users ?? 0} color="blue" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top-Autoren */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🏆</span> Top-Autoren
          </h2>
          {topAuthors.length > 0 ? (
            <div className="space-y-3">
              {topAuthors.map((author, i) => (
                <div key={author.author_name} className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? "bg-yellow-100 text-yellow-700" :
                    i === 1 ? "bg-gray-100 text-gray-600" :
                    i === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-gray-50 text-gray-400"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-900 truncate">{author.author_name}</span>
                  <span className="text-sm font-bold text-forest-green">{author.count}</span>
                  <span className="text-xs text-gray-400">Artikel</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Noch keine Artikel veröffentlicht.</p>
          )}
        </div>

        {/* Letzte Artikel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">📝</span> Letzte Artikel
          </h2>
          {recentArticles.length > 0 ? (
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  <span className="flex-1 text-sm text-gray-900 truncate">{article.title}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {article.author_name ?? "—"} · {new Date(article.published_at).toLocaleDateString("de-DE")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Noch keine Artikel. Starte mit dem ersten!</p>
          )}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-electric-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Newsletter
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {newsletterStats?.brevoContacts ?? newsletterStats?.subscribers ?? 0}
            </p>
            <p className="text-xs text-gray-500">Abonnenten</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {newsletterStats?.openRate != null ? `${newsletterStats.openRate}%` : "–"}
            </p>
            <p className="text-xs text-gray-500">Öffnungsrate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {newsletterStats?.clickRate != null ? `${newsletterStats.clickRate}%` : "–"}
            </p>
            <p className="text-xs text-gray-500">Klickrate</p>
          </div>
        </div>
      </div>

      {/* Schnellzugriff */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Schnellzugriff</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickAction href="/admin/articles/new" label="Neuer Artikel" description="Artikel erstellen und veröffentlichen" icon="M12 4v16m8-8H4" />
        <QuickAction href="/admin/jobs/new" label="Neuer Job" description="Stellenanzeige erstellen" icon="M12 4v16m8-8H4" />
        <QuickAction href="/admin/clubs/new" label="Neuer Verein" description="Verein hinzufügen" icon="M12 4v16m8-8H4" />
      </div>
    </>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen!";
  if (hour < 17) return "Guten Tag!";
  return "Guten Abend!";
}

function getCategoryColor(cat: string): string {
  switch (cat) {
    case "spielbericht": return "bg-forest-green/10 text-forest-green";
    case "analyse": return "bg-blue-100 text-blue-700";
    case "transfer": return "bg-purple-100 text-purple-700";
    case "news": return "bg-gray-100 text-gray-600";
    case "interview": return "bg-orange-100 text-orange-700";
    case "kultur": return "bg-pink-100 text-pink-700";
    default: return "bg-gray-100 text-gray-500";
  }
}

const COLOR_MAP: Record<string, string> = {
  "forest-green": "bg-forest-green/10 text-forest-green",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-electric-orange/10 text-electric-orange",
  purple: "bg-purple-100 text-purple-700",
};

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className={`inline-flex p-2 rounded-lg mb-2 ${COLOR_MAP[color] ?? "bg-gray-100 text-gray-600"}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function QuickAction({ href, label, description, icon }: { href: string; label: string; description: string; icon: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-forest-green hover:shadow-md transition-all group">
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
