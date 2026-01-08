"use client";

import { cn } from "@/lib/utils";
import { DOMAINS, STANDARDS } from "@/constants/standards";
import { getAvailableStandardIds } from "@/lib/problems";
import {
  getUserProgress,
  getAggregateStats,
  getUserStats,
} from "@/lib/supabase-storage";
import { Progress } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface ProgressCardProps {
  userId: string;
  className?: string;
}

// Map domain colors to neon colors
const NEON_DOMAIN_COLORS: Record<
  string,
  { bg: string; bar: string; text: string }
> = {
  RP: { bg: "bg-cyan-500/20", bar: "bg-cyan-500", text: "text-cyan-400" },
  NS: { bg: "bg-green-500/20", bar: "bg-green-500", text: "text-green-400" },
  EE: {
    bg: "bg-fuchsia-500/20",
    bar: "bg-fuchsia-500",
    text: "text-fuchsia-400",
  },
  G: { bg: "bg-orange-500/20", bar: "bg-orange-500", text: "text-orange-400" },
  SP: { bg: "bg-pink-500/20", bar: "bg-pink-500", text: "text-pink-400" },
};

export function ProgressCard({ userId, className }: ProgressCardProps) {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [stats, setStats] = useState({
    totalProblems: 0,
    accuracy: 0,
    standardsMastered: 0,
  });
  const [studyTime, setStudyTime] = useState({ total: 0, weekly: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [progressData, aggregateStats, userStats] = await Promise.all([
        getUserProgress(userId),
        getAggregateStats(userId),
        getUserStats(userId),
      ]);

      setProgress(progressData);
      setStats(aggregateStats);
      setStudyTime({
        total: userStats.total_study_time_minutes || 0,
        weekly: userStats.weekly_study_time_minutes || 0,
      });
      setLoading(false);
    }

    loadData();
  }, [userId]);

  const availableStandards = getAvailableStandardIds();

  // Group progress by domain
  const progressByDomain = DOMAINS.map((domain) => {
    const domainStandards = STANDARDS.filter(
      (s) => s.domainCode === domain.code,
    );
    const domainProgress = domainStandards
      .filter((s) => availableStandards.includes(s.id))
      .map((standard) => {
        const studentProgress = progress.find(
          (p) => p.standard_id === standard.id,
        );
        return {
          standard,
          progress: studentProgress || null,
        };
      });

    const avgMastery =
      domainProgress.length > 0
        ? Math.round(
            domainProgress.reduce(
              (sum, p) => sum + (p.progress?.mastery_level || 0),
              0,
            ) / domainProgress.length,
          )
        : 0;

    return {
      domain,
      standards: domainProgress,
      avgMastery,
    };
  }).filter((d) => d.standards.length > 0);

  if (loading) {
    return (
      <div
        className={cn("neon-card rounded-xl p-6 neon-border-cyan", className)}
      >
        <h2 className="text-xl font-bold mb-4 neon-text-cyan">
          Your Progress 🐱
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-cyan-500/10 rounded-lg" />
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-fuchsia-500/10 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("neon-card rounded-xl p-6 neon-border-cyan", className)}>
      <h2 className="text-xl font-bold mb-4 neon-text-cyan">
        Your Progress 🐱
      </h2>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatBox
          label="Problems Solved"
          value={stats.totalProblems.toString()}
          color="cyan"
        />
        <StatBox label="Accuracy" value={`${stats.accuracy}%`} color="green" />
        <StatBox
          label="Standards Mastered"
          value={`${stats.standardsMastered}/${availableStandards.length}`}
          color="pink"
        />
        <StatBox
          label="Study Time"
          value={`${studyTime.weekly}m`}
          subtext="this week"
          color="yellow"
        />
      </div>

      {/* Progress by Domain */}
      <div className="space-y-4">
        <h3 className="font-semibold text-fuchsia-300">Progress by Domain</h3>
        {progressByDomain.map(({ domain, avgMastery }) => {
          const colors =
            NEON_DOMAIN_COLORS[domain.code] || NEON_DOMAIN_COLORS.RP;
          return (
            <div key={domain.code} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className={colors.text}>{domain.name}</span>
                <span className="font-medium text-white">{avgMastery}%</span>
              </div>
              <div className="h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    colors.bar,
                  )}
                  style={{
                    width: `${avgMastery}%`,
                    boxShadow:
                      avgMastery > 0 ? `0 0 10px currentColor` : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  subtext,
  color,
}: {
  label: string;
  value: string;
  subtext?: string;
  color: "cyan" | "green" | "pink" | "yellow";
}) {
  const colorClasses = {
    cyan: {
      box: "bg-cyan-900/40 border-cyan-500/50",
      value: "text-cyan-300",
      label: "text-cyan-100",
    },
    green: {
      box: "bg-green-900/40 border-green-500/50",
      value: "text-green-300",
      label: "text-green-100",
    },
    pink: {
      box: "bg-fuchsia-900/40 border-fuchsia-500/50",
      value: "text-fuchsia-300",
      label: "text-fuchsia-100",
    },
    yellow: {
      box: "bg-yellow-900/40 border-yellow-500/50",
      value: "text-yellow-300",
      label: "text-yellow-100",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={cn("rounded-lg p-3 text-center border", classes.box)}>
      <div className={cn("text-2xl font-bold", classes.value)}>{value}</div>
      <div className={cn("text-xs font-medium", classes.label)}>{label}</div>
      {subtext && <div className={cn("text-xs", classes.label)}>{subtext}</div>}
    </div>
  );
}
