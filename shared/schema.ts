import { z } from "zod";

export interface K8sNode {
  name: string;
  status: "Ready" | "NotReady";
  roles: string;
  age: string;
  version: string;
  internalIp: string;
  osImage: string;
  kernelVersion: string;
  containerRuntime: string;
}

export interface K8sPod {
  name: string;
  namespace: string;
  ready: string;
  status: string;
  restarts: number;
  age: string;
  ip?: string;
  node?: string;
}

export interface K8sDeployment {
  name: string;
  namespace: string;
  ready: string;
  upToDate: number;
  available: number;
  age: string;
}

export interface K8sService {
  name: string;
  namespace: string;
  type: string;
  clusterIp: string;
  externalIp: string;
  ports: string;
  age: string;
}

export interface K8sNamespace {
  name: string;
  status: string;
  age: string;
}

export interface CommandHistoryEntry {
  id: string;
  command: string;
  output: string;
  timestamp: number;
  isError: boolean;
}
