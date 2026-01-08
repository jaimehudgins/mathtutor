-- Gamification Schema for Math Tutor
-- Run this in your Supabase SQL Editor AFTER the initial schema

-- Add gamification columns to user_stats table
ALTER TABLE user_stats
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_problem_date DATE,
ADD COLUMN IF NOT EXISTS daily_problems INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_correct INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS session_correct INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS session_wrong INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS domains_attempted TEXT[] DEFAULT '{}';

-- Create index for leaderboard queries (optional future feature)
CREATE INDEX IF NOT EXISTS idx_user_stats_xp ON user_stats(xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_level ON user_stats(level DESC);
