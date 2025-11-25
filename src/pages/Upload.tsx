import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload as UploadIcon, FileText, Loader2 } from "lucide-react";
import { parsePDF } from "@/lib/pdfParser";
import { MockLLMService } from "@/services/mockLLMService";
import { storage } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      if (file.type === "application/pdf") {
        const extractedText = await parsePDF(file);
        setText(extractedText);
        if (!title) setTitle(file.name.replace(/\.pdf$/i, ""));
        toast({
          title: "PDF uploaded successfully",
          description: `Extracted ${extractedText.split(/\s+/).length} words`
        });
      } else if (file.type === "text/plain") {
        const text = await file.text();
        setText(text);
        if (!title) setTitle(file.name.replace(/\.txt$/i, ""));
        toast({
          title: "Text file uploaded successfully"
        });
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a PDF or TXT file",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast({
        title: "No content",
        description: "Please paste text or upload a file",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Detect domain
      const domain = MockLLMService.domainDetect(text);
      
      // Save ingest
      const ingest = storage.saveIngest({
        title: title || "Untitled Document",
        text,
        domain
      });

      // Generate summary
      const summaryData = MockLLMService.summarize(text, 0.65);
      const summary = storage.saveSummary({
        ingestId: ingest.id,
        ...summaryData
      });

      toast({
        title: "Document processed!",
        description: `Domain: ${domain.domain} (${Math.round(domain.confidence * 100)}% confidence)`
      });

      navigate(`/summary/${summary.id}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Processing failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-hero shadow-glow">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">
          Upload Your Study Material
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform any text or PDF into AI-powered study materials with summaries, 
          questions, and personalized learning paths.
        </p>
      </motion.div>

      {/* Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 shadow-card">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="e.g., Physics Chapter 3 - Quantum Mechanics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Text input */}
            <div className="space-y-2">
              <Label htmlFor="text">Paste Your Text</Label>
              <Textarea
                id="text"
                placeholder="Paste your study material here, or upload a file below..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isLoading}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {text.split(/\s+/).filter(w => w.length > 0).length} words
              </p>
            </div>

            {/* File upload */}
            <div className="space-y-2">
              <Label>Or Upload a File</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  disabled={isLoading}
                >
                  <UploadIcon className="w-4 h-4" />
                  Choose PDF or TXT
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !text.trim()}
              className="w-full gap-2 shadow-glow"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Study Materials
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {[
          { title: "AI Summaries", desc: "Get concise summaries with key highlights" },
          { title: "Smart Questions", desc: "Practice with auto-generated questions" },
          { title: "Exam Ready", desc: "Track weak spots and probabilities" }
        ].map((feature, idx) => (
          <Card key={idx} className="p-4 text-center bg-muted/50">
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
