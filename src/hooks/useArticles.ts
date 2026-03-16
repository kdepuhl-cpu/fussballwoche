"use client";

import { useState, useEffect } from "react";
import type { Artikel } from "@/lib/types";
import { getArticles, getArticleBySlug, getArticlesByTag } from "@/lib/api/articles";
import { artikel as mockArtikel } from "@/lib/data";

// Alle Artikel laden (Supabase mit Mock-Fallback)
export function useArticles() {
  const [articles, setArticles] = useState<Artikel[]>(mockArtikel);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .catch(() => setArticles(mockArtikel))
      .finally(() => setLoading(false));
  }, []);

  return { articles, loading };
}

// Einzelner Artikel per Slug
export function useArticle(slug: string) {
  const mockArticle = mockArtikel.find((a) => a.slug === slug);
  const [article, setArticle] = useState<Artikel | undefined>(mockArticle);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticleBySlug(slug)
      .then((a) => setArticle(a ?? mockArticle))
      .catch(() => setArticle(mockArticle))
      .finally(() => setLoading(false));
  }, [slug, mockArticle]);

  return { article, loading };
}

// Artikel nach Tag
export function useArticlesByTag(tag: string) {
  const [articles, setArticles] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticlesByTag(tag)
      .then(setArticles)
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [tag]);

  return { articles, loading };
}
