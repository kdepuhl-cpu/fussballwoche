"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import { useUser } from "@/lib/user/auth";
import { updateProfile } from "@/lib/api/profile";
import { BEZIRKE } from "@/lib/jobs";
import { ALL_LEAGUES } from "@/lib/leagues";

export default function ProfilPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile, signOut } = useUser();
  const [editBezirk, setEditBezirk] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (profile) {
      setEditBezirk(profile.bezirk);
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

  const handleRemoveClub = async (clubId: string) => {
    const updated = profile.favorite_club_ids.filter((c) => c !== clubId);
    setSaving(true);
    await updateProfile(user.id, { favorite_club_ids: updated });
    await refreshProfile();
    setSaving(false);
  };

  const handleRemoveLeague = async (leagueId: string) => {
    const updated = profile.favorite_league_ids.filter((l) => l !== leagueId);
    setSaving(true);
    await updateProfile(user.id, { favorite_league_ids: updated });
    await refreshProfile();
    setSaving(false);
  };

  const handleBezirkChange = async (newBezirk: string) => {
    setEditBezirk(newBezirk);
    setSaving(true);
    await updateProfile(user.id, { bezirk: newBezirk || null });
    await refreshProfile();
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    await signOut();
    router.push("/");
  };

  const getLeagueName = (id: string) =>
    ALL_LEAGUES.find((l) => l.id === id)?.name ?? id;

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50"><Header /></div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-headline text-3xl text-off-black dark:text-white mb-8">Mein Profil</h1>

        {/* Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-forest-green flex items-center justify-center text-white font-bold text-xl">
              {(profile.display_name ?? user.email ?? "?")[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-lg text-off-black dark:text-white">
                {profile.display_name ?? "Unbenannt"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bezirk
            </label>
            <select
              value={editBezirk ?? ""}
              onChange={(e) => handleBezirkChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-off-black dark:text-white text-sm"
            >
              <option value="">Kein Bezirk</option>
              {BEZIRKE.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Favorite Clubs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-off-black dark:text-white mb-4">Meine Vereine</h3>
          {profile.favorite_club_ids.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Noch keine Vereine ausgewählt.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.favorite_club_ids.map((clubId) => (
                <span
                  key={clubId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                >
                  {clubId}
                  <button
                    onClick={() => handleRemoveClub(clubId)}
                    disabled={saving}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Leagues */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-off-black dark:text-white mb-4">Meine Ligen</h3>
          {profile.favorite_league_ids.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Noch keine Ligen ausgewählt.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.favorite_league_ids.map((leagueId) => (
                <span
                  key={leagueId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                >
                  {getLeagueName(leagueId)}
                  <button
                    onClick={() => handleRemoveLeague(leagueId)}
                    disabled={saving}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm p-6">
          <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Account löschen</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Dein Account und alle Daten werden unwiderruflich gelöscht.
          </p>
          {showDeleteConfirm ? (
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Endgültig löschen
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
