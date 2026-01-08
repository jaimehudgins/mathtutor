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
        className={cn(
          "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6",
          className,
        )}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Your Progress
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 bg-gray-200 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6",
        className,
      )}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Your Progress
      </h2>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatBox
          label="Problems Solved"
          value={stats.totalProblems.toString()}
          color="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatBox
          label="Accuracy"
          value={`${stats.accuracy}%`}
          color="bg-green-100 dark:bg-green-900/30"
        />
        <StatBox
          label="Standards Mastered"
          value={`${stats.standardsMastered}/${availableStandards.length}`}
          color="bg-purple-100 dark:bg-purple-900/30"
        />
        <StatBox
          label="Study Time"
          value={`${studyTime.weekly}m`}
          subtext="this week"
          color="bg-orange-100 dark:bg-orange-900/30"
        />
      </div>

      {/* Progress by Domain */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
          Progress by Domain
        </h3>
        {progressByDomain.map(({ domain, avgMastery }) => (
          <div key={domain.code} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {domain.name}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {avgMastery}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  domain.color,
                )}
                style={{ width: `${avgMastery}%` }}
              />
            </div>
          </div>
        ))}
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
  color: string;
}) {
  return (
    <div className={cn("rounded-lg p-3 text-center", color)}>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
      {subtext && (
        <div className="text-xs text-gray-500 dark:text-gray-500">
          {subtext}
        </div>
      )}
    </div>
  );
}
