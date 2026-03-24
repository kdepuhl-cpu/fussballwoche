"use client";

import { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

const TOOLBAR_BUTTONS = [
  { label: "B", title: "Fett", prefix: "**", suffix: "**", placeholder: "Fetter Text" },
  { label: "I", title: "Kursiv", prefix: "*", suffix: "*", placeholder: "Kursiver Text", italic: true },
  { label: "H2", title: "Überschrift", prefix: "## ", suffix: "", placeholder: "Überschrift" },
  { label: "H3", title: "Unterüberschrift", prefix: "### ", suffix: "", placeholder: "Unterüberschrift" },
  { label: "—", title: "Trennlinie", prefix: "\n---\n", suffix: "", placeholder: "" },
  { label: "Link", title: "Link einfügen", prefix: "[", suffix: "](url)", placeholder: "Linktext" },
  { label: "• Liste", title: "Aufzählung", prefix: "- ", suffix: "", placeholder: "Listeneintrag" },
  { label: "\" Zitat", title: "Zitat", prefix: "> ", suffix: "", placeholder: "Zitat" },
];

export default function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder = "Artikelinhalt schreiben...",
  rows = 16,
  required = false,
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = useCallback(
    (prefix: string, suffix: string, placeholder: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.slice(start, end);
      const insert = selected || placeholder;
      const newValue = value.slice(0, start) + prefix + insert + suffix + value.slice(end);

      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + prefix.length + insert.length + suffix.length;
        textarea.setSelectionRange(
          selected ? cursorPos : start + prefix.length,
          selected ? cursorPos : start + prefix.length + insert.length
        );
      });
    },
    [value, onChange]
  );

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;

    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `articles/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("article-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (!error) {
      const { data } = supabase.storage.from("article-images").getPublicUrl(fileName);
      insertAtCursor(`\n![`, `](${data.publicUrl})\n`, "Bildbeschreibung");
    }
    setUploading(false);
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = "";
  }

  function renderMarkdown(md: string): string {
    return md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^---$/gm, "<hr class='my-4 border-gray-300'>")
      .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')
      .replace(/^### (.+)$/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2 class='text-xl font-bold mt-4 mb-2'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-forest-green underline">$1</a>')
      .replace(/^> (.+)$/gm, "<blockquote class='pl-4 border-l-4 border-gray-300 text-gray-600 italic my-2'>$1</blockquote>")
      .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
      .replace(/\n\n/g, "</p><p class='mb-3'>")
      .replace(/\n/g, "<br>")
      .replace(/^(.+)$/, "<p class='mb-3'>$1</p>");
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-forest-green focus-within:border-transparent">
        {/* Tabs + Toolbar */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50 overflow-x-auto">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              !preview ? "text-forest-green border-b-2 border-forest-green bg-white" : "text-gray-500"
            }`}
          >
            Schreiben
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              preview ? "text-forest-green border-b-2 border-forest-green bg-white" : "text-gray-500"
            }`}
          >
            Vorschau
          </button>

          {/* Toolbar */}
          {!preview && (
            <div className="flex items-center gap-0.5 ml-auto mr-2">
              {TOOLBAR_BUTTONS.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  title={btn.title}
                  onClick={() => insertAtCursor(btn.prefix, btn.suffix, btn.placeholder)}
                  className={`px-2 py-1 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors whitespace-nowrap ${
                    btn.italic ? "italic" : ""
                  } ${btn.label === "B" ? "font-bold" : ""}`}
                >
                  {btn.label}
                </button>
              ))}
              {/* Bild einfügen */}
              <button
                type="button"
                title="Bild in Artikel einfügen"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              >
                {uploading ? "⏳" : "🖼"}
              </button>
            </div>
          )}
        </div>

        {preview ? (
          <div
            className="p-4 min-h-[300px] prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="w-full px-4 py-3 text-sm focus:outline-none resize-y font-mono"
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFilePick}
        className="hidden"
      />
    </div>
  );
}
