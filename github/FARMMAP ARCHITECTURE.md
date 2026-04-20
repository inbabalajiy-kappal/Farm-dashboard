---
description: "Production-ready prompt for FarmMap-Dev: Modular GIS tool with clean architecture, SOLID principles, and OOP patterns for polygon management and mapping"
---

# FarmMap-Dev Project Prompt

**Document Version**: 1.0.0 | **Last Updated**: April 15, 2026 | **Status**: Production-Ready  
**Token Optimized**: Yes | **Extensible**: Yes | **Test Coverage**: Required

---

## Executive Summary

FarmMap-Dev is a modular GIS application built with **Next.js**, **OpenLayers**, and **React**. It enables users to:
- Draw polygons on an interactive map
- Manage polygon ownership via modal interfaces
- Edit polygon geometry and metadata
- Delete polygons cleanly from data storage

**Architecture**: Modular with separation of concerns (UI, Business Logic, Services, Models)  
**Code Quality**: Enterprise-grade with SOLID principles and OOP patterns  
**Performance**: Optimized rendering with reusable services and proper cleanup

---


## Project Structure (Modular)

```
farmmap-dev/
├── modules/field-layout/              # Feature module
│   ├── components/
│   │   ├── FieldMap.tsx               # Main map container
│   │   ├── PolygonOwnerModal.tsx       # Modal for owner input
│   │   └── MapControls.tsx             # UI buttons for interactions
│   ├── services/
│   │   ├── PolygonManager.ts           # Polygon CRUD operations
│   │   ├── MapInteractionManager.ts    # Draw/Modify interactions
│   │   └── FieldLayerService.ts        # Vector layer management
│   ├── hooks/
│   │   └── useFieldMap.ts              # Custom hook for map state
│   ├── models/
│   │   └── FieldPolygon.model.ts       # Data model
│   └── constants/
│       └── map.constants.ts            # Feature-specific constants
├── core/map/
│   └── MapFactory.ts                   # Factory pattern for map creation
├── types/
│   └── map.types.ts                    # Type definitions
└── shared/
    └── ui/
        └── Modal.tsx                   # Reusable modal component
```

---

## SOLID Principles Application

### 1️⃣ Single Responsibility Principle

**Each class/function has ONE reason to change:**

```typescript
// ✅ CORRECT: Each service has one responsibility
PolygonManager.ts
  - Responsibility: Create, edit, delete, style polygons
  - Methods: addPolygon(), updatePolygonOwner(), deletePolygon(), createStyle()

MapInteractionManager.ts
  - Responsibility: Manage draw and modify interactions
  - Methods: enableDraw(), disableDraw(), enableModify(), disableModify()

FieldLayerService.ts
  - Responsibility: Manage vector layers and features
  - Methods: createVectorLayer(), addLayer(), removeLayer()
```

**❌ AVOID:**
- Mixing polygon styling with layer management
- UI logic in service classes
- Multiple responsibilities in one function

---

### 2️⃣ Open/Closed Principle

**Open for extension, closed for modification:**

```typescript
// ✅ CORRECT: Extensible via service methods
interface IPolygonStyle {
  fillColor: string;
  strokeColor: string;
  textLabel: string;
}

class PolygonManager {
  createStyle(data: IPolygonStyle): Style {
    return new Style({
      fill: new Fill({ color: data.fillColor }),
      stroke: new Stroke({ color: data.strokeColor }),
      text: new Text({ text: data.textLabel })
    });
  }
}

// Add new feature: Export Polygon
class PolygonExporter {
  exportToGeoJSON(polygon: Feature): GeoJSON { }
}
```

**❌ AVOID:**
- Modifying existing services for new features
- Hardcoding feature logic in components
- String/enum switches for feature toggles

---

### 3️⃣ Liskov Substitution Principle

**Subclasses must be substitutable for base classes:**

```typescript
// ✅ CORRECT: All layer types follow same contract
abstract class BaseLayer {
  abstract addFeature(feature: Feature): void;
  abstract removeFeature(feature: Feature): void;
}

class VectorLayerImpl extends BaseLayer {
  addFeature(feature: Feature) { this.source.addFeature(feature); }
  removeFeature(feature: Feature) { this.source.removeFeature(feature); }
}

// Usage: Works with any BaseLayer implementation
function addPolygon(layer: BaseLayer, polygon: Feature) {
  layer.addFeature(polygon);
}
```

---

### 4️⃣ Interface Segregation Principle

**Clients don't depend on interfaces they don't use:**

