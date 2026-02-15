# ADR-0001: Complete UI/UX Redesign

## Status
Proposed (2026-02-15)

## Context

Excali-Discover is an interactive AI drawing assistant that pairs a chat interface with an Excalidraw canvas. While the core functionality works — users can chat with Claude and see diagrams rendered live — the UI is at hackathon-demo quality: a generic dark theme with hardcoded slate colors, no design system, no visual hierarchy, no responsive behavior, and minimal polish. For a tool that positions itself as a creative AI canvas, the UI must inspire confidence and delight, not feel like a prototype.

### User Need

Users of creative tools form first impressions within seconds. A polished, thoughtful UI communicates quality and trustworthiness — both in the AI's capabilities and the tool itself. The current UI fails to communicate either. Users comparing this to Figma, Linear, or Notion will immediately perceive it as unfinished.

### Current State

The frontend consists of 4 components with inline Tailwind classes and no design system:

| File | Current State | Issues |
|------|---------------|--------|
| `packages/client/src/App.tsx` | Hardcoded `bg-slate-950`, fixed 380px chat panel, no responsive layout | No breakpoint handling, no panel resize, no layout flexibility |
| `packages/client/src/components/ChatPanel.tsx` | Inline Tailwind classes, hardcoded colors (`bg-slate-900`, `bg-blue-600`), emoji-based empty state | No design tokens, no component reuse, no keyboard shortcuts, no markdown rendering |
| `packages/client/src/components/Canvas.tsx` | Bare Excalidraw wrapper with hardcoded `viewBackgroundColor: '#0f172a'` | No toolbar customization, no loading states, no canvas-chat visual integration |
| `packages/client/src/styles/index.css` | 25 lines — scrollbar styles and 2 keyframe animations | No CSS custom properties, no design tokens, no responsive utilities |
| `packages/client/tailwind.config.js` | Empty `extend: {}` — zero customization | No custom colors, fonts, spacing, or component classes |
| `packages/client/index.html` | Inline style `background: #0f172a` | Hardcoded, no theming support |

The Tailwind config has zero customization — `theme: { extend: {} }` — meaning every color, font, and spacing value is ad-hoc and scattered across component files.

### Problem Analysis

| # | Problem | Impact | Root Cause |
|---|---------|--------|------------|
| P1 | No design system or tokens | **Critical** | Colors, spacing, typography are hardcoded inline with no single source of truth |
| P2 | No visual hierarchy | **Critical** | All text uses default sizing, no heading scales, no weight variation, no intentional whitespace |
| P3 | No responsive layout | **High** | Fixed 380px sidebar, no breakpoints, unusable below 768px |
| P4 | Generic, uninspired aesthetic | **High** | Default Tailwind slate palette with no brand identity, no gradients, no depth |
| P5 | No component library | **Medium** | Button, input, badge, tooltip — all implemented inline with no reuse |
| P6 | No animations or micro-interactions | **Medium** | Only 2 CSS keyframes (fadeIn, typing dots), no hover states, no transitions, no element entrance animations |
| P7 | Chat panel lacks polish | **High** | No markdown rendering, no message grouping, no timestamps, no copy/retry actions, no resizable panel |
| P8 | Canvas integration is minimal | **Medium** | No visual connection between chat and canvas, no drawing status indicators, no element count display |

## Decision

Implement a complete UI/UX redesign using a custom design system built on Tailwind CSS with CSS custom properties, a reusable component library, responsive layout system, and polished micro-interactions — inspired by the craft of tools like Figma, Linear, and Notion.

### Key Architectural Choices

1. **CSS custom properties as design tokens** — Define all colors, spacing, typography, shadows, and radii as CSS variables in `index.css`, referenced by Tailwind config. This enables future theming (light mode) without touching components and provides a single source of truth.

2. **Tailwind config as the design system hub** — Extend `tailwind.config.js` with custom color scales, font families, spacing, and component-level utilities that map to CSS variables. All components use these semantic tokens, never raw hex values.

3. **Component library in `packages/client/src/components/ui/`** — Extract reusable primitives: `Button`, `Input`, `Badge`, `Tooltip`, `IconButton`, `Avatar`, `Panel`, `Divider`. Each component encapsulates its variants, states, and animations. No external component library (like shadcn/ui or Radix) — keep the dependency footprint minimal with hand-crafted components that perfectly match the design.

