// Gamification system - XP, Levels, and Badges

// =============================================================================
// LEVELS SYSTEM - Cat-themed progression
// =============================================================================

export interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  icon: string;
}

export const LEVELS: Level[] = [
  { level: 1, title: "Math Kitten", minXP: 0, maxXP: 100, icon: "🐱" },
  { level: 2, title: "Curious Cat", minXP: 100, maxXP: 250, icon: "😺" },
  { level: 3, title: "Clever Cat", minXP: 250, maxXP: 500, icon: "😸" },
  { level: 4, title: "Smart Cat", minXP: 500, maxXP: 850, icon: "😻" },
  { level: 5, title: "Math Cat", minXP: 850, maxXP: 1300, icon: "🐈" },
  { level: 6, title: "Super Cat", minXP: 1300, maxXP: 1900, icon: "🦁" },
  { level: 7, title: "Mega Cat", minXP: 1900, maxXP: 2600, icon: "🐯" },
  { level: 8, title: "Ultra Cat", minXP: 2600, maxXP: 3500, icon: "🐆" },
  { level: 9, title: "Math Tiger", minXP: 3500, maxXP: 4600, icon: "🐅" },
  { level: 10, title: "Math Legend", minXP: 4600, maxXP: Infinity, icon: "👑" },
];

export function getLevelFromXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelFromXP(xp);
  const current = xp - level.minXP;
  const needed = level.maxXP === Infinity ? current : level.maxXP - level.minXP;
  const percentage = level.maxXP === Infinity ? 100 : Math.round((current / needed) * 100);
  return { current, needed, percentage };
}

// =============================================================================
// XP REWARDS
// =============================================================================

export const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  STREAK_BONUS_3: 5,      // Bonus at 3 streak
  STREAK_BONUS_5: 10,     // Bonus at 5 streak
  STREAK_BONUS_10: 25,    // Bonus at 10 streak
  FIRST_PROBLEM_TODAY: 15, // Bonus for first problem of the day
  DOMAIN_MASTERY: 100,    // Bonus for mastering a domain (80%+)
  PERFECT_SESSION: 50,    // All correct in a session of 10+
};

export function calculateXPForAnswer(
  isCorrect: boolean,
  currentStreak: number,
  isFirstToday: boolean
): { xp: number; breakdown: string[] } {
  if (!isCorrect) {
    return { xp: 0, breakdown: [] };
  }

  let xp = XP_REWARDS.CORRECT_ANSWER;
  const breakdown: string[] = [`+${XP_REWARDS.CORRECT_ANSWER} Correct answer`];

  if (isFirstToday) {
    xp += XP_REWARDS.FIRST_PROBLEM_TODAY;
    breakdown.push(`+${XP_REWARDS.FIRST_PROBLEM_TODAY} First problem today!`);
  }

  if (currentStreak === 3) {
    xp += XP_REWARDS.STREAK_BONUS_3;
    breakdown.push(`+${XP_REWARDS.STREAK_BONUS_3} 3 streak bonus! 🔥`);
  } else if (currentStreak === 5) {
    xp += XP_REWARDS.STREAK_BONUS_5;
    breakdown.push(`+${XP_REWARDS.STREAK_BONUS_5} 5 streak bonus! 🔥🔥`);
  } else if (currentStreak === 10) {
    xp += XP_REWARDS.STREAK_BONUS_10;
    breakdown.push(`+${XP_REWARDS.STREAK_BONUS_10} 10 streak bonus! 🔥🔥🔥`);
  } else if (currentStreak > 10 && currentStreak % 5 === 0) {
    xp += XP_REWARDS.STREAK_BONUS_10;
    breakdown.push(`+${XP_REWARDS.STREAK_BONUS_10} ${currentStreak} streak! 🔥🔥🔥`);
  }

  return { xp, breakdown };
}

// =============================================================================
// BADGES SYSTEM
// =============================================================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "streak" | "problems" | "mastery" | "time" | "special";
  requirement: number; // Value needed to unlock
  xpReward: number;
}

