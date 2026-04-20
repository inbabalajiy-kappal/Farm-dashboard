---
description: "Define coding standards and principles for Farm-map-Dev"
---

# Copilot Instructions - Farm-map-Dev

## Coding Principles

### SOLID Principles
- **Single Responsibility Principle**: Each module should have one reason to change
- **Open/Closed Principle**: Open for extension, closed for modification
- **Liskov Substitution Principle**: Derived classes should be substitutable for base classes
- **Interface Segregation Principle**: Clients should not depend on interfaces they don't use
- **Dependency Inversion Principle**: Depend on abstractions, not concrete implementations

### DRY (Don't Repeat Yourself)
- Avoid code duplication
- Extract common logic into reusable functions or components
- Maintain single source of truth for each piece of information

### KISS (Keep It Simple, Stupid)
- Write the simplest solution that solves the problem
- Avoid over-engineering and unnecessary complexity
- Favor readability over cleverness

### YAGNI (You Aren't Gonna Need It)
- Don't implement features until they're actually needed
- Avoid speculative generalization
- Focus on current requirements, not hypothetical future needs

### Boy Scout Rule
- Leave the codebase in a better state than you found it
- Clean up technical debt incrementally
- Refactor problematic code when you encounter it
- Fix bugs and improve readability as you go

## Testing Guidelines

### Unit Tests
- **Optional but Recommended**: Write unit tests for critical business logic
- Test pure functions and utility helpers
- Use Jest as the testing framework
- Aim for >80% coverage on critical paths

### Component Tests
- Test React components for expected rendering and interactions
- Use React Testing Library for component testing
- Test component props and state changes

### Integration Tests
- Test feature workflows across multiple components
- Verify API integrations work correctly
- Test user interactions that span multiple components

## Code Quality Standards

### TypeScript Usage
- Use TypeScript for all new code
- Enable strict mode in tsconfig.json
- Avoid `any` types - use proper type annotations

### Code Style
- Follow ESLint configuration
- Use Prettier for code formatting
- Maintain consistent naming conventions (camelCase for variables/functions, PascalCase for components/classes)

### Documentation
- Add JSDoc comments for complex functions
- Document component props and their types
- Keep README files updated

## Design System
- Use **HeroUI** for consistent component styling
- Maintain design system documentation
- Follow component composition patterns defined in HeroUI

## Method/Function Rules

### Function Structure
- **Single Responsibility**: Each method should do one thing well
- **Naming Convention**: Use descriptive verb-based names (calculateAcreage, formatCoordinates, validatePolygon)
- **Parameters**: Keep <3 parameters; use object params for >2 related parameters
- **Return Types**: Always specify explicit return type annotations
- **Pure Functions**: Prefer pure functions that don't modify external state

### Function Documentation
```typescript
/**
 * Calculates total acreage from polygon coordinates
 * @param coordinates - Array of [lat, lng] coordinate pairs
 * @param unit - Unit type ('acres', 'hectares', 'sqm')
 * @returns Total calculated acreage as number
 * @throws Error if coordinates array is empty or invalid
 */
export function calculateAcreage(coordinates: [number, number][], unit: 'acres' | 'hectares' = 'acres'): number {
  // implementation
}
```

### Error Handling in Methods
- Validate all inputs at method entry point
- Throw descriptive errors with context
- Return early to reduce nesting
- Log errors with method name and parameters

### Async Method Patterns
- Use async/await, not `.then()` chains
- Add timeout handling for network calls
- Provide progress callbacks for long operations
- Cancel in-flight requests on unmount

## OpenLayers Integration

### Layer Management
- All map layers defined in `/core/map/LayerFactory.ts`
- Create layers with consistent property structure
- Use layer groups for related feature sets
- Always assign unique layer IDs
- Layer should support toggle, show, hide operations

### Layer Factory Pattern
```typescript
// core/map/LayerFactory.ts
export function createFieldLayer(fields: FieldData[]): VectorLayer {
  const source = new VectorSource()
  const layer = new VectorLayer({
    source,
    properties: {
      id: 'field-layer',
      name: 'Field Boundaries',
      zIndex: 100
    }
  })
  return layer
}
```

