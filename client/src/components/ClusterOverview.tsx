import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Box, Database, Network, CheckCircle2 } from "lucide-react";

export function ClusterOverview() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Cluster Overview</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Cluster Status</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kubernetes Version</span>
              <span className="font-mono">v1.28.3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Control Plane</span>
              <Badge variant="secondary" className="text-xs">
                Running
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">API Server</span>
              <span className="font-mono text-xs">192.168.1.10:6443</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Nodes</h3>
            <Badge variant="secondary" className="ml-auto text-xs">3 Ready</Badge>
          </div>
          <div className="space-y-3">
            {[
              { name: "node-1", role: "control-plane", ip: "192.168.1.10" },
              { name: "node-2", role: "worker", ip: "192.168.1.11" },
              { name: "node-3", role: "worker", ip: "192.168.1.12" }
            ].map(node => (
              <div
                key={node.name}
                className="flex items-center gap-3 p-2 rounded-md bg-muted/30"
                data-testid={`node-${node.name}`}
              >
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm font-medium">{node.name}</div>
                  <div className="text-xs text-muted-foreground">{node.ip}</div>
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {node.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Box className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Workloads</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-md bg-muted/30">
              <div className="text-2xl font-bold font-mono">14</div>
              <div className="text-xs text-muted-foreground mt-1">Pods</div>
            </div>
            <div className="text-center p-3 rounded-md bg-muted/30">
              <div className="text-2xl font-bold font-mono">5</div>
              <div className="text-xs text-muted-foreground mt-1">Deployments</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Network className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Services</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Services</span>
              <span className="font-mono">6</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">LoadBalancer</span>
              <span className="font-mono">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">NodePort</span>
              <span className="font-mono">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ClusterIP</span>
              <span className="font-mono">4</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Namespaces</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {["default", "kube-system", "production", "staging", "kube-public", "kube-node-lease"].map(ns => (
              <Badge key={ns} variant="outline" className="font-mono text-xs" data-testid={`namespace-${ns}`}>
                {ns}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