```typescript
// ✅ CORRECT: Minimal, focused interfaces
interface IPolygonManager {
  addPolygon(feature: Feature, owner: string): void;
  updatePolygonOwner(feature: Feature, owner: string): void;
  deletePolygon(feature: Feature): void;
}

interface IInteractionManager {
  enableDraw(onComplete: (feature: Feature) => void): void;
  disableDraw(): void;
  enableModify(): void;
  disableModify(): void;
}

// Component only uses what it needs
class FieldMap implements IPolygonManager {
  // ... implementation
}
```

---

### 5️⃣ Dependency Inversion Principle

Depend on abstractions, not concrete implementations:**

```typescript
// ✅ CORRECT: Inject abstractions
class FieldMap {
  constructor(
    private polygonManager: IPolygonManager,
    private interactionManager: IInteractionManager,
    private layerService: IFieldLayerService
  ) {}

  handleDrawComplete(feature: Feature) {
    this.polygonManager.addPolygon(feature, 'New Owner');
  }
}

// ❌ AVOID: Direct instantiation
class FieldMapWrong {
  private polygonManager = new PolygonManager(); // Hard dependency
}
```

---

## OOP Concepts Application

### 🏗️ Encapsulation

Hide internal details, expose controlled interface:**

```typescript
class PolygonManager {
  private vectorSource: VectorSource;
  private polygonStyles: Map<string, Style> = new Map();

  constructor(vectorSource: VectorSource) {
    this.vectorSource = vectorSource;
  }

  // Public interface: controlled access
  addPolygon(feature: Feature, owner: string): void {
    const style = this.createStyle(owner);
    feature.setStyle(style);
    feature.set('owner', owner);
    this.vectorSource.addFeature(feature);
  }

  // Private: hidden from external access
  private createStyle(owner: string): Style {
    return new Style({
      fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      stroke: new Stroke({ color: '#0000FF', width: 2 }),
      text: new Text({ text: `Belongs to ${owner}` })
    });
  }
}
```

---

### 🎯 Abstraction

Hide complexity behind simple interface:

```typescript
class MapInteractionManager {
  private map: Map;
  private drawInteraction: Draw | null = null;
  private modifyInteraction: Modify | null = null;

  // Simple public interface
  enableDraw(vectorSource: VectorSource): void {
    this.drawInteraction = new Draw({ source: vectorSource, type: 'Polygon' });
    this.map.addInteraction(this.drawInteraction);
  }

  disableDraw(): void {
    if (this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction);
      this.drawInteraction = null;
    }
  }

  // Complex logic hidden from users
  private setupInteractionDefaults(): void {
    // ... internal setup
  }
}
```

---

### 🔄 Polymorphism

Different objects, same interface:

```typescript
interface IGeometryGenerator {
  generate(coordinates: [number, number][]): Geometry;
}

class PolygonGenerator implements IGeometryGenerator {
  generate(coords: [number, number][]): Geometry {
    return new Polygon([coords]);
  }
}

class LineStringGenerator implements IGeometryGenerator {
  generate(coords: [number, number][]): Geometry {
    return new LineString(coords);
  }
}

// Use polymorphically
function createFeature(generator: IGeometryGenerator, coords: [number, number][]) {
  const geometry = generator.generate(coords);
  return new Feature({ geometry });
}
```

---

## Clean Code Standards

### Naming Conventions
- Functions: `enableDrawMode`, `updatePolygonOwner`, `calculatePolygonArea`
- Variables: `isDrawingEnabled`, `selectedPolygon`, `vectorSource`
- Classes: `PolygonManager`, `MapInteractionManager`, `FieldLayerService`
- Booleans: `isActive`, `hasOwner`, `canDelete`

### Function Design
- Max 10 lines per function
- Early returns reduce nesting
- One responsibility per function

```typescript
// ✅ CORRECT: Small, focused function
function toggleDrawMode(
  isEnabled: boolean,
  manager: MapInteractionManager,
  source: VectorSource,
  onDrawEnd: (feature: Feature) => void
): void {
  if (isEnabled) {
    manager.enableDraw(source);
  } else {
    manager.disableDraw();
  }
}

// ❌ AVOID: Large, mixed responsibilities
function handleMapClick(event: any, ...manyParams: any[]): void {
  // 50+ lines of business logic, styling, API calls, etc.
}
```

### TypeScript Best Practices
- Use explicit types (no `any`)
- Union types for clarity
- Proper null checking

