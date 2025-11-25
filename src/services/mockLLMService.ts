import type { Domain, Summary, Question, ExamProbability, QuestionType, DifficultyMode } from "@/types";

export class MockLLMService {
  // Simulate domain detection
  static domainDetect(text: string): Domain {
    const words = text.toLowerCase();
    
    // Simple keyword matching for demo
    if (words.includes("atom") || words.includes("physics") || words.includes("quantum")) {
      return {
        domain: "Physics",
        confidence: 0.92,
        recommendedDifficulty: "Intermediate",
        reasons: [
          "Text contains physics terminology",
          "Scientific concepts detected",
          "Mathematical formulas present"
        ]
      };
    } else if (words.includes("cell") || words.includes("biology") || words.includes("dna")) {
      return {
        domain: "Biology",
        confidence: 0.88,
        recommendedDifficulty: "Intermediate",
        reasons: [
          "Biological terms identified",
          "Life science concepts present",
          "Organic chemistry references"
        ]
      };
    } else if (words.includes("algorithm") || words.includes("code") || words.includes("computer")) {
      return {
        domain: "Computer Science",
        confidence: 0.95,
        recommendedDifficulty: "Advanced",
        reasons: [
          "Programming concepts detected",
          "Technical terminology present",
          "Algorithm discussion identified"
        ]
      };
    }
    
    return {
      domain: "General Studies",
      confidence: 0.75,
      recommendedDifficulty: "Intermediate",
      reasons: [
        "General academic content",
        "Multiple subjects referenced",
        "Broad topic coverage"
      ]
    };
  }

  // Simulate summarization
  static summarize(text: string, compression: number = 0.65): Omit<Summary, "id" | "ingestId" | "createdAt"> {
    const words = text.split(/\s+/);
    const wordCount = words.length;
    const targetWords = Math.floor(wordCount * compression);
    
    // Extract key sentences (simple algorithm)
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const summaryLength = Math.max(1, Math.floor(sentences.length * compression));
    const summaryText = sentences.slice(0, summaryLength).join(" ");
    
    // Extract highlights
    const highlights = sentences.slice(0, 3).map(s => s.trim());
    
    return {
      summaryText,
      highlights,
      wordCountOriginal: wordCount,
      wordCountSummary: summaryText.split(/\s+/).length,
      compression
    };
  }

  // Generate questions based on mode
  static generateQuestions(
    summary: string,
    sourceText: string,
    counts: { mcq: number; short: number; analytical: number },
    mode: DifficultyMode
  ): Question[] {
    const questions: Question[] = [];
    let id = 1;

    // Generate MCQs
    for (let i = 0; i < counts.mcq; i++) {
      questions.push({
        id: `q${id++}`,
        type: "mcq",
        prompt: mode === "topper" 
          ? `Advanced concept: Which principle best explains the phenomenon described in the text?`
          : `What is the main concept discussed in this section?`,
        options: [
          "Conservation of Energy",
          "Quantum Superposition",
          "Newton's Third Law",
          "Thermodynamic Equilibrium"
        ],
        answer: "Quantum Superposition",
        rationale: mode === "topper"
          ? "This requires deep understanding of quantum mechanics principles."
          : "This is a fundamental concept covered in the material.",
        supportingSpan: sourceText.substring(0, Math.min(100, sourceText.length)),
        difficulty: mode === "topper" ? "Hard" : "Medium",
        estimatedTimeSecs: mode === "topper" ? 90 : 60
      });
    }

    // Generate Short Answer
    for (let i = 0; i < counts.short; i++) {
      questions.push({
        id: `q${id++}`,
        type: "short",
        prompt: mode === "topper"
          ? "Explain the relationship between the two concepts discussed and provide an example."
          : "Define the key term mentioned in the first paragraph.",
        answer: mode === "topper"
          ? "The concepts are interconnected through fundamental principles, demonstrating causality."
          : "The key term refers to a fundamental principle in the field.",
        rationale: "This tests understanding of core concepts.",
        supportingSpan: sourceText.substring(100, Math.min(200, sourceText.length)),
        difficulty: mode === "topper" ? "Hard" : "Easy",
        estimatedTimeSecs: mode === "topper" ? 120 : 45
      });
    }

    // Generate Analytical
    for (let i = 0; i < counts.analytical; i++) {
      questions.push({
        id: `q${id++}`,
        type: "analytical",
        prompt: mode === "topper"
          ? "Critically analyze the implications of the theory presented. How might this change our understanding?"
          : "Explain why this concept is important in practical applications.",
        answer: "This requires synthesis of multiple concepts and critical thinking.",
        rationale: "Tests analytical and critical thinking skills.",
        supportingSpan: sourceText.substring(200, Math.min(320, sourceText.length)),
        difficulty: "Hard",
        estimatedTimeSecs: mode === "topper" ? 180 : 120
      });
    }

    return questions.map(q => ({ ...q, valid: true }));
  }

  // Exam probability analysis
  static examProbability(summary: string, sourceText: string): ExamProbability[] {
    const topics = [
      "Fundamental Concepts",
      "Theoretical Frameworks",
      "Practical Applications",
      "Historical Context",
      "Advanced Techniques"
    ];

    return topics.map((topic, idx) => ({
      topic,
      probability: idx < 2 ? "high" : idx < 4 ? "medium" : "low",
      reason: idx < 2
        ? "Core concept extensively covered in curriculum"
        : idx < 4
        ? "Supplementary topic with moderate emphasis"
        : "Advanced topic, less frequently examined"
    }));
  }

  // Answer question from source
  static answerQuestion(questionText: string, sourceText: string): { answerText: string | null; supportingSpan?: string; reason?: string } {
    // Simple keyword matching
    const keywords = questionText.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    
    for (const keyword of keywords) {
      if (sourceText.toLowerCase().includes(keyword)) {
        const index = sourceText.toLowerCase().indexOf(keyword);
        const span = sourceText.substring(
          Math.max(0, index - 50),
          Math.min(sourceText.length, index + 150)
        );
        
        return {
          answerText: `Based on the source material: ${span.substring(0, 100)}...`,
          supportingSpan: span
        };
      }
    }
    
    return {
      answerText: null,
      reason: "The question cannot be answered based on the provided source material. The content does not contain relevant information."
    };
  }

  // Generate flashcards
  static generateFlashcards(summary: string, count: number = 10) {
    const flashcards = [];
    
    for (let i = 0; i < count; i++) {
      flashcards.push({
        id: `fc${i + 1}`,
        front: `Key Concept ${i + 1}: What is the definition?`,
        back: `This concept refers to a fundamental principle that explains the relationship between elements in the system.`,
        topic: `Topic ${Math.floor(i / 3) + 1}`,
        difficulty: i < 3 ? "Easy" : i < 7 ? "Medium" : "Hard"
      });
    }
    
    return flashcards;
  }
}
