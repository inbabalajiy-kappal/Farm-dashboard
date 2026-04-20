# US-001: Create Field Polygon on Map

**Epic**: E01-Field Management | **Sprint**: S1 | **Priority**: P0 | **Story Points**: 8  
**Status**: 🔴 Not Started | **Completion**: 0% | **Dependencies**: None

---

## Agent Context

| Attribute | Value |
|-----------|-------|
| **Layer** | Presentation → Application → Domain |
| **Domain** | Field Layout, Map Interaction, GIS |
| **Interfaces** | `IPolygonService`, `IMapInteraction`, `IFieldRepository` |
| **Config Vars** | `MAP_DEFAULT_ZOOM`, `MAP_CENTER`, `POLYGON_SNAP_DISTANCE` |
| **Prereqs** | DATABASE-SCHEMA.md, FARMMAP ARCHITECTURE.md, web-app-guidelines.md |

---

## User Story

**As a** Farmer  
**I want to** Draw a field polygon on the map by clicking points  
**so that** I can define field boundaries and get accurate acreage calculations

| Field | Value |
|-------|-------|
| **BRD §** | §3.2 — Field Boundary Mapping |
| **Business Value** | Enables accurate field tracking, essential for farm planning and compliance |
| **Current State** | No field mapping capability exists |
| **Problem** | Farmers manually estimate field sizes; error-prone and time-consuming |
| **Solution** | Interactive map with polygon drawing (OpenLayers Draw interaction) |

---

## Acceptance Criteria

### Functional (GIVEN-WHEN-THEN)

| ID | Criterion | Test Type |
|----|-----------|-----------|
| AC-1 | GIVEN user on FieldMap component WHEN clicks "Draw Polygon" button THEN Draw interaction activates and cursor changes to crosshair | UI |
| AC-2 | GIVEN Draw mode active WHEN user clicks map points (min 3) THEN polygon is drawn with vertices visible and editable | UI |
| AC-3 | GIVEN polygon has 3+ vertices WHEN user double-clicks or presses Enter THEN polygon is finalized and saved to database | Integration |
| AC-4 | GIVEN polygon saved THEN area_sq_meters and area_acres auto-calculated by trigger and displayed to user | Integration |
| AC-5 | GIVEN invalid polygon (self-intersecting) THEN validation error shown inline, user cannot save | Unit |
| AC-6 | GIVEN user presses Escape WHEN drawing THEN drawing cancelled and no data saved | UI |

### Non-Functional

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Map render on polygon draw | < 200ms |
| Multi-Tenancy | `org_id` filter enforced on all queries | Guaranteed |
| Observability | OTel spans for polygon save operation | trace_id linked |
| Error Handling | Invalid geometry → user-friendly message | Standardized |
| Security | User can only draw in authorized farms | org_id validation |
| Accuracy | Polygon coordinates stored as WGS84 EPSG:4326 | PostGIS validated |

---

## Technical Specification

### Interfaces (Domain Layer)

```typescript
// modules/field-layout/services/PolygonService.ts
export interface IPolygonService {
  createPolygon(request: CreatePolygonRequest, orgId: UUID): Promise<FieldPolygon>
  validatePolygonGeometry(coordinates: [number, number][]): ValidationResult
  calculateArea(coordinates: [number, number][]): CalculatedArea
}

interface CreatePolygonRequest {
  farmId: UUID
  name: string
  coordinates: [number, number][]  // [lng, lat]
  soilType?: string
}

interface FieldPolygon {
  id: UUID
  farmId: UUID
  name: string
  areaSqMeters: number
  areaAcres: number
  polygon: GeoJSON.Polygon
  createdAt: Date
}
```

### Schemas (React Hook Form)

```typescript
// modules/field-layout/components/FieldPolygonForm.tsx
interface PolygonFormData {
  name: string
  coordinates: [number, number][]
  soilType?: string
  description?: string
}

const schema = z.object({
  name: z.string().min(1, "Field name required"),
  coordinates: z.array(z.tuple([z.number(), z.number()]))
    .min(3, "Minimum 3 points required"),
  soilType: z.string().optional(),
})
```

### Data Layer

| Table | Change | Description | Migration |
|-------|--------|-------------|-----------|
| `field_polygons` | No change | Uses existing table with auto-calcs | N/A |
| `audit_events` | INSERT | Log polygon creation | 001_initial_schema.sql |

### UI Components

```typescript
// modules/field-layout/components/FieldMap.tsx
export function FieldMap({ farmId }: { farmId: UUID }) {
  const [drawMode, setDrawMode] = useState(false)
  const mapRef = useRef<Map>(null)
  const { createPolygon, isLoading } = useCreatePolygon()

  const handleDrawStart = () => {
    const map = mapRef.current
    const drawInteraction = new Draw({
      source: vectorSource,
      type: 'Polygon',
    })
    
    drawInteraction.on('drawend', (event) => {
      const geom = event.feature.getGeometry() as Polygon
      const coords = geom.getCoordinates()[0]
      
      const polygonData: PolygonFormData = {
        name: `Field-${Date.now()}`,
        coordinates: coords as [number, number][],
      }
      
      createPolygon({ farmId, ...polygonData })
    })
    
    map.addInteraction(drawInteraction)
  }

  return (
    <div className="map-container">
      <div ref={mapRef} className="map" />
      <button onClick={handleDrawStart} disabled={isLoading}>
        Draw Polygon
      </button>
    </div>
  )
}
```

### Dependencies (DI)

```
FieldMap (Component)
├── useCreatePolygon (Hook)
│   ├── PolygonService (Domain)
│   │   ├── FieldRepository (Data)
│   │   └── GeometryValidator (Domain)
│   └── useFieldStore (Zustand)
└── OpenLayers Map instance
```

