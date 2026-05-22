# Option B — Terminal Hacker Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sequential CSS typewriter entrance to the Hero section and a title-only colour-channel glitch hover to every project card.

**Architecture:** All motion is pure CSS (`@keyframes` + `steps()` timing). Keyframes and helper classes are appended to `app/globals.css`. `Hero.tsx` swaps the JS `mounted` pattern for static typewriter markup (no hooks → no `'use client'`). `Projects.tsx` adds two classes and a `data-text` attribute; no structural changes.

**Tech Stack:** Next.js 15 static export, React 19, Tailwind CSS v4, plain CSS keyframes.

---

## File map

| File | Action |
|---|---|
| `app/globals.css` | Append typewriter + glitch keyframes and helper classes |
| `components/Hero.tsx` | Remove hooks/`'use client'`; replace with typewriter markup |
| `components/Projects.tsx` | Add `glitch-card` to `<Card>`, wrap title text in `<span className="glitch-title" data-text={…}>` |
| `__tests__/Hero.test.tsx` | Add assertions for new DOM structure |
| `__tests__/Projects.test.tsx` | Add assertions for `glitch-card` class and `data-text` attribute |

---

## Task 1: Create the feature branch

**Files:** none (git only)

- [ ] **Step 1: Create and switch to branch**

```bash
git checkout -b feat/option-b-terminal-hacker
```

Expected: `Switched to a new branch 'feat/option-b-terminal-hacker'`

---

## Task 2: Add CSS keyframes and helper classes to globals.css

**Files:**
- Modify: `app/globals.css`

No unit test covers raw CSS keyframes; correctness is verified visually in Task 5. Append the block below to the **end** of `app/globals.css` (after the closing `}` of the `@layer base` block).

- [ ] **Step 1: Append the CSS block**

Open `app/globals.css` and add the following at the very end of the file:

```css
/* ─────────────────────────────────────────────
   Option B: Terminal Hacker animations
───────────────────────────────────────────────*/

/* Typewriter reveal keyframes */
@keyframes hero-type-prompt { to { width: 9ch; } }
@keyframes hero-type-name   { to { width: 24ch; } }
@keyframes hero-type-role   { to { width: 34ch; } }

/* Cursor blink / fade */
@keyframes hero-cursor-blink { 50% { opacity: 0; } }
@keyframes hero-cursor-fade  { to { opacity: 0; width: 0; margin: 0; } }

/* Buttons appear */
@keyframes hero-buttons-appear { to { opacity: 1; } }

/* Typewriter spans — each starts hidden and expands one char at a time */
.hero-typewriter-prompt {
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  animation: hero-type-prompt 0.7s steps(9, end) 0.3s forwards;
}
.hero-typewriter-name {
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  animation: hero-type-name 1.2s steps(24, end) 1.2s forwards;
}
.hero-typewriter-role {
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  animation: hero-type-role 1.0s steps(34, end) 2.6s forwards;
}

/* Cursor blocks */
.hero-cursor-blink,
.hero-cursor-name,
.hero-cursor-role {
  display: inline-block;
  width: 7px;
  height: 1em;
  background: var(--color-primary);
  vertical-align: text-bottom;
  margin-left: 2px;
  flex-shrink: 0;
}
/* $ whoami — blinks forever */
.hero-cursor-blink {
  animation: hero-cursor-blink 0.8s step-end infinite;
}
/* Name cursor — blinks while typing, fades out at 2.4s (1.2s delay + 1.2s anim) */
.hero-cursor-name {
  animation: hero-cursor-blink 0.8s step-end infinite,
             hero-cursor-fade 0.15s ease 2.4s forwards;
}
/* Role cursor — blinks while typing, fades out at 3.6s (2.6s delay + 1.0s anim) */
.hero-cursor-role {
  animation: hero-cursor-blink 0.8s step-end infinite,
             hero-cursor-fade 0.15s ease 3.6s forwards;
}

/* Buttons row: invisible until typing is done */
.hero-buttons-fade {
  opacity: 0;
  animation: hero-buttons-appear 0.5s ease 3.8s forwards;
}

/* ─────────────────────────────────────────────
   Option B: Glitch hover — title only (Option A)
───────────────────────────────────────────────*/

@keyframes glitch-a1 {
  0%   { transform: translate(-2px,  0px); clip-path: inset(0 0 70% 0); }
  50%  { transform: translate( 2px,  1px); clip-path: inset(40% 0 30% 0); }
  100% { transform: translate(-1px,  0px); clip-path: inset(70% 0 0 0); }
}
@keyframes glitch-a2 {
  0%   { transform: translate( 2px,  0px); clip-path: inset(30% 0 50% 0); }
  50%  { transform: translate(-2px, -1px); clip-path: inset(60% 0 10% 0); }
  100% { transform: translate( 1px,  0px); clip-path: inset(10% 0 70% 0); }
}

.glitch-title {
  position: relative;
  display: inline-block;
}
.glitch-title::before,
.glitch-title::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  white-space: nowrap;
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

- [ ] **Step 2: Verify the dev server compiles without errors**

```bash
npm run dev
```

Open `http://localhost:3000`. The page should look identical to before (no changes to components yet). No red errors in the terminal. Stop the dev server (`Ctrl+C`) before continuing.

