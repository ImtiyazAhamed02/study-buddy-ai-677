import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Upload", icon: BookOpen },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/flashcards", label: "Flashcards", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ScholarGen
                </h1>
                <p className="text-xs text-muted-foreground">AI Study Partner</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    className={cn(
                      "gap-2 transition-smooth",
                      isActive && "shadow-glow"
                    )}
                  >
                    <Link to={item.path}>
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </nav>

            {/* Mobile nav */}
            <nav className="flex md:hidden items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    asChild
                    className={cn(isActive && "shadow-glow")}
                  >
                    <Link to={item.path}>
                      <Icon className="w-4 h-4" />
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ScholarGen - Your AI-Powered Study Companion</p>
          <p className="mt-1">Built with ❤️ for learners everywhere</p>
        </div>
      </footer>
    </div>
  );
}