### API Endpoint

| Method | Endpoint | Request | Response | Auth |
|--------|----------|---------|----------|------|
| POST | `/api/v1/fields` | `CreatePolygonRequest` | `FieldPolygon` | Bearer - User in farm |

---

## Business Logic

### Rules

| # | Rule | Enforcement |
|---|------|-------------|
| 1 | Polygon must have minimum 3 vertices | Validation in PolygonService |
| 2 | Polygon cannot self-intersect | PostGIS ST_IsValid() check |
| 3 | Area auto-calculated on save (trigger) | Database trigger |
| 4 | User must own farm to create fields in it | Repository query filter by user_teams |

### Flow (Sequence)

```
User clicks "Draw Polygon"
      ↓
Activate OpenLayers Draw Interaction
      ↓
User clicks map points (3+ min)
      ↓
User confirms (double-click or Enter)
      ↓
Extract coordinates from drawn geometry
      ↓
Validate: 1) Min 3 points 2) No self-intersection
      ↓
POST to /api/v1/fields with coordinates
      ↓
Backend: Save to DB (trigger auto-calcs area)
      ↓
Return created polygon + calculated acreage
      ↓
Update map with new field + refresh field list
      ↓
Show success toast: "Field created: 125.5 acres"
```

### Edge Cases

| Case | Behaviour | Test |
|------|-----------|------|
| User draws only 2 points then tries to save | "Minimum 3 points required" error | Unit |
| Polygon self-intersects (figure-8 shape) | "Invalid polygon geometry" error | Unit |
| Network error during save | Retry 3x, then "Save failed" message | Integration |
| Map zoomed very far out (world view) | Coordinates still accurate (EPSG:4326) | Unit |
| User draws outside farm bounds | Allow (farms can have non-contiguous areas) | Unit |

---

## Sub-Task Breakdown

| Sub-task | Scope | Estimate |
|----------|-------|----------|
| (a) Setup OpenLayers Draw interaction | Map interaction layer | 2pt |
| (b) Build PolygonService with validation | Domain logic | 3pt |
| (c) Implement FieldRepository.save() | Data layer | 2pt |
| (d) Create DrawPolygonForm component | UI form | 1pt |

---

## Test Specifications

### Matrix

| Type | Scope | Location | Mocks |
|------|-------|----------|-------|
| Unit | Validation, geometry | `tests/polygon.test.ts` | FakeRepository |
| Integration | API, DB trigger | `tests/integration/fields.test.ts` | testcontainers |
| Component | FieldMap draw UI | `tests/components/FieldMap.test.tsx` | Mock Map |

### Cases

**Happy Path**:
- [x] Draw 5-point polygon → area calculated & saved

**Validation**:
- [x] 2 points → "Minimum 3 required"
- [x] Self-intersecting → "Invalid geometry"
- [x] Missing name → validation error

**Errors**:
- [x] DB timeout → user message + retry
- [x] Map initialization fails → fallback view

**Multi-Tenant**:
- [x] User A draws in Farm A ✓
- [x] User A tries Farm B (not in team) ✗ 403

### Coverage

| Scope | Target |
|-------|--------|
| PolygonService | 100% |
| FieldRepository | 90%+ |
| UX (edge cases) | 85%+ |

---

## Implementation Phases

### Phase 1: Foundation
- [ ] T1.1: Review DATABASE-SCHEMA.md (polygon table + trigger)
- [ ] T1.2: Define IPolygonService interface
- [ ] T1.3: Create Pydantic/TypeScript schemas
- [ ] ✓ Gate: `npm run type-check` passes

### Phase 2: Tests (Red)
- [ ] T2.1: Write unit tests for geometry validation
- [ ] T2.2: Write PolygonService tests (min 3 points, no self-intersection)
- [ ] T2.3: Write API tests (POST /fields)
- [ ] ✓ Gate: All new tests FAIL

### Phase 3: Implementation (Green)
- [ ] T3.1: Implement GeometryValidator (coordinates → valid polygon)
- [ ] T3.2: Implement PolygonService.createPolygon()
- [ ] T3.3: Implement FieldRepository.save()
- [ ] T3.4: Create API route POST /api/v1/fields
- [ ] T3.5: Build FieldMap component with Draw interaction
- [ ] ✓ Gate: All tests pass

### Phase 4: Integration
- [ ] T4.1: E2E test (draw → DB save → area calc)
- [ ] T4.2: Add OTel spans (polygon save duration)
- [ ] T4.3: Verify multi-tenant isolation
- [ ] T4.4: Performance check (< 200ms map render)

### Phase 5: Quality Gate
```bash
npm test -- --coverage --coverageThreshold='{"global":{"lines":85}}'
npm run lint
npm run type-check
```
- [ ] T5.1: Coverage ≥ 85%
- [ ] T5.2: Manual test on map
- [ ] T5.3: Update user-stories-status.csv

---

## Definition of Done

| Category | Criteria |
|----------|----------|
| **Functional** | All AC met, polygon saves with auto-calculated area |
| **TDD** | Tests written first, all pass |
| **Architecture** | Clean separation: Component → Hook → Service → Repo |
| **Types** | `npm run type-check` clean, no `any` |
| **Lint** | `npm run lint` passes |
| **Coverage** | 85%+ overall, 100% validation logic |
| **Multi-Tenant** | `org_id` validated, user team-checked |
| **Observability** | OTel span for polygon creation |
| **Security** | No SQL injection (Prisma parameterized), no XSS |

---

## Progress

```
Status: 🔴 Not Started | Phase: 1 | Tasks: 0/20 | Coverage: 0%
Blockers: None
Next: T1.1 - Review schema
```

**Last Updated**: April 19, 2026
