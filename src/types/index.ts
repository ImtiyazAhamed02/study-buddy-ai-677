export type DifficultyMode = "topper" | "pass";
export type TimerMode = "perQuestion" | "overall";
export type QuestionType = "mcq" | "short" | "analytical";

export interface Domain {
  domain: string;
  confidence: number;
  recommendedDifficulty: string;
  reasons: string[];
}

export interface Summary {
  id: string;
  ingestId: string;
  summaryText: string;
  highlights: string[];
  wordCountOriginal: number;
  wordCountSummary: number;
  compression: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  answer: string;
  rationale: string;
  supportingSpan: string;
  difficulty: string;
  estimatedTimeSecs: number;
  valid?: boolean;
  failureReason?: string;
}

export interface QuestionPack {
  id: string;
  summaryId: string;
  mode: DifficultyMode;
  questions: Question[];
  createdAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  answerText: string;
  timeTakenSecs: number;
  correct?: boolean;
}

export interface Quiz {
  id: string;
  userId?: string;
  questionPackId: string;
  answers: QuizAnswer[];
  score?: number;
  totalScore?: number;
  perQuestionSecs: number;
  overallSecs?: number;
  mode: DifficultyMode;
  timerMode: TimerMode;
  startedAt: Date;
  expiresAt?: Date;
  finishedAt?: Date;
}

export interface QuizResults {
  totalScore: number;
  maxScore: number;
  percentage: number;
  breakdown: {
    correct: number;
    incorrect: number;
    unanswered: number;
  };
  motivationalMessage: string;
  weakSpots: WeakSpot[];
  rank?: number;
  percentile?: number;
  answeredQuestions: (Question & { userAnswer: string; correct: boolean })[];
}

export interface WeakSpot {
  topic: string;
  errorCount: number;
  studyTip: string;
}

export interface ExamProbability {
  topic: string;
  probability: "high" | "medium" | "low";
  reason: string;
}

export interface Ingest {
  id: string;
  userId?: string;
  title: string;
  text: string;
  domain?: Domain;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  stats: {
    totalQuizzes: number;
    avgScore: number;
    totalTimeSpent: number;
  };
}

export interface LeaderboardEntry {
  user: User;
  avgScore: number;
  totalQuizzes: number;
  rank: number;
  badges: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: string;
  difficulty: string;
}
