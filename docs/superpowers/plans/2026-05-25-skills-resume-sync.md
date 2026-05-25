# Skills Resume Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract skills from `public/resume.pdf` via the existing Claude sync script and drive the About section's skills badges from `data/resume.ts` instead of a hardcoded array.

**Architecture:** Extend the existing `sync-resume.ts` script to ask Claude for a `skills` array alongside experience/education. Add the field to the `ResumeData` type and the generated output. Update `About.tsx` to read `resume.skills` from the data module.

**Tech Stack:** TypeScript, Next.js (static export), Anthropic SDK (`@anthropic-ai/sdk`), Jest + Testing Library.

---

### Task 1: Add `skills` field to the ResumeData type and seed a default

**Files:**
- Modify: `data/resume.ts`

The type must be updated first so subsequent TypeScript changes compile. We also add `skills: []` to the existing generated object so the file is valid before the sync script runs.

- [ ] **Step 1: Update the type definitions in `data/resume.ts`**

  Replace the `ResumeData` type block (lines 17–21) with:

  ```ts
  export type ResumeData = {
    hasDocx: boolean
    skills: string[]
    experience: Experience[]
    education: Education[]
  }
  ```

- [ ] **Step 2: Add `skills: []` to the exported `resume` object**

  In the same file, add `"skills": []` as the second key of the `resume` object (after `hasDocx`):

  ```ts
  export const resume: ResumeData = {
    "hasDocx": false,
    "skills": [],
    "experience": [ ... ],   // unchanged
    "education": [ ... ],    // unchanged
  }
  ```

- [ ] **Step 3: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add data/resume.ts
  git commit -m "feat: add skills field to ResumeData type"
  ```

---

### Task 2: Write failing tests for the new `skills` field

**Files:**
- Modify: `__tests__/data.test.ts`
- Modify: `__tests__/About.test.tsx`

- [ ] **Step 1: Add skills assertions to `__tests__/data.test.ts`**

  Append inside the existing `describe('data/resume', ...)` block:

  ```ts
  it('has a skills array', () => {
    expect(Array.isArray(resume.skills)).toBe(true)
  })

  it('each skill is a non-empty string', () => {
    resume.skills.forEach((s) => {
      expect(typeof s).toBe('string')
      expect(s.length).toBeGreaterThan(0)
    })
  })
  ```

- [ ] **Step 2: Run the new tests — they should pass (empty array is valid)**

  ```bash
  npx jest __tests__/data.test.ts --no-coverage
  ```

  Expected: all tests PASS (`skills` is `[]`, so the `forEach` vacuously passes).

- [ ] **Step 3: Confirm the existing About test still passes**

  ```bash
  npx jest __tests__/About.test.tsx --no-coverage
  ```

  Expected: PASS (About still uses its own hardcoded array for now).

- [ ] **Step 4: Commit**

  ```bash
  git add __tests__/data.test.ts
  git commit -m "test: add skills field assertions to data tests"
  ```

---

### Task 3: Update `About.tsx` to use `resume.skills`

**Files:**
- Modify: `components/About.tsx`

- [ ] **Step 1: Replace the hardcoded array and import**

  Replace the entire top of `components/About.tsx` (lines 1–8) with:

  ```tsx
  import { Badge } from '@/components/ui/badge'
  import { FadeIn } from '@/components/FadeIn'
  import { resume } from '@/data/resume'
  ```

  Then in the JSX, replace `skills.map(...)` with `resume.skills.map(...)` (line 38):

  ```tsx
  {resume.skills.map((skill, index) => (
    <FadeIn key={skill} delay={index * 60}>
      <Badge variant="outline" data-testid="skill-badge">
        {skill}
      </Badge>
    </FadeIn>
  ))}
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Run the About test — it will now render 0 badges (skills is still `[]`)**

  ```bash
  npx jest __tests__/About.test.tsx --no-coverage
  ```

  Expected: the "renders at least one skill badge" test **FAILS** because `resume.skills` is still empty. This is the expected red state before the sync populates it.

- [ ] **Step 4: Commit**

  ```bash
  git add components/About.tsx
  git commit -m "feat: wire About skills badges to resume.skills data"
  ```

---

### Task 4: Extend the sync script to extract skills

**Files:**
- Modify: `scripts/sync-resume.ts`

- [ ] **Step 1: Add `skills` to the Claude prompt shape**

  In `scripts/sync-resume.ts`, update the prompt's JSON shape (around line 36) to include `skills`:

  ```ts
  content: `Extract structured resume data from the text below. Return ONLY a valid JSON object — no markdown fences, no explanation — matching this exact shape:

  {
    "skills": ["string"],
    "experience": [
      {
        "company": "string",
        "role": "string",
        "period": "string (e.g. '2022 – Present')",
        "bullets": ["string"]
      }
    ],
    "education": [
      {
        "school": "string",
        "degree": "string",
        "year": "string (4-digit year)"
      }
    ]
  }

  For "skills", extract a flat list of distinct technical skills (languages, frameworks, tools, platforms) mentioned anywhere in the resume. Each entry should be a short noun phrase (e.g. "React", "TypeScript", "PostgreSQL"). Do not include soft skills.

  Resume text:
  ${text}`,
  ```

- [ ] **Step 2: Update the parsed type and output template**

  Change the `parsed` type annotation (line 64) to include `skills`:

  ```ts
  let parsed: { skills: unknown[]; experience: unknown[]; education: unknown[] }
  ```

  The `JSON.stringify` call on line 93 already spreads `parsed`, so `skills` will be included automatically. No other changes needed.

- [ ] **Step 3: Verify TypeScript compiles**

  ```bash
  npx tsc --project tsconfig.scripts.json --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add scripts/sync-resume.ts
  git commit -m "feat: extract skills from resume PDF in sync script"
  ```

---

### Task 5: Run sync and verify end-to-end

**Files:**
- Regenerated: `data/resume.ts`

- [ ] **Step 1: Run the sync script**

  ```bash
  npm run sync-resume
  ```

  Expected output:
  ```
  sync-resume: extracting text from resume.pdf...
  sync-resume: parsing with Claude...
  sync-resume: data/resume.ts updated successfully
  ```

- [ ] **Step 2: Confirm `data/resume.ts` now has a populated `skills` array**

  ```bash
  grep -A 5 '"skills"' data/resume.ts
  ```

  Expected: a non-empty array of skill strings.

- [ ] **Step 3: Run the full test suite — all tests should now pass**

  ```bash
  npx jest --no-coverage
  ```

  Expected: all tests PASS, including "renders at least one skill badge" in `About.test.tsx`.

- [ ] **Step 4: Commit the regenerated data file**

  ```bash
  git add data/resume.ts
  git commit -m "chore: sync skills from resume PDF"
  ```
