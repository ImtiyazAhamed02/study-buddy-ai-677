import type { Ingest, Summary, QuestionPack, Quiz, User, LeaderboardEntry } from "@/types";

// In-memory storage for demo
class StorageService {
  private ingests: Map<string, Ingest> = new Map();
  private summaries: Map<string, Summary> = new Map();
  private questionPacks: Map<string, QuestionPack> = new Map();
  private quizzes: Map<string, Quiz> = new Map();
  private users: Map<string, User> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some users for leaderboard
    const users: User[] = [
      { id: "u1", name: "Alex Chen", email: "alex@example.com", stats: { totalQuizzes: 12, avgScore: 92, totalTimeSpent: 3600 } },
      { id: "u2", name: "Sarah Johnson", email: "sarah@example.com", stats: { totalQuizzes: 15, avgScore: 88, totalTimeSpent: 4200 } },
      { id: "u3", name: "Michael Brown", email: "michael@example.com", stats: { totalQuizzes: 8, avgScore: 95, totalTimeSpent: 2400 } },
      { id: "u4", name: "Emily Davis", email: "emily@example.com", stats: { totalQuizzes: 10, avgScore: 85, totalTimeSpent: 3000 } },
      { id: "u5", name: "Current User", email: "you@example.com", stats: { totalQuizzes: 0, avgScore: 0, totalTimeSpent: 0 } },
    ];
    
    users.forEach(u => this.users.set(u.id, u));
  }

  // Ingest operations
  saveIngest(ingest: Omit<Ingest, "id" | "createdAt">): Ingest {
    const id = `ing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newIngest: Ingest = {
      ...ingest,
      id,
      createdAt: new Date()
    };
    this.ingests.set(id, newIngest);
    return newIngest;
  }

  getIngest(id: string): Ingest | undefined {
    return this.ingests.get(id);
  }

  // Summary operations
  saveSummary(summary: Omit<Summary, "id" | "createdAt">): Summary {
    const id = `sum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSummary: Summary = {
      ...summary,
      id,
      createdAt: new Date()
    };
    this.summaries.set(id, newSummary);
    return newSummary;
  }

  getSummary(id: string): Summary | undefined {
    return this.summaries.get(id);
  }

  // Question pack operations
  saveQuestionPack(pack: Omit<QuestionPack, "id" | "createdAt">): QuestionPack {
    const id = `pack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPack: QuestionPack = {
      ...pack,
      id,
      createdAt: new Date()
    };
    this.questionPacks.set(id, newPack);
    return newPack;
  }

  getQuestionPack(id: string): QuestionPack | undefined {
    return this.questionPacks.get(id);
  }

  // Quiz operations
  saveQuiz(quiz: Omit<Quiz, "id" | "startedAt">): Quiz {
    const id = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newQuiz: Quiz = {
      ...quiz,
      id,
      startedAt: new Date()
    };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }

  getQuiz(id: string): Quiz | undefined {
    return this.quizzes.get(id);
  }

  updateQuiz(id: string, updates: Partial<Quiz>): Quiz | undefined {
    const quiz = this.quizzes.get(id);
    if (quiz) {
      const updated = { ...quiz, ...updates };
      this.quizzes.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // User operations
  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (user) {
      const updated = { ...user, ...updates };
      this.users.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Leaderboard
  getLeaderboard(mode: "topper" | "pass", limit: number = 10): LeaderboardEntry[] {
    const users = Array.from(this.users.values());
    return users
      .sort((a, b) => b.stats.avgScore - a.stats.avgScore)
      .slice(0, limit)
      .map((user, index) => ({
        user,
        avgScore: user.stats.avgScore,
        totalQuizzes: user.stats.totalQuizzes,
        rank: index + 1,
        badges: this.calculateBadges(user)
      }));
  }

  private calculateBadges(user: User): string[] {
    const badges: string[] = [];
    if (user.stats.avgScore >= 90) badges.push("🏆 Top Scorer");
    if (user.stats.totalQuizzes >= 10) badges.push("📚 Dedicated Learner");
    if (user.stats.avgScore >= 95) badges.push("⭐ Excellence");
    return badges;
  }
}

export const storage = new StorageService();
