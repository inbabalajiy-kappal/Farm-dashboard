# US-005: Team Collaboration & Field Access Control

**Epic**: E02-Team Management | **Sprint**: S2 | **Priority**: P1 | **Story Points**: 8  
**Status**: 🔴 Not Started | **Completion**: 0% | **Dependencies**: None

---

## User Story

**As a** Farm Owner/Admin  
**I want to** Invite team members and grant them access to specific farms/fields  
**so that** I can delegate tasks and maintain security

| Field | Value |
|-------|-------|
| **Business Value** | Enables team collaboration while protecting sensitive farm data |
| **Current State** | Only single-user access model |
| **Problem** | Can't share farm access with contractors, employees, or agronomists |
| **Solution** | Team management UI + role-based access control (RBAC) |

---

## Acceptance Criteria

### Functional

| ID | Criterion | Test Type |
|----|-----------|-----------|
| AC-1 | GIVEN admin views Team Members page WHEN clicks "Invite" THEN email form opens | UI |
| AC-2 | GIVEN email entered WHEN admin clicks Send THEN invitation email sent, user record created with pending status | Integration |
| AC-3 | GIVEN team member invited WHEN clicks link in email THEN accepts invite, joins team | Integration |
| AC-4 | GIVEN team member joined WHEN farm owner assigns role (lead, member, viewer) THEN member can access farm with role permissions | Authorization |
| AC-5 | GIVEN member role is "viewer" WHEN views field THEN cannot edit or delete; can only view analytics | Authorization |
| AC-6 | GIVEN member role is "lead" WHEN on field THEN can edit polygons, log activities, manage other members | Authorization |

### Non-Functional

| Category | Requirement | Target |
|----------|-------------|--------|
| Authorization | Role-based access per farm | Enforce on API |
| Security | Can't view another org's data | org_id isolation |
| Audit | All permission changes logged | audit_events |

---

## Technical Specification

### Domain Model (Database)

**Tables:**
- `teams` (already defined)
- `user_teams` (already defined)
- `team_farm_access` (NEW)

```sql
CREATE TABLE team_farm_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL,
    team_id UUID NOT NULL REFERENCES teams(id),
    farm_id UUID NOT NULL REFERENCES farms(id),
    permission_level VARCHAR(50) NOT NULL,  -- 'viewer', 'member', 'lead', 'admin'
    granted_at TIMESTAMP DEFAULT NOW(),
    granted_by_user_id UUID NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_team_farm_access ON team_farm_access(team_id, farm_id);
```

### Interfaces

```typescript
// modules/team/services/TeamService.ts
export interface ITeamService {
  inviteTeamMember(request: InviteRequest, orgId: UUID): Promise<InviteResponse>
  grantFarmAccess(teamId: UUID, farmId: UUID, role: PermissionLevel, orgId: UUID): Promise<void>
  checkFarmAccess(userId: UUID, farmId: UUID, orgId: UUID): Promise<boolean>
  getUserTeams(userId: UUID): Promise<Team[]>
}

interface InviteRequest {
  email: string
  teamId: UUID
  initialRole: 'member' | 'lead'
}

type PermissionLevel = 'viewer' | 'member' | 'lead' | 'admin'
```

### Authorization Middleware

```typescript
// middleware/checkFarmAccess.ts
export async function checkFarmAccess(req: Request, res: Response, next: NextFunction) {
  const { farmId } = req.params
  const userId = req.user.id
  const orgId = req.user.org_id

  const hasAccess = await teamService.checkFarmAccess(userId, farmId, orgId)
  
  if (!hasAccess) {
    return res.status(403).json({ error: 'Access denied to this farm' })
  }
  
  next()
}

// Usage in route:
app.get('/api/v1/farms/:farmId', checkFarmAccess, async (req, res) => {
  // Access granted
})
```

### Components

```typescript
// modules/team/components/TeamMembers.tsx
export function TeamMembers({ farmId }: { farmId: UUID }) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const { inviteTeamMember } = useInviteTeamMember()

  return (
    <div>
      <h2>Team Members</h2>
      {members.map(member => (
        <TeamMemberCard
          key={member.id}
          member={member}
          onRoleChange={(role) => updateMemberRole(member.id, role)}
        />
      ))}
      <InviteForm onSubmit={inviteTeamMember} />
    </div>
  )
}

// modules/team/components/InviteForm.tsx
function InviteForm({ onSubmit }: { onSubmit: (email: string) => Promise<void> }) {
  const form = useForm<InviteFormData>()

  return (
    <form onSubmit={form.handleSubmit(async (data) => {
      await onSubmit(data.email)
      form.reset()
      toast.success('Invitation sent!')
    })}>
      <input
        {...form.register('email', { validate: isEmail })}
        placeholder="team@farm.local"
        type="email"
      />
      <select {...form.register('initialRole')}>
        <option value="member">Member</option>
        <option value="lead">Lead</option>
      </select>
      <button type="submit">Invite</button>
    </form>
  )
}
```

---

## Role Permissions Matrix

| Role | Create Field | Edit Field | View Analytics | Manage Team | Delete Field |
|------|--------------|-----------|----------------|-------------|-------------|
| Viewer | ❌ | ❌ | ✅ | ❌ | ❌ |
| Member | ✅ | ✅ | ✅ | ❌ | ❌ |
| Lead | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Edge Cases

| Case | Behaviour | Test |
|------|-----------|------|
| User invited to multiple teams | Can switch between teams | Authorization |
| Revoke farm access | User loses access immediately | Authorization |
| Role upgrade during edit | Changes take effect on next action | Authorization |

---

## Implementation Phases

### Phase 1: Foundation
- [ ] T1.1: Create team_farm_access table migration
- [ ] T1.2: Define role enums and permission matrix

### Phase 2: Tests
- [ ] T2.1: Permission check tests
- [ ] T2.2: Multi-tenant isolation tests

### Phase 3: Implementation
- [ ] T3.1: Build authorization middleware
- [ ] T3.2: Implement TeamService
- [ ] T3.3: Build TeamMembers UI

### Phase 4: Integration
- [ ] T4.1: Test invite flow end-to-end
- [ ] T4.2: Verify audit trail

---

## Definition of Done

| Category | Criteria |
|----------|----------|
| **Auth** | All endpoints enforce role checks |
| **Audit** | Permission changes logged |
| **Isolation** | org_id always validated |
| **Coverage** | 85%+ |

---

## Progress

```
Status: 🔴 Not Started | Phase: 1 | Tasks: 0/20 | Coverage: 0%
```

**Last Updated**: April 19, 2026
