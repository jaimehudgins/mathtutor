"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getUserStats } from "@/lib/supabase-storage";
import {
  BADGES,
  getUnlockedBadges,
  getLockedBadges,
  Badge,
} from "@/lib/gamification";
import { Lock, Award } from "lucide-react";

interface BadgesDisplayProps {
  userId: string;
  className?: string;
}

export function BadgesDisplay({ userId, className }: BadgesDisplayProps) {
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [lockedBadges, setLockedBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function loadBadges() {
      setLoading(true);
      const stats = await getUserStats(userId);
      const badgeIds = stats?.badges || [];
      setUnlockedBadges(getUnlockedBadges(badgeIds));
      setLockedBadges(getLockedBadges(badgeIds));
      setLoading(false);
    }
    loadBadges();
  }, [userId]);

  if (loading) {
    return (
      <div
        className={cn("neon-card rounded-xl p-4 neon-border-yellow", className)}
      >
        <h3 className="font-bold neon-text-yellow mb-4 flex items-center gap-2">
          <Award size={20} />
          Badges
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-yellow-500/10 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const displayBadges = showAll
    ? [...unlockedBadges, ...lockedBadges]
    : unlockedBadges;

  return (
    <div
      className={cn("neon-card rounded-xl p-4 neon-border-yellow", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold neon-text-yellow flex items-center gap-2">
          <Award size={20} />
          Badges ({unlockedBadges.length}/{BADGES.length})
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-yellow-300 hover:text-yellow-100 transition-colors"
        >
          {showAll ? "Show earned" : "Show all"}
        </button>
      </div>

      {unlockedBadges.length === 0 && !showAll ? (
        <div className="text-center py-6 text-gray-400">
          <p className="mb-2">No badges yet!</p>
          <p className="text-sm">Solve problems to earn your first badge!</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {displayBadges.map((badge) => {
            const isUnlocked = unlockedBadges.some((b) => b.id === badge.id);
            return (
              <BadgeItem key={badge.id} badge={badge} unlocked={isUnlocked} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function BadgeItem({ badge, unlocked }: { badge: Badge; unlocked: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const categoryColors = {
    streak: "from-orange-500 to-red-500 border-orange-500/50",
    problems: "from-blue-500 to-cyan-500 border-blue-500/50",
    mastery: "from-purple-500 to-fuchsia-500 border-purple-500/50",
    time: "from-green-500 to-emerald-500 border-green-500/50",
    special: "from-yellow-500 to-amber-500 border-yellow-500/50",
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setShowTooltip(false)}
    >
      <div
        className={cn(
          "aspect-square rounded-lg flex items-center justify-center text-2xl border-2 transition-all cursor-pointer",
          unlocked
            ? `bg-gradient-to-br ${categoryColors[badge.category]}`
            : "bg-gray-800/50 border-gray-600/30 grayscale opacity-50",
        )}
      >
        {unlocked ? badge.icon : <Lock size={16} className="text-gray-500" />}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48 p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl text-xs">
          <div className="font-bold text-white flex items-center gap-1">
            <span>{badge.icon}</span>
            <span>{badge.name}</span>
          </div>
          <p className="text-gray-300 mt-1">{badge.description}</p>
          <p className="text-yellow-400 mt-1">+{badge.xpReward} Catnip</p>
          {!unlocked && (
            <p className="text-gray-500 mt-1 italic">Not yet unlocked</p>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
        </div>
      )}
    </div>
  );
}
