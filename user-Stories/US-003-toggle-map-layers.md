# US-003: Toggle Map Layers (Base & Overlays)

**Epic**: E01-Field Management | **Sprint**: S1 | **Priority**: P1 | **Story Points**: 3  
**Status**: 🔴 Not Started | **Completion**: 0% | **Dependencies**: US-001

---

## User Story

**As a** Farmer  
**I want to** Switch between satellite imagery and street map, toggle field boundaries  
**so that** I can see fields in context best suited to my task

| Field | Value |
|-------|-------|
| **Business Value** | Multiple views enable better field analysis (satellite for soil, street for location) |
| **Current State** | Single default base map only |
| **Problem** | Can't view satellite imagery or switch contexts easily |
| **Solution** | LayerToggle component + map_layers table configuration |

---

## Acceptance Criteria

### Functional

| ID | Criterion | Test Type |
|----|-----------|-----------|
| AC-1 | GIVEN FieldMap loaded WHEN user sees LayerToggle panel THEN list shows all available layers | UI |
| AC-2 | GIVEN layer list displayed WHEN user toggles checkbox THEN layer visibility changes instantly on map | UI |
| AC-3 | GIVEN layer toggled WHEN user preference saved THEN next login same layers visible | Integration |
| AC-4 | GIVEN user drags opacity slider THEN layer opacity updates in real-time | UI |

### Non-Functional

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Layer toggle | < 100ms |
| UX | Remember user preferences | Persist to DB |
| Accessibility | Keyboard navigation in toggles | Tab/Space support |

---

## Technical Specification

### Schema

```sql
-- Already defined in DATABASE-SCHEMA.md
SELECT * FROM map_layers WHERE org_id = $1;
SELECT * FROM user_layer_preferences WHERE user_id = $1;
```

### Component

```typescript
// modules/field-layout/components/LayerToggle.tsx
export function LayerToggle({ userId }: { userId: UUID }) {
  const [layers, setLayers] = useState<MapLayer[]>([])
  const [preferences, setPreferences] = useState<Record<UUID, boolean>>({})
  
  const toggleLayer = async (layerId: UUID) => {
    setPreferences(p => { ...p, [layerId]: !p[layerId] })
    
    // Persist to DB
    await updateLayerPreference({
      userId,
      layerId,
      visible: !preferences[layerId]
    })
  }

  return (
    <div className="layer-panel">
      {layers.map(layer => (
        <label key={layer.id}>
          <input
            type="checkbox"
            checked={preferences[layer.id] ?? layer.visible}
            onChange={() => toggleLayer(layer.id)}
          />
          {layer.name}
          <input
            type="range"
            min="0" max="1" step="0.1"
            onChange={(e) => updateLayerOpacity(layer.id, parseFloat(e.target.value))}
          />
        </label>
      ))}
    </div>
  )
}
```

---

## Implementation Phases

### Phase 1: Foundation
- [ ] T1.1: Fetch map_layers from DB
- [ ] T1.2: Query user_layer_preferences

### Phase 2: Tests
- [ ] T2.1: Unit tests for toggle logic
- [ ] T2.2: API tests for preference persistence

### Phase 3: Implementation
- [ ] T3.1: Build LayerToggle component
- [ ] T3.2: Implement preference persistence API

---

## Progress

```
Status: 🔴 Not Started | Phase: 1 | Tasks: 0/8 | Coverage: 0%
```

**Last Updated**: April 19, 2026
