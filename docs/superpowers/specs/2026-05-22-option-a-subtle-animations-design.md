# Design: Option A — Subtle & Polished Animations

**Date:** 2026-05-22
**Status:** Approved
**Scope:** Scroll-triggered fade-ins, mount animations on Hero, staggered badge reveals, card hover lifts

---

## Goal

Make the site feel alive and polished without distracting from content. Every animation fires once and stays — no re-triggering on scroll back.

---

## New Files

### `hooks/useInView.ts`

Wraps `IntersectionObserver`. Returns `[ref, inView]`.

- `threshold`: default `0.15` (15% of element visible triggers it)
- `once: true` — fires only the first time the element enters the viewport
- No new npm dependencies

```ts
// Usage
const [ref, inView] = useInView()
// apply ref to element, use inView to toggle classes
```

### `components/FadeIn.tsx`

Lightweight presentational wrapper. Keeps animation logic out of section components.

Props:
- `children: React.ReactNode`
- `delay?: number` — ms, default `0`, applied via inline `transitionDelay`
- `className?: string` — passed through to the wrapper `<div>`

Behavior:
- Uses `useInView` internally
- When `inView` is false: `opacity-0 translate-y-4`
- When `inView` is true: `opacity-100 translate-y-0 transition-all duration-700`

---

## Modified Files

### `components/Hero.tsx`

Hero is above the fold — no scroll trigger needed. Uses a `mounted` state (flips to `true` in `useEffect` on first render) to drive the same fade-up pattern as `FadeIn` but without `IntersectionObserver`.

Stagger order and delays:
| Element | Delay |
|---|---|
| `$ whoami` prompt | 0ms |
| `h1` heading | 100ms |
| Subtitle / role | 200ms |
| CTA buttons | 300ms |

### `components/About.tsx`

- Wrap the inner `<div className="mx-auto max-w-5xl">` in `<FadeIn>` — the outer `<section id="about">` stays untouched so the nav anchor link works
- Each skill `<Badge>` wrapped in `<FadeIn delay={index * 60}>` for staggered reveal

### `components/Projects.tsx`

- Same pattern: `<section id="projects">` stays, inner `<div className="mx-auto max-w-5xl">` wrapped in `<FadeIn>`
- Each featured `<Card>` wrapped in `<FadeIn delay={index * 100}>` — cascades left to right
- Each secondary (non-featured) `<Card>` wrapped in `<FadeIn delay={index * 80}>`
- Hover lift added directly to Card className: `transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10`

### `components/Resume.tsx`

- `<section id="resume">` stays, inner `<div className="mx-auto max-w-5xl">` wrapped in `<FadeIn>`

### `components/Contact.tsx`

- `<section id="contact">` stays, inner `<div className="mx-auto max-w-5xl">` wrapped in `<FadeIn>`

---

## What Does NOT Change

- `Nav.tsx` — sticky, always visible, no animation
- All `/data/*.ts` files — content stays where it is
- `components/ui/*` — shadcn components untouched
- No new test files added (consistent with existing smoke-test scope)
- No new npm packages

---

## Constraints

- `'use client'` directive required on any component using `useInView` (it uses browser APIs)
- Hero needs `'use client'` added if not already present
- Tailwind classes used must already exist in the design system — no custom CSS needed
- Dark-mode glass effects (`dark:` prefix) on cards are preserved; hover lift sits on top of existing styles

---

## Acceptance Criteria

- [ ] Page load: Hero elements fade up sequentially with no scroll required
- [ ] Scrolling to About: section fades up, badges stagger in one by one
- [ ] Scrolling to Projects: cards cascade in left to right, hover lifts each card
- [ ] Scrolling to Resume/Contact: each section fades up
- [ ] Scroll back up, scroll down again: no re-animation (once only)
- [ ] No layout shift during animation (elements occupy space even while transparent)
- [ ] `tsc --noEmit` passes clean
- [ ] Existing tests pass
