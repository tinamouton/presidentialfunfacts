---
name: review-changes
description: Review all uncommitted changes, including untracked files, without modifying the repository.
agent: agent
---

# PresidentialFunFacts — Pre-Commit Code Review

Perform a comprehensive, **read-only code review** of all current uncommitted changes in this repository.

## 1. Determine the review scope

Use Git to identify all changes relative to `HEAD`, including:

- Unstaged modifications
- Staged changes
- Newly added and untracked files
- Deleted files
- Renamed files

Inspect both tracked diffs and the actual contents of relevant untracked files.

Do not assume `git diff` includes untracked files.

Do not modify the Git index, working tree, or branch.

If a file cannot be reviewed, explicitly identify it.

## 2. Read project instructions

Before reviewing, inspect:

- `AGENTS.md`
- `README.md`
- `RESEARCH.md`, where applicable
- Relevant schemas, models, validation logic, and tests

Follow existing architectural and editorial conventions.

## 3. Review priorities

Evaluate changes in this order:

1. **Correctness:** Bugs, runtime errors, TypeScript issues, regressions, and edge cases.
2. **Data integrity:** Schema consistency, validation, relationships, IDs, and localStorage compatibility.
3. **Historical integrity:** Accurate claims, source references, evidence classifications, and distinctions between First Ladies and White House hostesses.
4. **Gameplay:** Who Am I? answer correctness, clue ambiguity, game eligibility, and gentle feedback.
5. **Accessibility:** Keyboard interaction, semantic markup, readability, and age-appropriate presentation.
6. **PWA behavior:** Offline functionality, asset paths, caching, and build compatibility.
7. **Testing:** Missing coverage, inadequate assertions, and tests that could hide regressions.
8. **Maintainability:** Meaningful complexity or duplication, without unnecessary refactoring.

Do not mistake successful data validation for independent verification of historical claims.

## 4. Review restrictions

This is a review, not an implementation task.

- Do not edit, create, or delete files.
- Do not run formatters or commands that rewrite files.
- Do not stage, commit, push, pull, fetch, reset, or switch branches.
- Do not install dependencies.
- Do not apply suggested fixes automatically.
- Prefer read-only inspection commands.
- Run existing tests only when they can safely execute without modifying tracked project files.
- Do not recommend unrelated dependencies, frameworks, or architectural changes.

## 5. Report findings

For each actionable issue, provide:

- Severity: Critical, High, Medium, or Low
- File path and line number
- What is wrong
- Why it matters
- A specific suggested correction

Distinguish confirmed defects from potential concerns.

Prioritize substantive findings over formatting preferences.

If no significant problems are found, state that explicitly.

## 6. Final summary

Conclude with:

- Number of changed files reviewed, including untracked files
- Findings grouped by severity
- Verification commands run and their results
- Anything not reviewed or not independently verified
- Whether the changes appear ready for a human commit decision

**Never commit or modify files as part of this review.**
