"use client";

import { useEffect, useState, useCallback } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import { useAdminAuth, type UserRole } from "@/lib/admin/auth";

interface TeamMember {
  id: string;
  display_name: string | null;
  role: UserRole;
  created_at: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  token: string;
  used: boolean;
  created_at: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  redakteur: "Redakteur",
  user: "User",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-electric-orange/10 text-electric-orange",
  redakteur: "bg-forest-green/10 text-forest-green",
  user: "bg-gray-100 text-gray-500",
};

export default function TeamPage() {
  return (
    <AdminGuard requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8 max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Team</h1>
            <p className="text-sm text-gray-500 mb-6">
              Verwalte Rollen und Zugriffsrechte für dein Team.
            </p>
            <InviteSection />
            <TeamList />
            <PendingInvitations />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

// === Einladung verschicken ===
function InviteSection() {
  const { user } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"redakteur" | "admin">("redakteur");
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInviteLink("");
    setLoading(true);

    const { data, error: err } = await supabase
      .from("invitations")
      .insert({ email: email.trim().toLowerCase(), role, invited_by: user?.id })
      .select("token")
      .single();

    if (err) {
      setError(err.message.includes("duplicate") ? "Diese E-Mail wurde bereits eingeladen." : err.message);
      setLoading(false);
      return;
    }

    const baseUrl = window.location.origin;
    setInviteLink(`${baseUrl}/admin/einladung?token=${data.token}`);
    setLoading(false);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Mitglied einladen</h2>

      {!inviteLink ? (
        <form onSubmit={handleInvite} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="redakteur@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "redakteur" | "admin")}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              <option value="redakteur">Redakteur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : "Einladen"}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-800">
              Einladung erstellt! Schicke diesen Link an <strong>{email}</strong>:
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 transition-colors"
            >
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>
          <button
            onClick={() => { setInviteLink(""); setEmail(""); }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Weitere Person einladen
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// === Team-Liste ===
function TeamList() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    const { data, error: err } = await supabase
      .from("profiles")
      .select("id, display_name, role, created_at")
      .in("role", ["admin", "redakteur"])
      .order("role")
      .order("display_name");

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setMembers((data ?? []).map((p) => ({ ...p, role: p.role as UserRole })));
    setLoading(false);
  }, []);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  async function changeRole(userId: string, newRole: UserRole) {
    setSaving(userId);
    const { error: err } = await supabase.rpc("set_user_role", {
      target_user_id: userId,
      new_role: newRole,
    });
    if (err) setError(err.message);
    else await loadMembers();
    setSaving(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      {error && <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm mb-4">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Aktive Mitglieder</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rolle</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Dabei seit</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">{member.display_name ?? "—"}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-bold uppercase rounded ${ROLE_COLORS[member.role]}`}>
                    {ROLE_LABELS[member.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(member.created_at).toLocaleDateString("de-DE")}
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={member.role}
                    onChange={(e) => changeRole(member.id, e.target.value as UserRole)}
                    disabled={saving === member.id}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="redakteur">Redakteur</option>
                    <option value="user">Entfernen</option>
                  </select>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  Noch keine Teammitglieder. Lade oben jemanden ein.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// === Offene Einladungen ===
function PendingInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("invitations")
      .select("*")
      .eq("used", false)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setInvitations((data ?? []) as Invitation[]);
        setLoading(false);
      });
  }, []);

  async function deleteInvitation(id: string) {
    await supabase.from("invitations").delete().eq("id", id);
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  }

  if (loading || invitations.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Offene Einladungen</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">E-Mail</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rolle</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Eingeladen am</th>
            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Aktionen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invitations.map((inv) => (
            <tr key={inv.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{inv.email}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex px-2 py-0.5 text-xs font-bold uppercase rounded ${
                  inv.role === "admin" ? ROLE_COLORS.admin : ROLE_COLORS.redakteur
                }`}>
                  {inv.role === "admin" ? "Admin" : "Redakteur"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(inv.created_at).toLocaleDateString("de-DE")}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => deleteInvitation(inv.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Zurückziehen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
