"use client";

import { useState } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder = "Markdown schreiben...",
  rows = 12,
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);

  // Simple markdown to HTML (bold, italic, headings, links, lists, paragraphs)
  function renderMarkdown(md: string): string {
    return md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^### (.+)$/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2 class='text-xl font-bold mt-4 mb-2'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-4 mb-2'>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-forest-green underline">$1</a>')
      .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
      .replace(/\n\n/g, "</p><p class='mb-2'>")
      .replace(/\n/g, "<br>")
      .replace(/^(.+)$/, "<p class='mb-2'>$1</p>");
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-forest-green focus-within:border-transparent">
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={`px-4 py-2 text-sm font-medium ${
              !preview ? "text-forest-green border-b-2 border-forest-green bg-white" : "text-gray-500"
            }`}
          >
            Schreiben
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={`px-4 py-2 text-sm font-medium ${
              preview ? "text-forest-green border-b-2 border-forest-green bg-white" : "text-gray-500"
            }`}
          >
            Vorschau
          </button>
        </div>

        {preview ? (
          <div
            className="p-4 min-h-[200px] prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 text-sm focus:outline-none resize-y"
          />
        )}
      </div>
    </div>
  );
}
