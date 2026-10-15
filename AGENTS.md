# PresidentialFunFacts

## Design Guidelines

The primary visual reference is located at:
`design/concept-board.png`

Use this image as inspiration for:

- Branding and typography
- Color palette
- Character design
- Layout and navigation
- Overall visual personality

The `design/` directory is intentionally gitignored.

Production-ready assets belong in `src/assets/` or `public/`.

Do not copy reference artwork into production assets without
explicit instruction.

## Code Style and Readability

Source code is written for human developers. Production minification is handled by Vite.

### Formatting

- Follow `.prettierrc.json` as the authoritative formatting configuration.
- Preserve intentional blank lines where possible.
- Use 2-space indentation, spaces rather than tabs, and LF line endings.
- Use single quotes in JavaScript and TypeScript, semicolons, and trailing commas wherever supported.
- Use a 100-character print width as a wrapping target, not a hard line-length limit.
- Preserve authored multiline objects with `objectWrap: "preserve"`: put a newline immediately after
  the opening brace when an object should stay multiline.
- Prefer compact markup for simple elements.
- Put each attribute on its own line when an element has multiple attributes.
- Do not introduce formatting rules that conflict with Prettier.
- Never manually minify source code.

### Whitespace and Organization

- Use one blank line between logical sections of code.
- Separate unrelated variable declarations, computed properties, functions, and methods.
- Group closely related declarations together.
- Use blank lines between major sections of Vue templates.
- Prefer multiline objects when their contents are substantial or benefit from visual separation.
- Avoid unnecessary blank lines within short, cohesive blocks.
- Preserve clear visual separation without excessive whitespace.

### Vue Components

- Put each attribute on its own line when an element has multiple attributes.
- Keep single-attribute elements compact when readable.
- Separate the closing `>` of a multiline opening tag on the final attribute line (`bracketSameLine: false`). Prettier handles self-closing tags separately.
- Use blank lines to separate major logical UI sections.
- Indent nested items inside tags (script, template, style)
- Avoid deeply nested template structures where a reusable component would improve clarity.

### TypeScript

- Use descriptive names.
- Prefer explicit, readable control flow over overly clever one-liners.
- Break up long functions into smaller logical units when appropriate.
- Separate logical groups of declarations with one blank line.
- Separate functions and computed properties with blank lines.
- Group related reactive state, computed values, watchers, and methods.
- Organize imports first, followed by types, constants and reactive state, computed values, watchers,
  and methods as appropriate. Keep dependencies readable; do not reorder code just to follow this
  outline if doing so changes initialization or behavior.
- Prefer readable multiline objects and arrays when they contain several properties.
- Do not compress multiple statements onto one line.

### Stylesheet Organization

- Use Less for styles. Vite compiles `.less` files and Vue `<style scoped lang="less">` blocks.
- Keep palette, CSS custom properties, and breakpoint variables in `src/styles/variables.less`.
- Keep document defaults in `src/styles/base.less` and reusable controls/layout helpers in
  `src/styles/utilities.less`. Import global styles once through `src/styles/index.less`.
- Colocate component and screen styles in their Vue files, including responsive rules.
- Import variables with `@import (reference)` inside Vue style blocks to avoid emitting global rules.
- Use shallow Less nesting. Use `:deep()` only for deliberate styling of child component content.
- Keep shared presentation in reusable components rather than duplicating its styles across screens.

### Tooling

- Run Prettier after making source changes.
- Use `npm run format` to apply formatting and `npm run format:check` to verify it.
- Respect `.prettierignore`: exclude dependencies, generated output, local design references, and
  assets. Do not format those files as part of routine source formatting.
- Ensure formatting checks pass before declaring a task complete.
- Do not introduce ESLint formatting rules that conflict with Prettier.

### Human Review

Prettier enforces syntax layout, not logical organization. Reviewers must check descriptive names,
declaration grouping, blank lines between logical sections, readable control flow, and sensible
function and component size. Prettier preserves existing single blank lines where supported but
does not insert semantic section breaks and may remove redundant whitespace. It preserves authored
multiline objects; it does not decide which objects deserve that layout. Strings, URLs, and other
unbreakable content may exceed the print-width target. Keep these conventions in mind when writing
new code; formatting tasks should not introduce unrelated structural refactors.

## Git Commit Conventions

Use Conventional Commits when proposing commit messages.

Format: type(optional-scope): short imperative description

Preferred types:

- feat: new functionality
- fix: bug fixes
- refactor: code restructuring without behavior changes
- style: formatting-only changes
- docs: documentation changes
- test: test changes
- chore: maintenance
- build: build tooling and configuration
- ci: continuous integration

Keep commits focused and descriptions concise.
Do not create commits unless explicitly instructed.
