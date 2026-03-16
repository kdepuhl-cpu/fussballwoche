"use client";

import { useState, useEffect } from "react";
import type { VereinProfil } from "@/lib/types";
import { getClubBySlug } from "@/lib/api/clubs";
import { vereine as mockVereine } from "@/lib/mock/clubs";

// Einzelner Verein per Slug (mit vollem Profil)
export function useClub(slug: string) {
  const mockClub = mockVereine.find((v) => v.slug === slug);
  const [club, setClub] = useState<VereinProfil | undefined>(mockClub);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClubBySlug(slug)
      .then((c) => setClub(c ?? mockClub))
      .catch(() => setClub(mockClub))
      .finally(() => setLoading(false));
  }, [slug, mockClub]);

  return { club, loading };
}
