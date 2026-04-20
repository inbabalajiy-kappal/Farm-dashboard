---
description: "Define coding standards and principles for FarmMap-Dev project"
---

# FarmMap-Dev Architecture Document

**Document Version**: 1.0.0 | **Last Updated**: April 15, 2026 | **Status**: Production-Ready

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [SOLID Design Principles](#solid-design-principles)
3. [Object-Oriented Programming (OOP) Patterns](#object-oriented-programming-patterns)
4. [Clean Code Standards](#clean-code-standards)
5. [Layer Separation & Responsibilities](#layer-separation--responsibilities)
6. [Component Architecture](#component-architecture)
7. [Data Management Patterns](#data-management-patterns)
8. [Type Safety Standards](#type-safety-standards)
9. [Performance & Optimization](#performance--optimization)
10. [Testing Strategy](#testing-strategy)
11. [Code Quality Enforcement](#code-quality-enforcement)
12. [Deployment & Monitoring](#deployment--monitoring)

---

## Project Structure

```text
farmmap-dev/
├── app/                              # Next.js route layer
│   ├── api/                          # Server-side API endpoints
│   ├── layout.tsx                    # Root layout component
│   └── [features]/                   # Feature-based route organization
├── modules/                          # Modular architecture
│   ├── field-layout/                 # Field layout feature
│   │   ├── components/               # UI components
│   │   ├── hooks/                    # Custom hooks
│   │   ├── services/                 # Business logic services
│   │   ├── models/                   # Data models
│   │   └── constants/                # Feature-specific constants
│   └── shared/                       # Shared utilities and components
├── core/                             # Core abstractions
│   └── map/                          # MapFactory and related utilities
├── public/                           # Static assets
├── styles/                           # Global CSS and Tailwind configuration
├── types/                            # Centralized type definitions
├── utils/                            # Pure utility functions
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Project documentation
```

---

## SOLID Design Principles

### 1. Single Responsibility Principle (SRP)
- Each module, component, or function should have only one reason to change.
- Example: `PolygonManager` handles polygon creation, editing, and deletion.

### 2. Open/Closed Principle (OCP)
- Open for extension, closed for modification.
- Example: Add new map interactions by extending `MapInteractionManager`.

### 3. Liskov Substitution Principle (LSP)
- Derived classes must be substitutable for base classes.
- Example: `VectorLayer` can be replaced with other layer types without breaking functionality.

### 4. Interface Segregation Principle (ISP)
- Clients should not depend on interfaces they don’t use.
- Example: Separate interfaces for `DrawInteraction` and `ModifyInteraction`.

### 5. Dependency Inversion Principle (DIP)
- Depend on abstractions, not concrete implementations.
- Example: Use `MapFactory` to abstract map creation.

---

## Object-Oriented Programming (OOP) Patterns

### Encapsulation
- Hide internal details, expose only necessary interfaces.
- Example: `PolygonManager` exposes methods like `addPolygon`, `updatePolygonOwner`.

### Abstraction
- Hide complexity behind simple interfaces.
- Example: `MapInteractionManager` abstracts OpenLayers interaction logic.

### Polymorphism
- Different objects respond to the same interface differently.
- Example: `PolygonManager` can handle different polygon styles dynamically.

---

## Clean Code Standards

### Naming Conventions
- Use descriptive, intention-revealing names.
- Example: `enableDrawInteraction` instead of `startDraw`.

### Function Design
- Small, focused functions (≤ 10 lines preferred).
- Example: `toggleDrawMode` handles enabling/disabling draw interaction.

### TypeScript Type Safety
- Use explicit types everywhere.
- Avoid `any` and use union types for clarity.

---

## Layer Separation & Responsibilities

### Architectural Layers
1. **Routes**: Thin route handlers, delegate to services.
2. **Business Logic**: Encapsulated in services (`PolygonManager`, `MapInteractionManager`).
3. **UI**: Focus on rendering, no business logic.
4. **Utils**: Pure functions, no side effects.

---

## Component Architecture

### Component Classification
1. **Presentational Components**: Pure UI rendering.
2. **Container Components**: Manage state, fetch data.
3. **Custom Hooks**: Encapsulate complex logic.

---

## Data Management Patterns

### Fetch Strategy
- Centralized service layer for API calls.
- Example: `FieldLayerService` handles vector layer management.

---

## Type Safety Standards

### Centralized Type File
- Define domain models, API contracts, and props interfaces in `types/`.

---

## Performance & Optimization

### Code Splitting
- Use dynamic imports for heavy modules.

### Memoization Guidelines
- Memoize expensive computations and avoid unnecessary re-renders.

---

## Testing Strategy

### Test Types
1. **Unit Tests**: Test services and utilities.
2. **Component Tests**: Test UI behavior.
3. **Integration Tests**: Test workflows across components.

---

## Code Quality Enforcement

### Tools & Standards
- Use ESLint, Prettier, and TypeScript strict mode.

---

## Deployment & Monitoring

### Build Optimization
- Use `npm run build` for production builds.

### Monitoring
- Track errors and performance metrics using tools like Sentry.

---

**Version**: 1.0.0 | **Updated**: April 15, 2026 | **Status**: Production-Ready
