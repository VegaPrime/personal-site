# Option C — Ambient Matrix Rain Design

**Date:** 2026-05-22
**Status:** Approved
**Scope:** Add a canvas-based matrix rain background to the Hero section only

---

## Goal

Add a subtle, ambient matrix rain effect behind the Hero section to deepen the terminal/hacker aesthetic without changing any existing animations or adding visual noise to other sections.

## Architecture

A new `'use client'` React component (`MatrixRain`) owns the canvas and its animation loop. It is imported into the existing `Hero` server component as a purely visual layer. All other components — About, Projects, Resume, Contact — are untouched.

**Tech Stack:** Next.js 15 static export, React 19, plain Canvas 2D API, `requestAnimationFrame`.

---

## 1. MatrixRain Component

### Behaviour

- Renders a `<canvas>` absolutely positioned to fill its parent (the Hero `<section>`)
- Draws falling columns of green katakana and ASCII characters at ~7% opacity
- Animation runs via `requestAnimationFrame`; loop is cancelled on component unmount
- Canvas resizes to match the Hero section on window resize (ResizeObserver)
- `pointer-events: none` so all Hero interactions (button clicks, links) pass through

### Character set

Mix of katakana (`ア`–`ノ`) and ASCII (`0-9`, `A-F`, `<`, `>`, `|`) — same visual language as the glitch effect already on project cards.

### Rain parameters

| Parameter | Value |
|---|---|
| Column width | 16px |
| Font size | 13px monospace |
| Drop speed | 0.9px per frame |
| Trail length | 8 characters |
| Head opacity | 0.18 (bright white-green) |
| Trail max opacity | 0.07 (fades to 0 over trail) |
| Background fade | `rgba(5, 12, 5, 0.13)` per frame |
| Reset probability | 0.975 (drops reset randomly at bottom) |

These values match what was visually confirmed in the brainstorming preview (Option A opacity, Option B containment).

### Bottom fade

A CSS gradient mask on the Hero `<section>` fades the rain out over the last 120px before the next section:

```css
-webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
```

This is applied via a Tailwind arbitrary class or inline style on the `<canvas>` element, not on the section itself (to avoid masking the Hero text).

### Accessibility

- Canvas is `aria-hidden="true"` — purely decorative
- `pointer-events: none` — no impact on keyboard or mouse navigation
- `prefers-reduced-motion`: if the user has reduced motion enabled, the component renders nothing (early return before starting the animation loop)

---

## 2. Hero Integration

`components/Hero.tsx` is currently a Server Component (no `'use client'`). Server Components can import Client Components — no directive change needed on Hero.

`<MatrixRain />` is rendered as the first child inside the `<section>`, before the content wrapper:

```tsx
<section id="hero" className="relative overflow-hidden px-6 py-28 md:py-40">
  <MatrixRain />
  <div className="relative mx-auto max-w-5xl">
    {/* existing typewriter content unchanged */}
  </div>
</section>
```

The `relative` and `overflow: hidden` classes already on `<section>` contain the canvas. The content wrapper has `relative` positioning so it layers above the canvas (z-index stacking order).

---

## 3. Files Changed

| File | Action |
|---|---|
| `components/MatrixRain.tsx` | **Create** — `'use client'` canvas component |
| `components/Hero.tsx` | **Modify** — import and render `<MatrixRain />` as first child |
| `__tests__/MatrixRain.test.tsx` | **Create** — renders without crashing, canvas present, aria-hidden |

No other files are touched.

---

## 4. Constraints

- No new npm packages
- `output: 'export'` unchanged
- Accent colour `#00ff88` unchanged
- Option B typewriter animations in `app/globals.css` are untouched
- All other section components (About, Projects, Resume, Contact) are untouched
- Canvas must clean up its `requestAnimationFrame` loop and `ResizeObserver` on unmount

---

## 5. Testing

`__tests__/MatrixRain.test.tsx`:
- Renders without throwing
- A `<canvas>` element is in the document
- Canvas has `aria-hidden="true"`
- Canvas has `pointer-events: none` style

`__tests__/Hero.test.tsx`:
- All 6 existing tests continue to pass (no changes to Hero markup other than adding MatrixRain)

Canvas 2D context and `requestAnimationFrame` will be mocked in `jest.setup.ts`.
