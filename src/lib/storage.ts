// localStorage utilities for persistence

export interface StudentProgress {
  standardId: string;
  masteryLevel: number; // 0-100
  problemsAttempted: number;
  problemsCorrect: number;
  lastPracticed: string;
}

export interface StudySession {
  id: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  standardsWorkedOn: string[];
}

export interface ChatMessage {
  id: string;
  role: 'student' | 'tutor';
  content: string;
  timestamp: string;
  relatedStandards?: string[];
}

export interface StudentData {
  progress: StudentProgress[];
  sessions: StudySession[];
  chatHistory: ChatMessage[];
  totalStudyTimeMinutes: number;
  weeklyStudyTimeMinutes: number;
  lastWeekReset: string;
}

const STORAGE_KEY = 'math-tutor-data';

const getDefaultData = (): StudentData => ({
  progress: [],
  sessions: [],
  chatHistory: [],
  totalStudyTimeMinutes: 0,
  weeklyStudyTimeMinutes: 0,
  lastWeekReset: new Date().toISOString(),
});

export function getStudentData(): StudentData {
  if (typeof window === 'undefined') return getDefaultData();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultData();
    
    const data = JSON.parse(stored) as StudentData;
    
    // Reset weekly time if it's a new week
    const lastReset = new Date(data.lastWeekReset);
    const now = new Date();
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 7) {
      data.weeklyStudyTimeMinutes = 0;
      data.lastWeekReset = now.toISOString();
      saveStudentData(data);
    }
    
    return data;
  } catch {
    return getDefaultData();
  }
}

export function saveStudentData(data: StudentData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateProgress(standardId: string, correct: boolean): void {
  const data = getStudentData();
  
  let progress = data.progress.find(p => p.standardId === standardId);
  
  if (!progress) {
    progress = {
      standardId,
      masteryLevel: 0,
      problemsAttempted: 0,
      problemsCorrect: 0,
      lastPracticed: new Date().toISOString(),
    };
    data.progress.push(progress);
  }
  
  progress.problemsAttempted += 1;
  if (correct) {
    progress.problemsCorrect += 1;
  }
  
  // Calculate mastery level (weighted recent performance)
  progress.masteryLevel = Math.min(100, Math.round(
    (progress.problemsCorrect / progress.problemsAttempted) * 100
  ));
  progress.lastPracticed = new Date().toISOString();
  
  saveStudentData(data);
}

export function addStudyTime(minutes: number): void {
  const data = getStudentData();
  data.totalStudyTimeMinutes += minutes;
  data.weeklyStudyTimeMinutes += minutes;
  saveStudentData(data);
}

export function startSession(): string {
  const data = getStudentData();
  const session: StudySession = {
    id: Date.now().toString(),
    startTime: new Date().toISOString(),
    durationMinutes: 0,
    standardsWorkedOn: [],
  };
  data.sessions.push(session);
  saveStudentData(data);
  return session.id;
}

export function endSession(sessionId: string): void {
  const data = getStudentData();
  const session = data.sessions.find(s => s.id === sessionId);
  if (session) {
    session.endTime = new Date().toISOString();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    session.durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    addStudyTime(session.durationMinutes);
  }
  saveStudentData(data);
}

export function addChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
  const data = getStudentData();
  const newMessage: ChatMessage = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  data.chatHistory.push(newMessage);
  saveStudentData(data);
  return newMessage;
}

export function getChatHistory(): ChatMessage[] {
  return getStudentData().chatHistory;
}

export function clearChatHistory(): void {
  const data = getStudentData();
  data.chatHistory = [];
  saveStudentData(data);
}

export function getProgressByDomain(): Record<string, { total: number; mastered: number; average: number }> {
  const data = getStudentData();
  const byDomain: Record<string, { total: number; mastered: number; sum: number; count: number }> = {};
  
  for (const p of data.progress) {
    const domainCode = p.standardId.split('-')[1]?.toUpperCase() || 'OTHER';
    
    if (!byDomain[domainCode]) {
      byDomain[domainCode] = { total: 0, mastered: 0, sum: 0, count: 0 };
    }
    
    byDomain[domainCode].total += 1;
    byDomain[domainCode].sum += p.masteryLevel;
    byDomain[domainCode].count += 1;
    
    if (p.masteryLevel >= 80) {
      byDomain[domainCode].mastered += 1;
    }
  }
  
  const result: Record<string, { total: number; mastered: number; average: number }> = {};
  
  for (const [domain, stats] of Object.entries(byDomain)) {
    result[domain] = {
      total: stats.total,
      mastered: stats.mastered,
      average: stats.count > 0 ? Math.round(stats.sum / stats.count) : 0,
    };
  }
  
  return result;
}