export const BADGES: Badge[] = [
  // Streak badges
  { id: "streak_3", name: "Hot Start", description: "Get 3 correct in a row", icon: "🔥", category: "streak", requirement: 3, xpReward: 20 },
  { id: "streak_5", name: "On Fire", description: "Get 5 correct in a row", icon: "🔥", category: "streak", requirement: 5, xpReward: 30 },
  { id: "streak_10", name: "Unstoppable", description: "Get 10 correct in a row", icon: "💥", category: "streak", requirement: 10, xpReward: 50 },
  { id: "streak_20", name: "Legendary", description: "Get 20 correct in a row", icon: "⚡", category: "streak", requirement: 20, xpReward: 100 },

  // Problems solved badges
  { id: "problems_1", name: "First Steps", description: "Solve your first problem", icon: "🐾", category: "problems", requirement: 1, xpReward: 10 },
  { id: "problems_10", name: "Getting Started", description: "Solve 10 problems", icon: "📝", category: "problems", requirement: 10, xpReward: 25 },
  { id: "problems_50", name: "Problem Solver", description: "Solve 50 problems", icon: "🧮", category: "problems", requirement: 50, xpReward: 50 },
  { id: "problems_100", name: "Century Club", description: "Solve 100 problems", icon: "💯", category: "problems", requirement: 100, xpReward: 100 },
  { id: "problems_500", name: "Math Machine", description: "Solve 500 problems", icon: "🤖", category: "problems", requirement: 500, xpReward: 250 },

  // Mastery badges (per domain)
  { id: "master_rp", name: "Ratio Ruler", description: "Master Ratios & Proportions (80%+)", icon: "📊", category: "mastery", requirement: 80, xpReward: 75 },
  { id: "master_ns", name: "Number Ninja", description: "Master Number System (80%+)", icon: "🔢", category: "mastery", requirement: 80, xpReward: 75 },
  { id: "master_ee", name: "Expression Expert", description: "Master Expressions & Equations (80%+)", icon: "✖️", category: "mastery", requirement: 80, xpReward: 75 },
  { id: "master_g", name: "Geometry Genius", description: "Master Geometry (80%+)", icon: "📐", category: "mastery", requirement: 80, xpReward: 75 },
  { id: "master_sp", name: "Probability Pro", description: "Master Statistics & Probability (80%+)", icon: "🎲", category: "mastery", requirement: 80, xpReward: 75 },

  // Special badges
  { id: "perfect_10", name: "Perfect 10", description: "Get 10 correct with no mistakes in one session", icon: "⭐", category: "special", requirement: 10, xpReward: 75 },
  { id: "comeback", name: "Comeback Cat", description: "Get 5 correct after getting 3 wrong", icon: "💪", category: "special", requirement: 5, xpReward: 40 },
  { id: "early_bird", name: "Early Bird", description: "Practice before 8 AM", icon: "🌅", category: "special", requirement: 8, xpReward: 25 },
  { id: "night_owl", name: "Night Owl", description: "Practice after 8 PM", icon: "🦉", category: "special", requirement: 20, xpReward: 25 },
  { id: "weekend_warrior", name: "Weekend Warrior", description: "Practice on Saturday or Sunday", icon: "🏆", category: "special", requirement: 0, xpReward: 30 },
  { id: "all_domains", name: "Well Rounded", description: "Solve problems in all 5 domains", icon: "🌟", category: "special", requirement: 5, xpReward: 100 },
];

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

export function getUnlockedBadges(unlockedIds: string[]): Badge[] {
  return BADGES.filter(b => unlockedIds.includes(b.id));
}

export function getLockedBadges(unlockedIds: string[]): Badge[] {
  return BADGES.filter(b => !unlockedIds.includes(b.id));
}

// Check if a badge should be unlocked based on current stats
export interface PlayerStats {
  totalProblems: number;
  totalCorrect: number;
  currentStreak: number;
  bestStreak: number;
  domainsMastered: string[]; // domain codes with 80%+
  domainsAttempted: string[]; // domain codes attempted
  sessionCorrect: number; // correct in current session
  sessionWrong: number; // wrong in current session
  comebackStreak: number; // correct after 3+ wrong
}

