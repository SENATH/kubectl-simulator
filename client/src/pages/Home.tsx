import { Terminal } from "@/components/Terminal";
import { CommandReference } from "@/components/CommandReference";
import { ClusterOverview } from "@/components/ClusterOverview";
import { ModeSelector } from "@/components/ModeSelector";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { SimulatorProvider } from "@/lib/simulator-context";
import type { SimulatorMode } from "@shared/schema";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [selectedMode, setSelectedMode] = useState<SimulatorMode | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial = stored || "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!selectedMode) {
    return <ModeSelector onSelectMode={setSelectedMode} />;
  }

  return (
    <SimulatorProvider mode={selectedMode}>
      <div className="flex flex-col h-screen bg-background">
        <header className="border-b border-border px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.9 2.1l9.899 1.415 1.414 9.9-9.192 9.192a1 1 0 01-1.414 0l-9.9-9.9a1 1 0 010-1.414L10.9 2.1zm2.828 8.486a2 2 0 102.828-2.829 2 2 0 00-2.828 2.829z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">Kubectl Simulator</h1>
              <p className="text-xs text-muted-foreground">Interactive Kubernetes Terminal</p>
            </div>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-toggle-theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-80 border-r border-border flex-shrink-0 overflow-hidden hidden lg:flex flex-col">
            <ClusterOverview />
          </aside>

          <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            <div className="flex-1 overflow-hidden flex flex-col border-r border-border">
              <Terminal />
            </div>
            
            <aside className="w-full lg:w-96 flex-shrink-0 overflow-hidden hidden md:flex flex-col">
              <CommandReference />
            </aside>
          </main>
        </div>
      </div>
    </SimulatorProvider>
  );
}
