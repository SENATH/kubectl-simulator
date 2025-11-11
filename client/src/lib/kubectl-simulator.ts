import type { K8sNode, K8sPod, K8sDeployment, K8sService, K8sNamespace, K8sCrd, K8sCustomResource, HelmRelease, SimulatorMode } from "@shared/schema";

export class KubectlSimulator {
  private mode: SimulatorMode;
  private nodes: K8sNode[];
  private pods: K8sPod[];
  private deployments: K8sDeployment[];
  private services: K8sService[];
  private namespaces: K8sNamespace[];
  private crds: K8sCrd[];
  private customResources: K8sCustomResource[];
  private helmReleases: HelmRelease[];
  private stateChangeCallbacks: (() => void)[] = [];

  constructor(mode: SimulatorMode = "basic") {
    this.mode = mode;
    this.nodes = this.initializeNodes();
    this.namespaces = this.initializeNamespaces();
    this.pods = this.initializePods();
    this.deployments = this.initializeDeployments();
    this.services = this.initializeServices();
    this.crds = [];
    this.customResources = [];
    this.helmReleases = [];
  }

  onStateChange(callback: () => void) {
    this.stateChangeCallbacks.push(callback);
  }

  private notifyStateChange() {
    this.stateChangeCallbacks.forEach(cb => cb());
  }

  getState() {
    return {
      nodes: this.nodes,
      pods: this.pods,
      deployments: this.deployments,
      services: this.services,
      namespaces: this.namespaces,
      crds: this.crds,
      customResources: this.customResources
    };
  }

  private formatAge(creationTimestamp: number): string {
    const seconds = Math.floor((Date.now() - creationTimestamp) / 1000);
    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const YEAR = 365 * DAY;
    
    if (seconds < MINUTE) {
      return `${seconds}s`;
    } else if (seconds < HOUR) {
      const m = Math.floor(seconds / MINUTE);
      const s = seconds % MINUTE;
      return s ? `${m}m${s}s` : `${m}m`;
    } else if (seconds < DAY) {
      const h = Math.floor(seconds / HOUR);
      const m = Math.floor((seconds % HOUR) / MINUTE);
      return m ? `${h}h${m}m` : `${h}h`;
    } else if (seconds < YEAR) {
      const d = Math.floor(seconds / DAY);
      const h = Math.floor((seconds % DAY) / HOUR);
      return h ? `${d}d${h}h` : `${d}d`;
    } else {
      const y = Math.floor(seconds / YEAR);
      const d = Math.floor((seconds % YEAR) / DAY);
      return d ? `${y}y${d}d` : `${y}y`;
    }
  }

  private initializeNodes(): K8sNode[] {
    const fortyFiveDaysAgo = Date.now() - (45 * 24 * 60 * 60 * 1000);
    return [
      {
        name: "node-1",
        status: "Ready",
        roles: "control-plane",
        version: "v1.28.3",
        internalIp: "192.168.1.10",
        osImage: "Ubuntu 22.04.3 LTS",
        kernelVersion: "5.15.0-88-generic",
        containerRuntime: "containerd://1.7.2",
        creationTimestamp: fortyFiveDaysAgo
      },
      {
        name: "node-2",
        status: "Ready",
        roles: "worker",
        version: "v1.28.3",
        internalIp: "192.168.1.11",
        osImage: "Ubuntu 22.04.3 LTS",
        kernelVersion: "5.15.0-88-generic",
        containerRuntime: "containerd://1.7.2",
        creationTimestamp: fortyFiveDaysAgo
      },
      {
        name: "node-3",
        status: "Ready",
        roles: "worker",
        version: "v1.28.3",
        internalIp: "192.168.1.12",
        osImage: "Ubuntu 22.04.3 LTS",
        kernelVersion: "5.15.0-88-generic",
        containerRuntime: "containerd://1.7.2",
        creationTimestamp: fortyFiveDaysAgo
      }
    ];
  }