---

## Task 3: Update Hero.tsx

**Files:**
- Modify: `__tests__/Hero.test.tsx`
- Modify: `components/Hero.tsx`

### 3a — Update the tests first

- [ ] **Step 1: Replace `__tests__/Hero.test.tsx` with the following**

```tsx
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

describe('Hero', () => {
  it('renders the whoami prompt text', () => {
    render(<Hero />)
    expect(screen.getByText('$ whoami')).toBeInTheDocument()
  })

  it('renders the whoami cursor with hero-cursor-blink class', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('.hero-cursor-blink')).toBeInTheDocument()
  })

  it('renders name text with hero-typewriter-name class', () => {
    const { container } = render(<Hero />)
    const nameSpan = container.querySelector('.hero-typewriter-name')
    expect(nameSpan).toBeInTheDocument()
    expect(nameSpan?.textContent).toContain("Hi, I'm")
    expect(nameSpan?.textContent).toContain('David Templeton')
  })

  it('renders role text with hero-typewriter-role class', () => {
    const { container } = render(<Hero />)
    const roleSpan = container.querySelector('.hero-typewriter-role')
    expect(roleSpan).toBeInTheDocument()
    expect(roleSpan?.textContent).toContain('Full-Stack Engineer')
  })

  it('renders view projects button linking to #projects', () => {
    render(<Hero />)
    const btn = screen.getByRole('link', { name: /view-projects/i })
    expect(btn).toHaveAttribute('href', '#projects')
  })

  it('renders download resume button linking to resume pdf', () => {
    render(<Hero />)
    const btn = screen.getByRole('link', { name: /download-resume/i })
    expect(btn).toHaveAttribute('href', '/resume.pdf')
  })
})
```

- [ ] **Step 2: Run the tests — expect failures on the new assertions**

```bash
npm test -- --testPathPattern="Hero" --no-coverage
```

Expected: 3 old tests pass, 3 new tests fail (`.hero-cursor-blink`, `.hero-typewriter-name`, `.hero-typewriter-role` not found yet).

### 3b — Implement the new Hero

- [ ] **Step 3: Replace the entire contents of `components/Hero.tsx` with the following**

