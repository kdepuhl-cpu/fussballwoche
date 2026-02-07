"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@/lib/user/auth";
import { recordArticleRead } from "@/lib/api/profile";

interface ReadingTrackerProps {
  articleSlug: string;
}

export default function ReadingTracker({ articleSlug }: ReadingTrackerProps) {
  const { user, refreshProfile } = useUser();
  const tracked = useRef(false);

  useEffect(() => {
    if (!user || tracked.current) return;

    const timer = setTimeout(async () => {
      tracked.current = true;
      await recordArticleRead(articleSlug);
      refreshProfile();
    }, 30000);

    return () => clearTimeout(timer);
  }, [user, articleSlug, refreshProfile]);

  return null;
}
