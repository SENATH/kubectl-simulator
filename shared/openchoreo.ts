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
      group: "openchoreo.dev",
      version: "v1alpha1",
      kind: "Organization",
      plural: "organizations",
      singular: "organization",
      scope: "Cluster",
      categories: ["openchoreo"]
    },
    sampleFactory: () => [
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Organization",
        metadata: {
          name: "default",
          namespace: "",
          creationTimestamp: Date.now() - (10 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Default Organization",
            "openchoreo.dev/description": "This is the default organization for this setup"
          }
        },
        spec: {},
        status: {
          observedGeneration: 1,
          namespace: "default",
          conditions: [
            { type: "Ready", status: "True" },
            { type: "NamespaceProvisioned", status: "True" }
          ]
        }
      }
    ]
  },

  project: {
    descriptor: {
      group: "openchoreo.dev",
      version: "v1alpha1",
      kind: "Project",
      plural: "projects",
      singular: "project",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Project",
        metadata: {
          name: "internal-apps",
          namespace,
          creationTimestamp: Date.now() - (8 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Internal Applications",
            "openchoreo.dev/description": "This project contains components for internal applications"
          }
        },
        spec: {
          deploymentPipelineRef: "default-deployment-pipeline"
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "Reconciled", status: "True" },
            { type: "NamespaceProvisioned", status: "True" }
          ]
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Project",
        metadata: {
          name: "customer-services",
          namespace,
          creationTimestamp: Date.now() - (7 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Customer Services",
            "openchoreo.dev/description": "Customer-facing microservices and APIs"
          }
        },
        spec: {
          deploymentPipelineRef: "default-deployment-pipeline"
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "Reconciled", status: "True" },
            { type: "NamespaceProvisioned", status: "True" }
          ]
        }
      }
    ]
  },

  component: {
    descriptor: {
      group: "openchoreo.dev",
      version: "v1alpha1",
      kind: "Component",
      plural: "components",
      singular: "component",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Component",
        metadata: {
          name: "customer-service",
          namespace,
          creationTimestamp: Date.now() - (5 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Customer Service",
            "openchoreo.dev/description": "Customer management REST API service"
          }
        },
        spec: {
          owner: {
            projectName: "customer-services"
          },
          type: "Service",
          build: {
            repository: {
              url: "https://github.com/myorg/customer-service",
              revision: {
                branch: "main"
              },
              appPath: "."
            },
            templateRef: {
              name: "docker",
              parameters: [
                { name: "docker-context", value: "." },
                { name: "dockerfile-path", value: "./Dockerfile" }
              ]
            }
          }
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "Reconciled", status: "True" }
          ]
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Component",
        metadata: {
          name: "frontend-app",
          namespace,
          creationTimestamp: Date.now() - (5 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Frontend Application",
            "openchoreo.dev/description": "React-based web application"
          }
        },
        spec: {
          owner: {
            projectName: "internal-apps"
          },
          type: "WebApplication",
          build: {
            repository: {
              url: "https://github.com/myorg/frontend",
              revision: {
                branch: "develop"
              },
              appPath: "./webapp"
            },
            templateRef: {
              name: "google-cloud-buildpacks"
            }
          }
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "Reconciled", status: "True" }
          ]
        }
      }
    ]
  },

  build: {
    descriptor: {
      group: "openchoreo.dev",
      version: "v1alpha1",
      kind: "Build",
      plural: "builds",
      singular: "build",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Build",
        metadata: {
          name: "customer-service-build-abc123",
          namespace,
          creationTimestamp: Date.now() - (2 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Customer Service Build #abc123",
            "openchoreo.dev/description": "Docker build for customer-service component"
          }
        },
        spec: {
          owner: {
            projectName: "customer-services",
            componentName: "customer-service"
          },
          repository: {
            url: "https://github.com/myorg/customer-service",
            revision: {
              branch: "main",
              commit: "abc123def456"
            },
            appPath: "."
          },
          templateRef: {
            name: "docker",
            parameters: [
              { name: "docker-context", value: "." },
              { name: "dockerfile-path", value: "./Dockerfile" }
            ]
          }
        },
        status: {
          conditions: [
            { type: "Ready", status: "True" },
            { type: "Building", status: "False" },
            { type: "Failed", status: "False" }
          ],
          imageStatus: {
            image: "docker.io/myorg/customer-service@sha256:abc123..."
          }
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Build",
        metadata: {
          name: "frontend-build-xyz789",
          namespace,
          creationTimestamp: Date.now() - (1 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Frontend Build #xyz789"
          }
        },
        spec: {
          owner: {
            projectName: "internal-apps",
            componentName: "frontend-app"
          },
          repository: {
            url: "https://github.com/myorg/frontend",
            revision: {
              branch: "develop"
            },
            appPath: "./webapp"
          },
          templateRef: {
            name: "google-cloud-buildpacks"
          }
        },
        status: {
          conditions: [
            { type: "Ready", status: "True" }
          ],
          imageStatus: {
            image: "docker.io/myorg/frontend@sha256:xyz789..."
          }
        }
      }
    ]
  },

  deployableartifact: {
    descriptor: {
      group: "openchoreo.dev",
      version: "v1alpha1",
      kind: "DeployableArtifact",
      plural: "deployableartifacts",
      singular: "deployableartifact",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "DeployableArtifact",
        metadata: {
          name: "customer-service-v1.2.0",
          namespace,
          creationTimestamp: Date.now() - (1 * 24 * 60 * 60 * 1000)
        },
        spec: {
          image: "docker.io/myorg/customer-service@sha256:abc123..."
        },
        status: {
          phase: "Available"
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "DeployableArtifact",
        metadata: {
          name: "frontend-v2.0.0",
          namespace,
          creationTimestamp: Date.now() - (1 * 24 * 60 * 60 * 1000)
        },
        spec: {
          image: "docker.io/myorg/frontend@sha256:xyz789..."
        },
        status: {
          phase: "Available"
        }
      }
    ]
  },

  environment: {
    descriptor: {
      group: "openchoreo.dev",
      version: "v1alpha1",
      kind: "Environment",
      plural: "environments",
      singular: "environment",
      scope: "Namespaced",
      categories: ["openchoreo"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Environment",
        metadata: {
          name: "development",
          namespace,
          creationTimestamp: Date.now() - (12 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Development",
            "openchoreo.dev/description": "Development environment for testing new features"
          }
        },
        spec: {
          dataPlaneRef: "dev-dataplane",
          isProduction: false,
          gateway: {
            dnsPrefix: "dev",
            security: {
              remoteJwks: {
                uri: "https://auth.example.com/.well-known/jwks.json"
              }
            }
          }
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "DataPlaneConnected", status: "True" },
            { type: "GatewayConfigured", status: "True" }
          ]
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Environment",
        metadata: {
          name: "staging",
          namespace,
          creationTimestamp: Date.now() - (10 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Staging",
            "openchoreo.dev/description": "Pre-production staging environment"
          }
        },
        spec: {
          dataPlaneRef: "staging-dataplane",
          isProduction: false,
          gateway: {
            dnsPrefix: "staging"
          }
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "DataPlaneConnected", status: "True" },
            { type: "GatewayConfigured", status: "True" }
          ]
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "Environment",
        metadata: {
          name: "production",
          namespace,
          creationTimestamp: Date.now() - (10 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Production",
            "openchoreo.dev/description": "Production environment"
          }
        },
        spec: {
          dataPlaneRef: "prod-dataplane",
          isProduction: true,
          gateway: {
            dnsPrefix: "api",
            security: {
              remoteJwks: {
                uri: "https://auth.example.com/.well-known/jwks.json"
              }
            }
          }
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "DataPlaneConnected", status: "True" },
            { type: "GatewayConfigured", status: "True" }
          ]
        }
      }
    ]
  },

  resourcetype: {
    descriptor: {
      group: "openchoreo.dev",
      version: "v1alpha1",
      kind: "ResourceType",
      plural: "resourcetypes",
      singular: "resourcetype",
      scope: "Cluster",
      categories: ["openchoreo", "platform"]
    },
    sampleFactory: () => [
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "ResourceType",
        metadata: {
          name: "postgres-db",
          namespace: "",
          creationTimestamp: Date.now() - (20 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "PostgreSQL Database",
            "openchoreo.dev/description": "Managed PostgreSQL database instance"
          }
        },
        spec: {
          category: "database",
          provider: "aws-rds"
        },
        status: {
          phase: "Available"
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "ResourceType",
        metadata: {
          name: "redis-cache",
          namespace: "",
          creationTimestamp: Date.now() - (20 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Redis Cache",
            "openchoreo.dev/description": "Managed Redis cache instance"
          }
        },
        spec: {
          category: "cache",
          provider: "aws-elasticache"
        },
        status: {
          phase: "Available"
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "ResourceType",
        metadata: {
          name: "s3-bucket",
          namespace: "",
          creationTimestamp: Date.now() - (20 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "S3 Bucket",
            "openchoreo.dev/description": "AWS S3 object storage bucket"
          }
        },
        spec: {
          category: "storage",
          provider: "aws-s3"
        },
        status: {
          phase: "Available"
        }
      }
    ]
  },

  dataplane: {
    descriptor: {
      group: "openchoreo.dev",
      version: "v1alpha1",
      kind: "DataPlane",
      plural: "dataplanes",
      singular: "dataplane",
      scope: "Namespaced",
      categories: ["openchoreo", "infrastructure"]
    },
    sampleFactory: (namespace = "default") => [
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "DataPlane",
        metadata: {
          name: "dev-dataplane",
          namespace,
          creationTimestamp: Date.now() - (15 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Development Data Plane",
            "openchoreo.dev/description": "Development Kubernetes cluster for testing"
          }
        },
        spec: {
          kubernetesCluster: {
            name: "dev-cluster",
            credentials: {
              apiServerURL: "https://k8s-dev.example.com:6443",
              caCert: "LS0tLS1CRUdJTi...",
              clientCert: "LS0tLS1CRUdJTi...",
              clientKey: "LS0tLS1CRUdJTi..."
            }
          },
          registry: {
            prefix: "docker.io/myorg",
            secretRef: "registry-credentials"
          },
          gateway: {
            publicVirtualHost: "dev.example.com",
            organizationVirtualHost: "dev-internal.example.com"
          }
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "Connected", status: "True" },
            { type: "GatewayProvisioned", status: "True" }
          ]
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "DataPlane",
        metadata: {
          name: "staging-dataplane",
          namespace,
          creationTimestamp: Date.now() - (15 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Staging Data Plane",
            "openchoreo.dev/description": "Staging Kubernetes cluster for pre-production testing"
          }
        },
        spec: {
          kubernetesCluster: {
            name: "staging-cluster",
            credentials: {
              apiServerURL: "https://k8s-staging.example.com:6443",
              caCert: "LS0tLS1CRUdJTi...",
              clientCert: "LS0tLS1CRUdJTi...",
              clientKey: "LS0tLS1CRUdJTi..."
            }
          },
          registry: {
            prefix: "docker.io/myorg",
            secretRef: "registry-credentials"
          },
          gateway: {
            publicVirtualHost: "staging.example.com",
            organizationVirtualHost: "staging-internal.example.com"
          }
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "Connected", status: "True" },
            { type: "GatewayProvisioned", status: "True" }
          ]
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "DataPlane",
        metadata: {
          name: "prod-dataplane",
          namespace,
          creationTimestamp: Date.now() - (15 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Production Data Plane",
            "openchoreo.dev/description": "Production Kubernetes cluster for workloads"
          }
        },
        spec: {
          kubernetesCluster: {
            name: "production-cluster",
            credentials: {
              apiServerURL: "https://k8s-api.example.com:6443",
              caCert: "LS0tLS1CRUdJTi...",
              clientCert: "LS0tLS1CRUdJTi...",
              clientKey: "LS0tLS1CRUdJTi..."
            }
          },
          registry: {
            prefix: "docker.io/myorg",
            secretRef: "registry-credentials"
          },
          gateway: {
            publicVirtualHost: "api.example.com",
            organizationVirtualHost: "internal.example.com"
          }
        },
        status: {
          observedGeneration: 1,
          conditions: [
            { type: "Ready", status: "True" },
            { type: "Connected", status: "True" },
            { type: "GatewayProvisioned", status: "True" }
          ]
        }
      }
    ]
  },

  idp: {
    descriptor: {
      group: "openchoreo.dev",
      version: "v1alpha1",
      kind: "IdentityProvider",
      plural: "idps",
      singular: "idp",
      scope: "Cluster",
      categories: ["openchoreo", "security"]
    },
    sampleFactory: () => [
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "IdentityProvider",
        metadata: {
          name: "corporate-sso",
          namespace: "",
          creationTimestamp: Date.now() - (30 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "Corporate SSO",
            "openchoreo.dev/description": "SAML-based corporate identity provider"
          }
        },
        spec: {
          type: "saml",
          issuer: "https://sso.acme-corp.com"
        },
        status: {
          phase: "Active",
          connected: true
        }
      },
      {
        apiVersion: "openchoreo.dev/v1alpha1",
        kind: "IdentityProvider",
        metadata: {
          name: "github-oauth",
          namespace: "",
          creationTimestamp: Date.now() - (25 * 24 * 60 * 60 * 1000),
          annotations: {
            "openchoreo.dev/display-name": "GitHub OAuth",
            "openchoreo.dev/description": "OAuth integration with GitHub"
          }
        },
        spec: {
          type: "oauth2",
          issuer: "https://github.com"
        },
        status: {
          phase: "Active",
          connected: true
        }
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
    creationTimestamp: Date.now() - (30 * 24 * 60 * 60 * 1000)
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
