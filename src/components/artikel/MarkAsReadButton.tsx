"use client";

import { useState, useEffect } from "react";
import {
  markArticleAsRead,
  isArticleRead,
  getLevelForPoints,
  getProgressToNextLevel,
  getNextLevel,
} from "@/lib/gamification";
import Confetti from "@/components/ui/Confetti";
import { useUser } from "@/lib/user/auth";
import { recordArticleRead } from "@/lib/api/profile";

interface MarkAsReadButtonProps {
  articleId: string;
}

// Level-specific emojis and colors
const LEVEL_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  "Kreisliga-Fan": { emoji: "⚽", color: "text-gray-600", bg: "bg-gray-100" },
  "Bezirksliga-Kenner": { emoji: "🥉", color: "text-amber-700", bg: "bg-amber-50" },
  "Landesliga-Experte": { emoji: "🥈", color: "text-gray-500", bg: "bg-gray-50" },
  "Oberliga-Veteran": { emoji: "🥇", color: "text-yellow-600", bg: "bg-yellow-50" },
  "Bundesliga-Legende": { emoji: "🏆", color: "text-electric-orange", bg: "bg-orange-50" },
};

export default function MarkAsReadButton({ articleId }: MarkAsReadButtonProps) {
  const { user, refreshProfile } = useUser();
  const [isRead, setIsRead] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [popupData, setPopupData] = useState<{
    points: number;
    level: string;
    levelUp: boolean;
    previousLevel: string;
    progressPercent: number;
    pointsToNext: number | null;
  } | null>(null);

  useEffect(() => {
    setIsRead(isArticleRead(articleId));
  }, [articleId]);

  const handleMarkAsRead = () => {
    if (isRead) return;

    const result = markArticleAsRead(articleId);
    const level = getLevelForPoints(result.newPoints);
    const nextLevel = getNextLevel(level);
    const progressPercent = getProgressToNextLevel(result.newPoints, level);
    const pointsToNext = nextLevel ? nextLevel.minPoints - result.newPoints : null;

    setIsRead(true);
    setPopupData({
      points: result.newPoints,
      level: result.currentLevel,
      levelUp: result.levelUp,
      previousLevel: result.previousLevel,
      progressPercent,
      pointsToNext,
    });
    setShowPopup(true);

    // Trigger confetti on level up
    if (result.levelUp) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    // Sync to Supabase
    if (user) {
      recordArticleRead(articleId).then(() => refreshProfile());
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const levelConfig = popupData ? LEVEL_CONFIG[popupData.level] : LEVEL_CONFIG["Kreisliga-Fan"];

  return (
    <>
      {/* Confetti Animation on Level Up */}
      <Confetti active={showConfetti} />

      <button
        onClick={handleMarkAsRead}
        disabled={isRead}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
          isRead
            ? "bg-mint/30 text-forest-green cursor-not-allowed border-2 border-forest-green/20"
            : "bg-forest-green text-white hover:bg-forest-green/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        }`}
      >
        {isRead ? (
          <span className="flex items-center justify-center gap-2">
            Bereits gelesen 🔥
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Gelesen! Check ✅
          </span>
        )}
      </button>

      {/* Popup */}
      {showPopup && popupData && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Level Up Celebration */}
            {popupData.levelUp && (
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">🎉</div>
                <span className="inline-block bg-gradient-to-r from-electric-orange to-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                  Level Up!
                </span>
                <p className="text-gray-500 text-sm mt-2">
                  {popupData.previousLevel} → {popupData.level}
                </p>
              </div>
            )}

            {/* Points Earned */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-mint mb-3">
                <span className="text-3xl font-bold text-forest-green">+10</span>
              </div>
              <p className="text-gray-500 font-medium">Punkte gesammelt!</p>
            </div>

            {/* Current Level Card */}
            <div className={`rounded-xl p-5 mb-6 ${levelConfig.bg} border-2 border-current/10`}>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{levelConfig.emoji}</div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Dein Level</p>
                  <p className={`font-headline text-xl ${levelConfig.color}`}>
                    {popupData.level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-off-black">{popupData.points}</p>
                  <p className="text-xs text-gray-500">Punkte</p>
                </div>
              </div>
            </div>

            {/* Progress to Next Level */}
            {popupData.pointsToNext !== null && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Fortschritt</span>
                  <span className="font-medium text-off-black">
                    Noch {popupData.pointsToNext} Punkte zum nächsten Level
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forest-green to-mint transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${popupData.progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Max Level Reached */}
            {popupData.pointsToNext === null && (
              <div className="text-center mb-6 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <p className="text-sm font-medium text-electric-orange">
                  🏆 Maximales Level erreicht! Du bist eine Legende!
                </p>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={closePopup}
              className="w-full py-3 bg-off-black text-white rounded-xl font-semibold hover:bg-off-black/90 transition-colors"
            >
              Weiter lesen 📖
            </button>
          </div>
        </div>
      )}
    </>
  );
}
