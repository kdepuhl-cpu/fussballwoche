"use client";

import { useUser } from "@/lib/user/auth";

interface FavoritesBadgeProps {
  ligaId: string;
}

export default function FavoritesBadge({ ligaId }: FavoritesBadgeProps) {
  const { user, profile } = useUser();

  if (!user || !profile) return null;
  if (!profile.favorite_league_ids.includes(ligaId)) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-green/10 text-forest-green text-xs font-medium">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      Dein Verein
    </span>
  );
}