```typescript
type InteractionMode = 'draw' | 'edit' | 'view';
type PolygonEvent = DrawEndEvent | ModifyEndEvent | ClickEvent;

interface IModalState {
  visible: boolean;
  polygonOwner: string | null;
  mode: 'create' | 'edit';
}
```

---

## Layer Architecture

```
┌─────────────────────────────────────────────┐
│  UI Layer (FrontEnd)                    │
│  - React components                         │
│  - State management (useState, useRef)      │
│  - Event handlers                           │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Business Logic Layer (Services)            │
│  - PolygonManager                           │
│  - MapInteractionManager                    │
│  - FieldLayerService                        │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  Data Layer (Models & Types)                │
│  - FieldPolygon model                       │
│  - Type definitions                         │
│  - Constants                                │
└─────────────────────────────────────────────┘
```

---

## Performance & Optimization

### ✅ DO:
- Create interactions once, reuse via service methods
- Use `useRef` for map instance and interactions
- Memoize expensive calculations
- Clean up interactions on component unmount
- Avoid recreating styles on every render

### ❌ DON'T:
- Create new Draw/Modify interactions on state change
- Recreate styles in render function
- Leak event listeners
- Re-instantiate services repeatedly

```typescript
// ✅ CORRECT: Interaction created once
const interactionManager = useRef<MapInteractionManager | null>(null);

useEffect(() => {
  if (!mapInstanceRef.current) return;
  interactionManager.current = new MapInteractionManager(mapInstanceRef.current);
  
  return () => {
    interactionManager.current?.cleanup();
  };
}, []);

// ❌ AVOID: New interaction on every render
const handleDraw = () => {
  const draw = new Draw({ source, type: 'Polygon' }); // WRONG!
  map.addInteraction(draw);
};
```

---

## Testing Requirements

### Unit Tests
- Test `PolygonManager` methods independently
- Test `MapInteractionManager` state transitions
- Test utility functions

### Integration Tests
- Test polygon creation to storage workflow
- Test interaction switching (draw → edit)
- Test modal interactions

### E2E Tests
- User draws polygon → enters owner → polygon appears with label
- User edits polygon → changes owner → label updates
- User deletes polygon → polygon removed from map

---

## Code Context for Implementation

### When building features:
1. **Define Types First** (`types/map.types.ts`)
2. **Create Service Classes** (`services/`)
3. **Build UI Components** (`components/`)
4. **Add Hooks if needed** (`hooks/`)
5. **Write Tests** alongside code

### Mandatory Checklist
- [ ] Follows SOLID principles
- [ ] Type-safe (no `any`)
- [ ] Single responsibility per function
- [ ] Clear naming conventions
- [ ] Proper error handling
- [ ] No code duplication
- [ ] Proper cleanup on unmount
- [ ] No performance issues
- [ ] Integration tests included

---

## Additional Features (Extensibility Examples)

### 🎯 Feature Templates

#### Export Polygons to GeoJSON
```typescript
class PolygonExporter {
  exportToGeoJSON(features: Feature[]): GeoJSON {
    // Service implementation following same pattern
  }
}
```

#### Import Polygons from GeoJSON
```typescript
class PolygonImporter {
  importFromGeoJSON(geojson: GeoJSON): Feature[] {
    // Service implementation following same pattern
  }
}
```

#### Calculate Polygon Area
```typescript
class PolygonCalculator {
  calculateArea(feature: Feature): number {
    // Business logic encapsulated
  }
}
```

---

## Token Optimization Strategy

**This prompt is designed for token efficiency:**
- Clear sections enable selective reading
- Code examples show patterns, not full implementations
- Flow diagram visualizes entire system
- Principles reference enables quick understanding
- Checklist ensures completeness without redundancy

**Total Context**: ~150 tokens for understanding full system  
**Implementation Time**: ~4-6 hours for complete feature

---

## Summary: Before Writing Code

```typescript
// Template for any new feature:

// 1. Define interface (abstraction)
interface IMyNewFeature {
  execute(): Promise<Result>;
}

// 2. Create service class (encapsulation)
class MyNewFeatureService implements IMyNewFeature {
  async execute(): Promise<Result> {
    // Implementation
  }
}

// 3. Use in component (dependency injection)
function MyComponent() {
  const service = useMemo(() => new MyNewFeatureService(), []);
  // Use service
}
```

---

**Version**: 1.0.0 | **Last Updated**: April 15, 2026 | **Status**: Production-Ready  
**Maintainers**: FarmMap-Dev Team  
**License**: Enterprise
