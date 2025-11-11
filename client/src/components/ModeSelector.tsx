import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, Box, AlertTriangle } from "lucide-react";
import type { SimulatorMode } from "@shared/schema";

interface ModeSelectorProps {
  onSelectMode: (mode: SimulatorMode) => void;
}

export function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Kubectl Web Terminal Simulator</h1>
          <p className="text-muted-foreground">Choose your simulation mode</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover-elevate cursor-pointer" onClick={() => onSelectMode("basic")} data-testid="card-mode-basic">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Server className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Basic Kubernetes Simulator</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Practice kubectl commands with a simulated 3-node Kubernetes cluster. 
                  Includes full read/write capabilities for pods, deployments, services, and namespaces.
                </p>
              </div>
              <Button className="w-full" data-testid="button-select-basic">
                Select Basic Mode
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover-elevate cursor-pointer" onClick={() => onSelectMode("openchoreo")} data-testid="card-mode-openchoreo">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Box className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold">OpenChoreo IDP Simulator</h2>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30" data-testid="badge-wip">
                    WIP
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Advanced simulation with Helm support. Practice installing and managing OpenChoreo 
                  control plane, data plane, and observability components.
                </p>
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 text-xs">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span>Work in progress - some features may break</span>
                </div>
              </div>
              <Button className="w-full" data-testid="button-select-openchoreo">
                Select OpenChoreo Mode
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
