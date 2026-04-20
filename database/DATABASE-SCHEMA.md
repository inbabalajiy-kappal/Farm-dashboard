# Farm-map-Dev Database Schema
## PostgreSQL 16+ with PostGIS

---

## 1. Overview

This database schema powers the Farm-map-Dev web application with support for:
- **Multi-tenant farm management** (users, farms, teams)
- **GIS polygon geometry** (field boundaries with PostGIS)
- **OpenLayers integration** (map layers, vector features)
- **Polygon editing & versioning** (edit history, audit trail)
- **Real-time analytics** (field metrics, soil data, activities)
- **Team collaboration** (permissions, activity tracking)

**Technology Stack:**
- PostgreSQL 16+
- PostGIS 3.3+ (geometric/geographic data)
- UUID for distributed IDs
- JSONB for flexible metadata

---

## 2. Core Domain Tables

### 2.1 Users & Organization

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    external_id VARCHAR(255) NOT NULL,  -- Auth provider ID
    display_name VARCHAR(255),
    email VARCHAR(255),
    role VARCHAR(50) DEFAULT 'farmer',   -- farmer, agronomist, admin
    tier VARCHAR(50) DEFAULT 'standard', -- standard, premium, enterprise
    preferences JSONB DEFAULT '{}',      -- UI settings, map defaults
    total_mapped_area_acres FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_active_at TIMESTAMP,
    UNIQUE(org_id, external_id)
);

CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
```

**Use Case:** Track farm operators, agronomists, and administrators. Handle per-user preferences for map zoom, default units, etc.

### 2.2 Farms

```sql
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),              -- Human-readable location (city, county)
    region VARCHAR(255),                -- Geographic region (Midwest, Great Plains)
    total_area_acres FLOAT,
    contact_email VARCHAR(255),
    metadata JSONB DEFAULT '{}',        -- Additional farm info, certifications
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_farms_user ON farms(owner_user_id, created_at DESC);
CREATE INDEX idx_farms_org ON farms(org_id);
```

**Use Case:** Represent individual farms within an organization. Track ownership and aggregate farm-level statistics.

---

## 3. GIS & Polygon Tables

### 3.1 Field Polygons (Core GIS Table)

```sql
CREATE TABLE field_polygons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- GIS Geometry (WGS84, stored as POLYGON)
    polygon GEOMETRY(POLYGON, 4326) NOT NULL,
    
    -- Calculated Areas
    area_sq_meters FLOAT,           -- Calculated by trigger
    area_acres FLOAT,               -- Calculated by trigger
    
    -- Field Properties
    soil_type VARCHAR(100),         -- Silt Loam, Clay, Sandy Loam, etc.
    drainage_class VARCHAR(50),     -- Well-drained, Poorly-drained
    slope_percent FLOAT,            -- Field slope for erosion
    
    -- Status & Metadata
    status VARCHAR(50) DEFAULT 'active',  -- active, archived, deleted
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_polygons_farm ON field_polygons(farm_id);
CREATE INDEX idx_polygons_org ON field_polygons(org_id);
CREATE INDEX idx_polygons_geom ON field_polygons USING GIST(polygon);
CREATE INDEX idx_polygons_status ON field_polygons(status);
```

**Use Case:** Store field boundaries as geometric polygons. Support spatial queries (find fields within bounds, check overlap). Auto-calc acreage.

### 3.2 Polygon Edit History

```sql
CREATE TABLE polygon_edits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    field_id UUID NOT NULL REFERENCES field_polygons(id) ON DELETE CASCADE,
    
    -- Edit Details
    edit_type VARCHAR(50) NOT NULL,  -- 'create', 'update', 'delete', 'restore'
    previous_polygon GEOMETRY(POLYGON, 4326),  -- NULL if creation
    new_polygon GEOMETRY(POLYGON, 4326),       -- NULL if deletion
    previous_area_acres FLOAT,
    new_area_acres FLOAT,
    
    change_reason TEXT,              -- Why was this edited?
    metadata JSONB DEFAULT '{}',
    
    -- Audit Trail
    edited_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_polygon_edits_field ON polygon_edits(field_id, created_at DESC);
