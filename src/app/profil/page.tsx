"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import { useUser } from "@/lib/user/auth";
import { updateProfile, getReaderLevel } from "@/lib/api/profile";
import { getUserStats, getUserRecentVotes, type RecentVote } from "@/lib/api/votes";
import { getClubs } from "@/lib/api/clubs";
import { BEZIRKE } from "@/lib/jobs";
import { ALL_LEAGUES, getLeaguesByCategory } from "@/lib/leagues";
import { useTheme } from "@/hooks/useTheme";
import { useArticles } from "@/hooks/useArticles";
import { ALL_MATCHES } from "@/lib/mock/matches";
import type { Verein } from "@/lib/types";

// === Stat Card ===

function StatCard({ icon, label, value, subtitle }: { icon: string; label: string; value: string | number; subtitle?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-off-black dark:text-white tabular-nums">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      {subtitle && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// === Section Card ===

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 ${className}`}>
      {children}
    </div>
  );
}

// === Main Page ===

export default function ProfilPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile, signOut } = useUser();
  const { theme, toggleTheme, mounted } = useTheme();
  const { articles: artikel } = useArticles();

  // Editing states
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [editingClubs, setEditingClubs] = useState(false);
  const [editingLeagues, setEditingLeagues] = useState(false);
  const [editingBezirk, setEditingBezirk] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Data states
  const [clubs, setClubs] = useState<Verein[]>([]);
  const [clubSearch, setClubSearch] = useState("");
  const [voteStats, setVoteStats] = useState({ total_votes: 0, correct_votes: 0, accuracy_pct: 0 });
  const [recentVotes, setRecentVotes] = useState<RecentVote[]>([]);
  const [activityTab, setActivityTab] = useState<"artikel" | "tipps">("artikel");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Load data + refresh profile from Supabase
  useEffect(() => {
    if (user) {
      refreshProfile();
      getUserStats(user.id).then(setVoteStats);
      getUserRecentVotes(user.id).then(setRecentVotes);
      getClubs().then(setClubs);
    }
  }, [user, refreshProfile]);

  useEffect(() => {
    if (profile) {
      setNameInput(profile.display_name ?? "");
    }
  }, [profile]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-off-white dark:bg-gray-900">
        <div className="sticky top-0 z-50"><Header /></div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-forest-green border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  // Reader level
  const readerLevel = getReaderLevel(profile.reader_points);
  const levelProgress = Math.min(
    ((profile.reader_points - readerLevel.min) / (readerLevel.max - readerLevel.min)) * 100,
    100
  );

  // Initials for avatar
  const displayName = profile.display_name ?? "Anonym";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Article lookup
  const readArticles = (profile.articles_read ?? [])
    .slice(-5)
    .reverse()
    .map((slug) => {
      const art = artikel.find((a) => a.slug === slug);
      return art ? { slug: art.slug, titel: art.titel, datum: art.datum } : { slug, titel: slug, datum: null };
    });

  // Match lookup for votes
  const matchMap = Object.fromEntries(ALL_MATCHES.map((m) => [m.id, m]));

  // League name helper
  const getLeagueName = (id: string) => ALL_LEAGUES.find((l) => l.id === id)?.name ?? id;

  // Club name helper
  const getClubName = (id: string) => clubs.find((c) => c.id === id)?.name ?? id;

  // === Handlers ===

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    await updateProfile(user.id, { display_name: nameInput.trim() });
    await refreshProfile();
    setSaving(false);
    setEditingName(false);
  };

  const handleToggleClub = async (clubId: string) => {
    const current = profile.favorite_club_ids;
    const updated = current.includes(clubId)
      ? current.filter((c) => c !== clubId)
      : current.length >= 5 ? current : [...current, clubId];
    setSaving(true);
    await updateProfile(user.id, { favorite_club_ids: updated });
    await refreshProfile();
    setSaving(false);
  };

  const handleToggleLeague = async (leagueId: string) => {
    const current = profile.favorite_league_ids;
    const updated = current.includes(leagueId)
      ? current.filter((l) => l !== leagueId)
      : [...current, leagueId];
    setSaving(true);
    await updateProfile(user.id, { favorite_league_ids: updated });
    await refreshProfile();
    setSaving(false);
  };

  const handleBezirkChange = async (newBezirk: string) => {
    setSaving(true);
    await updateProfile(user.id, { bezirk: newBezirk || null });
    await refreshProfile();
    setSaving(false);
    setEditingBezirk(false);
  };

  const handleDeleteAccount = async () => {
    await signOut();
    router.push("/");
  };

  // Filtered clubs for search
  const filteredClubs = clubSearch
    ? clubs.filter((c) => c.name.toLowerCase().includes(clubSearch.toLowerCase()))
    : clubs;

  // League groups
  const herrenLeagues = getLeaguesByCategory("herren");
  const frauenLeagues = getLeaguesByCategory("frauen");
  const pokalLeagues = getLeaguesByCategory("pokal");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-50"><Header /></div>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* ========== 1. PROFILE HEADER ========== */}
        <SectionCard>
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-forest-green flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name (editable) */}
              {editingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    autoFocus
                    className="font-bold text-lg text-off-black dark:text-white bg-transparent border-b-2 border-forest-green outline-none w-full"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="text-forest-green text-sm font-semibold whitespace-nowrap"
                  >
                    {saving ? "..." : "OK"}
                  </button>
                  <button
                    onClick={() => { setEditingName(false); setNameInput(displayName); }}
                    className="text-gray-400 text-sm"
                  >
                    Abb.
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="group flex items-center gap-2 mb-1"
                >
                  <h1 className="font-bold text-lg text-off-black dark:text-white truncate">
                    {displayName}
                  </h1>
                  <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-forest-green transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}

              {/* Bezirk Badge */}
              <div className="flex items-center gap-2 mb-3">
                {profile.bezirk && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forest-green/10 text-forest-green dark:text-green-400">
                    {profile.bezirk}
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {user.email}
                </span>
              </div>

              {/* Reader Level */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-off-black dark:text-white">
                    {readerLevel.name}
                  </span>
                  <span className="text-xs font-bold text-electric-orange tabular-nums">
                    {profile.reader_points} Punkte
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forest-green to-electric-orange rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  {readerLevel.max - profile.reader_points} Punkte bis zum nächsten Level
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ========== 2. STATS GRID ========== */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon="📖"
            label="Artikel gelesen"
            value={profile.articles_read?.length ?? 0}
          />
          <StatCard
            icon="🎯"
            label="Tippspiel-Quote"
            value={voteStats.total_votes > 0 ? `${voteStats.accuracy_pct}%` : "—"}
            subtitle={voteStats.total_votes > 0 ? `${voteStats.correct_votes}/${voteStats.total_votes} richtig` : undefined}
          />
          <StatCard
            icon="⚽"
            label="Tipps abgegeben"
            value={voteStats.total_votes}
          />
          <StatCard
            icon="🔥"
            label="Streak"
            value="—"
            subtitle="Kommt bald"
          />
        </div>

        {/* ========== 3. MEINE VEREINE ========== */}
        <SectionCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-off-black dark:text-white">Meine Vereine</h2>
            <button
              onClick={() => { setEditingClubs(!editingClubs); setClubSearch(""); }}
              className="text-xs font-semibold text-forest-green hover:text-forest-green/80 transition-colors"
            >
              {editingClubs ? "Fertig" : "Bearbeiten"}
            </button>
          </div>

          {profile.favorite_club_ids.length === 0 && !editingClubs ? (
            <Link
              href="/onboarding"
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-forest-green dark:hover:border-forest-green transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center group-hover:bg-forest-green/20 transition-colors">
                <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-off-black dark:text-white">Wähle deine Vereine</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Personalisiere deinen Feed</p>
              </div>
            </Link>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.favorite_club_ids.map((clubId) => (
                <span
                  key={clubId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-green/10 text-sm font-medium text-forest-green dark:text-green-400"
                >
                  <span className="w-5 h-5 rounded-full bg-forest-green/20 flex items-center justify-center text-[10px] font-bold">
                    {getClubName(clubId)[0]}
                  </span>
                  {getClubName(clubId)}
                  {editingClubs && (
                    <button
                      onClick={() => handleToggleClub(clubId)}
                      disabled={saving}
                      className="ml-0.5 text-forest-green/60 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Club Selection */}
          {editingClubs && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <input
                type="text"
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
                placeholder="Verein suchen..."
                className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-off-black dark:text-white mb-3 focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                {profile.favorite_club_ids.length}/5 ausgewählt
              </p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredClubs.map((club) => {
                  const selected = profile.favorite_club_ids.includes(club.id);
                  const disabled = !selected && profile.favorite_club_ids.length >= 5;
                  return (
                    <button
                      key={club.id}
                      onClick={() => handleToggleClub(club.id)}
                      disabled={disabled || saving}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        selected
                          ? "bg-forest-green/10 text-forest-green dark:text-green-400 font-medium"
                          : disabled
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>{club.name}</span>
                      {selected && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ========== 4. MEINE LIGEN ========== */}
        <SectionCard>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-off-black dark:text-white">Meine Ligen</h2>
            <button
              onClick={() => setEditingLeagues(!editingLeagues)}
              className="text-xs font-semibold text-forest-green hover:text-forest-green/80 transition-colors"
            >
              {editingLeagues ? "Fertig" : "Bearbeiten"}
            </button>
          </div>

          {profile.favorite_league_ids.length === 0 && !editingLeagues ? (
            <Link
              href="/onboarding"
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-forest-green dark:hover:border-forest-green transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-forest-green/10 flex items-center justify-center group-hover:bg-forest-green/20 transition-colors">
                <svg className="w-5 h-5 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-off-black dark:text-white">Wähle deine Ligen</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Verpasse kein Spiel</p>
              </div>
            </Link>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.favorite_league_ids.map((leagueId) => (
                <span
                  key={leagueId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-electric-orange/10 text-sm font-medium text-electric-orange"
                >
                  {getLeagueName(leagueId)}
                  {editingLeagues && (
                    <button
                      onClick={() => handleToggleLeague(leagueId)}
                      disabled={saving}
                      className="ml-0.5 text-electric-orange/60 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* League Selection */}
          {editingLeagues && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 max-h-64 overflow-y-auto space-y-4">
              {[
                { label: "Herren", leagues: herrenLeagues },
                { label: "Frauen", leagues: frauenLeagues },
                { label: "Pokal", leagues: pokalLeagues },
              ].map((group) => (
                <div key={group.label}>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                    {group.label}
                  </h4>
                  <div className="space-y-0.5">
                    {group.leagues.map((league) => {
                      const selected = profile.favorite_league_ids.includes(league.id);
                      return (
                        <button
                          key={league.id}
                          onClick={() => handleToggleLeague(league.id)}
                          disabled={saving}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                            selected
                              ? "bg-electric-orange/10 text-electric-orange font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>{league.name}</span>
                          {selected && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ========== 5. LETZTE AKTIVITÄT ========== */}
        <SectionCard>
          <h2 className="font-semibold text-off-black dark:text-white mb-3">Letzte Aktivität</h2>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActivityTab("artikel")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                activityTab === "artikel"
                  ? "bg-white dark:bg-gray-600 text-off-black dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Artikel
            </button>
            <button
              onClick={() => setActivityTab("tipps")}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                activityTab === "tipps"
                  ? "bg-white dark:bg-gray-600 text-off-black dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Tipps
            </button>
          </div>

          {/* Article List */}
          {activityTab === "artikel" && (
            <div className="space-y-0">
              {readArticles.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                  Noch keine Artikel gelesen
                </p>
              ) : (
                readArticles.map((art, i) => (
                  <Link
                    key={art.slug}
                    href={`/artikel/${art.slug}`}
                    className={`flex items-center gap-3 py-3 group ${
                      i < readArticles.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-forest-green/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-off-black dark:text-white truncate group-hover:text-forest-green transition-colors">
                        {art.titel}
                      </p>
                      {art.datum && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {new Date(art.datum).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Votes List */}
          {activityTab === "tipps" && (
            <div className="space-y-0">
              {recentVotes.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
                  Noch keine Tipps abgegeben
                </p>
              ) : (
                recentVotes.map((vote, i) => {
                  const match = matchMap[vote.match_id];
                  const matchLabel = match
                    ? `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`
                    : vote.match_id;
                  const isCorrect = vote.result !== null && vote.result === vote.vote;
                  const isWrong = vote.result !== null && vote.result !== vote.vote;

                  return (
                    <Link
                      key={vote.match_id}
                      href={`/spiel/${vote.match_id}`}
                      className={`flex items-center gap-3 py-3 ${
                        i < recentVotes.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? "bg-green-100 dark:bg-green-900/30" : isWrong ? "bg-red-100 dark:bg-red-900/30" : "bg-gray-100 dark:bg-gray-700"
                      }`}>
                        {isCorrect ? (
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : isWrong ? (
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-off-black dark:text-white truncate">
                          {matchLabel}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          Dein Tipp: <span className="font-bold">{vote.vote}</span>
                          {vote.result && (
                            <> · Ergebnis: <span className="font-bold">{vote.result}</span></>
                          )}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isCorrect
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : isWrong
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                      }`}>
                        {isCorrect ? "+3" : isWrong ? "0" : "..."}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </SectionCard>

        {/* ========== 6. EINSTELLUNGEN ========== */}
        <SectionCard>
          <h2 className="font-semibold text-off-black dark:text-white mb-4">Einstellungen</h2>

          {/* Dark Mode Toggle */}
          {mounted && (
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
                <span className="text-sm text-off-black dark:text-white">Dark Mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  theme === "dark" ? "bg-forest-green" : "bg-gray-300"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
          )}

          {/* Bezirk */}
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <span className="text-sm text-off-black dark:text-white">Bezirk</span>
                  {profile.bezirk && !editingBezirk && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">{profile.bezirk}</p>
                  )}
                </div>
              </div>
              {!editingBezirk && (
                <button
                  onClick={() => setEditingBezirk(true)}
                  className="text-xs font-semibold text-forest-green"
                >
                  Ändern
                </button>
              )}
            </div>
            {editingBezirk && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleBezirkChange("")}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    !profile.bezirk
                      ? "bg-forest-green text-white border-forest-green"
                      : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-forest-green"
                  }`}
                >
                  Kein Bezirk
                </button>
                {BEZIRKE.map((b) => (
                  <button
                    key={b}
                    onClick={() => handleBezirkChange(b)}
                    disabled={saving}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      profile.bezirk === b
                        ? "bg-forest-green text-white border-forest-green"
                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-forest-green"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>
        </SectionCard>

        {/* ========== DANGER ZONE ========== */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/40 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">⚠️</span>
            <h2 className="font-semibold text-red-600 dark:text-red-400">Account löschen</h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Dein Account und alle Daten werden unwiderruflich gelöscht.
          </p>
          {showDeleteConfirm ? (
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2.5 min-h-[44px] bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Endgültig löschen
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2.5 min-h-[44px] text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 min-h-[44px] border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Account löschen...
            </button>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
