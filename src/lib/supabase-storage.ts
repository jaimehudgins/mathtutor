// Supabase-backed storage for persistence across devices
import { createClient, ProblemAttempt, Progress } from './supabase';
import { Problem } from './problems';

// Record a problem attempt and update progress
export async function recordProblemAttempt(
  userId: string,
  problem: Problem,
  userAnswer: string,
  isCorrect: boolean
): Promise<void> {
  const supabase = createClient();

  // Insert the problem attempt
  const attempt: Omit<ProblemAttempt, 'id' | 'created_at'> = {
    user_id: userId,
    standard_id: problem.standardId,
    question: problem.question,
    user_answer: userAnswer,
    correct_answer: problem.correctAnswer,
    is_correct: isCorrect,
  };

  await supabase.from('problem_attempts').insert(attempt);

  // Update or insert progress for this standard
  const { data: existingProgress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('standard_id', problem.standardId)
    .single();

  if (existingProgress) {
    const newAttempted = existingProgress.problems_attempted + 1;
    const newCorrect = existingProgress.problems_correct + (isCorrect ? 1 : 0);
    const newMastery = Math.min(100, Math.round((newCorrect / newAttempted) * 100));

    await supabase
      .from('progress')
      .update({
        problems_attempted: newAttempted,
        problems_correct: newCorrect,
        mastery_level: newMastery,
        last_practiced: new Date().toISOString(),
      })
      .eq('id', existingProgress.id);
  } else {
    const newProgress: Omit<Progress, 'id' | 'last_practiced'> = {
      user_id: userId,
      standard_id: problem.standardId,
      problems_attempted: 1,
      problems_correct: isCorrect ? 1 : 0,
      mastery_level: isCorrect ? 100 : 0,
    };

    await supabase.from('progress').insert(newProgress);
  }
}

// Get all progress for a user
export async function getUserProgress(userId: string): Promise<Progress[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_practiced', { ascending: false });

  if (error) {
    console.error('Error fetching progress:', error);
    return [];
  }

  return data || [];
}

// Get user stats
export async function getUserStats(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user stats:', error);
    return {
      total_study_time_minutes: 0,
      weekly_study_time_minutes: 0,
    };
  }

  return data;
}

// Get recent problem attempts
export async function getRecentAttempts(userId: string, limit: number = 20): Promise<ProblemAttempt[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('problem_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching attempts:', error);
    return [];
  }

  return data || [];
}

// Get problem history for a specific standard
export async function getStandardHistory(userId: string, standardId: string): Promise<ProblemAttempt[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('problem_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('standard_id', standardId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching standard history:', error);
    return [];
  }

  return data || [];
}

// Get aggregate stats
export async function getAggregateStats(userId: string) {
  const supabase = createClient();

  // Get total problems and correct count
  const { data: attempts } = await supabase
    .from('problem_attempts')
    .select('is_correct')
    .eq('user_id', userId);

  const totalProblems = attempts?.length || 0;
  const totalCorrect = attempts?.filter(a => a.is_correct).length || 0;
  const accuracy = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0;

  // Get mastered standards count
  const { data: progress } = await supabase
    .from('progress')
    .select('mastery_level')
    .eq('user_id', userId);

  const standardsMastered = progress?.filter(p => p.mastery_level >= 80).length || 0;

  return {
    totalProblems,
    totalCorrect,
    accuracy,
    standardsMastered,
  };
}

// Start a study session
export async function startStudySession(userId: string): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: userId,
      duration_minutes: 0,
      standards_worked_on: [],
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error starting session:', error);
    return null;
  }

  return data?.id || null;
}

// End a study session
export async function endStudySession(sessionId: string): Promise<void> {
  const supabase = createClient();

  // Get the session to calculate duration
  const { data: session } = await supabase
    .from('study_sessions')
    .select('start_time, user_id')
    .eq('id', sessionId)
    .single();

  if (!session) return;

  const startTime = new Date(session.start_time);
  const endTime = new Date();
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

  // Update the session
  await supabase
    .from('study_sessions')
    .update({
      end_time: endTime.toISOString(),
      duration_minutes: durationMinutes,
    })
    .eq('id', sessionId);

  // Update user stats
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', session.user_id)
    .single();

  if (stats) {
    // Check if we need to reset weekly time
    const lastReset = new Date(stats.last_week_reset);
    const daysSinceReset = Math.floor((endTime.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    const updates: Record<string, unknown> = {
      total_study_time_minutes: stats.total_study_time_minutes + durationMinutes,
    };

    if (daysSinceReset >= 7) {
      updates.weekly_study_time_minutes = durationMinutes;
      updates.last_week_reset = endTime.toISOString();
    } else {
      updates.weekly_study_time_minutes = stats.weekly_study_time_minutes + durationMinutes;
    }

    await supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', session.user_id);
  }
}
