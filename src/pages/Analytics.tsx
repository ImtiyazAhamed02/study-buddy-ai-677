import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Target, Clock, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function Analytics() {
  // Mock data for demo
  const weakSpotData = [
    { topic: "Quantum Mechanics", errors: 8, color: "hsl(var(--destructive))" },
    { topic: "Thermodynamics", errors: 5, color: "hsl(var(--warning))" },
    { topic: "Classical Mechanics", errors: 3, color: "hsl(var(--secondary))" },
    { topic: "Electromagnetism", errors: 2, color: "hsl(var(--success))" }
  ];

  const timePerQuestion = [
    { type: "MCQ", avgTime: 45 },
    { type: "Short", avgTime: 75 },
    { type: "Analytical", avgTime: 120 }
  ];

  const examProbabilities = [
    { topic: "Fundamental Laws", probability: "high", reason: "Core concept, heavily emphasized in syllabus" },
    { topic: "Problem Solving", probability: "high", reason: "Frequently appears in past papers" },
    { topic: "Theoretical Frameworks", probability: "medium", reason: "Important but less frequently tested" },
    { topic: "Historical Context", probability: "medium", reason: "Supplementary material" },
    { topic: "Advanced Applications", probability: "low", reason: "Optional advanced topic" }
  ];

  const masteryLevels = [
    { chapter: "Chapter 1", mastery: 95 },
    { chapter: "Chapter 2", mastery: 88 },
    { chapter: "Chapter 3", mastery: 72 },
    { chapter: "Chapter 4", mastery: 85 },
    { chapter: "Chapter 5", mastery: 60 }
  ];

  const getProbabilityColor = (prob: string) => {
    switch (prob) {
      case "high": return "bg-success/10 text-success border-success/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-muted text-muted-foreground border-muted";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary shadow-glow">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Learning Analytics</h1>
        <p className="text-lg text-muted-foreground">
          Track your progress and identify areas for improvement
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-4 gap-4"
      >
        {[
          { label: "Avg Score", value: "85%", icon: TrendingUp, trend: "+5% this week" },
          { label: "Total Time", value: "12h", icon: Clock, trend: "Study time" },
          { label: "Weak Spots", value: "3", icon: Target, trend: "Need focus" },
          { label: "Mastery", value: "80%", icon: Brain, trend: "Overall progress" }
        ].map((stat, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.trend}</p>
          </Card>
        ))}
      </motion.div>

      {/* Weak Spot Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-warning" />
            Weak Spot Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weakSpotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="topic" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="errors" radius={[8, 8, 0, 0]}>
                {weakSpotData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Time Per Question Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Average Time Per Question Type
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={timePerQuestion} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="type" type="category" stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="avgTime" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Mastery by Chapter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            Mastery by Chapter
          </h2>
          <div className="space-y-4">
            {masteryLevels.map((item, idx) => {
              const color = item.mastery >= 80 ? "success" : item.mastery >= 60 ? "warning" : "destructive";
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.chapter}</span>
                    <span className={`font-bold text-${color}`}>{item.mastery}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${color} transition-all duration-1000`}
                      style={{ width: `${item.mastery}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Exam Probability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Exam Probability Analysis</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Based on your study material, here are topics ranked by exam likelihood
          </p>
          <div className="space-y-3">
            {examProbabilities.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{item.topic}</h3>
                  <Badge variant="outline" className={getProbabilityColor(item.probability)}>
                    {item.probability}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
