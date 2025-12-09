# Project Master Spec: Logic Finals Reviewer

**Project Name:** Logic Finals Reviewer
**Goal:** A React/TypeScript Single Page Application (SPA) hosting 4 targeted logic drills.
**Tech Stack:** React, TypeScript, Tailwind CSS, LocalStorage (for streaks).
**Design Philosophy:** "Reuse vs Reinvent." We utilize existing logic parsers/visualizers where possible.

---

## 1. Core Data Structures & State

### Global State (`useActivityStats`)
Tracks progress for gamification.
```typescript
export type ActivityId = "tfl-subproof" | "fol-checklist" | "error-spotting" | "nested-quantifiers";

export interface ActivityStats {
  id: ActivityId;
  streak: number;      // Current correct answers in a row
  maxStreak: number;   // Best ever streak
  score: number;       // (+1 correct, -2 incorrect)
}
```

### Shared Logic Types
**Fitch Proof Rendering:**
```typescript
export interface ProofLine {
  id: string;
  formula: string;        // The raw string, e.g. "Ax(Fx -> Gx)"
  justification: string;  // e.g. "AE 1"
  depth: number;          // Indentation level (0 = main, 1 = subproof)
  isHypothesis?: boolean; // If true, render horizontal bar under it
  highlight?: boolean;    // For error spotting (optional red highlight)
}
```

---

## 2. Existing Assets & Integration (The "Bridge")

**[INSTRUCTION TO CODING AI]**: The user has provided source code from an existing project (LogicPenguin/OpenLogic). **Do not reinvent** these logical components. Port/Wrap them as described below.

Asset A: TFL Sentence Generator (Port from Python)Source: User provided Python logic (see Prompts).Action: Create src/utils/generator.ts.Logic: Port the recursive generation logic from Python to TypeScript.Crucial: Change the operator | to v (for disjunction).Operators: v (or), & (and), -> (conditional), <-> (biconditional), ~ (negation).Asset B: TFL Syntax & Formatting (Port from JS)Source: syntax.js (from LogicPenguin repo).Action: Create src/utils/syntax.ts.Functions to Port:prettyStr(s): Converts ASCII inputs (->, v) into Unicode symbols ($\to$, $\lor$).Regex: Replace -> with $\to$, v with $\lor$, <-> with $\leftrightarrow$, & with $\land$, ~ with $\neg$.fixWffInputStr(s): Sanitizes user input.Asset C: Fitch Proof Styling (Port from CSS)Source: proofs.css (LogicPenguin).Action: Create a component src/components/FitchDisplay.tsx.Logic:Render ProofLine[] as a styled table.Subproofs: Use Tailwind to replicate border-left: 2px solid black for indented lines.Hypotheses: Use Tailwind to replicate border-bottom: 2px solid black.Asset D: Model VisualizationSource: User provided ModelGrid.tsx.Action: Create src/components/ModelVisualizer.tsx.

## 3. The 4 Activities (Implementation Specs)

### Activity 1: TFL Subproof Structure Drill
**Goal:** Check if student knows how many subproofs a rule needs, using **complex** sentences.

* **Inputs:** `generateRandomFormula()` (User provided utility).
* **Interaction:**
    1.  App generates random complex formulas $\Phi, \Psi$.
    2.  App selects a rule (e.g., $\lor E$).
    3.  Display: "You have line: $\Phi \lor \Psi$. You want to derive $\chi$ using $\lor E$."
    4.  **Quiz:**
        * Radio: "How many subproofs?" (0, 1, 2).
        * Inputs: "Start of Subproof 1", "End of Subproof 1", etc.
* **Validation:** Compare User Input (normalized via `fixWffInputStr`) with `prettyStr` of the generated parts.

### Activity 2: Easy FOL Proof Checklist
**Goal:** Warm-up checklist. External link based.

* **Data Source:** **[GAP: WAITING FOR USER INPUT - HANDWRITTEN LIST]**
* **Structure:**
    * Map over a JSON list of problems.
    * Render premises/conclusion using `FitchDisplay` (read-only).
    * Button: "Open Proof Checker" (links to `https://proofs.openlogicproject.org/`).
    * Checkbox: "I solved it".
* **Action:** When user provides list, convert to JSON array.

### Activity 3: "Spot the Error"
**Goal:** Diagnose invalid steps.

* **Data Source:** **[GAP: WAITING FOR USER INPUT - PDF/LATEX]**
* **Logic:**
    1.  Load an `ErrorTemplate` (a proof with a known mistake).
    2.  **Reskinning:** At runtime, randomly swap atomic letters (P/Q $\to$ F/G) and constants (a/b $\to$ c/d) using a helper function so the problem looks fresh.
    3.  Render using `FitchDisplay`.
    4.  Question: "Is this step valid?" (Yes/No) -> If No, select reason from dropdown.

### Activity 4: Nested Quantifier Drill
**Goal:** Quick model checking.

* **Logic:**
    1.  Generate small model (Domain size 2-3, Relation R).
    2.  Render using `ModelVisualizer`.
    3.  Generate 3 random sentences (e.g., $\forall x \exists y Rxy$).
    4.  User toggles True/False.
    5.  **Feedback:** If wrong, show counter-example (e.g., "False: Look at x=a").

---

## 4. Implementation Plan

1.  **System Setup:** Initialize React, Tailwind, and the `useActivityStats` hook.
2.  **Logic Utils:** Port `syntax.js` (pretty printing) and integrate `generateRandomFormula` (User provided).
3.  **UI Components:** Build `FitchDisplay` (React version of the CSS tables).
4.  **Activities:** Build them one by one, filling in the Data Gaps (JSON/PDFs) as we go.
