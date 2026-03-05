"use client";

import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface FeedbackButtonProps {
  pageUrl: string;
  context?: string;
}

function ThumbUpIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      className="w-4 h-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
      />
    </svg>
  );
}

function ThumbDownIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      className="w-4 h-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.367 13.75c-.806 0-1.533.446-2.031 1.08a9.041 9.041 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 0 0-.322 1.672v.633a.75.75 0 0 1-.75.75 2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282m0 0H4.372c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 2.25 12.5c0-2.764.939-5.308 2.649-7.521.388-.482.987-.729 1.605-.729H10.52c.483 0 .964.078 1.423.23l3.114 1.04a4.501 4.501 0 0 0 1.423.23h1.424m-10.598 9.75H9.75m10.598-9.75a3.75 3.75 0 0 0-.27-.602c-.197-.4.078-.898.523-.898h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.958 8.958 0 0 0 1.302-4.665c0-1.194-.232-2.333-.654-3.375Z"
      />
    </svg>
  );
}

export default function FeedbackButton({ pageUrl, context }: FeedbackButtonProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [showThanks, setShowThanks] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const storageKey = `feedback_${pageUrl}`;

  // Check localStorage on mount to prevent repeat votes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setVote(stored as "up" | "down");
        setDisabled(true);
      }
    } catch {
      // localStorage not available
    }
  }, [storageKey]);

  const handleVote = async (type: "up" | "down") => {
    if (disabled) return;

    setVote(type);
    setDisabled(true);
    setShowThanks(true);

    // Store in localStorage to prevent repeat
    try {
      localStorage.setItem(storageKey, type);
    } catch {
      // localStorage not available
    }

    // Save to Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("feedback").insert({
          page_url: pageUrl,
          vote: type,
          context: context ?? null,
          user_id: user?.id ?? null,
        });
      } catch {
        // Fail silently — feedback is non-critical
      }
    }

    // Hide "Danke!" after 2 seconds
    setTimeout(() => {
      setShowThanks(false);
    }, 2000);
  };

  if (showThanks) {
    return (
      <span className="text-xs text-gray-400 dark:text-gray-500 transition-opacity duration-300">
        Danke!
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <button
        onClick={() => handleVote("up")}
        disabled={disabled}
        aria-label="Hilfreich"
        className={`p-1.5 rounded transition-colors ${
          vote === "up"
            ? "text-forest-green dark:text-green-400"
            : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        } ${disabled ? "cursor-default" : "cursor-pointer"}`}
      >
        <ThumbUpIcon filled={vote === "up"} />
      </button>
      <button
        onClick={() => handleVote("down")}
        disabled={disabled}
        aria-label="Nicht hilfreich"
        className={`p-1.5 rounded transition-colors ${
          vote === "down"
            ? "text-forest-green dark:text-green-400"
            : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        } ${disabled ? "cursor-default" : "cursor-pointer"}`}
      >
        <ThumbDownIcon filled={vote === "down"} />
      </button>
    </div>
  );
}
