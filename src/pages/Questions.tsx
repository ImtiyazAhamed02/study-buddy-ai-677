import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storage } from "@/services/storageService";
import { QuestionPack, TimerMode } from "@/types";
import { QuestionCard } from "@/components/QuestionCard";
import { Play, Loader2, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Questions() {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pack, setPack] = useState<QuestionPack | null>(null);
  const [timerMode, setTimerMode] = useState<TimerMode>("perQuestion");
  const [perQuestionSecs, setPerQuestionSecs] = useState(60);

  useEffect(() => {
    if (packId) {
      const data = storage.getQuestionPack(packId);
      if (data) {
        setPack(data);
      } else {
        toast({
          title: "Questions not found",
          variant: "destructive"
        });
        navigate("/");
      }
    }
  }, [packId, navigate, toast]);

  const startQuiz = () => {
    if (!pack) return;

    const quiz = storage.saveQuiz({
      questionPackId: pack.id,
      answers: [],
      perQuestionSecs,
      overallSecs: timerMode === "overall" ? pack.questions.length * perQuestionSecs : undefined,
      mode: pack.mode,
      timerMode,
      userId: "u5", // Current user
      expiresAt: timerMode === "overall" 
        ? new Date(Date.now() + pack.questions.length * perQuestionSecs * 1000)
        : undefined
    });

    navigate(`/quiz/${quiz.id}`);
  };

  if (!pack) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalTime = Math.floor(pack.questions.reduce((sum, q) => sum + q.estimatedTimeSecs, 0) / 60);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-warning flex items-center justify-center shadow-glow">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Practice Questions</h1>
            <p className="text-muted-foreground">
              {pack.mode === "topper" ? "Topper Mode" : "Pass Mode"} • {pack.questions.length} questions • ~{totalTime}min
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quiz Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Quiz Settings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Timer Mode</Label>
              <Select value={timerMode} onValueChange={(v) => setTimerMode(v as TimerMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perQuestion">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Per Question Timer
                    </div>
                  </SelectItem>
                  <SelectItem value="overall">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Overall Timer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {timerMode === "perQuestion" 
                  ? "Each question has its own timer"
                  : "Complete all questions before time runs out"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Time Per Question (seconds)</Label>
              <Select value={String(perQuestionSecs)} onValueChange={(v) => setPerQuestionSecs(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="45">45 seconds</SelectItem>
                  <SelectItem value="60">60 seconds (recommended)</SelectItem>
                  <SelectItem value="90">90 seconds</SelectItem>
                  <SelectItem value="120">120 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={startQuiz}
            size="lg"
            className="w-full mt-6 gap-2 shadow-glow"
          >
            <Play className="w-5 h-5" />
            Start Quiz Now
          </Button>
        </Card>
      </motion.div>

      {/* Questions Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold">Question Preview</h2>
        <div className="space-y-4">
          {pack.questions.map((question, idx) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * idx }}
            >
              <QuestionCard question={question} index={idx + 1} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
