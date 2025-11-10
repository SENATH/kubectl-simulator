import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Terminal, Database, Info } from "lucide-react";

interface Command {
  name: string;
  category: string;
  description: string;
  examples: string[];
}

const commands: Command[] = [
  {
    name: "get",
    category: "Basic",
    description: "Display one or many resources",
    examples: [
      "kubectl get nodes",
      "kubectl get pods",
      "kubectl get pods --all-namespaces",
      "kubectl get deployments -n production",
      "kubectl get services -o yaml"
    ]
  },
  {
    name: "describe",
    category: "Basic",
    description: "Show details of a specific resource",
    examples: [
      "kubectl describe node node-1",
      "kubectl describe pod nginx-deployment-7d4c8f6d9b-hx2lk"
    ]
  },
  {
    name: "logs",
    category: "Basic",
    description: "Print container logs for a pod",
    examples: [
      "kubectl logs nginx-deployment-7d4c8f6d9b-hx2lk",
      "kubectl logs redis-master-0"
    ]
  },
  {
    name: "version",
    category: "Cluster",
    description: "Display client and server version",
    examples: ["kubectl version"]
  },
  {
    name: "cluster-info",
    category: "Cluster",
    description: "Display cluster information",
    examples: ["kubectl cluster-info"]
  },
  {
    name: "config",
    category: "Cluster",
    description: "Modify kubeconfig files",
    examples: ["kubectl config view"]
  }
];

export function CommandReference() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommands = commands.filter(
    cmd =>
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(commands.map(c => c.category)));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Command Reference</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-commands"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {categories.map(category => {
          const categoryCommands = filteredCommands.filter(c => c.category === category);
          
          if (categoryCommands.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">{category} Commands</h3>
              
              <div className="space-y-3">
                {categoryCommands.map(cmd => (
                  <Card key={cmd.name} className="p-4 hover-elevate" data-testid={`card-command-${cmd.name}`}>
                    <div className="flex items-start gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="font-mono font-semibold text-foreground">kubectl {cmd.name}</code>
                          <Badge variant="secondary" className="text-xs">
                            {cmd.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{cmd.description}</p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Examples:</div>
                      {cmd.examples.map((example, idx) => (
                        <div
                          key={idx}
                          className="font-mono text-xs bg-muted/50 px-3 py-1.5 rounded-md text-foreground"
                          data-testid={`example-${cmd.name}-${idx}`}
                        >
                          {example}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {filteredCommands.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No commands found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