export function checkNewBadges(stats: PlayerStats, currentBadges: string[]): Badge[] {
  const newBadges: Badge[] = [];
  const hour = new Date().getHours();
  const day = new Date().getDay();

  // Streak badges
  if (stats.bestStreak >= 3 && !currentBadges.includes("streak_3")) {
    newBadges.push(getBadgeById("streak_3")!);
  }
  if (stats.bestStreak >= 5 && !currentBadges.includes("streak_5")) {
    newBadges.push(getBadgeById("streak_5")!);
  }
  if (stats.bestStreak >= 10 && !currentBadges.includes("streak_10")) {
    newBadges.push(getBadgeById("streak_10")!);
  }
  if (stats.bestStreak >= 20 && !currentBadges.includes("streak_20")) {
    newBadges.push(getBadgeById("streak_20")!);
  }

  // Problems badges
  if (stats.totalProblems >= 1 && !currentBadges.includes("problems_1")) {
    newBadges.push(getBadgeById("problems_1")!);
  }
  if (stats.totalProblems >= 10 && !currentBadges.includes("problems_10")) {
    newBadges.push(getBadgeById("problems_10")!);
  }
  if (stats.totalProblems >= 50 && !currentBadges.includes("problems_50")) {
    newBadges.push(getBadgeById("problems_50")!);
  }
  if (stats.totalProblems >= 100 && !currentBadges.includes("problems_100")) {
    newBadges.push(getBadgeById("problems_100")!);
  }
  if (stats.totalProblems >= 500 && !currentBadges.includes("problems_500")) {
    newBadges.push(getBadgeById("problems_500")!);
  }

  // Domain mastery badges
  if (stats.domainsMastered.includes("RP") && !currentBadges.includes("master_rp")) {
    newBadges.push(getBadgeById("master_rp")!);
  }
  if (stats.domainsMastered.includes("NS") && !currentBadges.includes("master_ns")) {
    newBadges.push(getBadgeById("master_ns")!);
  }
  if (stats.domainsMastered.includes("EE") && !currentBadges.includes("master_ee")) {
    newBadges.push(getBadgeById("master_ee")!);
  }
  if (stats.domainsMastered.includes("G") && !currentBadges.includes("master_g")) {
    newBadges.push(getBadgeById("master_g")!);
  }
  if (stats.domainsMastered.includes("SP") && !currentBadges.includes("master_sp")) {
    newBadges.push(getBadgeById("master_sp")!);
  }

  // Special badges
  if (stats.sessionCorrect >= 10 && stats.sessionWrong === 0 && !currentBadges.includes("perfect_10")) {
    newBadges.push(getBadgeById("perfect_10")!);
  }
  if (stats.comebackStreak >= 5 && !currentBadges.includes("comeback")) {
    newBadges.push(getBadgeById("comeback")!);
  }
  if (hour < 8 && !currentBadges.includes("early_bird")) {
    newBadges.push(getBadgeById("early_bird")!);
  }
  if (hour >= 20 && !currentBadges.includes("night_owl")) {
    newBadges.push(getBadgeById("night_owl")!);
  }
  if ((day === 0 || day === 6) && !currentBadges.includes("weekend_warrior")) {
    newBadges.push(getBadgeById("weekend_warrior")!);
  }
  if (stats.domainsAttempted.length >= 5 && !currentBadges.includes("all_domains")) {
    newBadges.push(getBadgeById("all_domains")!);
  }

  return newBadges.filter(b => b !== undefined);
}

// =============================================================================
// DAILY GOALS
// =============================================================================

export interface DailyGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
}

export function generateDailyGoals(currentProblems: number, currentCorrect: number): DailyGoal[] {
  return [
    {
      id: "daily_problems",
      name: "Solve 10 problems today",
      target: 10,
      current: Math.min(currentProblems, 10),
      xpReward: 25,
      completed: currentProblems >= 10,
    },
    {
      id: "daily_correct",
      name: "Get 7 correct today",
      target: 7,
      current: Math.min(currentCorrect, 7),
      xpReward: 30,
      completed: currentCorrect >= 7,
    },
    {
      id: "daily_streak",
      name: "Get a 5 streak",
      target: 5,
      current: 0, // Will be updated by caller
      xpReward: 20,
      completed: false, // Will be updated by caller
    },
  ];
}
