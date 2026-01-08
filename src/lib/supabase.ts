import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.",
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Types for our database tables
export interface ProblemAttempt {
  id?: string;
  user_id: string;
  standard_id: string;
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  created_at?: string;
}

export interface Progress {
  id?: string;
  user_id: string;
  standard_id: string;
  mastery_level: number;
  problems_attempted: number;
  problems_correct: number;
  last_practiced?: string;
}

export interface StudySession {
  id?: string;
  user_id: string;
  start_time?: string;
  end_time?: string;
  duration_minutes: number;
  standards_worked_on: string[];
}

export interface UserStats {
  user_id: string;
  total_study_time_minutes: number;
  weekly_study_time_minutes: number;
  last_week_reset?: string;
  // Gamification fields
  xp: number;
  level: number;
  current_streak: number;
  best_streak: number;
  badges: string[];
  last_problem_date?: string;
  daily_problems: number;
  daily_correct: number;
  session_correct: number;
  session_wrong: number;
  domains_attempted: string[];
}
