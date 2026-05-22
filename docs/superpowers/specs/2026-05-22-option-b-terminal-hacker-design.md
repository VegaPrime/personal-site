# Option B — Terminal Hacker Animations Design

**Goal:** Add typewriter entrance to the Hero section and a title glitch-hover effect to project cards, deepening the terminal/hacker aesthetic without adding any runtime JavaScript animation libraries.

**Architecture:** All motion is pure CSS (`@keyframes` + `steps()` timing function). Keyframes and helper classes are added to `app/globals.css`. React components reference those classes via `className`; no JS state machines or third-party deps are needed.

**Tech Stack:** Next.js (static export), React 19, Tailwind CSS v4, plain CSS keyframes.

---

## 1. Hero — Typewriter Entrance

### Behaviour

| Element | Animation | Cursor after |
|---|---|---|
| `$ whoami` | Types at t=0.3s, 0.7s duration | Blinking cursor stays forever |
| `Hi, I'm David Templeton.` | Types at t=1.2s, 1.2s duration | Cursor blinks while typing, fades out at t=2.4s |
| `Full-Stack Engineer & UI Craftsman` | Types at t=2.6s, 1.0s duration | Cursor blinks while typing, fades out at t=3.6s |
| Buttons row | Fades in at t=3.8s, 0.5s | — |

### Mechanism

Each text element is wrapped in a `<span>` with `overflow: hidden; white-space: nowrap; width: 0` and a `@keyframes` that animates `width` from `0` to `Nch` using `steps(N, end)`. This creates the classic character-by-character reveal without JS.

Each cursor is a sibling `<span>` styled as a solid block that matches the primary accent colour (`#00ff88`). The permanent cursor on `$ whoami` uses `animation: cursor-blink 0.8s step-end infinite`. The temporary cursors on name and role combine `cursor-blink` with a `cursor-fade` keyframe (`opacity → 0; width → 0`) that fires via `animation-delay` precisely when the line finishes typing.

### Character counts (determines `steps()` and `ch` width)

- `$ whoami` → 9 ch (includes trailing space for visual clearance)
- `Hi, I'm David Templeton.` → 24 ch
- `Full-Stack Engineer & UI Craftsman` → 34 ch

### Removal of old `mounted` pattern

`Hero.tsx` currently uses `useState(false)` + `useEffect` to trigger a fade-in class. This is replaced entirely by the CSS typewriter approach; the component no longer needs any hooks, and the `'use client'` directive can be removed.

---

## 2. Projects — Glitch Hover on Title (Option A)

### Behaviour

On card hover, only the `■ ProjectName` title text splits into magenta and cyan colour channels with a `clip-path` flicker animation. The card body (description, badges) and the existing lift + border-glow transition remain unchanged.

### Mechanism

Each title `<span>` receives class `glitch-title` and `data-text="■ ProjectName"`. The CSS rules:

```css
.glitch-title { position: relative; display: inline-block; }

.glitch-title::before,
.glitch-title::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  opacity: 0;
  pointer-events: none;
  /* font size/family inherited */
}

.glitch-card:hover .glitch-title::before {
  color: #ff00ff;
  opacity: 0.75;
  animation: glitch-a1 0.2s steps(2) infinite;
}

.glitch-card:hover .glitch-title::after {
  color: #00ffff;
  opacity: 0.75;
  animation: glitch-a2 0.2s steps(2) infinite;
}
```

`glitch-a1` and `glitch-a2` animate `transform: translate()` and `clip-path: inset()` out of phase to create the colour-channel split illusion.

The card wrapper (the `<div>` that already carries `hover:-translate-y-1`) receives the additional class `glitch-card`.

### Data flow

`data/projects.ts` already has `name` on each project object. The `■` prefix and the project `name` are concatenated at render time to produce the `data-text` value: `` data-text={`■ ${project.name}`} ``.

---

## 3. Files Changed

| File | Change |
|---|---|
| `app/globals.css` | Add `@keyframes` (type-prompt, type-name, type-role, cursor-blink, cursor-fade, glitch-a1, glitch-a2) and helper classes (`.hero-typewriter-prompt/name/role`, `.hero-cursor-blink`, `.hero-cursor-name`, `.hero-cursor-role`, `.hero-buttons-fade`, `.glitch-title`, `.glitch-card`) |
| `components/Hero.tsx` | Remove `mounted` state, `useEffect`, `'use client'`; replace with static typewriter markup using new CSS classes |
| `components/Projects.tsx` | Add `glitch-card` to card wrapper `className`; add `glitch-title` class and `data-text` attribute to title `<span>` |
| `__tests__/Hero.test.tsx` | Update to assert new typewriter markup elements (prompt span, name span, role span, cursor spans) |
| `__tests__/Projects.test.tsx` | Update to assert `glitch-card` class and `data-text` attribute on rendered cards |

---

## 4. Constraints

- No new npm packages.
- `output: 'export'` unchanged — no server features used.
- Accent colour `#00ff88` unchanged.
- All keyframes in `app/globals.css`; no inline `<style>` tags in components.
- The `FadeIn` component and `useInView` hook from Option A are untouched.
- Existing Option A scroll-fade-in on About, Resume, Contact is untouched.

---

## 5. Testing

- `Hero.test.tsx`: render Hero, assert presence of `.hero-typewriter-prompt`, `.hero-cursor-blink`, name span with `Hi, I'm`, role span with `Full-Stack`, buttons with `./view-projects`.
- `Projects.test.tsx`: render Projects, assert card wrapper has `glitch-card` class, title span has `glitch-title` class and correct `data-text`.
- CSS animation correctness verified visually in dev server before PR.
- All 33 existing tests must continue to pass.
