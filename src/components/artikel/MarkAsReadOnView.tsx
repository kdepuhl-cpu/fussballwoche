"use client";

import { useEffect } from "react";
import { markArticleAsReadDirect } from "@/hooks/useReadArticles";
import { useUser } from "@/lib/user/auth";
import { recordArticleRead } from "@/lib/api/profile";

interface MarkAsReadOnViewProps {
  slug: string;
}

export default function MarkAsReadOnView({ slug }: MarkAsReadOnViewProps) {
  const { user, refreshProfile } = useUser();

  useEffect(() => {
    // Mark as read in localStorage
    markArticleAsReadDirect(slug);

    // Sync to Supabase
    if (user) {
      recordArticleRead(slug).then(() => refreshProfile());
    }
  }, [slug, user, refreshProfile]);

  return null;
}