4. **Inter as the primary typeface** — Load Inter (variable weight) via Google Fonts or bundled. It pairs well with Excalidraw's hand-drawn aesthetic, is highly legible at small sizes, and is used by Linear, Vercel, and other premium tools.

5. **Resizable split layout** — Replace the fixed 380px sidebar with a resizable split panel using a drag handle. Collapsible on mobile. Uses CSS `resize` or a lightweight pointer-event drag implementation — no dependency.

6. **Color palette: refined dark theme with accent colors** — Move from generic Tailwind slate to a custom dark palette with carefully tuned background layers (surface-0 through surface-3), a vibrant accent color (indigo/violet), and semantic colors for success, warning, error, and info states.

7. **Motion design with CSS transitions and keyframes** — All interactive elements get `transition-all duration-150` as baseline. Add entrance animations for messages, element drawing progress, panel open/close, and hover micro-interactions. Use `prefers-reduced-motion` media query for accessibility.

8. **Markdown rendering in chat** — Add `react-markdown` with `remark-gfm` for rich assistant responses. Style code blocks, lists, headers, and links within the chat design system.

9. **Empty state and onboarding redesign** — Replace emoji-based empty state with an illustrated/SVG hero, refined prompt suggestions as cards with icons, and a subtle onboarding flow that highlights the canvas.

10. **Canvas-chat visual integration** — Add a drawing status bar between chat and canvas showing element count, drawing progress, and connection status. Unify the visual language so the canvas and chat feel like one tool, not two panels glued together.

### Implementation Approach

#### Phase 1: Design Foundation (design tokens, typography, color system)