CREATE INDEX idx_polygon_edits_user ON polygon_edits(edited_by_user_id);
```

**Use Case:** Maintain edit history for compliance, rollback capability, and analytics. Track who changed what and when.

---

## 4. Map & OpenLayers Integration

### 4.1 Map Layers

```sql
CREATE TABLE map_layers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    
    -- Layer Identity
    name VARCHAR(255) NOT NULL,
    layer_type VARCHAR(50) NOT NULL,  -- 'base', 'overlay', 'vector'
    category VARCHAR(100),             -- 'satellite', 'terrain', 'fields', 'soil'
    
    -- OpenLayers Configuration
    source_type VARCHAR(50),           -- 'osm', 'wms', 'xyz', 'geojson'
    source_url TEXT,                   -- URL template: https://tile.openstreetmap.org/{z}/{x}/{y}.png
    
    -- Layer State
    visible BOOLEAN DEFAULT true,
    opacity FLOAT DEFAULT 1.0,         -- 0.0-1.0
    z_index INT DEFAULT 0,
    
    -- Advanced OpenLayers Config
    layer_config JSONB DEFAULT '{}',   -- Attribution, styles, feature rules
    
    created_at TIMESTAMP DEFAULT NOW(),
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_map_layers_org ON map_layers(org_id);
CREATE INDEX idx_map_layers_type ON map_layers(layer_type);
```

**Use Case:** Define map layers for OpenLayers integration. Support basemaps (OSM, satellite), overlay layers, and dynamic vector layers.

### 4.2 Layer Visibility & User Preferences

```sql
CREATE TABLE user_layer_preferences (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    layer_id UUID NOT NULL REFERENCES map_layers(id) ON DELETE CASCADE,
    
    visible BOOLEAN DEFAULT true,
    opacity FLOAT DEFAULT 1.0,
    z_index INT,
    
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, layer_id)
);

CREATE INDEX idx_user_layers ON user_layer_preferences(user_id);
```

**Use Case:** Persist per-user layer visibility, opacity, and ordering preferences.

---

## 5. Teams & Permissions

### 5.1 Teams

```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    function VARCHAR(100),             -- 'field-ops', 'management', 'analytics'
    description TEXT,
    team_lead_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    farm_access JSONB DEFAULT '[]',   -- [farm_id, farm_id, ...] accessible farms
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(org_id, name)
);

CREATE INDEX idx_teams_org ON teams(org_id);
```

**Use Case:** Group users by role/function. Control field access per team.

### 5.2 User-Team Assignments

```sql
CREATE TABLE user_teams (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    
    role VARCHAR(50) DEFAULT 'member',  -- 'lead', 'member', 'viewer'
    assigned_at TIMESTAMP DEFAULT NOW(),
    
    PRIMARY KEY (user_id, team_id)
);

CREATE INDEX idx_user_teams_user ON user_teams(user_id);
CREATE INDEX idx_user_teams_team ON user_teams(team_id);
```

---

## 6. Field Activities & History

### 6.1 Field Activities

```sql
CREATE TABLE field_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    field_id UUID NOT NULL REFERENCES field_polygons(id) ON DELETE CASCADE,
    
    -- Activity Details
    activity_type VARCHAR(50) NOT NULL,  -- 'planting', 'fertilizer', 'spray', 'harvest', 'soil_test'
    notes TEXT,
    
    -- Timing
    performed_at TIMESTAMP NOT NULL,  -- When did it happen?
    performed_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    
    -- Structured Data
    activity_data JSONB DEFAULT '{}',  -- crop:'wheat', rate:'200 lbs/acre'
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_field ON field_activities(field_id, performed_at DESC);
CREATE INDEX idx_activities_type ON field_activities(activity_type);
```

**Use Case:** Record farming operations (planting, spraying, harvesting). Link to field and user.

---

## 7. Analytics & Soil Data

### 7.1 Field Metrics

```sql
CREATE TABLE field_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    field_id UUID NOT NULL REFERENCES field_polygons(id) ON DELETE CASCADE,
    
    -- Metric Details
    metric_name VARCHAR(100) NOT NULL,  -- 'soil_ph', 'organic_matter', 'nitrogen'
    metric_value FLOAT NOT NULL,
    metric_unit VARCHAR(50),            -- 'pH', '%', 'ppm', 'lbs/acre'
    
    -- Source & Timing
    source_type VARCHAR(50),            -- 'lab-test', 'sensor', 'calculation'
    recorded_at TIMESTAMP NOT NULL,
    recorded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_metrics_field ON field_metrics(field_id, metric_name);
