# Farm-map-Dev User Stories

**Project**: Farm-map-Dev - Field Mapping Web Application  
**Created**: April 19, 2026  
**Status**: Planning Phase

---

## 📋 User Stories Index

| Story ID | Title | Epic | Points | Priority | Status |
|----------|-------|------|--------|----------|--------|
| [US-001](#us-001) | Create field polygon on map | E01 | 8 | P0 | 🔴 Not Started |
| [US-002](#us-002) | Edit field polygon & recalculate acreage | E01 | 5 | P0 | 🔴 Not Started |
| [US-003](#us-003) | Toggle map layers (base & overlays) | E01 | 3 | P1 | 🔴 Not Started |
| [US-004](#us-004) | Record field activity (operations log) | E01 | 5 | P1 | 🔴 Not Started |
| [US-005](#us-005) | Team collaboration & field access control | E02 | 8 | P1 | 🔴 Not Started |

---

## 📊 Planning Summary

### By Epic

| Epic | Title | Total Points | Stories |
|------|-------|--------------|---------|
| **E01** | Field Management | 21 | US-001, US-002, US-003, US-004 |
| **E02** | Team Management | 8 | US-005 |
| **TOTAL** | — | **29** | 5 stories |

### By Priority

| Priority | Count | Points | Stories |
|----------|-------|--------|---------|
| P0 (Critical) | 2 | 13 | US-001, US-002 |
| P1 (High) | 3 | 16 | US-003, US-004, US-005 |

### Sprint Allocation

**Sprint 1** (Foundation):
- US-001: Create field polygon (8pt) — Core feature
- US-002: Edit polygon (5pt) — Dependent on US-001
- US-003: Toggle layers (3pt) — Quick win

**Sprint 2** (Operations):
- US-004: Log activities (5pt)
- US-005: Team collaboration (8pt)

---

## 🎯 Feature Map

```
┌─────────────────────────────────────────────────────┐
│          FARM-MAP-DEV FEATURE ROADMAP               │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Field Management (Sprint 1-2)                      │
│  ├─ Create polygons (US-001)         [████████]     │
│  ├─ Edit polygons (US-002)           [█████]        │
│  ├─ Map layers (US-003)              [███]          │
│  └─ Activity logging (US-004)        [█████]        │
│                                                       │
│  Team & Access (Sprint 2)                           │
│  └─ Collaboration (US-005)           [████████]     │
│                                                       │
│  Analytics (Future - not yet planned)               │
│  └─ Field metrics dashboard                         │
│  └─ Compliance reports                              │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Technical Dependencies

```
US-001 (Create Polygon)
   ├── DATABASE-SCHEMA.md
   ├── OpenLayers integration
   ├── PostGIS geometry support
   └── FieldMap component

US-002 (Edit Polygon) ─ depends on US-001
   ├── polygon_edits table
   ├── Real-time area calc
   └── Modify interaction

US-003 (Toggle Layers) ─ depends on US-001
   ├── map_layers table
   ├── user_layer_preferences
   └── LayerToggle component

US-004 (Log Activity) ─ depends on US-001
   ├── field_activities table
   ├── ActivityForm component
   └── Structured JSONB storage

US-005 (Team Collaboration)
   ├── teams + user_teams tables
   ├── team_farm_access table
   ├── RBAC middleware
   └── Authorization checks
```

---

## 📚 Reference Documentation

- [DATABASE-SCHEMA.md](../DATABASE-SCHEMA.md) — All tables and triggers
- [FARMMAP ARCHITECTURE.md](../FARMMAP%20ARCHITECTURE.md) — System design
- [web-app-guidelines.md](../github/web-app-guidelines.md) — Development standards
- [copilot_instructions.md](../github/copilot_instructions.md) — Coding principles

---

## ✅ Definition of Done (All Stories)

| Aspect | Standard |
|--------|----------|
| **Acceptance Criteria** | 100% met |
| **Test Coverage** | 85%+ overall |
| **Types** | `npm run type-check` clean |
| **Linting** | `npm run lint` passes |
| **Architecture** | Clean layers, interfaces used |
| **Multi-Tenancy** | `org_id` enforced on all queries |
| **Authorization** | Role checks on sensitive endpoints |
| **Audit** | Changes logged to audit_events |
| **Observability** | OTel spans for critical paths |
| **Security** | No SQL injection, no XSS, secrets protected |

---

## 🔄 Development Workflow (TDD)

For each story:

1. **Phase 1: Foundation** → Define interfaces, schemas, DB changes
2. **Phase 2: Tests (Red)** → Write tests that FAIL
3. **Phase 3: Implementation (Green)** → Write minimal code to PASS tests
4. **Phase 4: Integration** → E2E tests, observability, multi-tenant checks
5. **Phase 5: Quality Gate** → Coverage, lint, type check pass

**Example:**
```bash
# Phase 2: Write tests first (red)
npm test -- --watch  # All tests FAIL

# Phase 3: Implement (green)
# ... write implementation ...
npm test -- --watch  # All tests PASS

# Phase 5: Quality gate
npm run type-check && npm run lint && npm test -- --coverage
```

---

## 📈 Story Estimation Rationale

| Story | Points | Reasoning |
|-------|--------|-----------|
| US-001 | 8 | Core feature; OpenLayers learning curve; polygon validation |
| US-002 | 5 | Depends on US-001; simpler than creation; real-time feedback |
| US-003 | 3 | Small scope; leverages existing map_layers table |
| US-004 | 5 | Activity types; conditional form rendering; JSONB metadata |
| US-005 | 8 | Complex RBAC; authorization middleware; email invites |

---

## 🚀 Getting Started

### For Developers

1. **Start with US-001** (Foundation)
   ```bash
   cd Farm-map-Dev
   # Read US-001 story
   # Review DATABASE-SCHEMA.md (field_polygons table)
   # Review FARMMAP ARCHITECTURE.md
   npm test -- --watch  # Start in red phase
   ```

2. **Follow TDD workflow**
   - Write tests first
   - Implement to pass tests
   - Refactor for clean code

3. **Run quality checks**
   ```bash
   npm run type-check
   npm run lint
   npm test -- --coverage
   ```

### For Project Managers

- **Sprint 1**: Focus on US-001, US-002, US-003 (13 points)
- **Sprint 2**: US-004, US-005 (13 points, can parallelize)
- **Buffer**: 20% (~5 points) for unknowns

---

## 🎓 Learning Resources

**OpenLayers:**
- [OpenLayers Draw Interaction](https://openlayers.org/en/latest/apidoc/module-ol_interaction_Draw.html)
- [OpenLayers Modify Interaction](https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify.html)

**PostGIS:**
- [PostGIS ST_Area](https://postgis.net/docs/ST_Area.html)
- [Coordinate Systems](https://postgis.net/docs/using_postgis_dbmanagement.html)

**Web App Patterns:**
- See [web-app-guidelines.md](../github/web-app-guidelines.md) for React, Zustand, Zod best practices

---

## 📝 Future Stories (Backlog)

These will be created later:

- **E03-Analytics**: Field metrics dashboard, yield forecasts
- **E04-Reporting**: Compliance reports, PDF export
- **E05-Mobile**: Mobile app for field ops (React Native)
- **E06-Integration**: Connect to weather APIs, market data

---

## 📞 Questions or Blockers?

If you encounter:
- **Database questions** → Refer to DATABASE-SCHEMA.md with examples
- **Architecture questions** → Check FARMMAP ARCHITECTURE.md
- **Coding standards** → Follow copilot_instructions.md + web-app-guidelines.md
- **OpenLayers questions** → Check story AC* for usage patterns

---

**Maintained by**: Farm-map-Dev Team  
**Last Updated**: April 19, 2026  
**Total Points**: 29 (Sprint 1: 13pt, Sprint 2: 16pt)
