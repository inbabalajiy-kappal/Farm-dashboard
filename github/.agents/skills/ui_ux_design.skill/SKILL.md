---
name: uiuxdesign
description: "Use when: designing and implementing UI/UX features following design system principles, accessibility standards, and user experience best practices"
---

# UI/UX Design Skill

## Overview
Comprehensive workflow for designing and implementing user interfaces that prioritize user experience, accessibility, and design consistency across the application.

## Core Design Principles

### User-Centered Design
- Understand user needs and pain points
- Create intuitive interfaces that match user mental models
- Minimize cognitive load
- Provide clear feedback for user actions

### Consistency
- Maintain visual consistency across all pages
- Use the design system (HeroUI) for component consistency
- Follow established color, typography, and spacing conventions
- Create predictable interaction patterns

### Accessibility (A11y)
- Follow WCAG 2.1 AA standards
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation support
- Maintain sufficient color contrast (4.5:1 for text)

### Responsive Design
- Mobile-first approach
- Test on all breakpoints (mobile, tablet, desktop)
- Optimize touch targets (minimum 44x44px)
- Use Tailwind CSS responsive utilities

---

## Layout & Composition Analysis

### Grid System & Responsive Design
**Best Practices**:
- Consistent CSS Grid and Flexbox layouts
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Container max-width: `max-w-7xl` (1280px) for optimal readability
- Adequate padding: `px-6 lg:px-8` for responsive gutters
- Well-structured patterns: 2-column, 3-column, 4-column layouts

**Common Patterns**:
```css
/* 2-column responsive */
grid-cols-1 md:grid-cols-2

/* 3-column with fallback */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* 4-column for services/products */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
```

### F-Pattern & Z-Pattern Reading Flow
**F-Pattern** (for images with text):
- Headline positioned at top (strong visual weight)
- First line of content received heavy attention
- Subsequent lines receive progressively less attention
- Visual hierarchy critical for scannability

**Z-Pattern** (for balanced layouts):
- Primary visual element (top-left)
- Secondary content (center)
- Content column (left to right)
- Call-to-action (bottom-right)

**Implementation Checklist**:
- [ ] Hero section follows F or Z pattern appropriately
- [ ] Natural reading order matches design intent
- [ ] Visual connections between anchor points
- [ ] Eye tracking flows to important CTAs

### Visual Hierarchy
**Typography Hierarchy**:
```css
/* Hero Section */
h1: text-5xl lg:text-7xl font-bold

/* Section Headers */
h2: text-4xl lg:text-5xl font-bold

/* Card/Subsection Titles */
h3: text-xl lg:text-2xl font-semibold

/* Body Text */
body: text-lg leading-relaxed
small: text-sm text-gray-600
```

**Color Hierarchy**:
- Primary brand color: Featured elements, CTAs
- Secondary color: Supporting information
- Neutral grays: Background, secondary text
- Ensure 4-5 color stops maximum

---

## Gestalt Principles Application

### 1. Proximity ✅
**Rule**: Elements placed close together appear related
**Implementation**:
- Group related elements with consistent spacing
- Service cards grouped in grid: `gap-6`
- Internal component padding: `p-6` standard
- White space between unrelated sections: `py-20`

**Audit Checklist**:
- [ ] Related information visually grouped
- [ ] Adequate spacing (`gap-4` to `gap-8`) between sections
- [ ] Card components maintain internal cohesion
- [ ] No ambiguous groupings

### 2. Similarity ⚠️
**Rule**: Similar objects are perceived as related
**Implementation**:
- Standardize button styles with variants: solid, bordered, flat, ghost
- Consistent card components across all sections
- Unified color usage following semantic rules
- Consistent icon styles and sizing

**Audit Checklist**:
- [ ] Button styles consistent (primary, secondary, tertiary)
- [ ] Color palette: max 5-7 colors + neutrals
- [ ] Icon sizes uniform (24px, 32px, 48px standard)
- [ ] Card styling aligned across product sections
- [ ] Typography weights used consistently

