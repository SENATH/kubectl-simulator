import type { K8sCrd, K8sCustomResource } from "./schema";

export interface CrdDescriptor {
  group: string;
  version: string;
  kind: string;
  plural: string;
  singular: string;
  scope: "Namespaced" | "Cluster";
  categories?: string[];
}

export interface CustomResourceSampleFactory {
  (namespace?: string): K8sCustomResource[];
}

export interface CrdRegistryEntry {
  descriptor: CrdDescriptor;
  sampleFactory: CustomResourceSampleFactory;
}

export const OPENCHOREO_CRDS: Record<string, CrdRegistryEntry> = {
  organization: {
    descriptor: {
      group: "choreo.dev",
      version: "v1alpha1",
      kind: "Organization",
      plural: "organizations",
      singular: "organization",
      scope: "Cluster",
      categories: ["openchoreo"]
    },
    sampleFactory: () => [
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Organization",
        metadata: {
          name: "acme-corp",
          namespace: "",
          creationTimestamp: Date.now() - (10 * 24 * 60 * 60 * 1000) // 10 days ago
        },
        spec: {
          displayName: "ACME Corporation",
          description: "Enterprise organization for ACME products"
        },
        status: { phase: "Active" }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Organization",
        metadata: {
          name: "demo-org",
          namespace: "",
          creationTimestamp: Date.now() - (15 * 24 * 60 * 60 * 1000) // 15 days ago
        },
        spec: {
          displayName: "Demo Organization",
          description: "Sample organization for testing"
        },
        status: { phase: "Active" }
      }
    ]
  },

  project: {
    descriptor: {
      group: "choreo.dev",
      version: "v1alpha1",
      kind: "Project",
      plural: "projects",
      singular: "project",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Project",
        metadata: {
          name: "web-app",
          namespace,
          creationTimestamp: Date.now() - (8 * 24 * 60 * 60 * 1000) // 8 days ago
        },
        spec: {
          displayName: "Web Application",
          description: "Main customer-facing web application",
          organizationRef: { name: "acme-corp" }
        },
        status: { phase: "Active" }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Project",
        metadata: {
          name: "api-backend",
          namespace,
          creationTimestamp: Date.now() - (7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        spec: {
          displayName: "API Backend",
          description: "REST API backend services",
          organizationRef: { name: "acme-corp" }
        },
        status: { phase: "Active" }
      }
    ]
  },

  component: {
    descriptor: {
      group: "choreo.dev",
      version: "v1alpha1",
      kind: "Component",
      plural: "components",
      singular: "component",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Component",
        metadata: {
          name: "frontend",
          namespace,
          creationTimestamp: Date.now() - (5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        spec: {
          displayName: "Frontend UI",
          description: "React-based frontend application",
          projectRef: { name: "web-app", namespace },
          componentType: "web",
          repository: "https://github.com/acme-corp/frontend"
        },
        status: { phase: "Ready" }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Component",
        metadata: {
          name: "user-service",
          namespace,
          creationTimestamp: Date.now() - (5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        spec: {
          displayName: "User Service",
          description: "User management microservice",
          projectRef: { name: "api-backend", namespace },
          componentType: "service",
          repository: "https://github.com/acme-corp/user-service"
        },
        status: { phase: "Ready" }
      }
    ]
  },

  build: {
    descriptor: {
      group: "choreo.dev",
      version: "v1alpha1",
      kind: "Build",
      plural: "builds",
      singular: "build",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Build",
        metadata: {
          name: "frontend-build-1",
          namespace,
          creationTimestamp: Date.now() - (2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        spec: {
          componentRef: { name: "frontend", namespace },
          gitCommit: "a1b2c3d",
          buildType: "container"
        },
        status: { phase: "Succeeded", completedAt: Date.now() - (2 * 24 * 60 * 60 * 1000) }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Build",
        metadata: {
          name: "user-service-build-2",
          namespace,
          creationTimestamp: Date.now() - (1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        spec: {
          componentRef: { name: "user-service", namespace },
          gitCommit: "e4f5g6h",
          buildType: "container"
        },
        status: { phase: "Succeeded", completedAt: Date.now() - (1 * 24 * 60 * 60 * 1000) }
      }
    ]
  },

  deployableartifact: {
    descriptor: {
      group: "choreo.dev",
      version: "v1alpha1",
      kind: "DeployableArtifact",
      plural: "deployableartifacts",
      singular: "deployableartifact",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "DeployableArtifact",
        metadata: {
          name: "frontend-v1.2.0",
          namespace,
          creationTimestamp: Date.now() - (1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        spec: {
          buildRef: { name: "frontend-build-1", namespace },
          version: "v1.2.0",
          imageRef: "acme/frontend:v1.2.0"
        },
        status: { phase: "Available" }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "DeployableArtifact",
        metadata: {
          name: "user-service-v2.1.0",
          namespace,
          creationTimestamp: Date.now() - (1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        spec: {
          buildRef: { name: "user-service-build-2", namespace },
          version: "v2.1.0",
          imageRef: "acme/user-service:v2.1.0"
        },
        status: { phase: "Available" }
      }
    ]
  },

  environment: {
    descriptor: {
      group: "choreo.dev",
      version: "v1alpha1",
      kind: "Environment",
      plural: "environments",
      singular: "environment",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Environment",
        metadata: {
          name: "dev",
          namespace,
          creationTimestamp: Date.now() - (12 * 24 * 60 * 60 * 1000) // 12 days ago
        },
        spec: {
          displayName: "Development",
          description: "Development environment",
          projectRef: { name: "web-app", namespace },
          type: "non-production"
        },
        status: { phase: "Ready" }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Environment",
        metadata: {
          name: "staging",
          namespace,
          creationTimestamp: Date.now() - (10 * 24 * 60 * 60 * 1000) // 10 days ago
        },
        spec: {
          displayName: "Staging",
          description: "Staging environment for testing",
          projectRef: { name: "web-app", namespace },
          type: "non-production"
        },
        status: { phase: "Ready" }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "Environment",
        metadata: {
          name: "production",
          namespace,
          creationTimestamp: Date.now() - (10 * 24 * 60 * 60 * 1000) // 10 days ago
        },
        spec: {
          displayName: "Production",
          description: "Production environment",
          projectRef: { name: "web-app", namespace },
          type: "production"
        },
        status: { phase: "Ready" }
      }
    ]
  },

  resourcetype: {
    descriptor: {
      group: "choreo.dev",
      version: "v1alpha1",
      kind: "ResourceType",
      plural: "resourcetypes",
      singular: "resourcetype",
      scope: "Cluster",
      categories: ["openchoreo"]
    },
    sampleFactory: () => [
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "ResourceType",
        metadata: {
          name: "postgres-db",
          namespace: "",
          creationTimestamp: Date.now() - (20 * 24 * 60 * 60 * 1000) // 20 days ago
        },
        spec: {
          displayName: "PostgreSQL Database",
          description: "Managed PostgreSQL database instance",
          category: "database",
          provider: "aws-rds"
        },
        status: { phase: "Available" }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "ResourceType",
        metadata: {
          name: "redis-cache",
          namespace: "",
          creationTimestamp: Date.now() - (20 * 24 * 60 * 60 * 1000) // 20 days ago
        },
        spec: {
          displayName: "Redis Cache",
          description: "Managed Redis cache instance",
          category: "cache",
          provider: "aws-elasticache"
        },
        status: { phase: "Available" }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "ResourceType",
        metadata: {
          name: "s3-bucket",
          namespace: "",
          creationTimestamp: Date.now() - (20 * 24 * 60 * 60 * 1000) // 20 days ago
        },
        spec: {
          displayName: "S3 Bucket",
          description: "AWS S3 object storage bucket",
          category: "storage",
          provider: "aws-s3"
        },
        status: { phase: "Available" }
      }
    ]
  },

  dataplane: {
    descriptor: {
      group: "choreo.dev",
      version: "v1alpha1",
      kind: "DataPlane",
      plural: "dataplanes",
      singular: "dataplane",
      scope: "Cluster",
      categories: ["openchoreo", "infrastructure"]
    },
    sampleFactory: () => [
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "DataPlane",
        metadata: {
          name: "default-dp",
          namespace: "",
          creationTimestamp: Date.now() - (15 * 24 * 60 * 60 * 1000) // 15 days ago
        },
        spec: {
          displayName: "Default Data Plane",
          description: "Primary data plane for application workloads",
          region: "us-west-2",
          clusterRef: { name: "production-cluster" }
        },
        status: { phase: "Ready", health: "Healthy" }
      }
    ]
  },

  idp: {
    descriptor: {
      group: "choreo.dev",
      version: "v1alpha1",
      kind: "IdentityProvider",
      plural: "idps",
      singular: "idp",
      scope: "Cluster",
      categories: ["openchoreo", "security"]
    },
    sampleFactory: () => [
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "IdentityProvider",
        metadata: {
          name: "corporate-sso",
          namespace: "",
          creationTimestamp: Date.now() - (30 * 24 * 60 * 60 * 1000) // 30 days ago
        },
        spec: {
          displayName: "Corporate SSO",
          description: "SAML-based corporate identity provider",
          type: "saml",
          issuer: "https://sso.acme-corp.com"
        },
        status: { phase: "Active", connected: true }
      },
      {
        apiVersion: "choreo.dev/v1alpha1",
        kind: "IdentityProvider",
        metadata: {
          name: "github-oauth",
          namespace: "",
          creationTimestamp: Date.now() - (25 * 24 * 60 * 60 * 1000) // 25 days ago
        },
        spec: {
          displayName: "GitHub OAuth",
          description: "OAuth integration with GitHub",
          type: "oauth2",
          issuer: "https://github.com"
        },
        status: { phase: "Active", connected: true }
      }
    ]
  }
};

export function getCrdFromRegistry(kind: string): K8sCrd | null {
  const entry = OPENCHOREO_CRDS[kind.toLowerCase()];
  if (!entry) return null;

  const { descriptor } = entry;
  return {
    name: `${descriptor.plural}.${descriptor.group}`,
    group: descriptor.group,
    version: descriptor.version,
    kind: descriptor.kind,
    plural: descriptor.plural,
    singular: descriptor.singular,
    scope: descriptor.scope,
    creationTimestamp: Date.now() - (30 * 24 * 60 * 60 * 1000) // Assume installed 30 days ago
  };
}

export function getAllCrdsFromRegistry(): K8sCrd[] {
  return Object.keys(OPENCHOREO_CRDS).map(kind => getCrdFromRegistry(kind)!);
}

export function createSampleResources(kind: string, namespace?: string): K8sCustomResource[] {
  const entry = OPENCHOREO_CRDS[kind.toLowerCase()];
  if (!entry) return [];
  return entry.sampleFactory(namespace);
}

export function getAllSampleResources(namespace = "default"): K8sCustomResource[] {
  const resources: K8sCustomResource[] = [];
  
  for (const kind of Object.keys(OPENCHOREO_CRDS)) {
    const entry = OPENCHOREO_CRDS[kind];
    if (entry.descriptor.scope === "Cluster") {
      resources.push(...entry.sampleFactory());
    } else {
      resources.push(...entry.sampleFactory(namespace));
    }
  }
  
  return resources;
}
