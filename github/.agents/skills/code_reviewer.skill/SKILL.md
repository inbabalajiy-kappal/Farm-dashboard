---
name: code-reviewer
description: "Use when performing enterprise-grade code reviews, maintainability audits, frontend architecture validation, SOLID enforcement, testing quality assessment, design system governance, performance analysis, and long-term engineering quality control"
version: "3.0.0"
owner: "engineering-system"
stability: "long-term"
---

# Code Reviewer Skill

---

# 1. Review Philosophy

Review every code change as if:

- code must survive at least 5 years
- ownership may transfer to unknown engineers
- scale may increase beyond current assumptions
- junior engineers must safely maintain it
- product complexity will grow
- debugging must remain possible under pressure

---

## Engineering Golden Rules

- Prefer clarity over cleverness
- Prefer explicitness over hidden behavior
- Prefer maintainability over short-term speed
- Prefer domain readability over abstraction density
- Prefer stable patterns over experimental structure

---

## Reviewer Core Question

Before approving any code:

> Would an engineer unfamiliar with this feature understand and safely modify it after six months?

If answer = no → review is incomplete

---

# 2. Review Output Contract

Every review output must follow this order.

---

## Critical Issues

Must fix before merge.

Used when issue affects:

- correctness
- security
- maintainability
- architecture safety
- production reliability

---

## Warning Issues

Should improve before release or next iteration.

Used when issue affects:

- readability
- consistency
- minor performance
- future maintainability

---

## Positive Notes

Mention strong engineering decisions worth preserving.

Used for:

- clean abstractions
- strong decomposition
- reusable patterns
- good naming

---

## Suggested Refactor

Always propose practical refactor when issue is structural.

Format:

Problem → Reason → Safer Replacement

---

# 3. Critical Smells (Must Block Merge)

| Smell | Signal | Fix |
|------|------|------|
| God Component | file too large / too many responsibilities | split by domain |
| Feature Envy | logic depends heavily on external object | move logic |
| Primitive Obsession | repeated raw strings / numbers | value abstraction |
| Long Parameter List | more than 4 parameters | contract object |
| Shotgun Surgery | one change touches many files | abstraction |
| Dead Code | unreachable or commented code | remove |
| Boolean Trap | multiple boolean flags | enum / config |
| Massive JSX | unreadable nested render tree | extract components |
| Circular Dependency | import loop | invert dependency |
| Mixed Responsibility | UI + API + business logic together | separate layers |

---

# 4. Warning Smells (Should Improve)

| Smell | Signal | Fix |
|------|------|------|
| Magic Numbers | repeated values | constants |
| Deep Nesting | more than 3 levels | early return |
| Temporary Variable Noise | too many intermediates | simplify |
| Long Comments | code needs explanation to survive | rewrite logic |
| Naming Drift | inconsistent verb usage | naming alignment |
| Repeated Conditions | duplicated conditions | helper extraction |

---

# 5. Functionality Review Checklist

## Category | Check

| Category | Check |
|----------|------|
| Feature Behavior | matches business requirement |
| Edge Cases | verified |
| Error Handling | explicit fallback exists |
| Empty State | handled |
| Invalid Input | guarded |
| Loading State | visible |
| Retry Flow | available |
| Failure Recovery | safe |

---

## State Safety

- [ ] optimistic updates safe
- [ ] rollback possible
- [ ] stale state prevented
- [ ] race conditions controlled

---

# 6. SOLID Validation

---

## Single Responsibility Principle

- one component = one reason to change
- one hook = one domain concern

---

## Open Closed Principle

- extension possible without editing stable core

---

## Liskov Substitution Principle

- child implementation preserves parent expectations

---

## Interface Segregation Principle

- props remain minimal
- avoid oversized interfaces

---

## Dependency Inversion Principle

- business logic depends on abstractions

---

# 7. Frontend OOP Enforcement

## OOP Concept | Frontend Application

| Principle | Frontend Meaning |
|----------|------------------|
| Encapsulation | component hides internal state |
| Abstraction | hook exposes clean API |
| Polymorphism | interchangeable contracts |
| Composition | preferred over inheritance |

---

## Component Responsibility Rule

If component mixes:

- business logic
- fetch logic
- render orchestration
- side effect control

→ split immediately

---

# 8. TypeScript Review

## Strictness Rules

- [ ] no any
- [ ] exported types explicit
- [ ] unions preferred
- [ ] nullable contracts explicit
- [ ] generics used where beneficial

---

## Dangerous Patterns

| Problem | Fix |
|--------|------|
| as abuse | narrowing |
| loose object shape | interface |
| implicit undefined | optional contract |

---

# 9. React / Next.js Review

## Component Quality

