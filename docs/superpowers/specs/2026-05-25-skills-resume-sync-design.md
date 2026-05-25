# Design: Auto-sync skills from resume PDF

## Goal
Pull the skills list in the About section directly from `public/resume.pdf` via the existing sync script, eliminating the hardcoded array in `About.tsx`.

## Changes

### `scripts/sync-resume.ts`
Add `"skills": ["string"]` to the Claude prompt's expected JSON shape. Claude extracts a flat array of technical skill names from the resume text.

### `data/resume.ts`
- Add `skills: string[]` to the `ResumeData` type.
- The auto-generated `resume` object will include a `skills` field populated by the sync script.
- Fallback: if the PDF has no skills section, the array is empty (`[]`).

### `components/About.tsx`
- Remove the hardcoded `skills` constant.
- Import `resume` from `@/data/resume.ts`.
- Render `resume.skills` in place of the local array.

## Workflow
1. Apply the three code changes above.
2. Run `npm run sync-resume` to regenerate `data/resume.ts` with real skills from the current PDF.
3. Subsequent PDF updates: replace `public/resume.pdf` → re-run `npm run sync-resume` → skills update automatically.

## Out of scope
- Manual skill curation / overrides (fully auto only).
- Any changes to the skills badge UI in About.tsx.