1. Define CSS custom properties in `packages/client/src/styles/index.css` for:
   - Color scales: `--color-surface-0` through `--color-surface-3`, `--color-accent-*`, `--color-text-*`, `--color-border-*`, `--color-semantic-*`
   - Typography: `--font-sans`, `--font-mono`, `--text-xs` through `--text-2xl` with line heights
   - Spacing: `--space-1` through `--space-16`
   - Radii: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
   - Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`
2. Update `packages/client/tailwind.config.js` to consume CSS variables via `theme.extend`
3. Add Inter font to `packages/client/index.html` (Google Fonts link) and set as default sans font
4. Update `packages/client/index.html` body styles to use design tokens

#### Phase 2: Component Library

1. Create `packages/client/src/components/ui/Button.tsx` — variants: primary, secondary, ghost, danger; sizes: sm, md, lg; states: hover, active, disabled, loading
2. Create `packages/client/src/components/ui/Input.tsx` — text input with label, helper text, error state, icon slots
3. Create `packages/client/src/components/ui/IconButton.tsx` — round/square icon-only button with tooltip
4. Create `packages/client/src/components/ui/Badge.tsx` — status badges (connected, streaming, error)
5. Create `packages/client/src/components/ui/Tooltip.tsx` — lightweight CSS-only tooltip
6. Create `packages/client/src/components/ui/Avatar.tsx` — for user/AI message avatars
7. Create `packages/client/src/components/ui/Panel.tsx` — reusable panel container with header, body, footer slots

#### Phase 3: Layout Redesign

1. Rewrite `packages/client/src/App.tsx` layout:
   - Resizable split panel with drag handle
   - Responsive breakpoints: collapsed chat on mobile (<768px), side-by-side on desktop
   - Optional fullscreen canvas mode (chat as overlay drawer)
2. Create `packages/client/src/components/ResizeHandle.tsx` — drag handle component for split panel
3. Add keyboard shortcut to toggle chat panel visibility (Cmd/Ctrl + \)
4. Add responsive CSS utilities to `packages/client/src/styles/index.css`

#### Phase 4: Chat Panel Redesign

1. Redesign `packages/client/src/components/ChatPanel.tsx`:
   - Use `Avatar` for user/AI messages
   - Add message grouping (consecutive same-role messages cluster)
   - Add timestamps (relative, e.g., "2 min ago")
   - Add copy-to-clipboard button on assistant messages
   - Add message entrance animations (staggered slide-up)
2. Install and integrate `react-markdown` + `remark-gfm` for assistant message rendering
3. Redesign empty state with SVG illustration and card-based prompt suggestions
4. Redesign input area: auto-growing textarea, character count, keyboard shortcut hints
5. Add connection status as a refined inline badge, not plain text

#### Phase 5: Canvas Integration & Polish

1. Update `packages/client/src/components/Canvas.tsx`:
   - Add drawing progress indicator (pulsing border or progress bar when streaming elements)
   - Use design token colors for Excalidraw `viewBackgroundColor` and default stroke colors
   - Add element count badge overlay
2. Create `packages/client/src/components/StatusBar.tsx` — thin bar between chat and canvas showing:
   - Connection status (dot + text)
   - Element count
   - Drawing status ("Drawing..." with animation during streaming)
3. Add smooth transitions when elements are added (canvas glow or highlight effect)
4. Final polish pass: hover states on all interactive elements, focus rings for accessibility, consistent border radii, shadow consistency

### Key Challenges

1. **Excalidraw theme integration**
   - Problem: Excalidraw has its own theming system that may not align with custom design tokens
   - Solution: Use Excalidraw's `theme="dark"` prop and override `viewBackgroundColor` and default element colors to match the custom palette
   - Challenge: Excalidraw's internal UI (toolbar, context menus) cannot be fully styled
   - Mitigation: Choose design token colors that harmonize with Excalidraw's dark theme defaults

2. **Resizable panel without a library dependency**
   - Problem: Implementing smooth resize with pointer events, min/max constraints, and persistence
   - Solution: Custom `ResizeHandle` component using `onPointerDown` / `onPointerMove` / `onPointerUp` with `requestAnimationFrame` for smoothness
   - Challenge: Must handle edge cases (touch devices, keyboard resize, persisting width to localStorage)

3. **Performance with animations during streaming**
   - Problem: Adding CSS animations while the WebSocket is streaming text + elements could cause frame drops
   - Solution: Use CSS-only animations (GPU-composited `transform` and `opacity`), avoid layout-triggering properties. Batch element additions using `requestAnimationFrame`.
   - Performance target: Maintain 60fps during streaming with animations enabled

## Expected Impact

| Phase | Impact | Complexity |
|-------|--------|------------|
| Phase 1: Design Foundation | Establishes single source of truth for all visual decisions; enables rapid iteration | Low |
| Phase 2: Component Library | Reduces code duplication, enforces consistency, accelerates future feature development | Medium |
| Phase 3: Layout Redesign | Makes the app usable on all screen sizes, gives users control over their workspace | Medium |
| Phase 4: Chat Panel Redesign | Dramatically improves the primary interaction surface — where users spend most time | High |
| Phase 5: Canvas Integration | Transforms two disconnected panels into a cohesive creative tool experience | Medium |

## Key Files

| File | Role |
|------|------|
| `packages/client/src/styles/index.css` | Design token definitions (CSS custom properties), global styles, animation keyframes |
| `packages/client/tailwind.config.js` | Design system hub — maps CSS variables to Tailwind utilities |
| `packages/client/index.html` | Font loading, base theme setup |
| `packages/client/src/App.tsx` | Root layout — resizable split panel, responsive breakpoints |
| `packages/client/src/components/ChatPanel.tsx` | Chat UI — message rendering, input, empty state |
| `packages/client/src/components/Canvas.tsx` | Excalidraw wrapper — theme integration, status overlay |
| `packages/client/src/components/ui/Button.tsx` | Primary button component with variants |
| `packages/client/src/components/ui/Input.tsx` | Text input component with states |
| `packages/client/src/components/ui/IconButton.tsx` | Icon-only button component |
| `packages/client/src/components/ui/Badge.tsx` | Status badge component |
| `packages/client/src/components/ui/Tooltip.tsx` | CSS tooltip component |
| `packages/client/src/components/ui/Avatar.tsx` | User/AI avatar component |
| `packages/client/src/components/ui/Panel.tsx` | Reusable panel container |
| `packages/client/src/components/ResizeHandle.tsx` | Drag handle for split panel resize |
| `packages/client/src/components/StatusBar.tsx` | Connection/drawing status bar |

## Consequences

### Positive
- **Production-quality aesthetic** — the UI will look and feel like a polished creative tool, not a demo
- **Design system enables velocity** — future features inherit consistent styling automatically via tokens and components
- **Responsive and accessible** — usable on tablets and smaller screens, with proper focus management and reduced-motion support
- **Maintainable styling** — centralized tokens eliminate scattered hardcoded values; changing the accent color means updating one variable
- **Delightful interactions** — smooth animations and micro-interactions make the tool feel alive and responsive to user actions

### Negative
- **Significant frontend effort** — touching every component file, plus creating ~10 new files
- **Potential Excalidraw conflicts** — custom theming may clash with Excalidraw's internal styles in edge cases
- **Added dependency** — `react-markdown` and `remark-gfm` add ~40KB gzipped to the bundle
- **Design maintenance** — a design system requires discipline; new features must use tokens and components, not ad-hoc styles

### Risks and Mitigations

**Technical Risks:**
1. **Excalidraw CSS conflicts** — custom styles may inadvertently affect Excalidraw's internal components
   - *Mitigation:* Scope all custom styles under a `.excali-discover` parent class; use Tailwind's `important` selector strategy if needed
2. **Resize handle performance** — frequent pointer events during drag could cause jank
   - *Mitigation:* Use `requestAnimationFrame` throttling and CSS `will-change: width` on the panel
3. **Font loading flash (FOUT)** — Inter loading from Google Fonts may cause a flash of unstyled text
   - *Mitigation:* Use `font-display: swap` and preload the font file in `<head>`

**UX Risks:**
1. **Learning curve for existing users** — drastic visual changes may disorient current users
   - *Mitigation:* Keep the fundamental layout (chat left, canvas right) unchanged; improve within the existing mental model
2. **Over-animation** — too many animations can feel sluggish or distracting
   - *Mitigation:* Keep all transitions under 200ms; respect `prefers-reduced-motion`; test with real workflows

## Alternatives Considered

### 1. Use shadcn/ui or Radix Primitives
- **Pros:** Battle-tested accessibility, extensive component library, popular in React ecosystem
- **Cons:** Adds significant dependency weight, opinionated styling that may conflict with Excalidraw, and components are more complex than needed for this scope (we have ~5 UI components, not 50)
- **Why rejected:** The component surface area is small enough that hand-crafted components provide better control over the exact aesthetic, tighter integration with the design tokens, and zero dependency risk. If the app grows to 20+ component types, revisit this decision.

### 2. Use Chakra UI or Mantine
- **Pros:** Full design system out of the box, dark mode built in, good DX
- **Cons:** Heavy bundle size (100KB+ gzipped), would replace Tailwind entirely (significant rewrite), opinionated runtime CSS-in-JS that conflicts with Tailwind's utility-first approach
- **Why rejected:** Replacing Tailwind with a CSS-in-JS framework is a lateral move that doesn't justify the migration cost. The goal is a custom aesthetic, not a generic component library look.

### 3. Light theme or system-preference theme
- **Pros:** Broader accessibility, matches OS preference
- **Cons:** Excalidraw's dark theme is the default and looks best; creative tools overwhelmingly use dark themes (Figma, VS Code, After Effects); implementing both themes doubles the design work
- **Why rejected:** Ship dark theme first with design tokens structured to support light theme later. The CSS variable architecture makes adding light theme a Phase 2 concern — just swap variable values under a `.light` class.

### 4. Incremental improvements without a design system
- **Pros:** Lower effort, no new architecture
- **Cons:** Perpetuates the core problem — scattered, inconsistent styling. Each new feature adds more ad-hoc CSS. Technical debt compounds.
- **Why rejected:** The root cause of the poor UI is the lack of a system, not the lack of individual polish. Fixing individual components without a foundation guarantees inconsistency.

| Alternative | Why Rejected |
|-------------|-------------|
| shadcn/ui or Radix | Component surface area too small to justify the dependency; custom components give better design control |
| Chakra UI / Mantine | Would replace Tailwind entirely; heavy bundle; generic look doesn't match the custom aesthetic goal |
| Light theme first | Creative tools favor dark; Excalidraw dark theme is default; design tokens support future light mode |
| Incremental fixes | Treats symptoms, not root cause; no foundation means continued inconsistency |