- [ ] component under safe complexity
- [ ] render readable
- [ ] subcomponents extracted
- [ ] hooks grouped logically

---

## Hook Review

- [ ] dependency arrays correct
- [ ] stale closures absent
- [ ] cleanup exists

---

## Next.js Rules

- [ ] route files thin
- [ ] service layer extracted
- [ ] heavy modules dynamic imported
- [ ] server/client boundaries clear

---

## Data Fetching

- [ ] duplicate fetch avoided
- [ ] cancellation considered
- [ ] loading fallback exists
- [ ] error state visible

---

# 10. Performance Review

## Critical Performance Smells

| Smell | Signal | Fix |
|------|------|------|
| Re-render Storm | unstable props | memoize |
| Layout Thrashing | width/height animation | transform only |
| Heavy Bundle | large import | split import |
| Duplicate Requests | repeated fetch | cache |

---

## Animation Rules

- [ ] transform only
- [ ] opacity only
- [ ] no layout animation
- [ ] reduced motion respected

---

# 11. Design System Review

## Token Compliance

| Category | Check |
|----------|------|
| Color Tokens | semantic only |
| Spacing Tokens | scale respected |
| Radius Tokens | consistent |
| Shadow Tokens | shared scale |
| Typography Tokens | hierarchy respected |

---

## Token Optimization

| Signal | Fix |
|--------|------|
| repeated hex | token extraction |
| repeated px | spacing token |
| isolated shadow | elevation token |

---

## Context Enrichment

| Category | Check |
|----------|------|
| component name reflects business meaning |
| variant names semantic |
| token names explain intent |

---

## Visual Debt

| Problem | Fix |
|--------|------|
| duplicate card styles | shared component |
| excessive variants | variant consolidation |

---

# 12. Accessibility Review

## Critical Accessibility

- [ ] semantic HTML
- [ ] keyboard navigation
- [ ] focus visible
- [ ] labels meaningful
- [ ] aria valid

---

## Screen Reader

- [ ] heading order correct
- [ ] landmarks present
- [ ] live regions where needed

---

# 13. Security Review

## Must Check

- [ ] input validated
- [ ] secrets protected
- [ ] unsafe logs absent
- [ ] auth verified

---

## Security Smells

| Risk | Fix |
|------|------|
| XSS | sanitize |
| env leak | server isolation |
| injection | parameterization |

---

# 14. Testing Review

## Category | Check

| Category | Check |
|----------|------|
| Intent | business rule visible |
| Naming | scenario readable |
| Isolation | no shared state |
| Determinism | stable result |
| Assertion Quality | exact expectation |
| Coverage | full path range |

---

## Test Quality Assessment

| Dimension | Excellent | Acceptable | Poor (Flag) |
|----------|-----------|------------|-------------|
| Naming | full business behavior | partial clarity | vague |
| Isolation | fully isolated | minor dependency | shared state |
| Assertions | exact output | partial validation | weak assertion |
| Coverage | happy + edge + failure | happy + edge | happy only |
| Readability | immediate understanding | moderate reading | confusing |

---

## Test Quality Pattern

- arrange
- act
- assert

---

## Required Cases

- [ ] happy path
- [ ] edge case
- [ ] invalid input
- [ ] null case
- [ ] loading case
- [ ] failure case
- [ ] retry case

---

## Test Anti Patterns

| Anti Pattern | Problem | Fix |
|-------------|---------|------|
| Assertionless Test | false confidence | assert |
| Massive Test | too broad | split |
| Mock Explosion | unreadable | reduce mocks |
| Snapshot Abuse | hidden logic | explicit assertions |
| Timing Dependency | flaky | controlled async |

---

# 15. Documentation Review

- [ ] why explained where needed
- [ ] API contract documented
- [ ] complex logic explained
- [ ] readme updated when needed

---

# 16. Architecture Anti Patterns

| Anti Pattern | Problem | Fix |
|-------------|---------|------|
| Fat Controller | orchestration overload | service layer |
| Prop Drilling | deep prop chain | context/composition |
| Hook Explosion | too many hooks | split hooks |
| Conditional Hell | nested render | extraction |

---

# 17. Review Language Standard

## Positive

Strong separation of concerns.

## Suggestion

Consider extracting for long-term readability.

## Concern

This may create scaling difficulty later.

## Question

Why was this abstraction chosen?

---

# 18. Merge Decision Rules

## Block Merge If

- critical smell exists
- security issue exists
- failing tests exist
- broken accessibility exists

---

## Allow Merge With Warning If

- readability issue only
- optional refactor only

---

# 19. Long-Term Ownership Rule

Code must remain understandable after original author leaves.

---

# 20. Final Rule

Readable code is production safety.

---

Last Updated: April 2, 2026
Version: 3.0.0
```
