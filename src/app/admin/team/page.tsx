"use client";

import { useEffect, useState, useCallback } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import type { UserRole } from "@/lib/admin/auth";

interface TeamMember {
  id: string;
  display_name: string | null;
  role: UserRole;
  email: string;
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
            <TeamList />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}

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

    // Fetch emails from auth (admin RPC not available, use display as fallback)
    setMembers(
      (data ?? []).map((p) => ({
        ...p,
        role: p.role as UserRole,
        email: p.display_name ?? "—",
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function changeRole(userId: string, newRole: UserRole) {
    setSaving(userId);
    const { error: err } = await supabase.rpc("set_user_role", {
      target_user_id: userId,
      new_role: newRole,
    });

    if (err) {
      setError(err.message);
    } else {
      await loadMembers();
    }
    setSaving(null);
  }

  // Add user by email
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<UserRole>("redakteur");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    // Find user by display_name (email is stored there on signup)
    const { data, error: err } = await supabase
      .from("profiles")
      .select("id, display_name")
      .ilike("display_name", addEmail.trim())
      .limit(1)
      .single();

    if (err || !data) {
      setAddError("User nicht gefunden. Der User muss sich zuerst registrieren.");
      setAddLoading(false);
      return;
    }

    await changeRole(data.id, addRole);
    setAddEmail("");
    setAddLoading(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>
      )}

      {/* Add user form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mitglied hinzufügen</h2>
        <form onSubmit={handleAddUser} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail / Name
            </label>
            <input
              type="text"
              required
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
            <select
              value={addRole}
              onChange={(e) => setAddRole(e.target.value as UserRole)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
            >
              <option value="redakteur">Redakteur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={addLoading}
            className="px-4 py-2 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 disabled:opacity-50 transition-colors"
          >
            {addLoading ? "..." : "Hinzufügen"}
          </button>
        </form>
        {addError && (
          <p className="mt-2 text-sm text-red-600">{addError}</p>
        )}
      </div>

      {/* Team list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Rolle
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Dabei seit
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {member.display_name ?? "—"}
                  </span>
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
                  Noch keine Teammitglieder. Füge oben jemanden hinzu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
