---
name: nextjs
description: "Use when: building Next.js frontend features with TypeScript, HeroUI, Tailwind CSS, and maintainable component architecture"
---

# Next.js Frontend Skill

## 1. Repository Structure

| Folder | Responsibility | Rule |
|--------|----------------|------|
| app | routes, layouts, server components | route files remain thin |
| components | shared + feature UI | no business logic |
| config | constants, environment mapping | centralized only |
| hooks | reusable stateful logic | one hook = one responsibility |
| lib | domain logic, integrations | reusable across features |
| public | static assets | no logic |
| scripts | automation | isolated from runtime |
| styles | tokens, globals | token-first |
| types | shared contracts | explicit only |
| utils | pure helpers | stateless only |

---

## 2. Frontend SOLID Enforcement

| Principle | Check |
|-----------|------|
| SRP | one component = one responsibility |
| OCP | extend via props, avoid rewrite |
| LSP | child behavior preserves contract |
| ISP | minimal prop interfaces |
| DIP | rendering separated from domain logic |

---

## 3. Frontend OOP Application

| Principle | Check |
|-----------|------|
| Encapsulation | internal state hidden |
| Abstraction | hooks expose minimal API |
| Composition | preferred over inheritance |
| Contract Safety | props predictable |

---

## 4. Component Review Checklist

| Category | Check |
|----------|------|
| Component Size | split when responsibility grows |
| JSX Depth | avoid excessive nesting |
| Prop Contract | explicit and minimal |
| Side Effects | isolated |
| Reuse | avoid duplicate patterns |

---

## 5. TypeScript Frontend Rules

| Category | Check |
|----------|------|
| Explicit Types | exported contracts defined |
| `any` Usage | prohibited |
| Nullable Handling | explicit |
| Union Types | domain meaningful |
| Assertions | avoid unsafe casting |

---

## 6. Hooks Review

| Category | Check |
|----------|------|
| Responsibility | single logical concern |
| Dependency Safety | complete dependency array |
| Cleanup | explicit where required |
| Reusability | extract repeated logic |

---

## 7. State Management Review

| Category | Check |
|----------|------|
| Local State | component-owned only |
| Shared State | context/store only when needed |
| Derived State | avoid duplication |
| Updates | predictable transitions |

---

## 8. Rendering Review

| Category | Check |
|----------|------|
| Conditional Render | avoid nested ternary |
| Large JSX | extract subcomponent |
| Repeated Blocks | reusable component |
| Render Cost | heavy logic removed |

---

## 9. Responsive Layout Rules

| Category | Check |
|----------|------|
| Mobile First | mandatory |
| Breakpoint Consistency | stable |
| Spacing | token scale only |

---

## 10. HeroUI Usage

| Category | Check |
|----------|------|
| Base Layer | HeroUI first |
| Extension | minimal override |
| Duplication | avoid recreating existing patterns |

---

## 11. Design System Review

| Category | Check |
|----------|------|
| Color Usage | semantic tokens only |
| Spacing | scale values only |
| Radius | shared values |
| Shadow | tokenized |

---

## 12. Token Optimization

| Category | Check |
|----------|------|
| Repeated Values | extract |
| Arbitrary Values | avoid |
| One-off Colors | avoid |

---

## 13. Context Enrichment

| Category | Check |
|----------|------|
| Component Naming | business meaningful |
| Variant Naming | semantic |
| Token Naming | usage clear |

---

## 14. Accessibility Review

| Category | Check |
|----------|------|
| Semantic HTML | required |
| Focus Visibility | required |
| Keyboard Navigation | valid |
| Labels | explicit |

---

## 15. Performance Review

| Category | Check |
|----------|------|
| Images | next/image |
| Heavy Modules | dynamic import |
| Duplicate Fetch | avoid |
| Memoization | only when justified |

---

## 16. Animation Review

| Category | Check |
|----------|------|
| GPU Safe | transform / opacity only |
| Reduced Motion | respected |

---

## 17. Test Review Checklist

| Category | Check |
|----------|------|
| Render | stable |
| Interaction | verified |
| Edge Cases | covered |
| Accessibility | tested |

---

## 18. Test Quality Assessment

| Dimension | Excellent | Acceptable | Poor (Flag) |
|-----------|-----------|------------|-------------|
| Naming | business clear | understandable | vague |
| Assertions | exact behavior | partial | weak |
| Isolation | independent | limited dependency | shared state |
| Coverage | critical paths covered | partial | superficial |

---

## 19. Test Quality Patterns

- [ ] happy path
- [ ] invalid input
- [ ] empty state
- [ ] boundary values
- [ ] async completion
- [ ] error surface

---

## 20. Test Anti Patterns

| Anti Pattern | Problem | Fix |
|--------------|---------|------|
| snapshot abuse | weak validation | explicit assertions |
| excessive mocks | false confidence | reduce mocks |
| multi-behavior test | unclear failure | split test |

---

## 21. Frontend Anti Patterns

| Anti Pattern | Problem | Fix |
|--------------|---------|------|
| large component | unreadable | split by responsibility |
| deep prop chain | coupling | local abstraction |
| mixed concerns | maintenance cost | separate layers |

---

## 22. Long-Term Rule

- new feature extends existing architecture first  
- new pattern requires clear justification  
- repository consistency preferred over local optimization
```
