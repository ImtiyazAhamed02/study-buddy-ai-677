import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { storage } from "@/services/storageService";
import { Quiz as QuizType, Question } from "@/types";
import { Clock, ChevronRight, Flag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Quiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    if (quizId) {
      const data = storage.getQuiz(quizId);
      if (data) {
        setQuiz(data);
        const pack = storage.getQuestionPack(data.questionPackId);
        if (pack) {
          setQuestions(pack.questions);
          setTimeLeft(data.timerMode === "perQuestion" ? data.perQuestionSecs : data.overallSecs || 0);
        }
      } else {
        toast({
          title: "Quiz not found",
          variant: "destructive"
        });
        navigate("/");
      }
    }
  }, [quizId, navigate, toast]);

  useEffect(() => {
    if (!quiz || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (quiz.timerMode === "perQuestion") {
            handleNext(true);
          } else {
            handleFinish();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, timeLeft, currentIndex]);

  const handleNext = (autoAdvance = false) => {
    if (!quiz) return;

    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    const currentQuestion = questions[currentIndex];

    const updatedAnswers = [
      ...quiz.answers,
      {
        questionId: currentQuestion.id,
        answerText: answer,
        timeTakenSecs: timeTaken
      }
    ];

    const updatedQuiz = { ...quiz, answers: updatedAnswers };
    storage.updateQuiz(quiz.id, { answers: updatedAnswers });
    setQuiz(updatedQuiz);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setQuestionStartTime(Date.now());
      if (quiz.timerMode === "perQuestion") {
        setTimeLeft(quiz.perQuestionSecs);
      }
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    if (!quiz) return;
    storage.updateQuiz(quiz.id, { finishedAt: new Date() });
    navigate(`/results/${quiz.id}`);
  };

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quiz in Progress</h1>
          <p className="text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeLeft < 10 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        }`}>
          <Clock className="w-5 h-5" />
          <span className="text-xl font-bold font-mono">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentIndex + 1}/{questions.length} completed</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 shadow-card">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {currentQuestion.type.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-semibold leading-relaxed">
                  {currentQuestion.prompt}
                </h2>
              </div>

              {currentQuestion.type === "mcq" && currentQuestion.options ? (
                <RadioGroup value={answer} onValueChange={setAnswer}>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-smooth cursor-pointer ${
                          answer === option
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setAnswer(option)}
                      >
                        <RadioGroupItem value={option} id={`option-${idx}`} />
                        <Label
                          htmlFor={`option-${idx}`}
                          className="flex-1 cursor-pointer font-medium"
                        >
                          {String.fromCharCode(65 + idx)}. {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <Textarea
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  className="text-base"
                />
              )}

              <div className="flex gap-3">
                {currentIndex < questions.length - 1 ? (
                  <Button
                    onClick={() => handleNext()}
                    disabled={!answer.trim()}
                    size="lg"
                    className="flex-1 gap-2"
                  >
                    Next Question
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleFinish}
                    disabled={!answer.trim()}
                    size="lg"
                    className="flex-1 gap-2 bg-success hover:bg-success/90"
                  >
                    Finish Quiz
                    <Flag className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