**Semantic Color System**:
```typescript
// Primary: Main interactions
PRIMARY = '#06c7c7' // Cyan

// Semantic Colors
SUCCESS = '#10b981' // Green
WARNING = '#f59e0b' // Amber
DESTRUCTIVE = '#ef4444' // Red

// Neutral
BACKGROUND = '#ffffff'
SURFACE = '#f3f4f6'
BORDER = '#e5e7eb'
TEXT = '#1f2937'
TEXT_SECONDARY = '#6b7280'
```

### 3. Continuity ✅
**Rule**: Elements arranged in straight lines appear more related
**Implementation**:
- Smooth animations with `transition-all duration-300`
- Scroll reveal animations creating visual flow
- Consistent navigation patterns throughout
- Predictable component behavior

### 4. Closure ⚠️
**Rule**: People perceive incomplete shapes as complete
**Implementation**:
- Use subtle borders for section definition
- Card shadows provide visual containment: `shadow-lg`
- Background color changes define regions
- Subtle gradients guide attention

**Patterns**:
```typescript
// Add closure to sections
<section className="bg-gradient-to-b from-white to-gray-50 py-20">
  {/* Content */}
</section>

// Card containment
<Card className="border border-gray-200 shadow-md rounded-lg">
  {/* Content */}
</Card>
```

---

## Usability Laws

### Fitts's Law: Minimize Time to Target
**Formula**: Time = a + b × log₂(D/W)
- D = Distance to target
- W = Width of target

**Application**:
- Buttons: `px-8 py-4` minimum (≥44×44px for touch)
- Navigation links: Pad to 44×44px minimum touch target
- Icon buttons: 48×48px minimum
- Scroll-to-top: 48×48px minimum

**Audit Checklist**:
- [ ] All interactive elements ≥44×44px on mobile
- [ ] Adequate spacing between clickable elements (8px minimum)
- [ ] Primary CTAs positioned at predictable locations
- [ ] Hover targets enlarged for better acquisition

**Example**:
```typescript
// Good: Large, easy-to-hit target
<button className="px-8 py-4 min-w-[48px] min-h-[48px]">
  Click me
</button>

// Bad: Too small for mobile
<button className="px-2 py-1">
  Click
</button>
```

### Hick's Law: Reduce Decision Complexity
**Formula**: RT = a + b × log₂(N)
- N = Number of choices
- RT = Reaction time

**Optimal Ranges**:
- Navigation items: 5-7 (7±2 rule)
- CTAs per section: 1-2 primary, 1 secondary
- Card actions: 1 primary action
- Form fields: 5-7 maximum per form

**Implementation**:
- Main navigation: 5 items (Home, Services, About, Blog, Contact)
- Hero section: 2 clear CTAs (Primary + Secondary)
- Service cards: Single action per card
- Decision paths: Group related choices

**Audit Checklist**:
- [ ] Navigation items ≤7
- [ ] Primary/secondary action hierarchy clear
- [ ] Cognitive load minimized
- [ ] Related choices grouped

### Miller's Law: 7±2 Chunk Limit
**Rule**: Most people can hold 5-9 items in working memory

**Application**:
- Nav items: 5 items ✓
- Service cards: 4 items ✓
- Blog grid: 3 items ✓
- Feature list: Group into 3-5 categories

---

## Color Theory & Psychology

### Semantic Color Mapping
**Blue/Cyan**: Trust, technology, stability
- Primary brand communication
- Interactive elements
- Links and CTAs

**Green**: Growth, success, positive
- Success messages
- Completed states
- CTA for conversion-focused elements

**Red/Orange**: Urgency, attention, warning
- Destructive actions
- Error states
- High-priority notifications

**Gray/Neutral**: Background, text, structure
- Content hierarchy
- Disabled states
- Secondary information

### Contrast & Accessibility
**WCAG 2.1 Standards**:
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- UI components: 3:1 for focus indicators

**Testing Tools**:
- WebAIM Contrast Checker
- Browser DevTools accessibility audit
- axe DevTools extension

**Implementation**:
```typescript
// Good: Sufficient contrast
<p className="text-gray-900 bg-white">Text with 21:1 contrast</p>

// Bad: Insufficient contrast
<p className="text-gray-400 bg-gray-100">Text with 1.2:1 contrast</p>
```