### Map Interactions
- Use `InteractionFactory.ts` for all map interactions
- Support Draw (polygon), Modify (edit), Select (highlight)
- Enable interactions based on user mode (view/edit/draw)
- Handle interaction events in callbacks
- Clear interactions when mode changes

### Coordinate System
- Use WGS84 (EPSG:4326) for storage and API
- Transform to Web Mercator (EPSG:3857) only for rendering
- Store coordinates as [lng, lat] in GeoJSON format
- Use consistent coordinate ordering throughout

### Map Configuration
```typescript
// core/map/MapFactory.ts
const mapConfig = {
  center: [-95.7134, 37.0842], // [lng, lat]
  zoom: 12,
  projection: 'EPSG:3857',
  layers: [...],
  controls: [...]
}
```

## Polygon Calculation Rules

### Acreage Calculation
- **Algorithm**: Use Haversine formula for accurate Earth-surface distances
- **Latitude/Longitude pairs**: Must be in [lat, lng] order for geo calculations
- **Precision**: Return results rounded to 2 decimal places
- **Units**: Support acres, hectares, square meters conversions
- **Validation**: Check for valid coordinate ranges before calculation

```typescript
// AcreageCalculator.ts
export function calculatePolygonAcreage(coordinates: [number, number][]): number {
  // coordinates: [[lat, lng], [lat, lng], ...]
  if (coordinates.length < 3) throw new Error('Polygon requires minimum 3 points')
  
  const area = calculateSphericalArea(coordinates)
  return convertSquareMetersToAcres(area)
}
```

### Polygon Validation
- Check for minimum 3 coordinates
- Verify polygon is not self-intersecting
- Validate coordinate values (lat: -90 to 90, lng: -180 to 180)
- Ensure polygon is closed (first and last coordinates match)
- Check for clockwise/counterclockwise orientation consistency

### Area Calculation Service
- Service location: `/modules/field-layout/services/AcreageCalculator.ts`
- Return detailed breakdown (gross area, net area, perimeter)
- Cache results on polygon object
- Update cache when polygon changes
- Handle edge cases (very small areas, crossing date line)

## Polygon Editing Rules

### Polygon Editing Workflow
1. **Select Mode**: User clicks polygon to select it
2. **Edit Mode**: Activated on selection, show edit handles
3. **Modify**: User drags vertices or midpoints to adjust
4. **Save**: Persist changes to store and backend
5. **Cancel**: Revert to original coordinates

### Edit Interaction Setup
```typescript
// In FieldMap.tsx or useFieldMap.ts
const setupPolygonEditing = (polygon: Feature) => {
  const modify = new Modify({
    source: vectorSource,
    features: [polygon]
  })
  
  modify.on('modifyend', (event) => {
    const updatedCoords = extractCoordinates(event.feature)
    updatePolygonInStore(updatedCoords)
    recalculateAcreage(updatedCoords)
  })
  
  map.addInteraction(modify)
}
```

### Edit State Management
- Store original coordinates before editing
- Provide undo/redo for polygon changes
- Show real-time acreage updates while editing
- Validate polygon validity on every change
- Disable save button if polygon is invalid

### Edit Constraints
- Prevent self-intersecting polygons
- Set minimum distance between vertices (e.g., 5 meters)
- Limit polygon complexity (max points)
- Disallow dragging vertices outside defined bounds
- Snap to existing vertices if close (<5 meters)

### UI Feedback During Editing
- Highlight currently editing polygon
- Show vertex handles with distinct styling
- Display real-time measurements (acreage, perimeter)
- Show validation errors inline
- Provide visual feedback for snapping operations

### Editing Service Pattern
```typescript
// services/PolygonService.ts
export interface EditPolygonRequest {
  polygonId: string
  newCoordinates: [number, number][]
  validateSnapshot: boolean
}

export async function updatePolygon(request: EditPolygonRequest): Promise<EditPolygonResponse> {
  validatePolygonGeometry(request.newCoordinates)
  const acreage = calculateAcreage(request.newCoordinates)
  return savePolygonChanges(request.polygonId, request.newCoordinates, acreage)
}
```

---

**Effective Date**: April 1, 2026  
**Maintained By**: Farm-map-Dev
