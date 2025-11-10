import { useState, useRef, useEffect } from "react";
import { KubectlSimulator } from "@/lib/kubectl-simulator";
import type { CommandHistoryEntry } from "@shared/schema";
import { Terminal as TerminalIcon } from "lucide-react";

interface TerminalProps {
  className?: string;
}

export function Terminal({ className = "" }: TerminalProps) {
  const [history, setHistory] = useState<CommandHistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [simulator] = useState(() => new KubectlSimulator());
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const commandHistory = useRef<string[]>([]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (command: string) => {
    const { output, isError } = simulator.executeCommand(command);
    
    const entry: CommandHistoryEntry = {
      id: `${Date.now()}-${Math.random()}`,
      command,
      output,
      timestamp: Date.now(),
      isError
    };

    setHistory(prev => [...prev, entry]);
    
    if (command.trim()) {
      commandHistory.current.push(command);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentInput.trim()) {
      executeCommand(currentInput);
      setCurrentInput("");
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.current.length === 0) return;
      
      const newIndex = historyIndex === -1 
        ? commandHistory.current.length - 1 
        : Math.max(0, historyIndex - 1);
      
      setHistoryIndex(newIndex);
      setCurrentInput(commandHistory.current[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      
      const newIndex = historyIndex + 1;
      
      if (newIndex >= commandHistory.current.length) {
        setHistoryIndex(-1);
        setCurrentInput("");
      } else {
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory.current[newIndex]);
      }
    }
  };

  const handleClear = () => {
    setHistory([]);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-card border-b border-card-border">
        <TerminalIcon className="w-4 h-4 text-primary" />
        <span className="text-sm font-mono font-medium">kubectl simulator</span>
        <div className="ml-auto">
          <button
            onClick={handleClear}
            className="text-xs font-mono text-muted-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md"
            data-testid="button-clear-terminal"
          >
            clear
          </button>
        </div>
      </div>

      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-background"
        onClick={() => inputRef.current?.focus()}
        data-testid="terminal-output"
      >
        {history.length === 0 && (
          <div className="text-muted-foreground mb-4">
            <p>Welcome to kubectl simulator!</p>
            <p className="mt-2">This simulates a 3-node Kubernetes cluster.</p>
            <p className="mt-1">Try commands like:</p>
            <ul className="mt-2 ml-4 space-y-1">
              <li>• kubectl get nodes</li>
              <li>• kubectl get pods --all-namespaces</li>
              <li>• kubectl describe node node-1</li>
              <li>• kubectl version</li>
              <li>• kubectl help</li>
            </ul>
          </div>
        )}

        {history.map((entry) => (
          <div key={entry.id} className="mb-4">
            <div className="flex items-start gap-2">
              <span className="text-primary">$</span>
              <span className="text-foreground flex-1 break-all">{entry.command}</span>
            </div>
            {entry.output && (
              <pre
                className={`mt-1 ml-4 whitespace-pre-wrap break-words ${
                  entry.isError ? "text-destructive" : "text-muted-foreground"
                }`}
                data-testid={`output-${entry.id}`}
              >
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-start gap-2">
          <span className="text-primary">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-foreground font-mono caret-primary"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            data-testid="input-command"
          />
        </form>
      </div>
    </div>
  );
}