---

## Typography System

### Type Scale Definition
```css
/* Recommended Tailwind scale */
text-xs:   0.75rem  /* 12px */
text-sm:   0.875rem /* 14px */
text-base: 1rem     /* 16px */
text-lg:   1.125rem /* 18px */
text-xl:   1.25rem  /* 20px */
text-2xl:  1.5rem   /* 24px */
text-3xl:  1.875rem /* 30px */
text-4xl:  2.25rem  /* 36px */
text-5xl:  3rem     /* 48px */
text-6xl:  3.75rem  /* 60px */
text-7xl:  4.5rem   /* 72px */
```

### Font Family Strategy
- Primary (body): Inter, Segoe UI, sans-serif
- Display (headings): Optional secondary font for brand
- Monospace (code): Courier New, monospace

### Line Height Guidelines
```css
heading:  line-height: 1.2 (120%)
body:     line-height: 1.6 (160%)
compact:  line-height: 1.4 (140%)
```

---

## Mobile-First Design

### Breakpoint Strategy
```css
SM: 640px  - Small phones, landscape
MD: 768px  - Tablets
LG: 1024px - Small laptops
XL: 1280px - Desktops
2XL: 1536px - Large displays
```

### Mobile UX Optimizations
- Touch targets: 44×44px minimum
- Font size minimum: 16px (prevents zoom on iOS)
- Tap-friendly spacing: 8px minimum between interactive elements
- Simplified navigation on mobile (hamburger menu)
- One-column layouts for mobile, multi-column for desktop

### Responsive Image Strategy
```typescript
<Image
  src="/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  className="w-full h-auto"
  priority={false}
  loading="lazy"
/>
```

### Progressive Enhancement
- Core content loads without JavaScript
- CSS-based responsive design
- Graceful animation fallbacks
- Enhanced experiences for capable devices

---

## Accessibility Compliance (WCAG 2.1 AA)

### Color & Contrast
- [ ] Text contrast: 4.5:1 (normal), 3:1 (large)
- [ ] UI component contrast: 3:1 for boundaries
- [ ] Color not sole means of conveying information
- [ ] Focus indicators: 3:1 contrast

### Keyboard Navigation
- [ ] All interactive elements keyboard accessible
- [ ] Focus order logical (LTR, top-to-bottom)
- [ ] Tab key navigation works smoothly
- [ ] No keyboard traps (can always escape)
- [ ] Focus visible with clear indicator

