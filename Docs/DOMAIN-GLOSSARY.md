# Domain Glossary — Farm-map-Dev

> **Project:** Farm Mapping and Management System
> **Last Updated:** April 17, 2026

This glossary defines the canonical vocabulary for the **Farm-map-Dev** project. All team members, AI systems, documents, code, and specifications should use these terms consistently to ensure clear communication, scalable architecture, and token-optimized AI-assisted development.

---

## Table of Contents

* [A](#a) · [B](#b) · [C](#c) · [D](#d) · [E](#e) · [F](#f) · [G](#g) · [H](#h) · [I](#i) · [L](#l) · [M](#m) · [O](#o) · [P](#p) · [R](#r) · [S](#s) · [T](#t) · [V](#v) · [W](#w)

---

## A

| Term                 | Definition                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Area Calculation** | The computed total land area of a polygon field using latitude/longitude coordinates. The system must calculate area in square meters and convert it into **acres** (1 acre = 4046.86 sq meters). Calculations must be efficient, reusable, and triggered only on geometry changes to ensure runtime and token optimization. |
| **Area Limit**       | A business constraint that restricts polygon size. Validation must occur during draw/edit operations to prevent invalid state mutations. Limits may be defined in acres for domain relevance.                                                                                                                                |

---

## B

| Term              | Definition                                                                                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Business Rule** | Domain-specific constraint applied to polygon features (e.g., ownership validation, area limits, edit permissions). Must be enforced at service layer to maintain loose coupling. |

---

## C

| Term                   | Definition                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Component**          | UI layer responsible only for rendering. Must not contain business logic. Interacts with hooks for behavior.                          |
| **Context Enrichment** | AI preprocessing step where request is enriched with domain context (FeatureModel, Polygon, Map interactions) before generating code. |
| **CRAG Awareness**     | AI must ensure generated logic is valid, relevant, and complete. Poor implementations must be avoided through structured generation.  |

---

## D

| Term                 | Definition                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Draw Interaction** | OpenLayers interaction used to create polygon features. Must be toggled dynamically to avoid conflicts with edit mode. |
| **Delete Operation** | Removal of polygon feature from vector source. Must be handled via service layer to ensure consistency.                |

---

## E

| Term                | Definition                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Edit Mode**       | A controlled state where polygon modification is enabled. Must be explicitly toggled via UI (button-based activation).                |
| **Event Lifecycle** | The lifecycle of map interactions (draw, modify, select). Must be managed via hooks to prevent memory leaks and redundant re-renders. |

---

## F

| Term              | Definition                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| **FeatureModel**  | Core domain entity representing a mapped polygon. Includes id, owner, geometry, **area (in acres)**, and metadata. |
| **Field Mapping** | The process of defining land boundaries using polygon drawing tools.                                               |

---

## G

| Term           | Definition                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| **Guardrails** | Rules applied to AI-generated code to enforce architecture, prevent invalid logic, and ensure token efficiency. |

---

## H

| Term     | Definition                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Hook** | Logic abstraction layer managing state, lifecycle, and interactions. Ensures separation of concerns and reusable behavior. |

---

## I

| Term                    | Definition                                                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Interaction Manager** | Internal abstraction controlling OpenLayers interactions (Draw, Modify, Select). Prevents multiple active conflicting interactions. |

---

## L

| Term               | Definition                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Loose Coupling** | Architectural principle where UI, logic, and services are independent. Ensures scalability and maintainability. |

---

## M

| Term                   | Definition                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **MapFactory**         | Core abstraction responsible for initializing map instances. Ensures centralized control over map configuration. |
| **Modify Interaction** | OpenLayers interaction used for editing polygon geometry. Activated only in edit mode.                           |

---

## O

| Term                | Definition                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Ownership Label** | Metadata attached to a polygon feature indicating the owner. Displayed via popup or overlay along with area in acres. |

---

## P

| Term                | Definition                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Polygon Feature** | A geometric representation of a field boundary. Core unit of interaction in the system.                                  |
| **Popup System**    | UI overlay used for feature actions (save, edit, delete, and display **area in acres**). Triggered on feature selection. |

---

## R

| Term                     | Definition                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| **Runtime Optimization** | Techniques used to reduce unnecessary computations, re-renders, and interaction recreations. |
| **Reusable Logic**       | Code written in hooks/services to avoid duplication and improve maintainability.             |

---

## S

| Term                 | Definition                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Service Layer**    | Business logic layer handling operations like create, update, delete, area calculation, and validation of features. |
| **SOLID Principles** | Design principles ensuring modular, maintainable, and scalable code architecture.                                   |
| **State Management** | Controlled handling of UI and interaction states (draw mode, edit mode).                                            |

---

## T

| Term                   | Definition                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Token Optimization** | AI generation strategy to minimize unnecessary output, reduce redundancy, and improve efficiency. |
| **Toggle Interaction** | Mechanism to enable/disable map interactions dynamically (draw/edit modes).                       |

---

## V

| Term              | Definition                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| **Vector Source** | Data source storing polygon features in OpenLayers. Acts as the single source of truth for map data. |

---

## W

| Term         | Definition                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------- |
| **Workflow** | Structured process: User Action → Hook → Service → Area Calculation → Map Update → UI Render. |

---

## Technology & Library Quick Reference

| Technology              | Category           | Usage in Platform                      |
| ----------------------- | ------------------ | -------------------------------------- |
| **Next.js**             | Frontend Framework | UI rendering and routing               |
| **OpenLayers**          | GIS Library        | Map rendering and polygon interactions |
| **TypeScript**          | Language           | Type safety and scalable architecture  |
| **React Hooks**         | UI Logic           | State and lifecycle management         |
| **PostgreSQL (future)** | Database           | Feature storage and retrieval          |
| **AI (Claude/Copilot)** | Code Generation    | Token-optimized feature development    |

---

## Acronym Index

| Acronym | Expansion                              |
| ------- | -------------------------------------- |
| GIS     | Geographic Information System          |
| OOP     | Object-Oriented Programming            |
| SOLID   | Design Principles for scalable systems |
| UI      | User Interface                         |
| API     | Application Programming Interface      |
| CRUD    | Create, Read, Update, Delete           |
