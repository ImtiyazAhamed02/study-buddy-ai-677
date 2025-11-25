import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Question } from "@/types";
import { useState } from "react";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  index: number;
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [showSpan, setShowSpan] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "mcq": return "bg-primary/10 text-primary border-primary/20";
      case "short": return "bg-secondary/10 text-secondary border-secondary/20";
      case "analytical": return "bg-accent/10 text-accent border-accent/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const lower = difficulty.toLowerCase();
    if (lower === "easy") return "bg-success/10 text-success border-success/20";
    if (lower === "medium") return "bg-warning/10 text-warning border-warning/20";
    if (lower === "hard") return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-glow transition-smooth">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {index}
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={cn("border", getTypeColor(question.type))}>
                {question.type.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={cn("border", getDifficultyColor(question.difficulty))}>
                {question.difficulty}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {Math.floor(question.estimatedTimeSecs / 60)}m
          </div>
        </div>

        {/* Question prompt */}
        <div className="space-y-3">
          <p className="font-semibold text-lg leading-relaxed">{question.prompt}</p>
          
          {/* MCQ Options */}
          {question.options && question.options.length > 0 && (
            <div className="space-y-2 pl-4">
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-3 rounded-lg border transition-smooth",
                    option === question.answer
                      ? "border-success bg-success/5"
                      : "border-border bg-muted/30"
                  )}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rationale */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm font-medium text-muted-foreground mb-1">Rationale:</p>
          <p className="text-sm">{question.rationale}</p>
        </div>

        {/* Supporting span toggle */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSpan(!showSpan)}
            className="gap-2"
          >
            {showSpan ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showSpan ? "Hide" : "Show"} Supporting Text
          </Button>
          
          {showSpan && (
            <div className="mt-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm italic text-muted-foreground">
                "{question.supportingSpan}"
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