  private initializeNamespaces(): K8sNamespace[] {
    const fortyFiveDaysAgo = Date.now() - (45 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return [
      { name: "default", status: "Active", creationTimestamp: fortyFiveDaysAgo },
      { name: "kube-system", status: "Active", creationTimestamp: fortyFiveDaysAgo },
      { name: "kube-public", status: "Active", creationTimestamp: fortyFiveDaysAgo },
      { name: "kube-node-lease", status: "Active", creationTimestamp: fortyFiveDaysAgo },
      { name: "production", status: "Active", creationTimestamp: thirtyDaysAgo },
      { name: "staging", status: "Active", creationTimestamp: thirtyDaysAgo }
    ];
  }

  private initializePods(): K8sPod[] {
    const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
    const twelveDaysAgo = Date.now() - (12 * 24 * 60 * 60 * 1000);
    const eighteenDaysAgo = Date.now() - (18 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const fortyFiveDaysAgo = Date.now() - (45 * 24 * 60 * 60 * 1000);
    return [
      { name: "nginx-deployment-7d4c8f6d9b-hx2lk", namespace: "default", ready: "1/1", status: "Running", restarts: 0, ip: "10.244.1.5", node: "node-2", creationTimestamp: fiveDaysAgo },
      { name: "nginx-deployment-7d4c8f6d9b-mt9pq", namespace: "default", ready: "1/1", status: "Running", restarts: 0, ip: "10.244.2.8", node: "node-3", creationTimestamp: fiveDaysAgo },
      { name: "redis-master-0", namespace: "default", ready: "1/1", status: "Running", restarts: 1, ip: "10.244.1.12", node: "node-2", creationTimestamp: twelveDaysAgo },
      { name: "postgres-db-85f9c7b8d-xk4jl", namespace: "production", ready: "1/1", status: "Running", restarts: 0, ip: "10.244.2.15", node: "node-3", creationTimestamp: eighteenDaysAgo },
      { name: "api-server-65b8d4f7c9-p2wvn", namespace: "production", ready: "2/2", status: "Running", restarts: 0, ip: "10.244.1.20", node: "node-2", creationTimestamp: sevenDaysAgo },
      { name: "coredns-5d78c9869d-7hqxm", namespace: "kube-system", ready: "1/1", status: "Running", restarts: 3, ip: "10.244.0.2", node: "node-1", creationTimestamp: fortyFiveDaysAgo },
      { name: "coredns-5d78c9869d-k9plz", namespace: "kube-system", ready: "1/1", status: "Running", restarts: 2, ip: "10.244.0.3", node: "node-1", creationTimestamp: fortyFiveDaysAgo },
      { name: "etcd-node-1", namespace: "kube-system", ready: "1/1", status: "Running", restarts: 1, ip: "192.168.1.10", node: "node-1", creationTimestamp: fortyFiveDaysAgo },
      { name: "kube-apiserver-node-1", namespace: "kube-system", ready: "1/1", status: "Running", restarts: 2, ip: "192.168.1.10", node: "node-1", creationTimestamp: fortyFiveDaysAgo },
      { name: "kube-controller-manager-node-1", namespace: "kube-system", ready: "1/1", status: "Running", restarts: 1, ip: "192.168.1.10", node: "node-1", creationTimestamp: fortyFiveDaysAgo },
      { name: "kube-proxy-6lxrt", namespace: "kube-system", ready: "1/1", status: "Running", restarts: 0, ip: "192.168.1.10", node: "node-1", creationTimestamp: fortyFiveDaysAgo },
      { name: "kube-proxy-m8w4p", namespace: "kube-system", ready: "1/1", status: "Running", restarts: 0, ip: "192.168.1.11", node: "node-2", creationTimestamp: fortyFiveDaysAgo },
      { name: "kube-proxy-tn2vx", namespace: "kube-system", ready: "1/1", status: "Running", restarts: 0, ip: "192.168.1.12", node: "node-3", creationTimestamp: fortyFiveDaysAgo },
      { name: "kube-scheduler-node-1", namespace: "kube-system", ready: "1/1", status: "Running", restarts: 1, ip: "192.168.1.10", node: "node-1", creationTimestamp: fortyFiveDaysAgo }
    ];
  }

  private initializeDeployments(): K8sDeployment[] {
    const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
    const twelveDaysAgo = Date.now() - (12 * 24 * 60 * 60 * 1000);
    const eighteenDaysAgo = Date.now() - (18 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const fortyFiveDaysAgo = Date.now() - (45 * 24 * 60 * 60 * 1000);
    return [
      { name: "nginx-deployment", namespace: "default", ready: "2/2", upToDate: 2, available: 2, creationTimestamp: fiveDaysAgo },
      { name: "redis-master", namespace: "default", ready: "1/1", upToDate: 1, available: 1, creationTimestamp: twelveDaysAgo },
      { name: "postgres-db", namespace: "production", ready: "1/1", upToDate: 1, available: 1, creationTimestamp: eighteenDaysAgo },
      { name: "api-server", namespace: "production", ready: "1/1", upToDate: 1, available: 1, creationTimestamp: sevenDaysAgo },
      { name: "coredns", namespace: "kube-system", ready: "2/2", upToDate: 2, available: 2, creationTimestamp: fortyFiveDaysAgo }
    ];
  }

  private initializeServices(): K8sService[] {
    const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
    const twelveDaysAgo = Date.now() - (12 * 24 * 60 * 60 * 1000);
    const eighteenDaysAgo = Date.now() - (18 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const fortyFiveDaysAgo = Date.now() - (45 * 24 * 60 * 60 * 1000);
    return [
      { name: "kubernetes", namespace: "default", type: "ClusterIP", clusterIp: "10.96.0.1", externalIp: "<none>", ports: "443/TCP", creationTimestamp: fortyFiveDaysAgo },
      { name: "nginx-service", namespace: "default", type: "LoadBalancer", clusterIp: "10.96.15.20", externalIp: "203.0.113.42", ports: "80:30080/TCP", creationTimestamp: fiveDaysAgo },
      { name: "redis-service", namespace: "default", type: "ClusterIP", clusterIp: "10.96.22.15", externalIp: "<none>", ports: "6379/TCP", creationTimestamp: twelveDaysAgo },
      { name: "postgres-service", namespace: "production", type: "ClusterIP", clusterIp: "10.96.35.8", externalIp: "<none>", ports: "5432/TCP", creationTimestamp: eighteenDaysAgo },
      { name: "api-service", namespace: "production", type: "NodePort", clusterIp: "10.96.40.12", externalIp: "<none>", ports: "8080:32000/TCP", creationTimestamp: sevenDaysAgo },
      { name: "kube-dns", namespace: "kube-system", type: "ClusterIP", clusterIp: "10.96.0.10", externalIp: "<none>", ports: "53/UDP,53/TCP,9153/TCP", creationTimestamp: fortyFiveDaysAgo }
    ];
  }

  executeCommand(input: string): { output: string; isError: boolean } {
    const trimmed = input.trim();
    
    if (!trimmed) {
      return { output: "", isError: false };
    }

    const parts = trimmed.split(/\s+/);
    const firstCommand = parts[0];

    if (firstCommand === "clear") {
      return { output: "CLEAR_TERMINAL", isError: false };
    }

    if (firstCommand === "ls") {
      return {
        output: "kubectl-simulator  user-data  tmp  home",
        isError: false
      };
    }

    if (firstCommand === "pwd") {
      return {
        output: "/home/user",
        isError: false
      };
    }

    if (firstCommand === "cd") {
      return {
        output: "",
        isError: false
      };
    }

    if (firstCommand === "mv" || firstCommand === "cp") {
      return {
        output: `${firstCommand}: simulated filesystem - changes not persisted`,
        isError: false
      };
    }

    if (firstCommand === "helm" && this.mode === "openchoreo") {
      const helmArgs = parts.slice(1);
      return this.handleHelm(helmArgs);
    }

    if (firstCommand === "helm" && this.mode === "basic") {
      return {
        output: "bash: helm: command not found\nTip: Helm is available in OpenChoreo IDP mode",
        isError: true
      };
    }

    if (firstCommand === "curl") {
      if (this.mode === "basic") {
        return {
          output: "bash: curl: command not found\nTip: curl is available in OpenChoreo IDP mode for installing scripts",
          isError: true
        };
      }
      return this.handleCurl(trimmed);
    }

    if (!trimmed.startsWith("kubectl")) {
      return {
        output: `bash: ${trimmed.split(" ")[0]}: command not found`,
        isError: true
      };
    }

    const args = trimmed.slice(7).trim().split(/\s+/).filter(arg => arg.length > 0);
    const command = args[0];

    if (!command || command === "") {
      return this.handleHelp();
    }

    try {
      switch (command) {
        case "get":
          return this.handleGet(args.slice(1));
        case "describe":
          return this.handleDescribe(args.slice(1));
        case "create":
          return this.handleCreate(args.slice(1));
        case "delete":
          return this.handleDelete(args.slice(1));
        case "apply":
          return this.handleApply(args.slice(1));
        case "scale":
          return this.handleScale(args.slice(1));
        case "version":
          return this.handleVersion();
        case "cluster-info":
          return this.handleClusterInfo();
        case "config":
          return this.handleConfig(args.slice(1));
        case "logs":
          return this.handleLogs(args.slice(1));
        case "exec":
          return { output: "Error: Interactive commands are not supported in this simulator", isError: true };
        case "edit":
        case "patch":
          return { output: `Note: ${command} command simulation is limited. Use create/delete/apply for full control.`, isError: false };
        case "help":
        case "--help":
        case "-h":
          return this.handleHelp();
        default:
          return { output: `Error: unknown command "${command}" for "kubectl"`, isError: true };
      }
    } catch (error) {
      return { output: `Error: ${error instanceof Error ? error.message : String(error)}`, isError: true };
    }
  }

  private handleGet(args: string[]): { output: string; isError: boolean } {
    if (args.length === 0) {
      return { output: "Error: You must specify the type of resource to get", isError: true };
    }

    const resource = args[0];
    const flags = this.parseFlags(args.slice(1));
    const namespace = typeof flags.namespace === 'string' ? flags.namespace : 
                     typeof flags.n === 'string' ? flags.n : "default";
    const outputFormat = typeof flags.output === 'string' ? flags.output :
                        typeof flags.o === 'string' ? flags.o : "table";
    const allNamespaces = flags["all-namespaces"] === true || flags.A === true;

    if (resource === "crd" || resource === "crds" || resource === "customresourcedefinition" || resource === "customresourcedefinitions") {
      return this.formatCrds(outputFormat);
    }

    switch (resource) {
      case "nodes":
      case "node":
      case "no":
        return this.formatNodes(outputFormat);
      case "pods":
      case "pod":
      case "po":
        return this.formatPods(allNamespaces ? undefined : namespace, outputFormat);
      case "deployments":
      case "deployment":
      case "deploy":
        return this.formatDeployments(allNamespaces ? undefined : namespace, outputFormat);
      case "services":
      case "service":
      case "svc":
        return this.formatServices(allNamespaces ? undefined : namespace, outputFormat);
      case "namespaces":
      case "namespace":
      case "ns":
        return this.formatNamespaces(outputFormat);
      case "all":
        return this.formatAll(namespace);
      default:
        return { output: `Error: the server doesn't have a resource type "${resource}"`, isError: true };
    }
  }

  private handleCreate(args: string[]): { output: string; isError: boolean } {
    if (args.length === 0) {
      return { output: "Error: must specify type of resource to create", isError: true };
    }

    const resource = args[0];
    const flags = this.parseFlags(args.slice(1));
    const namespace = typeof flags.namespace === 'string' ? flags.namespace :
                     typeof flags.n === 'string' ? flags.n : "default";

    switch (resource) {
      case "namespace":
      case "ns":
        return this.createNamespace(args[1]);
      case "deployment":
      case "deploy":
        return this.createDeployment(args[1], namespace, flags);
      case "service":
      case "svc":
        return this.createService(args[1], namespace, flags);
      case "pod":
        return this.createPod(args[1], namespace, flags);
      default:
        return { output: `Error: the server doesn't support resource type "${resource}"`, isError: true };
    }
  }

  private handleDelete(args: string[]): { output: string; isError: boolean } {
    if (args.length < 2) {
      return { output: "Error: You must specify the type of resource to delete and its name", isError: true };
    }

    const resource = args[0];
    const name = args[1];
    const flags = this.parseFlags(args.slice(2));
    const namespace = typeof flags.namespace === 'string' ? flags.namespace :
                     typeof flags.n === 'string' ? flags.n : "default";

    switch (resource) {
      case "namespace":
      case "ns":
        return this.deleteNamespace(name);
      case "pod":
      case "pods":
      case "po":
        return this.deletePod(name, namespace);
      case "deployment":
      case "deployments":
      case "deploy":
        return this.deleteDeployment(name, namespace);
      case "service":
      case "services":
      case "svc":
        return this.deleteService(name, namespace);
      default:
        return { output: `Error: the server doesn't support resource type "${resource}"`, isError: true };
    }
  }

  private handleApply(args: string[]): { output: string; isError: boolean } {
    const flags = this.parseFlags(args);
    
    if (flags.f || flags.filename) {
      return {
        output: "Note: File-based apply is simulated. Use create commands for specific resources.",
        isError: false
      };
    }

    return { output: "Error: must specify -f, --filename for apply", isError: true };
  }

  private handleScale(args: string[]): { output: string; isError: boolean } {
    if (args.length === 0) {
      return { output: "Error: You must specify resource type/name and --replicas", isError: true };
    }

    let resourceType: string;
    let name: string;
    let remainingArgs: string[];

    if (args[0].includes('/')) {
      [resourceType, name] = args[0].split('/');
      remainingArgs = args.slice(1);
    } else if (args.length >= 2 && !args[1].startsWith('-')) {
      resourceType = args[0];
      name = args[1];
      remainingArgs = args.slice(2);
    } else {
      resourceType = 'deployment';
      name = args[0];
      remainingArgs = args.slice(1);
    }

    const flags = this.parseFlags(remainingArgs);
    const replicas = typeof flags.replicas === 'string' ? parseInt(flags.replicas) : undefined;
    const namespace = typeof flags.namespace === 'string' ? flags.namespace :
                     typeof flags.n === 'string' ? flags.n : "default";

    if (replicas === undefined || isNaN(replicas)) {
      return { output: "Error: --replicas is required and must be a number", isError: true };
    }

    if (resourceType === "deployment" || resourceType === "deploy") {
      const deployment = this.deployments.find(d => d.name === name && d.namespace === namespace);
      
      if (!deployment) {
        return { output: `Error from server (NotFound): deployments.apps "${name}" not found`, isError: true };
      }

      deployment.ready = `${replicas}/${replicas}`;
      deployment.upToDate = replicas;
      deployment.available = replicas;

      const podPrefix = name;
      const existingPods = this.pods.filter(p => p.name.startsWith(podPrefix) && p.namespace === namespace);
      
      if (replicas > existingPods.length) {
        for (let i = existingPods.length; i < replicas; i++) {
          const newPod: K8sPod = {
            name: `${podPrefix}-${this.generateHash()}-${this.generateHash(5)}`,
            namespace,
            ready: "1/1",
            status: "Running",
            restarts: 0,
            ip: this.generateIP(),
            node: this.getRandomWorkerNode(),
            creationTimestamp: Date.now()
          };
          this.pods.push(newPod);
        }
      } else if (replicas < existingPods.length) {
        const toRemove = existingPods.slice(replicas);
        this.pods = this.pods.filter(p => !toRemove.includes(p));
      }

      this.notifyStateChange();
      
      return {
        output: `deployment.apps/${name} scaled`,
        isError: false
      };
    }

    return { output: `Error: scaling for resource type "${resourceType}" is not supported`, isError: true };
  }

  private createNamespace(name: string): { output: string; isError: boolean } {
    if (!name) {
      return { output: "Error: name is required for namespace creation", isError: true };
    }

    if (this.namespaces.find(ns => ns.name === name)) {
      return { output: `Error from server (AlreadyExists): namespaces "${name}" already exists`, isError: true };
    }

    this.namespaces.push({
      name,
      status: "Active",
      creationTimestamp: Date.now()
    });

    this.notifyStateChange();
    return { output: `namespace/${name} created`, isError: false };
  }

  private createDeployment(name: string, namespace: string, flags: Record<string, string | boolean>): { output: string; isError: boolean } {
    if (!name) {
      return { output: "Error: name is required for deployment creation", isError: true };
    }

    const image = typeof flags.image === 'string' ? flags.image : undefined;
    const replicas = typeof flags.replicas === 'string' ? parseInt(flags.replicas) : 1;

    if (!image) {
      return { output: "Error: --image is required for deployment creation", isError: true };
    }

    if (this.deployments.find(d => d.name === name && d.namespace === namespace)) {
      return { output: `Error from server (AlreadyExists): deployments.apps "${name}" already exists`, isError: true };
    }

    if (!this.namespaces.find(ns => ns.name === namespace)) {
      return { output: `Error from server (NotFound): namespace "${namespace}" not found`, isError: true };
    }

    this.deployments.push({
      name,
      namespace,
      ready: `${replicas}/${replicas}`,
      upToDate: replicas,
      available: replicas,
      creationTimestamp: Date.now()
    });

    for (let i = 0; i < replicas; i++) {
      this.pods.push({
        name: `${name}-${this.generateHash()}-${this.generateHash(5)}`,
        namespace,
        ready: "1/1",
        status: "Running",
        restarts: 0,
        ip: this.generateIP(),
        node: this.getRandomWorkerNode(),
        creationTimestamp: Date.now()
      });
    }

    this.notifyStateChange();
    return { output: `deployment.apps/${name} created`, isError: false };
  }

  private createService(name: string, namespace: string, flags: Record<string, string | boolean>): { output: string; isError: boolean } {
    if (!name) {
      return { output: "Error: name is required for service creation", isError: true };
    }

    const port = typeof flags.port === 'string' ? flags.port : "80";
    const serviceType = typeof flags.type === 'string' ? flags.type : "ClusterIP";

    if (this.services.find(s => s.name === name && s.namespace === namespace)) {
      return { output: `Error from server (AlreadyExists): services "${name}" already exists`, isError: true };
    }

    if (!this.namespaces.find(ns => ns.name === namespace)) {
      return { output: `Error from server (NotFound): namespace "${namespace}" not found`, isError: true };
    }

    this.services.push({
      name,
      namespace,
      type: serviceType,
      clusterIp: this.generateClusterIP(),
      externalIp: serviceType === "LoadBalancer" ? this.generateExternalIP() : "<none>",
      ports: `${port}/TCP`,
      creationTimestamp: Date.now()
    });

    this.notifyStateChange();
    return { output: `service/${name} created`, isError: false };
  }

  private createPod(name: string, namespace: string, flags: Record<string, string | boolean>): { output: string; isError: boolean } {
    if (!name) {
      return { output: "Error: name is required for pod creation", isError: true };
    }

    const image = typeof flags.image === 'string' ? flags.image : undefined;

    if (!image) {
      return { output: "Error: --image is required for pod creation", isError: true };
    }

    if (this.pods.find(p => p.name === name && p.namespace === namespace)) {
      return { output: `Error from server (AlreadyExists): pods "${name}" already exists`, isError: true };
    }

    if (!this.namespaces.find(ns => ns.name === namespace)) {
      return { output: `Error from server (NotFound): namespace "${namespace}" not found`, isError: true };
    }

    this.pods.push({
      name,
      namespace,
      ready: "1/1",
      status: "Running",
      restarts: 0,
      ip: this.generateIP(),
      node: this.getRandomWorkerNode(),
      creationTimestamp: Date.now()
    });

    this.notifyStateChange();
    return { output: `pod/${name} created`, isError: false };
  }

  private deleteNamespace(name: string): { output: string; isError: boolean } {
    const index = this.namespaces.findIndex(ns => ns.name === name);
    
    if (index === -1) {
      return { output: `Error from server (NotFound): namespaces "${name}" not found`, isError: true };
    }

    if (["default", "kube-system", "kube-public", "kube-node-lease"].includes(name)) {
      return { output: `Error: cannot delete system namespace "${name}"`, isError: true };
    }

    this.namespaces.splice(index, 1);
    this.pods = this.pods.filter(p => p.namespace !== name);
    this.deployments = this.deployments.filter(d => d.namespace !== name);
    this.services = this.services.filter(s => s.namespace !== name);

    this.notifyStateChange();
    return { output: `namespace "${name}" deleted`, isError: false };
  }

  private deletePod(name: string, namespace: string): { output: string; isError: boolean } {
    const index = this.pods.findIndex(p => p.name === name && p.namespace === namespace);
    
    if (index === -1) {
      return { output: `Error from server (NotFound): pods "${name}" not found`, isError: true };
    }

    this.pods.splice(index, 1);
    this.notifyStateChange();
    return { output: `pod "${name}" deleted`, isError: false };
  }

  private deleteDeployment(name: string, namespace: string): { output: string; isError: boolean } {
    const index = this.deployments.findIndex(d => d.name === name && d.namespace === namespace);
    
    if (index === -1) {
      return { output: `Error from server (NotFound): deployments.apps "${name}" not found`, isError: true };
    }

    this.deployments.splice(index, 1);
    this.pods = this.pods.filter(p => !p.name.startsWith(name) || p.namespace !== namespace);

    this.notifyStateChange();
    return { output: `deployment.apps "${name}" deleted`, isError: false };
  }

  private deleteService(name: string, namespace: string): { output: string; isError: boolean } {
    const index = this.services.findIndex(s => s.name === name && s.namespace === namespace);
    
    if (index === -1) {
      return { output: `Error from server (NotFound): services "${name}" not found`, isError: true };
    }

    this.services.splice(index, 1);
    this.notifyStateChange();
    return { output: `service "${name}" deleted`, isError: false };
  }

  private generateHash(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateIP(): string {
    return `10.244.${Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 254) + 1}`;
  }

  private generateClusterIP(): string {
    return `10.96.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;
  }

  private generateExternalIP(): string {
    return `203.0.113.${Math.floor(Math.random() * 254) + 1}`;
  }

  private getRandomWorkerNode(): string {
    const workers = ["node-2", "node-3"];
    return workers[Math.floor(Math.random() * workers.length)];
  }

  private handleDescribe(args: string[]): { output: string; isError: boolean } {
    if (args.length === 0) {
      return { output: "Error: You must specify the type of resource to describe", isError: true };
    }

    const resource = args[0];
    const name = args[1];

    if (!name) {
      return { output: `Error: You must specify the name of the resource to describe`, isError: true };
    }

    switch (resource) {
      case "node":
      case "nodes":
      case "no":
        return this.describeNode(name);
      case "pod":
      case "pods":
      case "po":
        return this.describePod(name);
      default:
        return { output: `Describe for resource type "${resource}" is not fully implemented in this simulator`, isError: false };
    }
  }

  private handleVersion(): { output: string; isError: boolean } {
    return {
      output: `Client Version: v1.28.3
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
Server Version: v1.28.3`,
      isError: false
    };
  }

  private handleClusterInfo(): { output: string; isError: boolean } {
    return {
      output: `Kubernetes control plane is running at https://192.168.1.10:6443
CoreDNS is running at https://192.168.1.10:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.`,
      isError: false
    };
  }

  private handleConfig(args: string[]): { output: string; isError: boolean } {
    if (args.length === 0 || args[0] === "view") {
      return {
        output: `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: DATA+OMITTED
    server: https://192.168.1.10:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: DATA+OMITTED
    client-key-data: DATA+OMITTED`,
        isError: false
      };
    }

    return { output: `Config subcommand "${args[0]}" is not fully implemented in this simulator`, isError: false };
  }

  private handleLogs(args: string[]): { output: string; isError: boolean } {
    if (args.length === 0) {
      return { output: "Error: You must specify a pod name", isError: true };
    }

    const podName = args[0];
    const pod = this.pods.find(p => p.name === podName);

    if (!pod) {
      return { output: `Error from server (NotFound): pods "${podName}" not found`, isError: true };
    }

    return {
      output: `2024-11-10T10:23:15.234Z INFO Starting application...
2024-11-10T10:23:16.112Z INFO Connecting to database
2024-11-10T10:23:17.445Z INFO Database connection established
2024-11-10T10:23:17.567Z INFO Server listening on port 8080
2024-11-10T10:24:32.891Z INFO Health check passed
2024-11-10T10:25:48.123Z INFO Processing request GET /api/status`,
      isError: false
    };
  }

  private formatCrds(format: string): { output: string; isError: boolean } {
    if (format === "json") {
      return { output: JSON.stringify({ items: this.crds }, null, 2), isError: false };
    }

    if (format === "yaml") {
      return { output: this.toYaml({ items: this.crds }), isError: false };
    }

    if (this.crds.length === 0) {
      return {
        output: "No resources found",
        isError: false
      };
    }

    // Both "wide" and default "table" format show the same columns for CRDs
    const header = "NAME                                      AGE";
    const rows = this.crds.map(crd => {
      return `${crd.name.padEnd(41)} ${this.formatAge(crd.creationTimestamp)}`;
    });

    return {
      output: [header, ...rows].join("\n"),
      isError: false
    };
  }

  private handleHelp(): { output: string; isError: boolean } {
    return {
      output: `kubectl controls the Kubernetes cluster manager.

Find more information at: https://kubernetes.io/docs/reference/kubectl/

Basic Commands (Beginner):
  create         Create a resource from a file or stdin
  get            Display one or many resources
  delete         Delete resources
  
Basic Commands (Intermediate):
  apply          Apply a configuration to a resource
  scale          Set a new size for a deployment
  
Troubleshooting and Debugging Commands:
  describe       Show details of a specific resource or group of resources
  logs           Print the logs for a container in a pod
  
Cluster Management Commands:
  cluster-info   Display cluster information
  version        Print the client and server version information
  config         Modify kubeconfig files

Usage:
  kubectl [flags] [options]

Use "kubectl <command> --help" for more information about a given command.`,
      isError: false
    };
  }

  private formatNodes(format: string): { output: string; isError: boolean } {
    if (format === "json") {
      return { output: JSON.stringify({ items: this.nodes }, null, 2), isError: false };
    }

    if (format === "yaml") {
      return { output: this.toYaml({ items: this.nodes }), isError: false };
    }

    if (format === "wide") {
      const header = "NAME     STATUS   ROLES           AGE   VERSION    INTERNAL-IP     EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME";
      const rows = this.nodes.map(n => 
        `${n.name.padEnd(8)} ${n.status.padEnd(8)} ${n.roles.padEnd(15)} ${this.formatAge(n.creationTimestamp).padEnd(5)} ${n.version.padEnd(10)} ${n.internalIp.padEnd(15)} <none>        ${n.osImage.padEnd(20)} ${n.kernelVersion.padEnd(19)} ${n.containerRuntime}`
      );
      return { output: [header, ...rows].join("\n"), isError: false };
    }

    const header = "NAME     STATUS   ROLES           AGE   VERSION";
    const rows = this.nodes.map(n => 
      `${n.name.padEnd(8)} ${n.status.padEnd(8)} ${n.roles.padEnd(15)} ${this.formatAge(n.creationTimestamp).padEnd(5)} ${n.version}`
    );
    return { output: [header, ...rows].join("\n"), isError: false };
  }

  private formatPods(namespace: string | undefined, format: string): { output: string; isError: boolean } {
    const filtered = namespace ? this.pods.filter(p => p.namespace === namespace) : this.pods;

    if (format === "json") {
      return { output: JSON.stringify({ items: filtered }, null, 2), isError: false };
    }

    if (format === "yaml") {
      return { output: this.toYaml({ items: filtered }), isError: false };
    }

    const hasNamespace = namespace === undefined;
    
    if (format === "wide") {
      const header = hasNamespace 
        ? "NAMESPACE     NAME                                      READY   STATUS    RESTARTS   AGE   IP             NODE       NOMINATED NODE   READINESS GATES"
        : "NAME                                      READY   STATUS    RESTARTS   AGE   IP             NODE       NOMINATED NODE   READINESS GATES";
      
      const rows = filtered.map(p => {
        const base = `${p.name.padEnd(41)} ${p.ready.padEnd(7)} ${p.status.padEnd(9)} ${String(p.restarts).padEnd(10)} ${this.formatAge(p.creationTimestamp).padEnd(5)} ${(p.ip || '<none>').padEnd(14)} ${(p.node || '<none>').padEnd(10)} <none>           <none>`;
        return hasNamespace ? `${p.namespace.padEnd(13)} ${base}` : base;
      });

      return { output: [header, ...rows].join("\n"), isError: false };
    }

    const header = hasNamespace 
      ? "NAMESPACE     NAME                                      READY   STATUS    RESTARTS   AGE"
      : "NAME                                      READY   STATUS    RESTARTS   AGE";
    
    const rows = filtered.map(p => {
      const base = `${p.name.padEnd(41)} ${p.ready.padEnd(7)} ${p.status.padEnd(9)} ${String(p.restarts).padEnd(10)} ${this.formatAge(p.creationTimestamp)}`;
      return hasNamespace ? `${p.namespace.padEnd(13)} ${base}` : base;
    });

    return { output: [header, ...rows].join("\n"), isError: false };
  }

  private formatDeployments(namespace: string | undefined, format: string): { output: string; isError: boolean } {
    const filtered = namespace ? this.deployments.filter(d => d.namespace === namespace) : this.deployments;

    if (format === "json") {
      return { output: JSON.stringify({ items: filtered }, null, 2), isError: false };
    }

    if (format === "yaml") {
      return { output: this.toYaml({ items: filtered }), isError: false };
    }

    const hasNamespace = namespace === undefined;
    const header = hasNamespace
      ? "NAMESPACE     NAME                READY   UP-TO-DATE   AVAILABLE   AGE"
      : "NAME                READY   UP-TO-DATE   AVAILABLE   AGE";

    const rows = filtered.map(d => {
      const base = `${d.name.padEnd(19)} ${d.ready.padEnd(7)} ${String(d.upToDate).padEnd(12)} ${String(d.available).padEnd(11)} ${this.formatAge(d.creationTimestamp)}`;
      return hasNamespace ? `${d.namespace.padEnd(13)} ${base}` : base;
    });

    return { output: [header, ...rows].join("\n"), isError: false };
  }

  private formatServices(namespace: string | undefined, format: string): { output: string; isError: boolean } {
    const filtered = namespace ? this.services.filter(s => s.namespace === namespace) : this.services;

    if (format === "json") {
      return { output: JSON.stringify({ items: filtered }, null, 2), isError: false };
    }

    if (format === "yaml") {
      return { output: this.toYaml({ items: filtered }), isError: false };
    }

    const hasNamespace = namespace === undefined;
    const header = hasNamespace
      ? "NAMESPACE     NAME              TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                      AGE"
      : "NAME              TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                      AGE";

    const rows = filtered.map(s => {
      const base = `${s.name.padEnd(17)} ${s.type.padEnd(14)} ${s.clusterIp.padEnd(15)} ${s.externalIp.padEnd(15)} ${s.ports.padEnd(28)} ${this.formatAge(s.creationTimestamp)}`;
      return hasNamespace ? `${s.namespace.padEnd(13)} ${base}` : base;
    });

    return { output: [header, ...rows].join("\n"), isError: false };
  }

  private formatNamespaces(format: string): { output: string; isError: boolean } {
    if (format === "json") {
      return { output: JSON.stringify({ items: this.namespaces }, null, 2), isError: false };
    }

    if (format === "yaml") {
      return { output: this.toYaml({ items: this.namespaces }), isError: false };
    }

    const header = "NAME               STATUS   AGE";
    const rows = this.namespaces.map(n => 
      `${n.name.padEnd(18)} ${n.status.padEnd(8)} ${this.formatAge(n.creationTimestamp)}`
    );
    return { output: [header, ...rows].join("\n"), isError: false };
  }

  private formatAll(namespace: string): { output: string; isError: boolean } {
    const pods = this.formatPods(namespace, "table");
    const deploys = this.formatDeployments(namespace, "table");
    const svcs = this.formatServices(namespace, "table");

    return {
      output: `NAME                                          READY   STATUS    RESTARTS   AGE
${this.pods.filter(p => p.namespace === namespace).map(p => 
  `pod/${p.name.padEnd(41)} ${p.ready.padEnd(7)} ${p.status.padEnd(9)} ${String(p.restarts).padEnd(10)} ${this.formatAge(p.creationTimestamp)}`
).join("\n")}

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
${this.deployments.filter(d => d.namespace === namespace).map(d => 
  `deployment.apps/${d.name.padEnd(19)} ${d.ready.padEnd(7)} ${String(d.upToDate).padEnd(12)} ${String(d.available).padEnd(11)} ${this.formatAge(d.creationTimestamp)}`
).join("\n")}

NAME              TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                      AGE
${this.services.filter(s => s.namespace === namespace).map(s => 
  `service/${s.name.padEnd(17)} ${s.type.padEnd(14)} ${s.clusterIp.padEnd(15)} ${s.externalIp.padEnd(15)} ${s.ports.padEnd(28)} ${this.formatAge(s.creationTimestamp)}`
).join("\n")}`,
      isError: false
    };
  }

  private describeNode(name: string): { output: string; isError: boolean } {
    const node = this.nodes.find(n => n.name === name);
    if (!node) {
      return { output: `Error from server (NotFound): nodes "${name}" not found`, isError: true };
    }

    return {
      output: `Name:               ${node.name}
Roles:              ${node.roles}
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=${node.name}
                    kubernetes.io/os=linux
                    node-role.kubernetes.io/${node.roles}=
Annotations:        kubeadm.alpha.kubernetes.io/cri-socket: unix:///var/run/containerd/containerd.sock
                    node.alpha.kubernetes.io/ttl: 0
CreationTimestamp:  ${new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()}
Taints:             <none>
Unschedulable:      false
Conditions:
  Type             Status  LastHeartbeatTime                 LastTransitionTime                Reason                       Message
  ----             ------  -----------------                 ------------------                ------                       -------
  MemoryPressure   False   ${new Date().toISOString()}   ${new Date().toISOString()}   KubeletHasSufficientMemory   kubelet has sufficient memory available
  DiskPressure     False   ${new Date().toISOString()}   ${new Date().toISOString()}   KubeletHasNoDiskPressure     kubelet has no disk pressure
  PIDPressure      False   ${new Date().toISOString()}   ${new Date().toISOString()}   KubeletHasSufficientPID      kubelet has sufficient PID available
  Ready            True    ${new Date().toISOString()}   ${new Date().toISOString()}   KubeletReady                 kubelet is posting ready status
Addresses:
  InternalIP:  ${node.internalIp}
  Hostname:    ${node.name}
Capacity:
  cpu:                4
  ephemeral-storage:  103079844Ki
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  memory:             16384Mi
  pods:               110
Allocatable:
  cpu:                4
  ephemeral-storage:  94979940Ki
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  memory:             15872Mi
  pods:               110
System Info:
  Machine ID:                 abc123def456
  System UUID:                12345678-1234-1234-1234-123456789012
  Boot ID:                    98765432-9876-9876-9876-987654321098
  Kernel Version:             ${node.kernelVersion}
  OS Image:                   ${node.osImage}
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  ${node.containerRuntime}
  Kubelet Version:            ${node.version}
  Kube-Proxy Version:         ${node.version}
Non-terminated Pods:          (${this.pods.filter(p => p.node === name).length} in total)
  Namespace                   Name                                CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                                ------------  ----------  ---------------  -------------  ---
${this.pods.filter(p => p.node === name).map(p => 
  `  ${p.namespace.padEnd(27)} ${p.name.padEnd(35)} 0 (0%)        0 (0%)      0 (0%)           0 (0%)         ${this.formatAge(p.creationTimestamp)}`
).join("\n")}
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests  Limits
  --------           --------  ------
  cpu                0 (0%)    0 (0%)
  memory             0 (0%)    0 (0%)
  ephemeral-storage  0 (0%)    0 (0%)
Events:              <none>`,
      isError: false
    };
  }

  private describePod(name: string): { output: string; isError: boolean } {
    const pod = this.pods.find(p => p.name === name);
    if (!pod) {
      return { output: `Error from server (NotFound): pods "${name}" not found`, isError: true };
    }

    return {
      output: `Name:             ${pod.name}
Namespace:        ${pod.namespace}
Priority:         0
Service Account:  default
Node:             ${pod.node || 'unknown'}
Start Time:       ${new Date(pod.creationTimestamp).toISOString()}
Labels:           app=${pod.name.split('-')[0]}
                  pod-template-hash=${pod.name.split('-').slice(-1)[0]}
Annotations:      <none>
Status:           ${pod.status}
IP:               ${pod.ip || 'unknown'}
IPs:
  IP:  ${pod.ip || 'unknown'}
Containers:
  ${pod.name.split('-')[0]}:
    Container ID:   containerd://abc123def456789
    Image:          ${pod.name.split('-')[0]}:latest
    Image ID:       docker.io/library/${pod.name.split('-')[0]}@sha256:abc123def456
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      ${new Date(pod.creationTimestamp).toISOString()}
    Ready:          True
    Restart Count:  ${pod.restarts}
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  kube-api-access:
    Type:                    Projected (a volume that contains injected data from multiple sources)
QoS Class:                   BestEffort
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:                      <none>`,
      isError: false
    };
  }

  private handleHelm(args: string[]): { output: string; isError: boolean } {
    if (args.length === 0) {
      return {
        output: `The Kubernetes package manager

Common actions for Helm:

- helm install: install a chart
- helm list: list releases
- helm upgrade: upgrade a release
- helm uninstall: uninstall a release
- helm version: print the version

Usage:
  helm [command]

Use "helm [command] --help" for more information about a command.`,
        isError: false
      };
    }

    const command = args[0];

    switch (command) {
      case "version":
        return this.handleHelmVersion();
      case "install":
        return this.handleHelmInstall(args.slice(1));
      case "list":
      case "ls":
        return this.handleHelmList(args.slice(1));
      case "--version":
        return this.handleHelmVersion();
      default:
        return {
          output: `Error: unknown command "${command}" for "helm"`,
          isError: true
        };
    }
  }

  private handleHelmVersion(): { output: string; isError: boolean } {
    return {
      output: `version.BuildInfo{Version:"v3.15.1", GitCommit:"a5e7e", GitTreeState:"clean"}`,
      isError: false
    };
  }

  private handleHelmList(args: string[]): { output: string; isError: boolean } {
    const flags = this.parseFlags(args);
    const namespace = typeof flags.namespace === 'string' ? flags.namespace : undefined;

    let releases = this.helmReleases;
    if (namespace) {
      releases = releases.filter(r => r.namespace === namespace);
    }

    if (releases.length === 0) {
      return {
        output: "",
        isError: false
      };
    }

    const header = "NAME                    \tNAMESPACE                      \tREVISION\tUPDATED                        \tSTATUS  \tCHART                         \tAPP VERSION";
    const rows = releases.map(r => 
      `${r.name.padEnd(24)}\t${r.namespace.padEnd(31)}\t${r.revision}\t${r.updated.padEnd(31)}\t${r.status.padEnd(8)}\t${r.chart.padEnd(30)}\t${r.appVersion}`
    );

    return {
      output: [header, ...rows].join("\n"),
      isError: false
    };
  }

  private handleHelmInstall(args: string[]): { output: string; isError: boolean } {
    if (args.length < 2) {
      return {
        output: "Error: \"helm install\" requires 2 arguments\n\nUsage:  helm install [NAME] [CHART] [flags]",
        isError: true
      };
    }

    const releaseName = args[0];
    const chartUrl = args[1];
    const flags = this.parseFlags(args.slice(2));

    const namespace = typeof flags.namespace === 'string' ? flags.namespace : 
                     typeof flags['create-namespace'] !== 'undefined' && typeof flags.namespace === 'string' ? flags.namespace : 'default';
    const version = typeof flags.version === 'string' ? flags.version : '0.3.2';
    const createNamespace = flags['create-namespace'] === true;

    if (createNamespace && namespace && !this.namespaces.find(ns => ns.name === namespace)) {
      this.namespaces.push({
        name: namespace,
        status: "Active",
        creationTimestamp: Date.now()
      });
    }

    const chartName = chartUrl.includes('/') ? chartUrl.split('/').pop() || chartUrl : chartUrl;

    const helmRelease: HelmRelease = {
      name: releaseName,
      namespace,
      revision: "1",
      updated: new Date().toISOString().split('T')[0] + " " + new Date().toTimeString().split(' ')[0],
      status: "deployed",
      chart: `${chartName}-${version}`,
      appVersion: version
    };

    this.helmReleases.push(helmRelease);

    this.addOpenChoreoComponents(releaseName, namespace, chartName);

    this.notifyStateChange();

    return {
      output: `NAME: ${releaseName}
LAST DEPLOYED: ${helmRelease.updated}
NAMESPACE: ${namespace}
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
Thank you for installing ${chartName}!`,
      isError: false
    };
  }

  private addOpenChoreoComponents(releaseName: string, namespace: string, chartName: string) {
    const timestamp = Date.now();
    
    if (chartName.includes('cilium')) {
      this.pods.push({
        name: `cilium-${Math.random().toString(36).substring(7)}`,
        namespace,
        ready: "1/1",
        status: "Running",
        restarts: 0,
        ip: `10.244.0.${Math.floor(Math.random() * 200) + 10}`,
        node: "openchoreo-worker",
        creationTimestamp: timestamp
      });
      this.nodes.forEach(node => {
        node.status = "Ready";
      });
    }

    if (chartName.includes('control-plane')) {
      ['controller-manager', 'api-server'].forEach(component => {
        this.pods.push({
          name: `${component}-${Math.random().toString(36).substring(7)}`,
          namespace,
          ready: "1/1",
          status: "Running",
          restarts: 0,
          ip: `10.244.1.${Math.floor(Math.random() * 200) + 10}`,
          node: "openchoreo-worker",
          creationTimestamp: timestamp
        });
      });

      for (let i = 0; i < 3; i++) {
        this.pods.push({
          name: `cert-manager-${['webhook', 'cainjector', ''][i]}-${Math.random().toString(36).substring(7)}`,
          namespace,
          ready: "1/1",
          status: "Running",
          restarts: 0,
          ip: `10.244.1.${Math.floor(Math.random() * 200) + 10}`,
          node: "openchoreo-worker",
          creationTimestamp: timestamp
        });
      }

      this.deployments.push({
        name: "controller-manager",
        namespace,
        ready: "1/1",
        upToDate: 1,
        available: 1,
        creationTimestamp: timestamp
      });

      this.deployments.push({
        name: "api-server",
        namespace,
        ready: "1/1",
        upToDate: 1,
        available: 1,
        creationTimestamp: timestamp
      });
    }

    if (chartName.includes('data-plane')) {
      ['hashicorp-vault-0', 'secrets-store-csi-driver', 'gateway', 'registry', 'redis', 'envoy-gateway', 'envoy-ratelimit', 'fluent-bit'].forEach(component => {
        this.pods.push({
          name: `${component}-${Math.random().toString(36).substring(7)}`,
          namespace,
          ready: "1/1",
          status: "Running",
          restarts: 0,
          ip: `10.244.2.${Math.floor(Math.random() * 200) + 10}`,
          node: "openchoreo-worker",
          creationTimestamp: timestamp
        });
      });
    }

    if (chartName.includes('build-plane')) {
      this.pods.push({
        name: `argo-workflow-controller-${Math.random().toString(36).substring(7)}`,
        namespace,
        ready: "1/1",
        status: "Running",
        restarts: 0,
        ip: `10.244.3.${Math.floor(Math.random() * 200) + 10}`,
        node: "openchoreo-worker",
        creationTimestamp: timestamp
      });

      this.deployments.push({
        name: "argo-workflow-controller",
        namespace,
        ready: "1/1",
        upToDate: 1,
        available: 1,
        creationTimestamp: timestamp
      });
    }
  }

  private handleCurl(command: string): { output: string; isError: boolean } {
    const pipeline = this.parsePipeline(command);
    
    if (pipeline.length === 0) {
      return { output: "curl: no URL specified", isError: true };
    }

    const curlSegment = pipeline[0];
    const curlResult = this.executeCurlCommand(curlSegment);
    
    if (curlResult.isError) {
      return curlResult;
    }

    if (pipeline.length > 1) {
      const pipeTarget = pipeline[1].trim();
      
      if (pipeTarget === "bash" || pipeTarget === "sh" || 
          pipeTarget.startsWith("bash ") || pipeTarget.startsWith("sh ")) {
        const url = this.extractUrlFromCurl(curlSegment);
        return this.executeScriptFromUrl(url);
      } else if (pipeTarget.startsWith("kubectl apply -f")) {
        return { output: "Applied configuration from stdin", isError: false };
      } else {
        return { output: `Piping to ${pipeTarget} is not yet supported in this simulator`, isError: false };
      }
    }

    return curlResult;
  }

  private parsePipeline(command: string): string[] {
    const segments: string[] = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < command.length; i++) {
      const char = command[i];
      
      if ((char === '"' || char === "'") && (i === 0 || command[i - 1] !== '\\')) {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
          quoteChar = "";
        }
        current += char;
      } else if (char === '|' && !inQuotes) {
        segments.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      segments.push(current.trim());
    }
    
    return segments;
  }

  private extractUrlFromCurl(curlCommand: string): string {
    const urlMatch = curlCommand.match(/https?:\/\/[^\s'"]+/);
    return urlMatch ? urlMatch[0] : "";
  }

  private executeCurlCommand(curlCommand: string): { output: string; isError: boolean } {
    const url = this.extractUrlFromCurl(curlCommand);
    
    if (!url) {
      return { output: "curl: no URL specified", isError: true };
    }

    const hasFailFlag = curlCommand.includes('-f') || curlCommand.includes('--fail');
    const hasSilentFlag = curlCommand.includes('-s') || curlCommand.includes('--silent') || curlCommand.includes('-S');
    
    if (!hasSilentFlag) {
      return {
        output: `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  2048  100  2048    0     0   8192      0 --:--:-- --:--:-- --:--:--  8192

${this.getContentForUrl(url)}`,
        isError: false
      };
    }

    return {
      output: this.getContentForUrl(url),
      isError: false
    };
  }

  private getContentForUrl(url: string): string {
    const scriptRegistry = this.getScriptRegistry();
    
    for (const [pattern, content] of Object.entries(scriptRegistry)) {
      if (url.includes(pattern)) {
        return content.scriptContent || "#!/bin/bash\n# Simulated script content\necho 'Script downloaded successfully'";
      }
    }

    return `<!DOCTYPE html>
<html>
<head><title>Simulated Response</title></head>
<body>
<h1>Mock Response for ${url}</h1>
<p>This is a simulated curl response.</p>
</body>
</html>`;
  }

  private executeScriptFromUrl(url: string): { output: string; isError: boolean } {
    const scriptRegistry = this.getScriptRegistry();
    
    for (const [pattern, script] of Object.entries(scriptRegistry)) {
      if (url.includes(pattern)) {
        return script.executor(this);
      }
    }

    return {
      output: `Downloading and executing script from ${url}...
✓ Script downloaded successfully
✓ Executing installation script...
✓ Installation completed

Note: This is a simulated script execution. Unknown URLs return mock output.`,
      isError: false
    };
  }

  private getScriptRegistry(): Record<string, { scriptContent?: string; executor: (sim: KubectlSimulator) => { output: string; isError: boolean } }> {
    return {
      "openchoreo-bootstrap": {
        scriptContent: "#!/bin/bash\n# OpenChoreo Bootstrap Script\necho 'Initializing OpenChoreo cluster...'\n",
        executor: (sim: KubectlSimulator) => {
          const output = `Downloading OpenChoreo bootstrap script...
✓ Script downloaded successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OpenChoreo Cluster Bootstrap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/4] Initializing cluster prerequisites...
      ✓ Checking system requirements
      ✓ Validating network configuration
      
[2/4] Installing Cilium CNI...
      ✓ Helm repository added
      ✓ Installing cilium chart...`;

          const ciliumNamespace = 'cilium';
          if (!sim.namespaces.find(ns => ns.name === ciliumNamespace)) {
            sim.namespaces.push({
              name: ciliumNamespace,
              status: "Active",
              creationTimestamp: Date.now()
            });
          }

          sim.pods.push({
            name: `cilium-${Math.random().toString(36).substring(7)}`,
            namespace: ciliumNamespace,
            ready: "1/1",
            status: "Running",
            restarts: 0,
            ip: `10.244.0.${Math.floor(Math.random() * 200) + 10}`,
            node: "node-1",
            creationTimestamp: Date.now()
          });

          sim.nodes.forEach(node => {
            node.status = "Ready";
          });

          const finalOutput = output + `
      ✓ Cilium CNI installed successfully

[3/4] Configuring network policies...
      ✓ Network policies applied
      
[4/4] Finalizing cluster setup...
      ✓ Cluster bootstrap completed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Bootstrap Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next steps:
  1. Install control plane: helm install control-plane ...
  2. Install data plane: helm install data-plane ...
  3. Verify installation: kubectl get pods -A

`;

          sim.notifyStateChange();
          return { output: finalOutput, isError: false };
        }
      },
      "install-openchoreo": {
        scriptContent: "#!/bin/bash\n# OpenChoreo Installation Script\n",
        executor: (sim: KubectlSimulator) => {
          const output = `Downloading OpenChoreo installation script...
✓ Script downloaded successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OpenChoreo Full Installation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/3] Installing Control Plane components...`;

          const cpNamespace = 'openchoreo-control-plane';
          if (!sim.namespaces.find(ns => ns.name === cpNamespace)) {
            sim.namespaces.push({
              name: cpNamespace,
              status: "Active",
              creationTimestamp: Date.now()
            });
          }

          ['controller-manager', 'api-server'].forEach(component => {
            sim.pods.push({
              name: `${component}-${Math.random().toString(36).substring(7)}`,
              namespace: cpNamespace,
              ready: "1/1",
              status: "Running",
              restarts: 0,
              ip: `10.244.1.${Math.floor(Math.random() * 200) + 10}`,
              node: "node-2",
              creationTimestamp: Date.now()
            });
          });

          const midOutput = output + `
      ✓ Controller Manager deployed
      ✓ API Server deployed
      ✓ Cert Manager deployed

[2/3] Installing Data Plane components...`;

          const dpNamespace = 'openchoreo-data-plane';
          if (!sim.namespaces.find(ns => ns.name === dpNamespace)) {
            sim.namespaces.push({
              name: dpNamespace,
              status: "Active",
              creationTimestamp: Date.now()
            });
          }

          ['vault', 'gateway', 'registry', 'redis'].forEach(component => {
            sim.pods.push({
              name: `${component}-${Math.random().toString(36).substring(7)}`,
              namespace: dpNamespace,
              ready: "1/1",
              status: "Running",
              restarts: 0,
              ip: `10.244.2.${Math.floor(Math.random() * 200) + 10}`,
              node: "node-3",
              creationTimestamp: Date.now()
            });
          });

          const finalOutput = midOutput + `
      ✓ Vault deployed
      ✓ Gateway deployed
      ✓ Registry deployed
      ✓ Redis deployed

[3/3] Verifying installation...
      ✓ All components healthy
      ✓ OpenChoreo IDP ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Installation Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OpenChoreo IDP is now running!

Access the dashboard: kubectl port-forward -n openchoreo-control-plane svc/api-server 8080:8080

`;

          sim.notifyStateChange();
          return { output: finalOutput, isError: false };
        }
      },
      "cluster-setup": {
        scriptContent: "#!/bin/bash\n# Cluster Setup Script\n",
        executor: (sim: KubectlSimulator) => {
          return {
            output: `Downloading cluster setup script...
✓ Script downloaded successfully
✓ Configuring cluster...
✓ Setting up networking...
✓ Cluster setup completed

Run 'kubectl get nodes' to verify cluster status.`,
            isError: false
          };
        }
      }
    };
  }

  private parseFlags(args: string[]): Record<string, string | boolean> {
    const flags: Record<string, string | boolean> = {};
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg.startsWith("--")) {
        const flagPart = arg.slice(2);
        
        if (flagPart.includes("=")) {
          const [key, value] = flagPart.split("=", 2);
          flags[key] = value;
        } else {
          const nextArg = args[i + 1];
          
          if (nextArg && !nextArg.startsWith("-")) {
            flags[flagPart] = nextArg;
            i++;
          } else {
            flags[flagPart] = true;
          }
        }
      } else if (arg.startsWith("-") && arg.length === 2) {
        const key = arg.slice(1);
        const nextArg = args[i + 1];
        
        if (nextArg && !nextArg.startsWith("-")) {
          flags[key] = nextArg;
          i++;
        } else {
          flags[key] = true;
        }
      }
    }
    
    return flags;
  }

  private toYaml(obj: any, indent = 0): string {
    const spaces = " ".repeat(indent);
    let yaml = "";

    if (Array.isArray(obj)) {
      obj.forEach(item => {
        yaml += `${spaces}- ${this.toYaml(item, indent + 2).trimStart()}\n`;
      });
    } else if (typeof obj === "object" && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          yaml += `${spaces}${key}:\n${this.toYaml(value, indent + 2)}`;
        } else {
          yaml += `${spaces}${key}: ${value}\n`;
        }
      });
    } else {
      return String(obj);
    }

    return yaml;
  }
}
