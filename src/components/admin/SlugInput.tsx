"use client";

interface SlugInputProps {
  title: string;
  slug: string;
  onSlugChange: (slug: string) => void;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function SlugInput({ title, slug, onSlugChange }: SlugInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
          placeholder="url-slug"
        />
        <button
          type="button"
          onClick={() => onSlugChange(generateSlug(title))}
          className="px-3 py-2 text-sm font-medium text-forest-green bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          Generieren
        </button>
      </div>
    </div>
  );
}
