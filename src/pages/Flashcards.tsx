import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockLLMService } from "@/services/mockLLMService";
import { Flashcard } from "@/types";
import { Zap, RotateCw, CheckCircle, XCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBoostMode, setIsBoostMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [streak, setStreak] = useState(0);
  const [wrongCards, setWrongCards] = useState<Flashcard[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Generate flashcards
    const cards = MockLLMService.generateFlashcards("Sample study material", 10);
    setFlashcards(cards);
  }, []);

  useEffect(() => {
    if (!isBoostMode || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleWrong();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBoostMode, timeLeft, currentIndex]);

  const handleCorrect = () => {
    setStreak(streak + 1);
    setScore(score + (isBoostMode ? 10 + streak * 2 : 10));
    nextCard();
  };

  const handleWrong = () => {
    setStreak(0);
    setWrongCards([...wrongCards, flashcards[currentIndex]]);
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (isBoostMode) {
        setTimeLeft(Math.max(5, 10 - Math.floor(streak / 3)));
      }
    } else if (wrongCards.length > 0) {
      // Repeat wrong cards
      setFlashcards(wrongCards);
      setWrongCards([]);
      setCurrentIndex(0);
    } else {
      // Done!
      setCurrentIndex(-1);
    }
  };

  const toggleBoostMode = () => {
    setIsBoostMode(!isBoostMode);
    setStreak(0);
    setTimeLeft(10);
  };

  if (flashcards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p>Loading flashcards...</p>
      </div>
    );
  }

  if (currentIndex === -1) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center space-y-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-success shadow-glow">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Session Complete!</h1>
        <Card className="p-8">
          <div className="text-6xl font-bold text-primary mb-4">{score}</div>
          <p className="text-xl text-muted-foreground">Final Score</p>
          <p className="text-sm text-muted-foreground mt-2">
            {wrongCards.length === 0 ? "Perfect run! All cards correct!" : `Reviewed ${wrongCards.length} cards twice`}
          </p>
        </Card>
        <Button onClick={() => window.location.reload()} size="lg" className="gap-2">
          <RotateCw className="w-5 h-5" />
          Start New Session
        </Button>
      </motion.div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-hero shadow-glow">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Flashcard Boost Mode</h1>
        <p className="text-muted-foreground">
          Quick-fire learning with streak multipliers
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{score}</div>
          <p className="text-xs text-muted-foreground">Score</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary">{streak}</div>
          <p className="text-xs text-muted-foreground">Streak</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold">{currentIndex + 1}/{flashcards.length}</div>
          <p className="text-xs text-muted-foreground">Progress</p>
        </Card>
        <Card className="p-4 text-center">
          <div className={`text-2xl font-bold ${timeLeft < 4 ? "text-destructive" : ""}`}>
            {isBoostMode ? timeLeft : "-"}
          </div>
          <p className="text-xs text-muted-foreground">Time</p>
        </Card>
      </div>

      {/* Boost Mode Toggle */}
      <div className="flex justify-center">
        <Button
          variant={isBoostMode ? "default" : "outline"}
          onClick={toggleBoostMode}
          className="gap-2"
        >
          <Zap className="w-4 h-4" />
          {isBoostMode ? "Boost Mode ON" : "Enable Boost Mode"}
        </Button>
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.3 }}
          className="perspective-1000"
        >
          <Card
            className="p-8 min-h-[400px] flex flex-col items-center justify-center text-center cursor-pointer shadow-glow"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <Badge variant="outline" className="mb-4">
              {currentCard.topic}
            </Badge>
            
            <div className="flex-1 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-2xl font-bold mb-4">Question</h2>
                    <p className="text-lg">{currentCard.front}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-2xl font-bold mb-4 text-primary">Answer</h2>
                    <p className="text-lg">{currentCard.back}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              {isFlipped ? "How did you do?" : "Click to reveal answer"}
            </p>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            onClick={handleWrong}
            variant="outline"
            size="lg"
            className="gap-2 border-2 border-destructive/20 hover:bg-destructive/10"
          >
            <XCircle className="w-5 h-5 text-destructive" />
            Need Review
          </Button>
          <Button
            onClick={handleCorrect}
            size="lg"
            className="gap-2 bg-success hover:bg-success/90"
          >
            <CheckCircle className="w-5 h-5" />
            Got It!
          </Button>
        </motion.div>
      )}
    </div>
  );
}
