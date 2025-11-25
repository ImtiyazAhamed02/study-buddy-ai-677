import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storage } from "@/services/storageService";
import { LeaderboardEntry } from "@/types";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [topperLeaders, setTopperLeaders] = useState<LeaderboardEntry[]>([]);
  const [passLeaders, setPassLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setTopperLeaders(storage.getLeaderboard("topper", 10));
    setPassLeaders(storage.getLeaderboard("pass", 10));
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-warning" />;
      case 2: return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3: return <Award className="w-6 h-6 text-secondary" />;
      default: return <span className="w-6 text-center font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "gradient-hero";
      case 2: return "bg-muted/80";
      case 3: return "gradient-coral";
      default: return "bg-card";
    }
  };

  const LeaderboardTable = ({ leaders }: { leaders: LeaderboardEntry[] }) => (
    <div className="space-y-3">
      {leaders.map((entry, idx) => (
        <motion.div
          key={entry.user.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className={`p-4 ${getRankColor(entry.rank)} ${entry.user.id === "u5" ? "border-2 border-primary shadow-glow" : ""}`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12">
                {getRankIcon(entry.rank)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">
                    {entry.user.name}
                    {entry.user.id === "u5" && (
                      <span className="ml-2 text-sm text-primary font-normal">(You)</span>
                    )}
                  </h3>
                  {entry.badges.map((badge, idx) => (
                    <span key={idx} className="text-sm">{badge}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{entry.user.email}</span>
                  <span>•</span>
                  <span>{entry.totalQuizzes} quizzes</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {entry.avgScore}%
                </div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-hero shadow-glow">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Leaderboard</h1>
        <p className="text-lg text-muted-foreground">
          See how you rank against other learners
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {[
          { label: "Total Learners", value: "1,234", icon: TrendingUp, color: "text-primary" },
          { label: "Quizzes Completed", value: "8,567", icon: Award, color: "text-secondary" },
          { label: "Avg Completion", value: "84%", icon: Trophy, color: "text-success" }
        ].map((stat, idx) => (
          <Card key={idx} className="p-4 text-center">
            <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* Leaderboard Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="topper" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="topper" className="gap-2">
              <Trophy className="w-4 h-4" />
              Topper Mode
            </TabsTrigger>
            <TabsTrigger value="pass" className="gap-2">
              <Award className="w-4 h-4" />
              Pass Mode
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topper">
            <LeaderboardTable leaders={topperLeaders} />
          </TabsContent>

          <TabsContent value="pass">
            <LeaderboardTable leaders={passLeaders} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
