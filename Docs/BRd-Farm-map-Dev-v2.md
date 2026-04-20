---
description: "Production-ready feature development prompt for FarmMap-Dev: Complete business requirements, architecture patterns, and code guidelines"
tags: ["feature-request", "code-generation", "business-requirements"]
---

# FarmMap-Dev: Feature Development Prompt

**Document Version**: 1.0.0 | **Last Updated**: April 17, 2026 | **Status**: Production-Ready  
**Purpose**: Centralized prompt for generating new features with consistent quality, architecture, and business requirements  
**Scope**: Feature development, component creation, service layer, API integration

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Application Overview](#application-overview)
3. [Business Requirements](#business-requirements)
4. [Technical Stack](#technical-stack)
5. [Architecture & Design Patterns](#architecture--design-patterns)
6. [Module Structure](#module-structure)
7. [Coding Guidelines](#coding-guidelines)
8. [Component Architecture](#component-architecture)
9. [Service Layer Architecture](#service-layer-architecture)
10. [Type Safety Standards](#type-safety-standards)
11. [Current Features](#current-features)
12. [Feature Development Workflow](#feature-development-workflow)
13. [Quality Checklist](#quality-checklist)

---

## Executive Summary

**FarmMap-Dev** is a production-grade **GIS (Geographic Information System) web application** built with Next.js, React, and OpenLayers. It enables agricultural users to:

- **Draw and manage farm field polygons** on an interactive map
- **Assign ownership** to polygons via modal interfaces
- **Edit polygon geometry** and metadata
- **Delete and manage** polygons efficiently
- **Visualize field layouts** with color-coded ownership

**Core Purpose**: Streamline farm field digitization and management through intuitive map-based interactions.

**Architecture Philosophy**: 
- ✅ Modular, feature-based organization
- ✅ SOLID principles and OOP patterns
- ✅ Clean separation of concerns (UI, Business Logic, Services, Models)
- ✅ Enterprise-grade code quality
- ✅ Extensible and maintainable

---

## Application Overview

### What is FarmMap-Dev?

FarmMap-Dev is a **farm field management platform** that combines:

| Component | Purpose |
|-----------|---------|
| **Interactive Map** | OpenLayers-based GIS frontend with polygon drawing/editing |
| **Polygon Manager** | CRUD operations for field polygons |
| **Ownership System** | Assign and manage field owners |
| **Layer Management** | Vector layers for field visualization |
| **UI Components** | Modals, controls, and user interaction elements |

### Key User Workflows

#### 1️⃣ **Draw Field Polygon**
```
User clicks "Draw Mode" 
→ Click map to place vertices 
→ Double-click to complete polygon 
→ Modal prompts for owner name 
→ Polygon saved with ownership
```

#### 2️⃣ **Edit Polygon**
```
User clicks "Edit Mode" 
→ Select polygon on map 
→ Drag vertices to reshape 
→ Auto-saves geometry changes
```

#### 3️⃣ **Manage Ownership**
```
User clicks polygon 
→ Modal displays current owner 
→ Update owner name 
→ Save changes
```

#### 4️⃣ **Delete Polygon**
```
User selects polygon 
→ Click "Delete" button 
→ Confirm deletion 
→ Polygon removed from map and database
```

---

## Business Requirements

### Functional Requirements

#### FR-1: Map Interaction
- **Draw Tool**: Enable users to draw polygons by clicking vertices on the map
- **Edit Tool**: Modify existing polygon geometry by dragging vertices
- **Selection**: Click polygons to select and display information
- **Zoom & Pan**: Standard map navigation functionality
- **Layer Toggle**: Show/hide different field layers

**Acceptance Criteria**:
- ✅ Draw tool creates valid polygon geometries
- ✅ Edit tool updates polygon coordinates in real-time
- ✅ Selection highlights active polygon
- ✅ Map maintains state during interactions

#### FR-2: Polygon Ownership Management
- **Assign Owner**: Prompt user for owner name when polygon is drawn
- **Edit Owner**: Change owner of existing polygon
- **Display Owner**: Show owner name on polygon label
- **Owner Search**: Search polygons by owner name

**Acceptance Criteria**:
- ✅ Owner modal appears after polygon creation
- ✅ Owner data persists across sessions
- ✅ Multiple polygons can have same owner
- ✅ Owner field is required (non-empty)

#### FR-3: Polygon Management (CRUD)
- **Create**: New polygons via draw tool
- **Read**: List and retrieve polygon data
- **Update**: Modify geometry, owner, metadata
- **Delete**: Remove polygons with confirmation

**Acceptance Criteria**:
- ✅ All CRUD operations preserve data integrity
- ✅ Deleted polygons removed from map and storage
- ✅ Updates reflected in real-time
- ✅ Undo/redo support (future)

#### FR-4: Data Persistence
- **Local Storage**: Cache polygons in browser storage
- **Database**: Persist data to backend (future)
- **Session Recovery**: Restore polygons on page reload
- **Export**: GeoJSON export capability (future)

**Acceptance Criteria**:
- ✅ Polygons survive browser refresh
- ✅ Multiple sessions isolated by user
- ✅ Data format compatible with GIS standards

#### FR-5: Visual Design
- **Color Coding**: Differentiate polygons by owner
- **Labels**: Display owner name on polygon
- **Hover Effects**: Highlight polygon on hover
- **Mobile Responsive**: Work on tablets and desktops

**Acceptance Criteria**:
- ✅ Polygons visually distinct by ownership
- ✅ UI responsive to different screen sizes
- ✅ Touch interactions work on mobile devices

### Non-Functional Requirements

#### NFR-1: Performance
- **Map Rendering**: <100ms for 1000 polygons
- **Interaction Latency**: <50ms response to user actions
- **Memory Usage**: <50MB for typical session
- **Bundle Size**: Keep main bundle <500KB

**Acceptance Criteria**:
- ✅ FCP (First Contentful Paint): <2s
- ✅ LCP (Largest Contentful Paint): <3s
- ✅ Smooth 60fps interactions

#### NFR-2: Scalability
- **Polygon Limit**: Support 10,000+ polygons
- **Concurrent Users**: Handle 1000+ concurrent sessions
- **Data Volume**: Scale to regional/national maps
- **API Throughput**: >1000 requests/second

**Acceptance Criteria**:
- ✅ No performance degradation up to limit
- ✅ Graceful error handling at capacity

#### NFR-3: Reliability
- **Uptime**: 99.5% availability
- **Data Integrity**: Zero data loss
- **Error Handling**: Graceful failure modes
- **Recovery**: Auto-recovery from network issues

**Acceptance Criteria**:
- ✅ User operations are atomic
- ✅ Network errors don't lose user data
- ✅ Clear error messages for users

#### NFR-4: Security
- **Data Validation**: Strict input validation
- **XSS Prevention**: Sanitize all user inputs
- **CSRF Protection**: Token-based requests (future)
- **Authorization**: User-level access control

**Acceptance Criteria**:
- ✅ No SQL injection vulnerabilities
- ✅ No XSS attacks possible
- ✅ Users only access their own data

---

## Technical Stack

### Frontend Technologies

```json
{
  "framework": "Next.js 15.4.6",
  "ui-library": "React 18.3.1",
  "state-management": "Zustand 5.0.8",
  "gis-mapping": "OpenLayers 10.6.1",
  "language": "TypeScript 5.x",
  "css": "Tailwind CSS (planned)",
  "linting": "ESLint 9",
  "package-manager": "npm"
}
```

### Development Tools

```json
{
  "build-server": "Next.js dev server",
  "typescript-strict": true,
  "testing": "Jest + React Testing Library (optional)",
  "formatting": "Prettier",
  "version-control": "Git"
}
```

### Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 8+)

### Environment Configuration

```bash
# Development
NEXT_PUBLIC_MAP_CENTER=78.95,20.59
NEXT_PUBLIC_MAP_ZOOM=10

# Production
NEXT_PUBLIC_API_BASE_URL=https://api.farmmap.io
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## Architecture & Design Patterns

### Architectural Principles

#### 🎯 SOLID Principles

**1. Single Responsibility Principle (SRP)**
- Each class/function has ONE reason to change
- Services handle one domain concern
- Components focus on UI rendering or state management

**Example**: `PolygonService` handles only polygon CRUD; `MapInteractionManager` handles only map interactions

**2. Open/Closed Principle (OCP)**
- Open for extension, closed for modification
- Add features without modifying existing code
- Use inheritance and composition

**Example**: New polygon styles added via `createStyle()` method, not by modifying existing code

**3. Liskov Substitution Principle (LSP)**
- Derived classes must be substitutable for base classes
- Contracts must be honored
- No surprises in subclass behavior

**Example**: All layer types follow same interface contract

**4. Interface Segregation Principle (ISP)**
- Clients don't depend on interfaces they don't use
- Keep interfaces minimal and focused
- Separate concerns explicitly

**Example**: `IPolygonManager` only exposes polygon methods, not map methods

**5. Dependency Inversion Principle (DIP)**
- Depend on abstractions, not concrete implementations
- Use constructor injection
- Favor composition over inheritance

**Example**: Services injected into components, not instantiated directly

#### 🏗️ OOP Concepts

**Encapsulation**
- Hide internal details, expose public interface only
- Use private methods for internal logic
- Properties protected by getters/setters

```typescript
class PolygonManager {
  private _polygons: Feature[] = []
  
  get polygonCount(): number {
    return this._polygons.length
  }
  
  addPolygon(feature: Feature, owner: string): void {
    // Encapsulated logic
  }
}
```

**Abstraction**
- Hide complexity behind simple interfaces
- Users don't need to know implementation details
- Focus on "what" not "how"

```typescript
// User calls simple method
polygonManager.addPolygon(feature, owner)

// Internal complexity hidden
// - Validation, event emission, storage, etc.
```

**Polymorphism**
- Different objects respond to same interface differently
- Enable flexible, extensible code
- Support multiple implementations

```typescript
interface ILayer {
  addFeature(feature: Feature): void
  removeFeature(feature: Feature): void
}

// Multiple implementations
class VectorLayerImpl implements ILayer { }
class GeoJSONLayerImpl implements ILayer { }
```

### Design Patterns

#### Factory Pattern

**Purpose**: Create objects without specifying exact classes

**Implementation**:
```typescript
// core/map/MapFactory.ts
export class MapFactory {
  static create(target: HTMLDivElement): Map {
    return new Map({
      target,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM })
    })
  }
}

// Usage
const map = MapFactory.create(mapElement)
```

**Benefits**:
- ✅ Centralized object creation
- ✅ Easy to mock in tests
- ✅ Consistent configuration

#### Service Layer Pattern

**Purpose**: Encapsulate business logic in reusable services

**Structure**:
```
services/
├── PolygonService.ts       # Polygon CRUD
├── MapInteractionManager   # Map interactions
└── FieldLayerService.ts    # Layer management
```

**Benefits**:
- ✅ Separates business logic from UI
- ✅ Reusable across components
- ✅ Easier testing and maintenance

#### Custom Hook Pattern

**Purpose**: Encapsulate complex component logic in reusable hooks

**Implementation**:
```typescript
// hooks/useFieldMap.ts
export function useFieldMap() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)
  
  const handleDrawComplete = (feature) => {
    // Complex logic here
  }
  
  return { isDrawing, selectedFeature, handleDrawComplete }
}

// Usage in component
function FieldMap() {
  const { isDrawing, handleDrawComplete } = useFieldMap()
}
```

**Benefits**:
- ✅ Keeps components lightweight
- ✅ Reusable logic across components
- ✅ Better testability

#### Observer Pattern

**Purpose**: Notify multiple objects about state changes

**Implementation**:
```typescript
// Events emitted by services
polygonManager.on('polygon:created', (polygon) => {
  updateUI(polygon)
  persistToStorage(polygon)
})

polygonManager.on('polygon:deleted', (polygon) => {
  removeFromUI(polygon)
  removeFromStorage(polygon)
})
```

**Benefits**:
- ✅ Loose coupling between components
- ✅ Multiple subscribers to events
- ✅ Reactive state management

---

## Module Structure

### Recommended Folder Organization

```
farmmap-dev/
├── app/                                    # Next.js routes
│   ├── layout.tsx                          # Root layout
│   └── page.tsx                            # Home page
│
├── modules/                                # Feature modules
│   ├── field-layout/                       # Field layout feature
│   │   ├── components/
│   │   │   ├── FieldMap.tsx               # Main map container
│   │   │   ├── PolygonOwnerModal.tsx      # Owner assignment modal
│   │   │   ├── LayerToggle.tsx            # Layer visibility toggle
│   │   │   └── MapControls.tsx            # Draw, edit, delete buttons
│   │   │
│   │   ├── services/
│   │   │   ├── PolygonService.ts          # Polygon CRUD operations
│   │   │   ├── FieldLayerService.ts       # Vector layer management
│   │   │   └── MapInteractionManager.ts   # Draw/modify interactions
│   │   │
│   │   ├── hooks/
│   │   │   ├── useFieldMap.ts             # Map initialization & state
│   │   │   ├── useDraw.ts                 # Draw interaction logic
│   │   │   └── usePolygonManager.ts       # Polygon management
│   │   │
│   │   ├── models/
│   │   │   └── FieldPolygon.model.ts      # Data model & validation
│   │   │
│   │   └── constants/
│   │       └── field-layout.constants.ts  # Feature-specific constants
│   │
│   └── shared/                            # Shared utilities & components
│       ├── components/
│       │   ├── Modal.tsx                  # Reusable modal
│       │   ├── Button.tsx                 # Reusable button
│       │   └── Input.tsx                  # Reusable input
│       │
│       ├── constants/
│       │   └── map.constants.ts           # Global map constants
│       │
│       └── utils/
│           ├── geometry.util.ts           # Geometry calculations
│           └── validation.util.ts         # Input validation
│
├── core/                                   # Core abstractions
│   └── map/
│       ├── MapFactory.ts                  # Map creation factory
│       ├── InteractionFactory.ts          # Interaction creation factory
│       ├── ProjectionService.ts           # Coordinate transformations
│       └── LayerFactory.ts                # Layer creation factory
│
├── types/                                  # Global type definitions
│   ├── map.types.ts                       # Map-related types
│   ├── polygon.types.ts                   # Polygon-related types
│   └── common.types.ts                    # Common types
│
├── store/                                  # Global state (Zustand)
│   ├── map.store.ts                       # Map state
│   └── polygon.store.ts                   # Polygon state
│
├── public/                                 # Static assets
│   └── images/
├── styles/                                 # Global styles
│   └── globals.css
│
├── next.config.ts                         # Next.js configuration
├── tsconfig.json                          # TypeScript configuration
├── package.json                           # Dependencies
└── README.md                              # Project documentation
```

### Module Naming Conventions

- **Components**: PascalCase (e.g., `FieldMap.tsx`, `LayerToggle.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useFieldMap.ts`)
- **Services**: PascalCase with `Service` suffix (e.g., `PolygonService.ts`)
- **Models**: PascalCase with `.model.ts` suffix (e.g., `FieldPolygon.model.ts`)
- **Constants**: camelCase with `.constants.ts` suffix (e.g., `map.constants.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `map.types.ts`)
- **Utilities**: camelCase with `.util.ts` suffix (e.g., `geometry.util.ts`)

---

## Coding Guidelines

### TypeScript Standards

#### ✅ Always Use Explicit Types

```typescript
// ✅ GOOD: Explicit types
function addPolygon(feature: Feature, owner: string): void {
  // ...
}

const polygons: Feature[] = []

// ❌ AVOID: Any types
function addPolygon(feature: any, owner: any): any {
  // ...
}

const polygons: any = []
```

#### ✅ Use Union Types for Clarity

```typescript
// ✅ GOOD: Clear possible values
type DrawMode = 'draw' | 'modify' | 'select' | null

interface IMapState {
  mode: DrawMode
  selectedFeature: Feature | null
}

// ❌ AVOID: String literals
interface IMapState {
  mode: string
  selectedFeature: any
}
```

#### ✅ Leverage Readonly When Appropriate

```typescript
// ✅ GOOD: Immutable props
interface IPolygonProps {
  readonly feature: Feature
  readonly owner: string
  readonly onDelete: () => void
}

// ❌ AVOID: Mutable props
interface IPolygonProps {
  feature: Feature
  owner: string
  onDelete: () => void
}
```

### Naming Conventions

| Category | Pattern | Example |
|----------|---------|---------|
| **Components** | PascalCase | `FieldMap`, `PolygonOwnerModal` |
| **Hooks** | `use` + PascalCase | `useFieldMap`, `useDraw` |
| **Services** | PascalCase + `Service` | `PolygonService`, `LayerService` |
| **Functions** | camelCase | `handleDrawComplete`, `addPolygon` |
| **Variables** | camelCase | `mapInstance`, `selectedFeature` |
| **Constants** | UPPER_SNAKE_CASE | `DEFAULT_ZOOM`, `MAP_CENTER` |
| **Interfaces** | `I` + PascalCase | `IPolygonManager`, `ILayerService` |
| **Types** | PascalCase | `FieldPolygon`, `DrawMode` |
| **Enums** | PascalCase | `InteractionType`, `PolygonStatus` |

### Function Design

#### ✅ Keep Functions Small (≤20 lines)

```typescript
// ✅ GOOD: Single responsibility
function createPolygonStyle(owner: string): Style {
  const color = getColorByOwner(owner)
  return new Style({
    fill: new Fill({ color }),
    stroke: new Stroke({ color, width: 2 })
  })
}

// ❌ AVOID: Too long, multiple responsibilities
function processPolygon(feature, owner, validate, save, emit) {
  // 50+ lines...
}
```

#### ✅ Use Descriptive Names

```typescript
// ✅ GOOD
function handleDrawInteractionComplete(feature: Feature): void {
  // ...
}

// ❌ AVOID
function handle(f): void {
  // ...
}
```

#### ✅ Return Early for Clarity

```typescript
// ✅ GOOD: Early return avoids nesting
function addPolygon(feature: Feature, owner: string): void {
  if (!feature) throw new Error('Feature required')
  if (!owner) throw new Error('Owner required')
  
  // Happy path here
  this._polygons.push(feature)
}

// ❌ AVOID: Deep nesting
function addPolygon(feature: Feature, owner: string): void {
  if (feature) {
    if (owner) {
      this._polygons.push(feature)
    }
  }
}
```

### Error Handling

#### ✅ Use Try-Catch for Async Operations

```typescript
// ✅ GOOD
try {
  const response = await fetchPolygons()
  setPolygons(response.data)
} catch (error) {
  console.error('Failed to fetch polygons:', error)
  setError('Unable to load polygons')
}

// ❌ AVOID: Unhandled promises
fetchPolygons().then(/* ... */).catch(/* silence error */)
```

#### ✅ Validate Input Early

```typescript
// ✅ GOOD: Input validation
function updatePolygonOwner(polygonId: string, owner: string): void {
  if (!polygonId?.trim()) {
    throw new Error('Polygon ID is required')
  }
  if (!owner?.trim()) {
    throw new Error('Owner is required')
  }
  // Proceed with update
}

// ❌ AVOID: No validation
function updatePolygonOwner(polygonId: string, owner: string): void {
  // Could receive empty values
}
```

### Code Organization

#### ✅ Group Related Code

```typescript
// ✅ GOOD: Related code together
export class PolygonManager {
  // Properties grouped
  private _polygons: Feature[] = []
  private _selectedFeature: Feature | null = null
  
  // Public methods
  public addPolygon(feature: Feature, owner: string): void { }
  public deletePolygon(feature: Feature): void { }
  
  // Private methods
  private _validatePolygon(feature: Feature): void { }
  private _createStyle(owner: string): Style { }
}

// ❌ AVOID: Random grouping
export class PolygonManager {
  private _validatePolygon() { }
  public addPolygon() { }
  private _createStyle() { }
  public deletePolygon() { }
}
```

#### ✅ Use Consistent Import Order

```typescript
// ✅ GOOD: Imports organized
// 1. External libraries
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Map, View } from 'ol'

// 2. Internal modules
import { MapFactory } from '@/core/map/MapFactory'
import { PolygonService } from '../services/PolygonService'

// 3. Types
import type { FieldPolygon } from '@/types/polygon.types'

// 4. Styles
import styles from './FieldMap.module.css'
```

---

## Component Architecture

### Component Classification

#### 1️⃣ Presentational Components

**Purpose**: Render UI only, no business logic

**Characteristics**:
- Pure functions
- Accept props, render output
- No side effects
- Highly reusable

**Example**:
```typescript
interface IButtonProps {
  readonly label: string
  readonly onClick: () => void
  readonly disabled?: boolean
}

export function Button({ label, onClick, disabled }: IButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
```

#### 2️⃣ Container Components

**Purpose**: Manage state, fetch data, orchestrate business logic

**Characteristics**:
- Stateful components
- Manage complex logic
- Connect services
- Pass data to presentational components

**Example**:
```typescript
export function FieldMap() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [polygons, setPolygons] = useState<Feature[]>([])
  
  useEffect(() => {
    // Fetch data
    const data = PolygonService.getPolygons()
    setPolygons(data)
  }, [])
  
  return (
    <div>
      <MapControls isDrawing={isDrawing} />
      {/* Render polygons */}
    </div>
  )
}
```

#### 3️⃣ Specialized Components

**Modals, Forms, Dialogs**:
- Self-contained logic
- Handle specific interactions
- Typically triggered by events

**Example**:
```typescript
interface IPolygonOwnerModalProps {
  readonly isOpen: boolean
  readonly onSubmit: (owner: string) => void
  readonly onClose: () => void
}

export function PolygonOwnerModal({ isOpen, onSubmit, onClose }: IPolygonOwnerModalProps) {
  const [owner, setOwner] = useState('')
  
  if (!isOpen) return null
  
  return (
    <Modal onClose={onClose}>
      <input 
        value={owner} 
        onChange={(e) => setOwner(e.target.value)} 
      />
      <button onClick={() => onSubmit(owner)}>Submit</button>
    </Modal>
  )
}
```

### Component Best Practices

#### ✅ Use Composition Over Inheritance

```typescript
// ✅ GOOD: Composition
function MapWithControls() {
  return (
    <div>
      <FieldMap />
      <MapControls />
      <LayerToggle />
    </div>
  )
}

// ❌ AVOID: Inheritance
class MapWithControls extends FieldMap {
  render() {
    return super.render() + <MapControls />
  }
}
```

#### ✅ Keep Props Focused

```typescript
// ✅ GOOD: Specific props
interface IPolygonListProps {
  readonly polygons: Feature[]
  readonly onPolygonSelect: (feature: Feature) => void
  readonly onPolygonDelete: (feature: Feature) => void
}

// ❌ AVOID: Too many props
interface IPolygonListProps {
  data: any
  handlers: any
  config: any
}
```

---

## Service Layer Architecture

### Service Design Principles

Each service should:
1. ✅ Have single responsibility
2. ✅ Expose clear public interface
3. ✅ Hide implementation details
4. ✅ Be independently testable
5. ✅ Support dependency injection

### Core Services

#### 1️⃣ PolygonService (CRUD Operations)

**Responsibility**: Manage polygon data lifecycle

```typescript
export class PolygonService {
  private static _polygons: Feature[] = []
  
  static getPolygons(): Feature[] {
    return [...this._polygons] // Return copy
  }
  
  static addPolygon(feature: Feature, owner: string): Feature {
    feature.setProperties({ owner, createdAt: new Date() })
    this._polygons.push(feature)
    return feature
  }
  
  static updatePolygonOwner(feature: Feature, owner: string): void {
    feature.setProperties({ owner })
  }
  
  static deletePolygon(feature: Feature): void {
    const index = this._polygons.indexOf(feature)
    if (index > -1) this._polygons.splice(index, 1)
  }
}
```

**Methods**:
- `getPolygons()`: Retrieve all polygons
- `getPolygonById(id)`: Get specific polygon
- `addPolygon(feature, owner)`: Create polygon
- `updatePolygonOwner(feature, owner)`: Update owner
- `deletePolygon(feature)`: Remove polygon
- `exportAsGeoJSON()`: Export polygons

#### 2️⃣ MapInteractionManager (Map Interactions)

**Responsibility**: Manage draw, modify, select interactions

```typescript
export class MapInteractionManager {
  constructor(
    private map: Map,
    private vectorSource: VectorSource
  ) {}
  
  enableDraw(onComplete: (feature: Feature) => void): void {
    const draw = new Draw({ source: this.vectorSource, type: 'Polygon' })
    draw.on('drawend', (e) => onComplete(e.feature))
    this.map.addInteraction(draw)
  }
  
  disableDraw(): void {
    // Remove draw interaction
  }
  
  enableModify(): void {
    const modify = new Modify({ source: this.vectorSource })
    this.map.addInteraction(modify)
  }
  
  disableModify(): void {
    // Remove modify interaction
  }
}
```

#### 3️⃣ FieldLayerService (Layer Management)

**Responsibility**: Manage vector layers and features

```typescript
export class FieldLayerService {
  private vectorLayer: VectorLayer
  
  constructor(private map: Map) {
    this.vectorLayer = new VectorLayer({
      source: new VectorSource()
    })
    this.map.addLayer(this.vectorLayer)
  }
  
  addFeature(feature: Feature): void {
    this.vectorLayer.getSource().addFeature(feature)
  }
  
  removeFeature(feature: Feature): void {
    this.vectorLayer.getSource().removeFeature(feature)
  }
  
  updateFeatureStyle(feature: Feature, style: Style): void {
    feature.setStyle(style)
  }
}
```

### Service Integration Pattern

```typescript
// How services work together
export function useFieldMap() {
  const mapService = new FieldLayerService(map)
  const interactionManager = new MapInteractionManager(map, vectorSource)
  const polygonService = PolygonService
  
  const handleDrawComplete = (feature: Feature) => {
    // 1. Add to layer
    mapService.addFeature(feature)
    
    // 2. Store in service
    polygonService.addPolygon(feature, owner)
    
    // 3. Update UI
    setPolygons(polygonService.getPolygons())
  }
  
  return { /* hooks and methods */ }
}
```

---

## Type Safety Standards

### Centralized Type Definitions

**File**: `types/map.types.ts`

```typescript
// Base types
export interface FieldPolygon {
  id: string
  coordinates: number[][][]
  owner: string
  createdAt: Date
  updatedAt: Date
}

// Feature properties
export interface PolygonProperties {
  owner: string
  id: string
  area: number
  perimeter: number
}

// Interaction types
export type DrawMode = 'draw' | 'modify' | 'select' | null
export type PolygonStatus = 'active' | 'archived' | 'deleted'

// API responses
export interface IGetPolygonsResponse {
  polygons: FieldPolygon[]
  total: number
}

export interface ICreatePolygonRequest {
  coordinates: number[][][]
  owner: string
}

// Component props
export interface IFieldMapProps {
  readonly initialZoom?: number
  readonly onPolygonCreate?: (polygon: FieldPolygon) => void
  readonly onPolygonDelete?: (polygonId: string) => void
}

export interface IMapControls {
  readonly isDrawing: boolean
  readonly isEditing: boolean
  readonly onDrawToggle: () => void
  readonly onEditToggle: () => void
}
```

### Type Validation Patterns

```typescript
// Runtime type guard
function isFieldPolygon(obj: unknown): obj is FieldPolygon {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'coordinates' in obj &&
    'owner' in obj
  )
}

// Zod for runtime validation
import { z } from 'zod'

const PolygonSchema = z.object({
  id: z.string().uuid(),
  coordinates: z.array(z.array(z.array(z.number()))),
  owner: z.string().min(1),
  createdAt: z.date()
})

type FieldPolygon = z.infer<typeof PolygonSchema>
```

---

## Current Features

### ✅ Implemented Features

#### 1. Interactive Map
- [x] OpenLayers map instance
- [x] OSM tile layer
- [x] Zoom and pan controls
- [x] Initial center and zoom level

#### 2. Polygon Drawing
- [x] Draw interaction
- [x] Multi-click polygon creation
- [x] Double-click to complete
- [x] Visual feedback during drawing

#### 3. Polygon Editing
- [x] Modify interaction
- [x] Drag vertices to reshape
- [x] Geometry updates in real-time

#### 4. Owner Assignment
- [x] Modal dialog for owner input
- [x] Owner name storage
- [x] Owner display on polygon

#### 5. Polygon Management
- [x] Create polygons
- [x] Read/retrieve polygons
- [x] Update owner
- [x] Delete polygons

#### 6. Area Calucation Management
- [x] Idenitfy ARea
- [x] Read/retrieve polygons Mapping 
- [x] Update owner Area on Acre
- [x] Delete the Acre

### 🔄 In-Progress Features

#### 1. Data Persistence
- [ ] Backend API integration
- [ ] Database storage
- [ ] Session recovery

#### 2. Performance Optimization
- [ ] Polygon clustering
- [ ] Lazy loading
- [ ] Virtual scrolling

#### 3. Advanced Features
- [ ] Undo/redo
- [ ] Polygon templates
- [ ] Batch operations

### 📋 Planned Features

#### Phase 2 (Q3 2026)
- [ ] Multi-field workspaces
- [ ] Team collaboration
- [ ] Audit logging
- [ ] Export/import (GeoJSON, Shapefile)
- [ ] Advanced filtering and search
- [ ] Mobile app

#### Phase 3 (Q4 2026)
- [ ] Satellite imagery layers
- [ ] Crop rotation planning
- [ ] Soil type mapping
- [ ] Weather integration
- [ ] Yield analytics

---

## Feature Development Workflow

### Step 1: Plan the Feature

**Define**:
- Feature name and scope
- User workflows
- Technical requirements
- Success criteria

**Example**:
```markdown
## Feature: Polygon Statistics

**Scope**: Display area, perimeter, owner info for each polygon

**Workflows**:
- User clicks polygon → Shows statistics panel
- Statistics auto-update on geometry change

**Technical**:
- GeometryUtil class for calculations
- Statistics service layer
- UI panel component

**Criteria**:
- ✓ Calculations accurate to 0.01%
- ✓ Updates within 100ms
- ✓ Works on 10k+ polygons
```

### Step 2: Create Branch

```bash
# Feature branch naming: feature/<feature-name>
git checkout -b feature/polygon-statistics
```

### Step 3: Implement Components

**Structure**:
```typescript
// 1. Create type definitions
// types/statistics.types.ts

// 2. Create service layer
// modules/field-layout/services/StatisticsService.ts

// 3. Create custom hook
// modules/field-layout/hooks/useStatistics.ts

// 4. Create UI component
// modules/field-layout/components/StatisticsPanel.tsx

// 5. Integrate into FieldMap
// modules/field-layout/components/FieldMap.tsx
```

### Step 4: Add Tests

```typescript
// __tests__/StatisticsService.test.ts
describe('StatisticsService', () => {
  it('calculates polygon area correctly', () => {
    // Test implementation
  })
  
  it('calculates perimeter correctly', () => {
    // Test implementation
  })
})
```

### Step 5: Document

```markdown
// Feature documentation
## Polygon Statistics

### Overview
Displays area and perimeter for each polygon.

### API

#### StatisticsService.getStatistics(feature: Feature)
Returns statistics for a feature.

Returns:
- `area`: number (square meters)
- `perimeter`: number (meters)
- `owner`: string

### Component Props
- `feature`: Feature object
- `onClose`: Callback when panel closes

### Examples
[Code examples here]
```

### Step 6: Code Review

**Checklist**:
- [ ] Follows architecture patterns
- [ ] SOLID principles applied
- [ ] TypeScript strict mode
- [ ] Error handling complete
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No breaking changes

### Step 7: Merge & Deploy

```bash
git push origin feature/polygon-statistics
# Create PR for review
# After approval and tests pass:
git merge --squash feature/polygon-statistics
git push origin main
```

---

## Quality Checklist

### Architecture Quality

- [ ] **Single Responsibility**: Each class/function has one reason to change
- [ ] **Dependency Injection**: Dependencies injected, not instantiated
- [ ] **No Circular Dependencies**: Modules don't create cycles
- [ ] **Layer Separation**: UI, services, types clearly separated
- [ ] **Factory Pattern**: Object creation centralized
- [ ] **Service Layer**: Business logic in services, not components

### Code Quality

- [ ] **Type Safety**: No `any` types, strict mode enabled
- [ ] **Naming**: Descriptive, follows conventions
- [ ] **Function Size**: Functions ≤ 20 lines
- [ ] **DRY**: No code duplication
- [ ] **Error Handling**: Try-catch, validation, error messages
- [ ] **Documentation**: Comments, JSDoc, README

### UI/UX Quality

- [ ] **Responsiveness**: Works on desktop, tablet, mobile
- [ ] **Accessibility**: ARIA labels, keyboard navigation
- [ ] **Performance**: <100ms interactions, 60fps rendering
- [ ] **Visual Design**: Consistent styling, clear hierarchy
- [ ] **Error States**: User-friendly error messages
- [ ] **Loading States**: Feedback during async operations

### Testing Quality

- [ ] **Unit Tests**: Services and utilities tested
- [ ] **Component Tests**: Rendering and interactions tested
- [ ] **Integration Tests**: Feature workflows tested
- [ ] **Coverage**: >80% for critical paths
- [ ] **E2E Tests**: User workflows tested end-to-end
- [ ] **Edge Cases**: Error states, boundary conditions tested

### Documentation Quality

- [ ] **README Updated**: Installation, setup, usage
- [ ] **API Documented**: All public methods documented
- [ ] **Type Definitions**: All types explained
- [ ] **Examples**: Code examples for complex features
- [ ] **Architecture Documented**: Design decisions explained
- [ ] **Changelog Updated**: What's new documented

### Performance Quality

- [ ] **FCP**: <2 seconds (First Contentful Paint)
- [ ] **LCP**: <3 seconds (Largest Contentful Paint)
- [ ] **TTI**: <4 seconds (Time to Interactive)
- [ ] **Bundle Size**: Main bundle <500KB
- [ ] **Memory**: <50MB typical session
- [ ] **Rendering**: 60fps interactions

### Security Quality

- [ ] **Input Validation**: All user inputs validated
- [ ] **XSS Prevention**: No unescaped user input
- [ ] **SQL Injection**: Parameterized queries (if applicable)
- [ ] **Data Privacy**: No sensitive data in logs
- [ ] **CSRF Protection**: Token-based requests
- [ ] **Authentication**: Secure token handling

---

## Development Commands

```bash
# Installation
npm install

# Development server
npm run dev

# Build production
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Testing (when available)
npm run test

# Testing with coverage
npm run test:coverage
```

---

## Support & References

### Internal Documentation
- [FARMMAP-DEV ARCHITECTURE.md](FARMMAP-DEV%20ARCHITECTURE.md) — Detailed architecture patterns
- [copilot_instructions.md](copilot_instructions.md) — Coding standards
- [HOOKS.md](HOOKS.md) — Custom hooks guide
- [API-REFERENCE.md](API-REFERENCE.md) — API contracts

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [OpenLayers Documentation](https://openlayers.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)

### Key Contacts
- **Architecture Questions**: See FARMMAP-DEV ARCHITECTURE.md
- **Code Style Questions**: See copilot_instructions.md
- **API Questions**: See API-REFERENCE.md

---

## Appendix: Prompt Usage Examples

### Example 1: Create New Feature

**User Request**: "Create a feature to display polygon information sidebar"

**Prompt Response** (using this document):
1. Create types for sidebar in `types/sidebar.types.ts`
2. Create `PolygonInfoService.ts` in services
3. Create `usePolygonInfo.ts` hook
4. Create `PolygonInfoSidebar.tsx` component
5. Integrate into `FieldMap.tsx`
6. Follow architecture patterns, SOLID principles, type safety standards

### Example 2: Fix Bug in Drawing Tool

**User Request**: "Users report drawing tool slow on 1000+ polygons"

**Prompt Response** (using this document):
1. Check performance standards (NFR-1)
2. Profile rendering bottleneck
3. Implement polygon clustering (service layer)
4. Optimize feature rendering (component)
5. Add performance tests
6. Document changes

### Example 3: Integrate Backend API

**User Request**: "Add backend API integration for polygon persistence"

**Prompt Response** (using this document):
1. Create API service layer
2. Define API types from API-REFERENCE.md
3. Update PolygonService to call API
4. Add error handling and retry logic
5. Implement data synchronization
6. Add integration tests

---

**Document Status**: ✅ Complete | **Last Updated**: April 17, 2026 | **Maintainer**: Development Team
