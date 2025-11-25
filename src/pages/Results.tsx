import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { storage } from "@/services/storageService";
import { QuizResults, Question } from "@/types";
import { Trophy, TrendingUp, Target, Home, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Results() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResults | null>(null);

  useEffect(() => {
    if (quizId) {
      const quiz = storage.getQuiz(quizId);
      if (!quiz) {
        navigate("/");
        return;
      }

      const pack = storage.getQuestionPack(quiz.questionPackId);
      if (!pack) {
        navigate("/");
        return;
      }

      // Grade the quiz
      let correct = 0;
      let incorrect = 0;
      let unanswered = 0;

      const answeredQuestions = pack.questions.map(q => {
        const userAnswer = quiz.answers.find(a => a.questionId === q.id);
        
        if (!userAnswer || !userAnswer.answerText.trim()) {
          unanswered++;
          return { ...q, userAnswer: "", correct: false };
        }

        // Simple grading
        let isCorrect = false;
        if (q.type === "mcq") {
          isCorrect = userAnswer.answerText.toLowerCase() === q.answer.toLowerCase();
        } else if (q.type === "short") {
          // Check if key terms match
          const keyTerms = q.answer.toLowerCase().split(/\s+/);
          const userTerms = userAnswer.answerText.toLowerCase();
          isCorrect = keyTerms.some(term => userTerms.includes(term));
        }
        // Analytical questions need manual grading (set to false for demo)

        if (isCorrect) correct++;
        else incorrect++;

        return { ...q, userAnswer: userAnswer.answerText, correct: isCorrect };
      });

      const totalScore = correct;
      const maxScore = pack.questions.length;
      const percentage = Math.round((totalScore / maxScore) * 100);

      // Calculate weak spots
      const weakSpots = [
        { topic: "Advanced Concepts", errorCount: incorrect, studyTip: "Review the theoretical frameworks" },
        { topic: "Practical Applications", errorCount: Math.floor(incorrect * 0.6), studyTip: "Practice with real-world examples" }
      ].filter(w => w.errorCount > 0);

      // Motivational message
      let message = "";
      if (percentage >= 90) message = "🎉 Outstanding! You're a true scholar!";
      else if (percentage >= 75) message = "💪 Great job! Keep up the excellent work!";
      else if (percentage >= 60) message = "✨ Good effort! A bit more practice will perfect your skills!";
      else message = "📚 Don't give up! Every expert was once a beginner!";

      // Update user stats
      const user = storage.getUser("u5");
      if (user) {
        const newStats = {
          totalQuizzes: user.stats.totalQuizzes + 1,
          avgScore: Math.round(
            (user.stats.avgScore * user.stats.totalQuizzes + percentage) / (user.stats.totalQuizzes + 1)
          ),
          totalTimeSpent: user.stats.totalTimeSpent + quiz.answers.reduce((sum, a) => sum + a.timeTakenSecs, 0)
        };
        storage.updateUser("u5", { stats: newStats });
      }

      // Calculate rank
      const leaderboard = storage.getLeaderboard(quiz.mode, 100);
      const userEntry = leaderboard.find(e => e.user.id === "u5");

      setResults({
        totalScore,
        maxScore,
        percentage,
        breakdown: { correct, incorrect, unanswered },
        motivationalMessage: message,
        weakSpots,
        rank: userEntry?.rank,
        percentile: userEntry ? Math.round((1 - userEntry.rank / leaderboard.length) * 100) : undefined,
        answeredQuestions
      });
    }
  }, [quizId, navigate]);

  if (!results) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-success to-primary shadow-glow">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Quiz Complete!</h1>
        <p className="text-xl text-muted-foreground">{results.motivationalMessage}</p>
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 shadow-card">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">
                {results.percentage}%
              </div>
              <p className="text-muted-foreground">Score</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-foreground mb-2">
                {results.totalScore}/{results.maxScore}
              </div>
              <p className="text-muted-foreground">Correct Answers</p>
            </div>
            {results.rank && (
              <div>
                <div className="text-5xl font-bold gradient-hero bg-clip-text text-transparent mb-2">
                  #{results.rank}
                </div>
                <p className="text-muted-foreground">Your Rank</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Breakdown</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-success/5 border border-success/20">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">{results.breakdown.correct}</div>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <XCircle className="w-6 h-6 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">{results.breakdown.incorrect}</div>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/5 border border-warning/20">
              <AlertCircle className="w-6 h-6 text-warning" />
              <div>
                <div className="text-2xl font-bold text-warning">{results.breakdown.unanswered}</div>
                <p className="text-sm text-muted-foreground">Skipped</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Weak Spots */}
      {results.weakSpots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-warning" />
              Areas to Improve
            </h2>
            <div className="space-y-3">
              {results.weakSpots.map((spot, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{spot.topic}</h3>
                    <span className="text-sm text-muted-foreground">{spot.errorCount} errors</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{spot.studyTip}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        <Button onClick={() => navigate("/leaderboard")} variant="outline" size="lg" className="flex-1 gap-2">
          <Trophy className="w-5 h-5" />
          View Leaderboard
        </Button>
        <Button onClick={() => navigate("/")} size="lg" className="flex-1 gap-2">
          <Home className="w-5 h-5" />
          Start New Session
        </Button>
      </motion.div>
    </div>
  );
}