CREATE INDEX idx_metrics_time ON field_metrics(recorded_at DESC);
```

**Use Case:** Store soil test results, sensor readings, and calculated metrics.

---

## 8. Audit & Compliance

### 8.1 Audit Events

```sql
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    
    -- Event Classification
    event_type VARCHAR(50) NOT NULL,    -- 'POLYGON_CREATE', 'POLYGON_EDIT', 'ACTIVITY_LOG'
    action VARCHAR(50) NOT NULL,        -- 'INSERT', 'UPDATE', 'DELETE'
    
    -- Resource Context
    resource_type VARCHAR(50),          -- 'field_polygon', 'activity', 'user'
    resource_id UUID,
    
    -- Actor
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Details
    change_summary JSONB DEFAULT '{}',  -- What changed: {field: 'area_acres', old: 100, new: 105}
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_org ON audit_events(org_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_events(resource_type, resource_id);
CREATE INDEX idx_audit_actor ON audit_events(actor_id);
```

**Use Case:** Compliance logging. Answer: "Who edited this field and when?"

---

## 9. Configuration & Settings

### 9.1 Organization Configuration

```sql
CREATE TABLE configuration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID,
    
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(org_id, config_key)
);

-- Examples:
-- key: 'map_default_center'    value: {"lat": 38.5, "lng": -97.0}
-- key: 'area_units'            value: ["acres", "hectares"]
-- key: 'map_bounds'            value: [[-98, 37], [-96, 39]]
-- key: 'polygon_snap_distance' value: 5 (meters)
```

---

## 10. Jobs & Background Processing

### 10.1 Jobs

```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Job Details
    job_type VARCHAR(100) NOT NULL,     -- 'polygon_import', 'area_calculation', 'report_generation'
    input_params JSONB DEFAULT '{}',
    output_result JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'queued',  -- queued, processing, completed, failed
    progress_pct INT DEFAULT 0,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_user ON jobs(user_id, created_at DESC);
```

**Use Case:** Background tasks (bulk polygon import, report generation, area calculations).

---

## 11. Files & Attachments

### 11.1 Files

```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    
    -- File Identity
    filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    file_size_bytes INT,
    
    -- Storage
    storage_path VARCHAR(500),          -- S3 path or local path
    category VARCHAR(50) NOT NULL,      -- 'field-boundary', 'soil-test', 'report'
    
    -- Relationship
    field_id UUID REFERENCES field_polygons(id) ON DELETE SET NULL,
    
    uploaded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_files_org ON files(org_id);
CREATE INDEX idx_files_field ON files(field_id);
```

---

## 12. Auto-Calculated Fields & Triggers

### 12.1 Auto Area Calculation on Polygon Insert/Update

```sql
CREATE OR REPLACE FUNCTION calculate_polygon_area()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate area in square meters using Web Mercator (EPSG:3857)
    NEW.area_sq_meters := ST_Area(ST_Transform(NEW.polygon, 3857));
    
    -- Convert to acres (1 acre = 4046.86 sq meters)
    NEW.area_acres := NEW.area_sq_meters / 4046.86;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_polygon_area
