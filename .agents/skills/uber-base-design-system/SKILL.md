---
name: uber-base-design-system
description: >-
  Enforces the Uber Base Design System (base.uber.com) principles, tokens, colors,
  typography scale, spacing grid, and Iconsax icon library for all UI/UX frontend
  development and styling in this project. Use whenever creating, styling, or
  refactoring UI components, pages, forms, or layouts.
---

# Uber Base Design System — Healthcare Adapted Specification

This skill guides the design, construction, and refactoring of all user interfaces in the DrMayDay system according to **Uber Base Web** guidelines (`https://base.uber.com/`) combined with technical color tokens and the **Iconsax** icon font library.

## Core Design Principles (Uber Base)

1. **Directional, Bold, Minimal:**
   - Functional-first design: Every element on screen must serve a clear medical or administrative decision.
   - Zero superfluous decorations, gradients, or clutter.
   - Clean lines, sharp contrast, clear borders.

2. **Accessibility & High Contrast (WCAG 2.1 AAA):**
   - High text-to-background contrast (minimum 4.5:1 for body, 7:1 for critical alerts).
   - Touch/click targets must be at least 44px by 44px for primary actions.
   - Clear focus rings on interactive elements: `2px solid var(--base-border-selected)`.

3. **Zero External Branding:**
   - Never use external brand logos, brand names, or third-party imagery.
   - Strictly use the medical-adapted token system and neutral system identifiers.

4. **Density Modes:**
   - **Clinician Mode (Compact):** For medical staff who need high information density, dense data grids, and quick navigation.
   - **Patient Mode (Spacious):** For patients, elderly, or emergency situations with large fonts, spacious touch controls, and high-visibility red flags.

---

## Token Reference (`uber-base-tokens.css`)

### Colors & Semantic Roles
- **Text & Content:**
  - `var(--base-content-primary)`: Main headings, strong text (`#091E42` / Dark `#F8FAFC`)
  - `var(--base-content-secondary)`: Subtitles, helper text (`#626F86` / Dark `#94A3B8`)
  - `var(--base-content-tertiary)`: Placeholders, disabled states (`#8590A2`)
  - `var(--base-content-accent)`: Primary emphasis / brand accent (`#217954` / `#4ED08A`)
- **Backgrounds:**
  - `var(--base-bg-canvas)`: Main app background (`#F9FAFB` / `#F4F5F8`)
  - `var(--base-bg-surface)`: Cards, panels, modal dialogs (`#FFFFFF`)
  - `var(--base-bg-secondary)`: Table headers, well sections (`#F1F2F4`)
- **Borders:**
  - `var(--base-border-opaque)`: Default card/input borders (`#E4E7EC`)
  - `var(--base-border-selected)`: Focused/selected borders (`#091E42` / `#4BCE97`)
- **Semantic Feedback:**
  - **Negative (Danger):** `var(--base-negative-primary)` (`#B42318`), tint: `var(--base-negative-tint)` (`#FFECEB`) — Used for Red Flags, Anaphylaxis, Drug allergy alerts.
  - **Warning:** `var(--base-warning-primary)` (`#8A5309`), tint: `var(--base-warning-tint)` (`#FFF7D6`) — Used for Pending triage, moderate UAS7.
  - **Positive (Success):** `var(--base-positive-primary)` (`#217954`), tint: `var(--base-positive-tint)` (`#E7F8EF`) — Used for Controlled UAS7, saved records.
  - **Info:** `var(--base-info-primary)` (`#0055CC`), tint: `var(--base-info-tint)` (`#E9F2FF`) — Used for follow-up reminders.

### Spacing Scale (4px/8px Base Grid)
- `scale100` = 4px
- `scale200` = 8px
- `scale300` = 12px
- `scale400` = 16px
- `scale500` = 20px
- `scale600` = 24px
- `scale700` = 32px
- `scale900` = 48px

### Border Radii
- Tags/Pills: `var(--base-radius-pill)` (9999px)
- Buttons/Inputs: `var(--base-radius-300)` (8px)
- Small Cards: `var(--base-radius-400)` (12px)
- Large Containers: `var(--base-radius-500)` (16px) or 20px

---

## Icon Usage (Iconsax System)

Always use the local vector font `Iconsax`. Do NOT import external icon CDNs or use inline raw SVGs when an Iconsax glyph is available:

```html
<!-- Outline Style (Default) -->
<span class="isax icon-heart"></span>
<span class="isax icon-hospital"></span>
<span class="isax icon-document-text"></span>
<span class="isax icon-calendar"></span>
<span class="isax icon-search-normal"></span>
<span class="isax icon-shield-tick"></span>

<!-- Bold Solid Style (Active / Selected States) -->
<span class="isax-b icon-heart"></span>
<span class="isax-b icon-calendar"></span>
<span class="isax-b icon-tick-circle"></span>
```

---

## Standard Component Patterns

### Base Buttons
```html
<button class="base-btn base-btn-default base-btn-primary">
  <span class="isax icon-tick-circle"></span> Primary Action
</button>

<button class="base-btn base-btn-default base-btn-secondary">
  Secondary
</button>

<button class="base-btn base-btn-default base-btn-negative">
  <span class="isax icon-danger"></span> Emergency Call 115
</button>
```

### Base Inputs
```html
<div class="relative">
  <span class="absolute left-3 top-2.5 text-gray-400 isax icon-search-normal text-base"></span>
  <input type="text" class="base-input pl-9" placeholder="Search...">
</div>
```

### Base Tags & Status Badges
```html
<span class="base-tag base-tag-positive">
  <span class="isax icon-tick-circle"></span> Kiểm soát tốt
</span>
<span class="base-tag base-tag-negative">
  <span class="isax icon-danger"></span> Báo động đỏ
</span>
```
