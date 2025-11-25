# ScholarGen - AI Study Partner

![ScholarGen Banner](https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=400&fit=crop)

**Transform any text or PDF into AI-powered study materials with summaries, questions, and personalized learning paths.**

---

## 🌟 Features

### Core Functionality
- ✅ **Document Upload**: Paste text or upload PDF/TXT files
- ✅ **AI Summarization**: Get concise summaries with key highlights
- ✅ **Question Generation**: Auto-generate MCQ, short answer, and analytical questions
- ✅ **Dual Mode System**:
  - **Topper Mode**: Advanced questions for top scorers
  - **Pass Mode**: High-probability questions focused on passing
- ✅ **Interactive Quizzes**: Two timer modes (per-question and overall)
- ✅ **Results & Analytics**: Track scores, weak spots, and rankings
- ✅ **Leaderboard**: Compete with other learners
- ✅ **Flashcard Boost**: Quick-fire learning with streak multipliers
- ✅ **Auto-Answer**: Ask questions about the source material

### Advanced Features
- 🎯 **Weak Spot Detection**: Identify topics needing more focus
- 📊 **Exam Probability Analysis**: Topics ranked by exam likelihood
- 📈 **Learning Analytics**: Track mastery, time spent, and progress
- 🎨 **Beautiful UI**: Modern design with smooth animations
- 📱 **Responsive**: Works on all devices

---

## 🚀 Tech Stack

Built with modern web technologies:

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **PDF Parsing**: pdfjs-dist
- **State**: React hooks + local storage service
- **Routing**: React Router v6

---

## 📋 Current Implementation

### Mock Mode (Active)
The app currently runs in **mock mode** with deterministic AI responses. This allows you to:
- Demo all features without API keys
- Test the complete user flow
- See realistic question generation
- Experience the full UI/UX

### Mock LLM Service
Location: `src/services/mockLLMService.ts`

Implements:
- `domainDetect()` - Identifies subject domain
- `summarize()` - Creates concise summaries
- `generateQuestions()` - Creates questions based on mode
- `examProbability()` - Analyzes exam likelihood
- `answerQuestion()` - Answers from source material
- `generateFlashcards()` - Creates study flashcards

---

## 🎯 How to Use

### 1. Upload Material
- Navigate to the home page
- Paste text or upload a PDF/TXT file
- Add a title (optional)
- Click "Generate Study Materials"

### 2. Review Summary
- View AI-generated summary
- Check key highlights
- Use "Ask a Question" to get answers from the source

### 3. Generate Questions
Choose your mode:
- **Topper Mode**: 7 challenging questions (3 MCQ, 2 Short, 2 Analytical)
- **Pass Mode**: 5 focused questions (2 MCQ, 2 Short, 1 Analytical)

### 4. Take Quiz
- Configure timer mode:
  - **Per Question**: Individual countdown per question
  - **Overall**: Total time for all questions
- Set time per question (30-120 seconds)
- Answer questions
- Get instant results

### 5. Review Performance
- See your score and breakdown
- Identify weak spots
- Check your rank on the leaderboard
- Review exam probability analysis

### 6. Use Flashcards
- Enable "Boost Mode" for timed challenges
- Build streaks for bonus points
- Review wrong cards automatically

### 7. Track Analytics
- View weak spot heatmap
- Analyze time per question type
- Check mastery by chapter
- Review exam probability rankings

---

## 🔮 Future Enhancements

### Ready to Add (when needed)
1. **Real LLM Integration**
   - Connect to Lovable AI gateway
   - Support for Google Gemini and OpenAI GPT-5
   - Edge functions for backend processing
   - Proper API error handling

2. **Backend (Lovable Cloud)**
   - PostgreSQL database for persistence
   - User authentication
   - Quiz history storage
   - Real leaderboard rankings

3. **Enhanced Features**
   - Collaborative study groups
   - Spaced repetition algorithm
   - Export study materials (PDF, Anki)
   - Voice narration for flashcards
   - Mobile app (React Native)

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── Layout.tsx       # Main layout with navigation
│   └── QuestionCard.tsx # Question display component
├── pages/
│   ├── Upload.tsx       # Document upload page
│   ├── Summary.tsx      # Summary view with Q&A
│   ├── Questions.tsx    # Question preview
│   ├── Quiz.tsx         # Quiz player
│   ├── Results.tsx      # Quiz results
│   ├── Leaderboard.tsx  # Rankings
│   ├── Analytics.tsx    # Learning analytics
│   └── Flashcards.tsx   # Flashcard boost mode
├── services/
│   ├── mockLLMService.ts   # Mock AI service
│   └── storageService.ts   # In-memory storage
├── types/
│   └── index.ts         # TypeScript types
├── lib/
│   ├── pdfParser.ts     # PDF text extraction
│   └── utils.ts         # Utility functions
└── App.tsx              # Main app with routing
```

---

## 🎨 Design System

### Colors
- **Primary**: Deep indigo (trust, learning)
- **Secondary**: Vibrant coral (energy, motivation)
- **Accent**: Purple (creativity)
- **Success**: Green (correct answers)
- **Warning**: Amber (time pressure)

### Typography
- Modern, readable fonts
- Bold headings for hierarchy
- Clean body text for long content

### Animations
- Smooth transitions with Framer Motion
- Page transitions and micro-interactions
- Stagger animations for lists
- Card flips for flashcards

---

## 📊 Data Flow

1. **Upload** → Extract text → Detect domain
2. **Summarize** → Generate summary + highlights
3. **Questions** → Generate based on mode (topper/pass)
4. **Quiz** → Record answers + time
5. **Grade** → Calculate score + weak spots
6. **Analytics** → Aggregate performance data

---

## 🔧 Development Notes

### Adding Real LLM
To connect real AI models:

1. Enable Lovable Cloud
2. Create edge function: `supabase/functions/chat/index.ts`
3. Use Lovable AI gateway: `https://ai.gateway.lovable.dev/v1/chat/completions`
4. Update `mockLLMService.ts` to call edge function
5. Handle rate limits (429) and credits (402)

### Recommended Models
- **Default**: `google/gemini-2.5-flash` (balanced)
- **Advanced**: `google/gemini-2.5-pro` (reasoning)
- **Fast**: `google/gemini-2.5-flash-lite` (quick tasks)

---

## 🎓 Use Cases

- 📚 **Students**: Prepare for exams efficiently
- 👨‍🏫 **Teachers**: Generate practice materials
- 🏢 **Professionals**: Learn new skills quickly
- 📖 **Researchers**: Summarize papers and articles
- 🌍 **Lifelong Learners**: Master any subject

---

## 🤝 Contributing

This project is ready for hackathons and demos! To extend it:

1. Fork the repository
2. Create a feature branch
3. Add your enhancements
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

Built with ❤️ for learners everywhere. Free to use and modify.

---

## 🙏 Acknowledgments

- Built on [Lovable](https://lovable.dev) platform
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Powered by modern web technologies

---

## 📞 Support

For questions or issues:
- Check the code comments
- Review the type definitions
- Inspect the mock service implementations
- Test with sample data provided

---

**Happy Learning! 🎓✨**