BEFORE INSERT OR UPDATE ON field_polygons
FOR EACH ROW
EXECUTE FUNCTION calculate_polygon_area();
```

### 12.2 Audit Trigger for Polygon Changes

```sql
CREATE OR REPLACE FUNCTION audit_polygon_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_events (org_id, event_type, action, resource_type, resource_id, actor_id, change_summary)
    VALUES (
        NEW.org_id,
        'POLYGON_' || TG_OP,
        TG_OP,
        'field_polygon',
        COALESCE(NEW.id, OLD.id),
        NEW.updated_by_user_id,
        jsonb_build_object(
            'name', NEW.name,
            'area_acres', NEW.area_acres,
            'previous_area_acres', OLD.area_acres
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_polygon
AFTER INSERT OR UPDATE ON field_polygons
FOR EACH ROW
EXECUTE FUNCTION audit_polygon_change();
```

### 12.3 Update Timestamps

```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_timestamp_farms
BEFORE UPDATE ON farms
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_timestamp_polygons
BEFORE UPDATE ON field_polygons
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

---

## 13. Key Queries

### 13.1 Get Farm with All Fields

```sql
SELECT 
    f.id, f.name, f.total_area_acres,
    json_agg(json_build_object(
        'field_id', fp.id,
        'field_name', fp.name,
        'area_acres', fp.area_acres,
        'soil_type', fp.soil_type
    )) as fields
FROM farms f
LEFT JOIN field_polygons fp ON f.id = fp.farm_id
WHERE f.org_id = $1 AND f.id = $2
GROUP BY f.id;
```

### 13.2 Find Fields Intersecting Bounds

```sql
-- Find all fields within a bounding box (useful for map viewport)
SELECT *
FROM field_polygons
WHERE ST_Intersects(
    polygon,
    ST_GeomFromText('POLYGON((-97.8 37 -97.6 37 -97.6 37.2 -97.8 37.2 -97.8 37))', 4326)
)
AND org_id = $1;
```

### 13.3 Acreage Summary by Farm

```sql
SELECT 
    f.id, f.name,
    SUM(fp.area_acres) as total_field_acres,
    COUNT(fp.id) as field_count,
    AVG(fp.area_acres) as avg_field_size
FROM farms f
LEFT JOIN field_polygons fp ON f.id = fp.farm_id
WHERE f.org_id = $1
GROUP BY f.id, f.name;
```

### 13.4 Audit Trail for a Field

```sql
SELECT *
FROM audit_events
WHERE resource_type = 'field_polygon'
AND resource_id = $1
ORDER BY created_at DESC
LIMIT 50;
```

### 13.5 Recent Field Activities

```sql
SELECT 
    fa.id, fa.activity_type, fa.notes, fa.performed_at,
    u.display_name as performed_by,
    fp.name as field_name
FROM field_activities fa
JOIN field_polygons fp ON fa.field_id = fp.id
LEFT JOIN users u ON fa.performed_by_user_id = u.id
WHERE fp.farm_id = $1
ORDER BY fa.performed_at DESC
LIMIT 20;
```

---

## 14. Web Application Integration Points

### 14.1 Frontend Requirements

**Next.js/React Components interact with:**
- `field_polygons` — Render on OpenLayers map (FieldMap component)
- `map_layers` — Switch base layers, toggle overlays (LayerToggle component)
- `field_activities` — Display operation history (ActivityLog component)
- `user_layer_preferences` — Persist map state per user

### 14.2 Backend API Endpoints

```typescript
// POST /api/fields → Create field
// PATCH /api/fields/{id} → Update polygon & trigger area calc
// GET /api/fields?farm_id=X → Fetch fields for map
// GET /api/fields/{id}/history → Get edit history
// GET /api/farms/{id}/analytics → Field metrics summary
```

### 14.3 Real-time Features (WebSocket)

- Broadcast polygon edits to team members
- Live acreage calculation feedback
- Activity notifications
- User presence on shared fields

---

## 15. Performance & Indexing Strategy

| Index | Purpose | Query Pattern |
|-------|---------|---------------|
| idx_polygons_geom (GIST) | Spatial queries | Find fields in viewport bounds |
| idx_polygons_farm | Field listing | All fields in a farm |
| idx_activities_field | Activity history | Recent ops on field |
| idx_audit_org (compound) | Compliance logs | Recent changes org-wide |
| idx_metrics_field | Analytics | Soil data by field |

---

## 16. Coordinate System Reference

| Aspect | Value |
|--------|-------|
| **Storage SRID** | 4326 (WGS84) |
| **Calculation SRID** | 3857 (Web Mercator) |
| **Format** | GeoJSON: [lng, lat] |
| **Lat Range** | -90 to +90 |
| **Lng Range** | -180 to +180 |

---

## 17. Multi-Tenancy & Data Isolation

Every table has `org_id` column. All queries MUST include:

```sql
WHERE org_id = $1
```

This ensures data isolation between organizations.

---

## 18. Migration & Deployment

**Development Setup:**
```bash
createdb farmmap_dev
psql farmmap_dev < schema.sql
psql farmmap_dev < seed_data.sql
```

**Production Considerations:**
- Use Alembic/db-migrate for versioned migrations
- Run backups before large schema changes
- Test migrations on staging environment
- Document breaking changes

---

**Last Updated:** April 19, 2026  
**Version:** 1.0  
**Technology:** PostgreSQL 16+, PostGIS 3.3+  
**Maintained by:** Farm-map-Dev Team
