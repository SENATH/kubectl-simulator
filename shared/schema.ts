import { z } from "zod";

export interface K8sNode {
  name: string;
  status: "Ready" | "NotReady";
  roles: string;
  version: string;
  internalIp: string;
  osImage: string;
  kernelVersion: string;
  containerRuntime: string;
  creationTimestamp: number;
}

export interface K8sPod {
  name: string;
  namespace: string;
  ready: string;
  status: string;
  restarts: number;
  ip?: string;
  node?: string;
  creationTimestamp: number;
}

export interface K8sDeployment {
  name: string;
  namespace: string;
  ready: string;
  upToDate: number;
  available: number;
  creationTimestamp: number;
}

export interface K8sService {
  name: string;
  namespace: string;
  type: string;
  clusterIp: string;
  externalIp: string;
  ports: string;
  creationTimestamp: number;
}

export interface K8sNamespace {
  name: string;
  status: string;
  creationTimestamp: number;
}

export interface K8sCrd {
  name: string;
  group: string;
  version: string;
  kind: string;
  plural: string;
  singular: string;
  scope: "Namespaced" | "Cluster";
  installedBy?: string;
  creationTimestamp: number;
}

export interface K8sCustomResource {
  kind: string;
  apiVersion: string;
  metadata: {
    name: string;
    namespace?: string;
    creationTimestamp: number;
  };
  spec?: Record<string, any>;
  status?: Record<string, any>;
}

export interface CommandHistoryEntry {
  id: string;
  command: string;
  output: string;
  timestamp: number;
  isError: boolean;
}

export type SimulatorMode = "basic" | "openchoreo";

export interface HelmRelease {
  name: string;
  namespace: string;
  revision: string;
  updated: string;
  status: string;
  chart: string;
  appVersion: string;
}