### Screen Reader Support
- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`)
- [ ] ARIA landmarks defined
- [ ] Image alt text descriptive
- [ ] Form labels associated with inputs
- [ ] Dynamic content announcements
- [ ] Skip navigation link present

### Motion & Animation
- [ ] Respect `prefers-reduced-motion` media query
- [ ] No auto-playing videos
- [ ] No flashing content (>3Hz)
- [ ] Animation duration ≤2 seconds for critical interactions

---

## UX Performance Metrics

### Page Performance
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.8s

### Design System Scoring
**Layout & Structure**: 8/10 - Grid systems, responsive patterns
**Usability**: 7/10 - Navigation, information architecture
**Accessibility**: 6/10 - Contrast, keyboard nav, ARIA
**Visual Design**: 7/10 - Color consistency, typography
**Performance**: 8/10 - Image optimization, animations

**Overall UX Maturity**: 7.2/10

---

## Implementation Priorities

### High Priority
1. Fix missing focus indicators for keyboard navigation
2. Verify and fix color contrast ratios
3. Standardize color system with semantic mapping
4. Increase touch target sizes to 44×44px minimum

### Medium Priority
1. Implement comprehensive typography scale
2. Add animation performance optimization
3. Complete WCAG 2.1 AA accessibility audit
4. Unify component styling across sections

### Low Priority
1. Micro-interactions and delightful details
2. Personalization features
3. Advanced analytics integration
4. Internationalization preparation

## HeroUI Design System

### Component Palette
Use HeroUI components as the foundation:
- **Navigation**: Navbar, Breadcrumb, Tabs
- **Layout**: Card, Container, Divider
- **Forms**: Input, Select, Checkbox, Radio, Switch
- **Feedback**: Button, Badge, Tooltip, Popover
- **Data**: Table, Pagination, Skeleton
- **Overlay**: Modal, Dropdown, Menu

### Design Tokens
- **Colors**: Follow brand color palette
- **Typography**: Consistent font hierarchy
- **Spacing**: Use 4px or 8px grid system
- **Shadows**: Subtle elevation changes
- **Transitions**: Smooth 200-300ms animations

## UI Implementation Checklist

### Layout
- [ ] Use CSS Grid/Flexbox for responsive layouts
- [ ] Employ breakpoint-based responsive design
- [ ] Maintain consistent spacing and alignment
- [ ] Implement whitespace strategically

### Forms
- [ ] Clear labels and instructions
- [ ] Helpful error messages
- [ ] Visual feedback for field states
- [ ] Logical tab order
- [ ] Submit button is clearly identifiable

### Navigation
- [ ] Intuitive information hierarchy
- [ ] Clear breadcrumb trails
- [ ] Consistent navigation patterns
- [ ] Active state indicators
- [ ] Accessible skip links

### Interactions
- [ ] Hover/focus states for interactive elements
- [ ] Loading states for async operations
- [ ] Success/error notifications
- [ ] Smooth transitions and animations
- [ ] Disabled state for unavailable actions

## Accessibility Checklist

### Visual
- [ ] Color isn't the only indicator of information
- [ ] Sufficient contrast ratios (4.5:1 minimum text)
- [ ] Text is resizable without loss of functionality
- [ ] No flashing or blinking content

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Logical tab order (left-to-right, top-to-bottom)
- [ ] Focus indicators are visible
- [ ] No keyboard traps

### Semantic HTML
```typescript
// Good: Semantic HTML with ARIA
<button aria-label="Close menu" onClick={handleClose}>×</button>
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

// Bad: Non-semantic elements
<div onClick={handleClick} role="button">Click me</div>
```

### Screen Reader Support
- [ ] Image alt text is descriptive
- [ ] Form labels associated with inputs
- [ ] ARIA landmarks defined properly
- [ ] Dynamic content updates announced

## Advanced Animation Performance

### GPU-Accelerated Properties
```typescript
// Good: Use transform and opacity only
className="transition-all duration-300 hover:scale-105 hover:opacity-80"

// Bad: Animating layout properties
className="transition-all duration-300 hover:width-[300px]"
```

### Reduced Motion Support
```typescript
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

// In React:
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Animation Performance Checklist
- [ ] Only transform and opacity animated
- [ ] No animations on page load (lazy reveal)
- [ ] Intersection Observer for scroll animations
- [ ] `will-change` used sparingly
- [ ] Tested on low-end devices
- [ ] Frame rate consistent (60fps target)

## Testing & Validation

### Usability Testing Process
1. Test with 5+ real users
2. Observe natural behavior
3. Collect feedback on:
   - Task completion rate
   - Time to complete key tasks
   - Error rates
   - Satisfaction scores
4. Iterate on findings

### Accessibility Testing
```bash
# Automated tools
npm install -D axe-core
npm install -D jest-axe

# Manual testing
- Keyboard-only navigation
- Screen reader (NVDA, JAWS, VoiceOver)
- Browser zoom (200%)
- Color blindness simulation
```

### Responsive Testing Devices
- **Mobile**: iPhone SE, iPhone 14, Pixel 6
- **Tablet**: iPad (9.7"), iPad Air
- **Desktop**: 1366×768, 1920×1080, 2560×1440

### Responsive Testing Orientation
- [ ] Portrait mode on mobile
- [ ] Landscape mode on mobile
- [ ] Tablet portrait and landscape
- [ ] Desktop with zoom 100%, 150%, 200%

### Performance Audit Tools
- Lighthouse (Chrome DevTools)
- WebPageTest
- Speedcurve
- Real User Monitoring (RUM)

---

**Last Updated**: April 1, 2026
