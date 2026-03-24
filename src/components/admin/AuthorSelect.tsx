"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Author {
  id: string;
  name: string;
  image_url: string | null;
}

interface AuthorSelectProps {
  value: string;
  onChange: (name: string, imageUrl: string) => void;
}

export default function AuthorSelect({ value, onChange }: AuthorSelectProps) {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("authors")
      .select("id, name, image_url")
      .order("name")
      .then(({ data }) => setAuthors(data ?? []));
  }, []);

  async function handleAddAuthor(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);

    const { data, error } = await supabase
      .from("authors")
      .insert({ name: newName.trim() })
      .select()
      .single();

    if (!error && data) {
      setAuthors((prev) => [...prev, data as Author].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(data.name, data.image_url ?? "");
      setNewName("");
      setShowAdd(false);
    }
    setSaving(false);
  }

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => {
          const author = authors.find((a) => a.name === e.target.value);
          onChange(e.target.value, author?.image_url ?? "");
        }}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
      >
        <option value="">Autor wählen...</option>
        {authors.map((a) => (
          <option key={a.id} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>

      {showAdd ? (
        <form onSubmit={handleAddAuthor} className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name des neuen Autors"
            autoFocus
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-3 py-1.5 bg-forest-green text-white text-sm rounded-lg hover:bg-forest-green/90 disabled:opacity-50"
          >
            {saving ? "..." : "Anlegen"}
          </button>
          <button
            type="button"
            onClick={() => { setShowAdd(false); setNewName(""); }}
            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            Abbrechen
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="text-xs text-forest-green hover:underline"
        >
          + Neuen Autor anlegen
        </button>
      )}
    </div>
  );
}
