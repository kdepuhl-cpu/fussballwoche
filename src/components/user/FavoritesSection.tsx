"use client";

import { useUser } from "@/lib/user/auth";
import HeroSection from "@/components/artikel/HeroSection";
import type { Artikel } from "@/lib/types";

interface FavoritesSectionProps {
  artikel: Artikel[];
}

export default function FavoritesSection({ artikel }: FavoritesSectionProps) {
  const { user, profile } = useUser();

  if (!user || !profile) return null;
  if (profile.favorite_league_ids.length === 0) return null;

  const favoriteArtikel = artikel
    .filter((a) =>
      profile.favorite_league_ids.includes(a.ligaId) ||
      (a.vereinIds?.some(id => profile.favorite_club_ids.includes(id)))
    )
    .sort((a, b) => {
      // Artikel über Lieblingsvereine zuerst
      const aClub = a.vereinIds?.some(id => profile.favorite_club_ids.includes(id)) ? 0 : 1;
      const bClub = b.vereinIds?.some(id => profile.favorite_club_ids.includes(id)) ? 0 : 1;
      return aClub - bClub;
    });

  if (favoriteArtikel.length === 0) return null;

  const hero = favoriteArtikel[0];
  const sidebar = favoriteArtikel.slice(1, 5);

  return (
    <HeroSection
      sectionTitle="Für dich"
      hero={hero}
      sidebar={sidebar}
    />
  );
}
