'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/lib/gamification';
import { X, Star, Trophy, TrendingUp } from 'lucide-react';

interface XPPopupProps {
  xpEarned: number;
  xpBreakdown: string[];
  newBadges: Badge[];
  newLevel: boolean;
  levelInfo: { level: number; title: string; icon: string };
  currentStreak: number;
  onClose: () => void;
}

export function XPPopup({
  xpEarned,
  xpBreakdown,
  newBadges,
  newLevel,
  levelInfo,
  currentStreak,
  onClose,
}: XPPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setVisible(true), 50);

    // Auto close after 4 seconds if no level up or badges
    if (!newLevel && newBadges.length === 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [newLevel, newBadges.length]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  // Simple XP popup for regular answers
  if (!newLevel && newBadges.length === 0 && xpEarned > 0) {
    return (
      <div
        className={cn(
          'fixed top-4 right-4 z-50 transition-all duration-300',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        )}
      >
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-lg px-4 py-2 shadow-lg neon-glow-purple">
          <div className="flex items-center gap-2 text-white font-bold">
            <Star className="w-5 h-5 text-yellow-300" />
            <span>+{xpEarned} XP</span>
            {currentStreak >= 3 && (
              <span className="text-orange-300 ml-1">
                {currentStreak}🔥
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No XP earned (wrong answer)
  if (xpEarned === 0 && !newLevel && newBadges.length === 0) {
    return null;
  }

  // Full modal for level up or badges
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-6 max-w-md w-full border-2 border-purple-500/50 shadow-2xl transition-all duration-300',
          visible ? 'scale-100' : 'scale-90'
        )}
        style={{
          boxShadow: '0 0 40px rgba(147, 51, 234, 0.3)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Level Up Section */}
        {newLevel && (
          <div className="text-center mb-6">
            <div className="text-6xl mb-2 animate-bounce">{levelInfo.icon}</div>
            <h2 className="text-2xl font-bold neon-text-purple mb-1">
              LEVEL UP!
            </h2>
            <p className="text-purple-200">
              You are now Level {levelInfo.level}
            </p>
            <p className="text-xl font-bold text-white mt-2">
              {levelInfo.title}
            </p>
          </div>
        )}

        {/* New Badges Section */}
        {newBadges.length > 0 && (
          <div className={cn('text-center', newLevel && 'mt-4 pt-4 border-t border-purple-500/30')}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="text-yellow-400" size={24} />
              <h3 className="text-lg font-bold neon-text-yellow">
                {newBadges.length === 1 ? 'New Badge!' : 'New Badges!'}
              </h3>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {newBadges.map((badge) => (
                <div key={badge.id} className="text-center">
                  <div className="text-4xl mb-1">{badge.icon}</div>
                  <p className="font-bold text-white text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                  <p className="text-xs text-yellow-400 mt-1">+{badge.xpReward} XP</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* XP Breakdown */}
        <div className={cn(
          'mt-4 pt-4 border-t border-purple-500/30',
          !newLevel && newBadges.length === 0 && 'mt-0 pt-0 border-t-0'
        )}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="text-green-400" size={18} />
            <span className="font-bold text-green-400">+{xpEarned} XP Total</span>
          </div>
          {xpBreakdown.length > 0 && (
            <div className="text-sm text-gray-300 space-y-1">
              {xpBreakdown.map((line, i) => (
                <p key={i} className="text-center">{line}</p>
              ))}
            </div>
          )}
        </div>

        {/* Streak display */}
        {currentStreak >= 3 && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-bold">
              🔥 {currentStreak} Streak!
            </span>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={handleClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-lg font-bold text-white hover:from-purple-500 hover:to-fuchsia-400 transition-all neon-glow-purple"
        >
          Awesome! Continue
        </button>
      </div>
    </div>
  );
}
