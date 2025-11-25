import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { storage } from "@/services/storageService";
import { MockLLMService } from "@/services/mockLLMService";
import { Summary as SummaryType } from "@/types";
import { Sparkles, Target, Users, Lightbulb, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Summary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ text: string | null; span?: string; reason?: string } | null>(null);

  useEffect(() => {
    if (id) {
      const data = storage.getSummary(id);
      if (data) {
        setSummary(data);
      } else {
        toast({
          title: "Summary not found",
          variant: "destructive"
        });
        navigate("/");
      }
    }
  }, [id, navigate, toast]);

  const generateQuestions = async (mode: "topper" | "pass") => {
    if (!summary) return;
    
    setIsGenerating(true);
    try {
      const ingest = storage.getIngest(summary.ingestId);
      if (!ingest) throw new Error("Source document not found");

      const counts = mode === "topper"
        ? { mcq: 3, short: 2, analytical: 2 }
        : { mcq: 2, short: 2, analytical: 1 };

      const questions = MockLLMService.generateQuestions(
        summary.summaryText,
        ingest.text,
        counts,
        mode
      );

      const pack = storage.saveQuestionPack({
        summaryId: summary.id,
        mode,
        questions
      });

      toast({
        title: "Questions generated!",
        description: `${questions.length} questions ready for ${mode} mode`
      });

      navigate(`/questions/${pack.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!summary || !question.trim()) return;

    const ingest = storage.getIngest(summary.ingestId);
    if (!ingest) return;

    const result = MockLLMService.answerQuestion(question, ingest.text);
    setAnswer({
      text: result.answerText,
      span: result.supportingSpan,
      reason: result.reason
    });
  };

  if (!summary) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const compressionPercent = Math.round((1 - summary.compression) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Summary</h1>
            <p className="text-muted-foreground">
              {compressionPercent}% reduction • {summary.wordCountSummary} words
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="text-base leading-relaxed mb-6">{summary.summaryText}</p>
          
          {/* Highlights */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              Key Highlights
            </h3>
            <div className="space-y-2">
              {summary.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <p className="text-sm">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Generate Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Generate Practice Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => generateQuestions("topper")}
              disabled={isGenerating}
              size="lg"
              className="gap-2 gradient-hero text-white shadow-glow h-auto py-6 flex-col items-start"
            >
              <div className="flex items-center gap-2 w-full">
                <Target className="w-5 h-5" />
                <span className="text-lg font-bold">Topper Mode</span>
              </div>
              <span className="text-sm opacity-90 font-normal">
                Challenge yourself with advanced questions
              </span>
            </Button>

            <Button
              onClick={() => generateQuestions("pass")}
              disabled={isGenerating}
              size="lg"
              variant="outline"
              className="gap-2 h-auto py-6 flex-col items-start border-2"
            >
              <div className="flex items-center gap-2 w-full">
                <Users className="w-5 h-5" />
                <span className="text-lg font-bold">Pass Mode</span>
              </div>
              <span className="text-sm text-muted-foreground font-normal">
                Focus on high-probability exam questions
              </span>
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Auto-Answer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ask anything about the source material and get AI-powered answers with supporting text
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="What is the main concept explained?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
            />
            <Button onClick={handleAskQuestion} disabled={!question.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-muted/50 border border-border"
            >
              {answer.text ? (
                <>
                  <p className="font-medium mb-2">Answer:</p>
                  <p className="text-sm mb-3">{answer.text}</p>
                  {answer.span && (
                    <div className="p-3 rounded bg-primary/5 border border-primary/20">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Supporting text:</p>
                      <p className="text-xs italic">"{answer.span}"</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    Not Found
                  </Badge>
                  <p className="text-sm text-muted-foreground">{answer.reason}</p>
                </div>
              )}
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
