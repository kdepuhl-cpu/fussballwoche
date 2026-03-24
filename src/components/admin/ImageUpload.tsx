"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  compact?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  bucket = "article-images",
  folder = "articles",
  compact = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Nur Bilder erlaubt (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Bild darf max. 5 MB groß sein");
      return;
    }

    setError("");
    setUploading(true);

    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    onChange(urlData.publicUrl);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <div className={`relative overflow-hidden rounded-lg bg-gray-100 border border-gray-200 ${compact ? "aspect-[3/2]" : "aspect-[16/9]"}`}>
            <Image src={value} alt="Vorschau" fill className="object-cover" />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs text-forest-green hover:underline"
            >
              Ersetzen
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-red-500 hover:underline"
            >
              Entfernen
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            compact ? "p-4" : "p-8"
          } ${
            dragOver
              ? "border-forest-green bg-forest-green/5"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-forest-green" />
              <p className="text-sm text-gray-500">Wird hochgeladen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg className={`text-gray-400 ${compact ? "w-6 h-6" : "w-8 h-8"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              <p className="text-sm text-gray-500">
                Bild hierher ziehen oder <span className="text-forest-green font-medium">klicken</span>
              </p>
              {!compact && <p className="text-xs text-gray-400">JPG, PNG, WebP — max. 5 MB</p>}
            </div>
          )}
        </div>
      )}

      {/* Manual URL fallback */}
      <div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="...oder Bild-URL einfügen"
          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-forest-green"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

// Lightweight version that returns a URL (for inline article images)
export function useImageUpload(bucket = "article-images", folder = "articles") {
  async function upload(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) return null;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  return { upload };
}
