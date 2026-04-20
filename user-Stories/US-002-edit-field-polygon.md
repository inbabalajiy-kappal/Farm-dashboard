# US-002: Edit Field Polygon & Recalculate Acreage

**Epic**: E01-Field Management | **Sprint**: S1 | **Priority**: P0 | **Story Points**: 5  
**Status**: 🔴 Not Started | **Completion**: 0% | **Dependencies**: US-001

---

## Agent Context

| Attribute | Value |
|-----------|-------|
| **Layer** | Presentation → Application → Domain |
| **Domain** | Field Layout, Polygon Editing, GIS |
| **Interfaces** | `IPolygonService`, `IEditInteraction`, `IPolygonRepository` |
| **Config Vars** | `POLYGON_SNAP_DISTANCE`, `MIN_VERTEX_DISTANCE_M` |
| **Prereqs** | US-001, DATABASE-SCHEMA.md, polygon_edits table |

---

## User Story

**As a** Farmer  
**I want to** Edit field polygon vertices and see acreage update in real-time  
**so that** I can refine boundaries and ensure accuracy

| Field | Value |
|-------|-------|
| **Business Value** | Allows field boundary corrections without recreating entire polygon |
| **Current State** | Polygons are immutable once created |
| **Problem** | Field surveys show incorrect boundaries; user must delete and redraw |
| **Solution** | OpenLayers Modify interaction with real-time area updates |

---

## Acceptance Criteria

### Functional

| ID | Criterion | Test Type |
|----|-----------|-----------|
| AC-1 | GIVEN field polygon on map WHEN user clicks Edit button THEN handles appear at vertices | UI |
| AC-2 | GIVEN edit mode active WHEN user drags vertex THEN polygon updates, acreage recalculates in real-time | UI |
| AC-3 | GIVEN user drags vertex WHEN validation detects self-intersection THEN show error, revert to previous state | UI |
| AC-4 | GIVEN polygon edited WHEN user clicks Save THEN polygon saved to DB as UPDATE, previous version in polygon_edits | Integration |
| AC-5 | GIVEN save succeeds THEN audit event created with user ID and timestamp | Integration |
| AC-6 | GIVEN user presses Escape THEN all changes discarded, polygon reverts | UI |

### Non-Functional

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Real-time area update on drag | < 100ms |
| UX Feedback | Show acreage live while dragging | Visible tooltip |
| Undo/Redo | Support undo of last edit | Browser back |
| Multi-Tenancy | User isolation on edit | org_id checked |

---

## Technical Specification

### Interfaces

```typescript
// modules/field-layout/services/PolygonService.ts
export interface IPolygonEditService {
  updatePolygon(request: UpdatePolygonRequest, orgId: UUID): Promise<PolygonEditResult>
  validateEditGeometry(newCoords: [number, number][], oldCoords: [number, number][]): EditValidation
  getPolygonEditHistory(fieldId: UUID): Promise<PolygonEdit[]>
}

interface UpdatePolygonRequest {
  fieldId: UUID
  newCoordinates: [number, number][]
  changeReason?: string
}

interface PolygonEditResult {
  fieldId: UUID
  previousAreaAcres: number
  newAreaAcres: number
  editId: UUID
  timestamp: Date
}
```

### UI Component

```typescript
// modules/field-layout/components/PolygonEditor.tsx
export function PolygonEditor({ fieldId }: { fieldId: UUID }) {
  const [isEditing, setIsEditing] = useState(false)
  const [liveArea, setLiveArea] = useState<{ sqm: number; acres: number } | null>(null)
  const { updatePolygon } = useUpdatePolygon()

  const handleEditStart = () => {
    const modify = new Modify({
      source: vectorSource,
      features: [polygonFeature],
    })

    modify.on('modifyend', (event) => {
      const geom = event.feature.getGeometry()
      const coords = geom.getCoordinates()[0]
      
      // Real-time area display
      const area = calculateArea(coords)
      setLiveArea(area)
    })

    map.addInteraction(modify)
    setIsEditing(true)
  }

  const handleSave = async () => {
    const result = await updatePolygon({ fieldId, newCoordinates: editedCoords })
    showNotification(`Polygon updated: ${result.newAreaAcres.toFixed(2)} acres`)
  }

  return (
    <div>
      <button onClick={handleEditStart}>Edit Polygon</button>
      {liveArea && <Tooltip>Area: {liveArea.acres} acres</Tooltip>}
      <button onClick={handleSave}>Save Changes</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </div>
  )
}
```

### Data Layer

| Table | Change | Description |
|-------|--------|-------------|
| `field_polygons` | UPDATE | polygon, area_sq_meters, area_acres, updated_at |
| `polygon_edits` | INSERT | Record edit with before/after geometry |
| `audit_events` | INSERT | Log POLYGON_UPDATE event |

### Database Triggers

```sql
-- Existing calculate_polygon_area() still runs on UPDATE
-- Add new trigger to record edit history
CREATE TRIGGER trg_record_polygon_edit
AFTER UPDATE ON field_polygons
FOR EACH ROW
WHEN (OLD.polygon IS DISTINCT FROM NEW.polygon)
EXECUTE FUNCTION record_polygon_edit();

CREATE OR REPLACE FUNCTION record_polygon_edit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO polygon_edits (
    org_id, field_id, edit_type, previous_polygon, new_polygon,
    previous_area_acres, new_area_acres, edited_by_user_id
  )
  VALUES (
    NEW.org_id, NEW.id, 'update',
    OLD.polygon, NEW.polygon,
    OLD.area_acres, NEW.area_acres,
    current_user_id()  -- Set via context
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Edge Cases

| Case | Behaviour | Test |
|------|-----------|------|
| Drag vertex to create self-intersection | Prevent save, show error | Unit |
| Drag vertex exactly to another vertex | Snap vertices together | UI |
| Undo while editing | Revert to original polygon | Integration |
| Two users edit same polygon | Last write wins, notify first user | Integration |

---

## Implementation Phases

### Phase 1: Foundation
- [ ] T1.1: Create polygon_edits table migration
- [ ] T1.2: Define IPolygonEditService interface
- [ ] T1.3: Create edit validation schemas

### Phase 2: Tests (Red)
- [ ] T2.1: Unit tests for edit validation
- [ ] T2.2: Test self-intersection detection
- [ ] T2.3: Test concurrent edit conflicts

### Phase 3: Implementation (Green)
- [ ] T3.1: Implement edit geometry validator
- [ ] T3.2: Implement PolygonService.updatePolygon()
- [ ] T3.3: Build PolygonEditor component
- [ ] T3.4: Implement real-time area calculation

### Phase 4: Integration
- [ ] T4.1: E2E test polygon edit flow
- [ ] T4.2: Verify edit history in polygon_edits
- [ ] T4.3: Test audit trail

---

## Definition of Done

| Category | Criteria |
|----------|----------|
| **Functional** | All AC met, edits saved with history |
| **Real-time** | Area updates live while dragging |
| **Validation** | No self-intersections allowed |
| **Audit** | polygon_edits and audit_events populated |
| **Coverage** | 85%+ |

---

## Progress

```
Status: 🔴 Not Started | Phase: 1 | Tasks: 0/15 | Coverage: 0%
Blockers: None
```

**Last Updated**: April 19, 2026