```tsx
import { buttonVariants } from '@/components/ui/button'

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 py-28 md:py-40"
    >
      <div className="relative mx-auto max-w-5xl">

        {/* Line 1: $ whoami — cursor blinks forever */}
        <div className="mb-3 flex items-center font-mono text-sm text-primary">
          <span className="hero-typewriter-prompt">$ whoami</span>
          <span className="hero-cursor-blink" aria-hidden="true" />
        </div>

        {/* Line 2: name — cursor disappears after typing */}
        <div className="mb-3 flex items-baseline text-4xl font-black leading-tight tracking-tight md:text-6xl">
          <span className="hero-typewriter-name">
            Hi, I&apos;m{' '}
            <span className="text-primary">David Templeton</span>.
          </span>
          <span className="hero-cursor-name" aria-hidden="true" />
        </div>

        {/* Line 3: role — cursor disappears after typing */}
        <div className="mb-8 flex items-center font-mono text-sm text-muted-foreground md:text-base">
          <span className="hero-typewriter-role">
            Full-Stack Engineer &amp; UI Craftsman
          </span>
          <span className="hero-cursor-role" aria-hidden="true" />
        </div>

        {/* Buttons: fade in after typing completes */}
        <div className="hero-buttons-fade flex flex-wrap gap-3">
          <a href="#projects" className={buttonVariants()}>
            ./view-projects
          </a>
          <a href="/resume.pdf" download className={buttonVariants({ variant: 'outline' })}>
            ./download-resume
          </a>
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run Hero tests — all 6 must pass**

```bash
npm test -- --testPathPattern="Hero" --no-coverage
```

Expected: `Tests: 6 passed, 6 total`

- [ ] **Step 5: Run the full test suite — all tests must pass**

```bash
npm test -- --no-coverage
```

Expected: all tests pass with 0 failures.

---

## Task 4: Update Projects.tsx

**Files:**
- Modify: `__tests__/Projects.test.tsx`
- Modify: `components/Projects.tsx`

### 4a — Update the tests first

- [ ] **Step 1: Replace `__tests__/Projects.test.tsx` with the following**

```tsx
import { render, screen } from '@testing-library/react'
import Projects from '@/components/Projects'

jest.mock('@/data/projects', () => ({
  projects: [
    {
      title: 'Test Project',
      description: 'A test project description.',
      stack: ['TypeScript', 'Next.js'],
      github: 'https://github.com/user/test',
      featured: true,
    },
    {
      title: 'Another Project',
      description: 'Another description.',
      stack: ['Go'],
      featured: false,
    },
  ],
}))

