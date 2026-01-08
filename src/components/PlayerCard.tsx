'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getUserStats } from '@/lib/supabase-storage';
import { getLevelFromXP, getXPProgress, LEVELS } from '@/lib/gamification';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

interface PlayerCardProps {
  userId: string;
  className?: string;
}

export function PlayerCard({ userId, className }: PlayerCardProps) {
  const [stats, setStats] = useState<{
    xp: number;
    level: number;
    current_streak: number;
    best_streak: number;
    badges: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const data = await getUserStats(userId);
      setStats({
        xp: data?.xp || 0,
        level: data?.level || 1,
        current_streak: data?.current_streak || 0,
        best_streak: data?.best_streak || 0,
        badges: data?.badges || [],
      });
      setLoading(false);
    }
    loadStats();
  }, [userId]);

  if (loading) {
    return (
      <div className={cn('neon-card rounded-xl p-4 neon-border-purple', className)}>
        <div className="animate-pulse flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-purple-500/20 rounded w-24" />
            <div className="h-3 bg-purple-500/20 rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelFromXP(stats?.xp || 0);
  const xpProgress = getXPProgress(stats?.xp || 0);
  const nextLevel = LEVELS[Math.min(levelInfo.level, LEVELS.length - 1)];

  return (
    <div className={cn('neon-card rounded-xl p-4 neon-border-purple overflow-hidden', className)}>
      {/* Header with level icon and title */}
      <div className="flex items-center gap-4 mb-4">
        {/* Level badge */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center text-3xl neon-glow-purple">
            {levelInfo.icon}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            Lv.{levelInfo.level}
          </div>
        </div>

        {/* Title and XP */}
        <div className="flex-1">
          <h3 className="font-bold text-lg neon-text-purple flex items-center gap-2">
            {levelInfo.title}
            <Sparkles size={16} className="text-yellow-400" />
          </h3>
          <p className="text-purple-200 text-sm">
            {stats?.xp?.toLocaleString() || 0} XP
          </p>
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-purple-300">Level {levelInfo.level}</span>
          {levelInfo.level < 10 && (
            <span className="text-purple-300">Level {levelInfo.level + 1}</span>
          )}
        </div>
        <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-purple-500/30">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full transition-all duration-500"
            style={{
              width: `${xpProgress.percentage}%`,
              boxShadow: '0 0 10px #bf00ff, 0 0 20px #bf00ff',
            }}
          />
        </div>
        {levelInfo.level < 10 && (
          <p className="text-xs text-purple-400 mt-1 text-center">
            {xpProgress.current} / {xpProgress.needed} XP to next level
          </p>
        )}
        {levelInfo.level >= 10 && (
          <p className="text-xs text-yellow-400 mt-1 text-center">
            MAX LEVEL - You're a Math Legend!
          </p>
        )}
      </div>

      {/* Streak info */}
      <div className="flex gap-3">
        <div className="flex-1 bg-orange-500/20 rounded-lg p-2 border border-orange-500/30">
          <div className="flex items-center gap-1 text-orange-300 text-xs mb-1">
            <Zap size={12} />
            Current Streak
          </div>
          <div className="text-xl font-bold text-orange-200">
            {stats?.current_streak || 0} {(stats?.current_streak || 0) > 0 && '🔥'}
          </div>
        </div>
        <div className="flex-1 bg-cyan-500/20 rounded-lg p-2 border border-cyan-500/30">
          <div className="flex items-center gap-1 text-cyan-300 text-xs mb-1">
            <TrendingUp size={12} />
            Best Streak
          </div>
          <div className="text-xl font-bold text-cyan-200">
            {stats?.best_streak || 0}
          </div>
        </div>
      </div>

      {/* Badges count */}
      <div className="mt-3 pt-3 border-t border-purple-500/20 text-center">
        <span className="text-purple-300 text-sm">
          {stats?.badges?.length || 0} badges earned
        </span>
      </div>
    </div>
  );
}
