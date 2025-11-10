# Kubectl Web Terminal Simulator

## Overview

This is an interactive web-based kubectl command simulator that allows users to practice Kubernetes commands in a simulated 3-node cluster environment with full read/write capabilities. The application provides a terminal interface that mimics the behavior of kubectl commands without requiring an actual Kubernetes cluster. Users can create, delete, scale, and manage resources in a realistic learning environment where changes persist throughout their session. It's designed as a learning and practice tool with a focus on terminal authenticity and developer-friendly UX.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: React hooks (useState, useRef, useEffect) for local component state
- **Data Fetching**: TanStack React Query for server state management
- **UI Component Library**: shadcn/ui (Radix UI primitives) with custom styling via Tailwind CSS

**Design System**:
- Typography: JetBrains Mono/Fira Code for terminal text, Inter for UI elements
- Styling: Tailwind CSS with custom design tokens following the "New York" variant of shadcn/ui
- Theme Support: Light/dark mode with localStorage persistence
- Component Structure: Modular components following atomic design principles

**Key Components**:
- **Terminal**: Interactive command-line interface with command history and input handling
- **ClusterOverview**: Displays simulated cluster status, nodes, and resource information
- **CommandReference**: Searchable reference guide for kubectl commands with examples

**Rationale**: React with Vite provides fast development cycles and optimal production builds. Wouter is chosen for minimal bundle size. TanStack Query handles caching and synchronization concerns. shadcn/ui provides accessible, customizable components while maintaining design consistency.

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Server Runtime**: Node.js with ESM modules
- **Development Server**: Custom Vite middleware integration for HMR during development
- **Build Process**: esbuild for production bundling with external package handling

**Data Layer**:
- **Primary Storage**: In-memory storage (MemStorage class) for user data
- **Database Configuration**: Drizzle ORM configured for PostgreSQL (ready for future migration from in-memory to persistent storage)
- **Session Management**: Connect-pg-simple configured for PostgreSQL-backed sessions (currently unused but ready for implementation)

**API Structure**: RESTful API design with `/api` prefix for all backend routes

**Rationale**: Express provides a minimal, flexible foundation. The in-memory storage allows the simulator to run without external dependencies while maintaining the same interface that would work with a real database. Drizzle ORM provides type-safe database queries and schema management when persistent storage is needed.

### Kubernetes Simulation Engine

**Architecture**: Client-side simulation engine (KubectlSimulator class)
- Maintains mutable simulated state for nodes, pods, deployments, services, and namespaces
- Parses kubectl command syntax and generates appropriate responses
- Provides realistic output formatting matching actual kubectl behavior
- Supports full CRUD operations: create, delete, scale, and read operations
- State changes persist during the user session, providing realistic feedback

**Supported Operations**:
- **Read Operations**: get, describe, logs, version, cluster-info, config
- **Write Operations**: create (namespace, deployment, service, pod), delete (all resource types), scale (deployments)
- **Output Formats**: table (default), JSON, YAML

**Data Models**: TypeScript interfaces for K8s resources (K8sNode, K8sPod, K8sDeployment, K8sService, K8sNamespace)

**Rationale**: Client-side simulation eliminates server dependencies and latency, providing instant command execution. Mutable state allows users to experiment with create/delete/scale operations and see realistic results, making it an effective learning tool. This approach prioritizes learning and practice over production-realistic architecture.

### Design Patterns

**Component Composition**: Radix UI primitives composed into custom shadcn/ui components, further composed into application-specific components

**Separation of Concerns**:
- UI components (client/src/components) separate from page layouts (client/src/pages)
- Business logic (kubectl-simulator.ts) isolated from presentation
- Shared types (shared/schema.ts) accessible to both client and server

**Code Organization**:
```
client/
  src/
    components/ - Reusable UI components
    pages/ - Route-level page components
    lib/ - Utilities and shared logic
    hooks/ - Custom React hooks
server/ - Backend Express application
shared/ - Types and schemas used by both client and server
```

**Rationale**: Clear separation enables independent testing, easier refactoring, and better code reusability. The shared folder prevents type duplication between frontend and backend.

## External Dependencies

### Third-Party UI Libraries

- **Radix UI**: Headless component primitives for accessibility and keyboard navigation (@radix-ui/react-*)
- **shadcn/ui**: Pre-styled component configurations built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command palette component (future feature support)
- **Embla Carousel**: Carousel implementation for potential feature galleries

### Styling & Design

- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Type-safe variant styling
- **clsx + tailwind-merge**: Class name composition and conflict resolution

### Forms & Validation

- **React Hook Form**: Form state management with performance optimization
- **Zod**: Schema validation library
- **@hookform/resolvers**: Zod resolver integration for React Hook Form
- **drizzle-zod**: Zod schema generation from Drizzle ORM schemas

### Database & ORM

- **Drizzle ORM**: Type-safe SQL query builder and schema management
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **PostgreSQL**: Configured as the target database (not currently required for core functionality)

**Note**: The application is currently designed to work without a database connection using in-memory storage. The database setup (Drizzle, Neon, PostgreSQL) provides a migration path for future features requiring persistence.

### Utilities

- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **wouter**: Lightweight client-side routing

### Development Tools

- **Vite**: Frontend build tool with HMR support
- **TypeScript**: Type safety across the application
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements (error overlay, cartographer, dev banner)