describe('Projects', () => {
  it('renders all projects', () => {
    render(<Projects />)
    expect(screen.getByText(/Test Project/)).toBeInTheDocument()
    expect(screen.getByText(/Another Project/)).toBeInTheDocument()
  })

  it('renders stack badges', () => {
    render(<Projects />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Go')).toBeInTheDocument()
  })

  it('renders github link when provided', () => {
    render(<Projects />)
    const githubLink = screen.getByRole('link', { name: /git/i })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/user/test')
  })

  it('card wrapper has glitch-card class', () => {
    const { container } = render(<Projects />)
    const glitchCards = container.querySelectorAll('.glitch-card')
    expect(glitchCards.length).toBeGreaterThan(0)
  })

  it('title span has glitch-title class and correct data-text attribute', () => {
    const { container } = render(<Projects />)
    const glitchTitles = container.querySelectorAll('.glitch-title')
    expect(glitchTitles.length).toBeGreaterThan(0)
    // Featured project title
    const featuredTitle = container.querySelector('[data-text="■ Test Project"]')
    expect(featuredTitle).toBeInTheDocument()
    expect(featuredTitle).toHaveClass('glitch-title')
    // Non-featured project title
    const restTitle = container.querySelector('[data-text="■ Another Project"]')
    expect(restTitle).toBeInTheDocument()
    expect(restTitle).toHaveClass('glitch-title')
  })
})
```

- [ ] **Step 2: Run the tests — expect failures on new assertions**

```bash
npm test -- --testPathPattern="Projects" --no-coverage
```

Expected: 3 old tests pass, 2 new tests fail (`glitch-card` and `glitch-title` not yet in markup).

### 4b — Implement the glitch markup

- [ ] **Step 3: Replace the entire contents of `components/Projects.tsx` with the following**

```tsx
import { projects } from '@/data/projects'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { GitFork, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/FadeIn'

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="px-6 py-20">
      <FadeIn>
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 font-mono text-xs text-primary">## ./projects</p>
          <h2 className="mb-10 text-2xl font-bold">Projects</h2>

          <div className="mb-6 grid gap-6 md:grid-cols-2">
            {featured.map((project, index) => (
              <FadeIn key={project.title} delay={index * 100}>
                <Card className="glitch-card border-primary/20 bg-card/50 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <CardTitle className="font-mono text-sm text-primary">
                      <span
                        className="glitch-title"
                        data-text={`■ ${project.title}`}
                      >
                        ■ {project.title}
                      </span>
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge key={tech} variant="outline" className="font-mono text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                        >
                          <GitFork className="mr-1 h-3 w-3" /> GitHub
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" /> Live
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          {rest.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3">
              {rest.map((project, index) => (
                <FadeIn key={project.title} delay={index * 80}>
                  <Card className="glitch-card bg-card/30 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-mono text-xs text-primary">
                        <span
                          className="glitch-title"
                          data-text={`■ ${project.title}`}
                        >
                          ■ {project.title}
                        </span>
                      </CardTitle>
                      <CardDescription className="text-xs">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {project.stack.map((tech) => (
                          <Badge key={tech} variant="outline" className="font-mono text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-2 px-0')}
                        >
                          <GitFork className="mr-1 h-3 w-3" /> GitHub
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </section>
  )
}
```

- [ ] **Step 4: Run Projects tests — all 5 must pass**

```bash
npm test -- --testPathPattern="Projects" --no-coverage
```

Expected: `Tests: 5 passed, 5 total`

- [ ] **Step 5: Run full suite — all tests must pass**

```bash
npm test -- --no-coverage
```

Expected: all tests pass with 0 failures.

---

## Task 5: Visual verification

**Files:** none (dev server only)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Check Hero typewriter on page load**

Open `http://localhost:3000`.

Verify in order:
1. `$ whoami` types out letter by letter; cursor blinks and stays forever
2. `Hi, I'm David Templeton.` types out; cursor blinks while typing, then disappears
3. `Full-Stack Engineer & UI Craftsman` types out; cursor blinks, then disappears
4. `./view-projects` and `./download-resume` buttons fade in after typing finishes
5. Reload the page and confirm the animation replays from scratch

- [ ] **Step 3: Check glitch hover on project cards**

Scroll to the Projects section. Hover over any project card.

Verify:
1. Only the `■ ProjectName` title text glitches (magenta + cyan split)
2. Card body (description, badges, buttons) does not move
3. The existing lift + border glow transition still works
4. Moving cursor off the card stops the glitch immediately

- [ ] **Step 4: Stop the dev server**

`Ctrl+C`

---

## Task 6: Commit and open PR

**Files:** git only

- [ ] **Step 1: Run type-check and lint**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes with `Export successful` and no TypeScript errors.

- [ ] **Step 2: Stage and commit**

```bash
git add app/globals.css components/Hero.tsx components/Projects.tsx __tests__/Hero.test.tsx __tests__/Projects.test.tsx
git commit -m "$(cat <<'EOF'
feat: Option B — typewriter Hero and glitch hover on project titles

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Push branch**

```bash
git push -u origin feat/option-b-terminal-hacker
```

- [ ] **Step 4: Open pull request**

```bash
gh pr create \
  --title "feat: Option B — typewriter Hero and glitch project title hover" \
  --body "$(cat <<'EOF'
## Summary
- Hero entrance replaced with sequential CSS typewriter: `$ whoami` → name → role, buttons fade in after
- Project card titles get a colour-channel glitch effect on hover (magenta + cyan split via CSS `::before`/`::after`)
- All motion is pure CSS keyframes — no new JS, no new npm packages
- `Hero.tsx` drops `'use client'` and all hooks (no longer needed)

## Test plan
- [ ] All 33+ existing tests pass
- [ ] New Hero tests: typewriter classes present, cursor classes present
- [ ] New Projects tests: `glitch-card` class on wrapper, `glitch-title` class + `data-text` on title spans
- [ ] Visual: typewriter animates on load, replays on reload
- [ ] Visual: glitch fires only on title text when card is hovered
EOF
)"
```
