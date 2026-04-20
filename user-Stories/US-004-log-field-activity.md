# US-004: Record Field Activity (Operations Log)

**Epic**: E01-Field Management | **Sprint**: S2 | **Priority**: P1 | **Story Points**: 5  
**Status**: 🔴 Not Started | **Completion**: 0% | **Dependencies**: US-001

---

## User Story

**As a** Farmer/Agronomist  
**I want to** Log field activities (planting, fertilizer, spraying, harvest)  
**so that** I maintain operation records for compliance and analysis

| Field | Value |
|-------|-------|
| **Business Value** | Documented operations enable compliance audits, yield analysis, and future planning |
| **Current State** | No activity logging capability |
| **Problem** | Manual paper records get lost; no historical context |
| **Solution** | ActivityForm component + field_activities table |

---

## Acceptance Criteria

### Functional

| ID | Criterion | Test Type |
|----|-----------|-----------|
| AC-1 | GIVEN field selected WHEN user clicks "Log Activity" THEN form opens with activity type dropdown | UI |
| AC-2 | GIVEN form open WHEN user selects "Planting" THEN additional fields appear (crop type, seed rate) | UI |
| AC-3 | GIVEN activity details entered WHEN user clicks Save THEN activity saved to DB with timestamp and user ID | Integration |
| AC-4 | GIVEN activity saved THEN appear in field activity timeline below map | UI |
| AC-5 | GIVEN user is admin WHEN viewing any field activities THEN all activities visible; non-admin sees only own activities | Authorization |

### Non-Functional

| Category | Requirement | Target |
|----------|-------------|--------|
| Audit Trail | All activities logged with user ID | Mandatory |
| Metadata | Store structured JSONB for activity details | crop, rate, notes |

---

## Technical Specification

### Interface

```typescript
// modules/field-layout/services/ActivityService.ts
export interface IActivityService {
  logActivity(request: LogActivityRequest, userId: UUID, orgId: UUID): Promise<FieldActivity>
  getActivities(fieldId: UUID, orgId: UUID): Promise<FieldActivity[]>
  getActivityTypes(): ActivityType[]
}

interface LogActivityRequest {
  fieldId: UUID
  activityType: 'planting' | 'fertilizer' | 'spray' | 'harvest' | 'soil_test'
  notes: string
  performedAt: Date
  activityData: Record<string, unknown>  // crop, rate, etc.
}

interface FieldActivity extends LogActivityRequest {
  id: UUID
  performedByUserId: UUID
  createdAt: Date
}
```

### Component

```typescript
// modules/field-layout/components/ActivityForm.tsx
export function ActivityForm({ fieldId }: { fieldId: UUID }) {
  const form = useForm<ActivityFormData>()
  const { logActivity } = useLogActivity()
  const activityType = form.watch('activityType')

  const renderActivityFields = () => {
    switch (activityType) {
      case 'planting':
        return <>
          <input {...form.register('cropType')} placeholder="Crop type" />
          <input {...form.register('seedRate')} placeholder="Seed rate (seeds/acre)" type="number" />
        </>
      case 'fertilizer':
        return <>
          <input {...form.register('nutrient')} placeholder="Nutrient (N, P, K)" />
          <input {...form.register('rate')} placeholder="Application rate (lbs/acre)" type="number" />
        </>
      case 'spray':
        return <>
          <input {...form.register('herbicide')} placeholder="Product name" />
          <input {...form.register('coverage')} placeholder="Coverage %" type="number" />
        </>
      default:
        return null
    }
  }

  return (
    <form onSubmit={form.handleSubmit(async (data) => {
      await logActivity({
        fieldId,
        ...data,
        activityData: extractActivityData(data)
      })
    })}>
      <select {...form.register('activityType')} required>
        <option value="">Select activity type</option>
        <option value="planting">Planting</option>
        <option value="fertilizer">Fertilizer Application</option>
        <option value="spray">Herbicide/Pesticide Spray</option>
        <option value="harvest">Harvest</option>
        <option value="soil_test">Soil Test</option>
      </select>

      {renderActivityFields()}

      <textarea {...form.register('notes')} placeholder="Notes" />
      <input {...form.register('performedAt')} type="datetime-local" required />

      <button type="submit">Log Activity</button>
    </form>
  )
}
```

### Data Layer

```sql
-- Already defined in DATABASE-SCHEMA.md
INSERT INTO field_activities (
  org_id, field_id, activity_type, notes, performed_at, performed_by_user_id, activity_data
)
VALUES ($1, $2, $3, $4, $5, $6, $7);
```

---

## Edge Cases

| Case | Behaviour | Test |
|------|-----------|------|
| Activity date in future | Allow (scheduled operations) | Unit |
| Activity older than field creation | Show warning | Unit |
| Bulk import activities (CSV) | Support batch insert | Integration |
| Export activity history | Trigger report generation job | Integration |

---

## Implementation Phases

### Phase 1: Foundation
- [ ] T1.1: Define ActivityService interface
- [ ] T1.2: Create activity type enums

### Phase 2: Tests
- [ ] T2.1: Unit tests for activity validation
- [ ] T2.2: Integration tests for logging

### Phase 3: Implementation
- [ ] T3.1: Build ActivityForm with conditional fields
- [ ] T3.2: Implement ActivityService
- [ ] T3.3: Create ActivityTimeline view

---

## Definition of Done

| Category | Criteria |
|----------|----------|
| **Functional** | All activity types loggable |
| **Audit** | All activities linked to user + timestamp |
| **Authorization** | Role-based activity visibility |
| **Metadata** | Structured JSONB storage |
| **Coverage** | 85%+ |

---

## Progress

```
Status: 🔴 Not Started | Phase: 1 | Tasks: 0/15 | Coverage: 0%
```

**Last Updated**: April 19, 2026
