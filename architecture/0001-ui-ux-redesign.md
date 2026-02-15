# ADR-0001: Complete UI/UX Redesign

## Status
Proposed (2026-02-15)

## Context

Excali-Discover is an AI-powered drawing assistant that combines a chat interface with an Excalidraw canvas. The current UI was built as a functional prototype with no design consideration — it's a generic dark theme with hard-coded colors, no visual hierarchy, no design system, no responsive behavior, and no attention to UX.

### User Need

Creative tools succeed or fail on their interface. Users of drawing/diagramming tools expect a polished, intuitive experience — think Figma, Linear, Notion, or tldraw. The current UI communicates "hackathon demo," not "tool I want to use daily."

### Current State

**Chat Panel (`packages/client/src/components/ChatPanel.tsx`):**
- Fixed 380px width, not resizable
- Hard-coded Tailwind classes with no design tokens
- Basic message bubbles with no markdown rendering
- Starter suggestions are plain buttons with no visual appeal
- No message actions (copy, retry, edit)
- Typing indicator is functional but generic
- No keyboard shortcuts

**Canvas (`packages/client/src/components/Canvas.tsx`):**
- Bare Excalidraw embed with minimal configuration
- Hard-coded dark background (`#0f172a`)
- No custom toolbar or canvas controls
- No zoom controls or minimap
- No integration between canvas and chat (can't reference elements)

**App Layout (`packages/client/src/App.tsx`):**
- Simple flex row: chat (fixed) | canvas (flex-1)
- No resizable panels
- No responsive behavior — broken on tablet/mobile
- No header, status bar, or navigation

**Styling (`packages/client/src/styles/index.css`):**
- Minimal Tailwind setup
- No CSS custom properties or design tokens
- No animation definitions
- No typography scale

### Problem Analysis

| # | Problem | Impact | Root Cause |
|---|---------|--------|------------|
| P1 | No design system — colors, spacing, typography are ad-hoc | **Critical** | Built for function, not form |
| P2 | Chat panel is basic and unpolished | **High** | No markdown rendering, no message actions, no resize |
| P3 | No responsive layout | **High** | Fixed widths, no breakpoints, no panel management |
| P4 | Canvas integration is bare minimum | **Medium** | Excalidraw dropped in with defaults, no custom controls |
| P5 | No animations or micro-interactions | **Medium** | No transition system, no delight factor |
| P6 | No keyboard shortcuts or accessibility | **Medium** | Not considered in initial build |

## Decision

Implement a complete UI/UX redesign with a custom design system, polished component library, responsive layout, and premium visual quality. The goal is a tool that feels as refined as Figma or Linear.

### Key Architectural Choices

1. **Design tokens via CSS custom properties** — All colors, spacing, typography, shadows, and radii defined as CSS variables. No hard-coded values in components. Enables theming and consistency.

2. **Resizable panel layout** — Chat panel resizable via drag handle. Collapsible to icon-only mode. Canvas takes remaining space. Responsive: stacked on mobile, side-by-side on desktop.

3. **Component architecture** — Build a small, focused component library:
   - Primitives: Button, Input, Badge, Tooltip, IconButton
   - Layout: Panel, ResizeHandle, Header, StatusBar
   - Chat: MessageBubble, MarkdownRenderer, SuggestionCard, StreamingIndicator
   - Canvas: Toolbar, ZoomControls, ElementInspector

4. **Typography scale** — Inter or Geist Sans as primary font. Defined scale from xs to 2xl with consistent line heights and letter spacing.

5. **Color system** — Semantic color tokens:
   - Background: `--bg-primary`, `--bg-secondary`, `--bg-elevated`, `--bg-overlay`
   - Text: `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-accent`
   - Accent: Primary (blue/cyan), Success (green), Warning (amber), Error (red)
   - Surface: `--surface-chat`, `--surface-canvas`, `--surface-input`
   - All colors with dark mode as default, light mode support later

6. **Animation system** — Framer Motion for component transitions. Defined easing curves and duration tokens. Subtle entrance animations for messages, smooth panel resize, canvas element pop-in.

7. **Markdown in chat** — Render assistant messages as markdown with syntax highlighting, proper lists, tables, and inline code. Use `react-markdown` + `rehype-highlight`.

8. **Keyboard shortcuts** — `Cmd/Ctrl+Enter` to send, `Cmd/Ctrl+/` to toggle chat panel, `Cmd/Ctrl+K` for command palette (future).

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Header Bar (logo, status, settings)                     │
├──────────────┬──────────┬───────────────────────────────┤
│              │ Resize   │                               │
│  Chat Panel  │ Handle   │   Excalidraw Canvas           │
│  (resizable) │   ║      │                               │
│              │   ║      │   ┌─────────────────┐         │
│  ┌─────────┐ │   ║      │   │ Floating Toolbar │         │
│  │Messages │ │   ║      │   └─────────────────┘         │
│  │         │ │   ║      │                               │
│  │         │ │   ║      │          ┌──────────┐         │
│  │         │ │   ║      │          │ Zoom Ctrl │         │
│  └─────────┘ │   ║      │          └──────────┘         │
│  ┌─────────┐ │   ║      │                               │
│  │  Input  │ │   ║      │                               │
│  └─────────┘ │          │                               │
├──────────────┴──────────┴───────────────────────────────┤
│  Status Bar (connection, model, element count)           │
└─────────────────────────────────────────────────────────┘
```

### Implementation Approach

**Phase 1: Design Foundation (1-2 days)**
1. Define complete CSS custom properties system in `packages/client/src/styles/tokens.css`
2. Set up typography scale with Inter/Geist font
3. Create base animation tokens and Framer Motion config
4. Set up component directory structure: `packages/client/src/components/ui/`

**Phase 2: Layout System (1-2 days)**
1. Implement resizable panel layout with drag handle in `packages/client/src/components/layout/PanelLayout.tsx`
2. Add header bar with logo, connection status, settings trigger
3. Add status bar with model info, element count, connection state
4. Implement responsive breakpoints — collapse chat on mobile

**Phase 3: Component Library (2-3 days)**
1. Build primitive components: Button, Input, IconButton, Badge, Tooltip
2. Build chat components: MessageBubble with markdown, SuggestionCard, StreamingIndicator
3. Build canvas components: custom toolbar overlay, ZoomControls
4. Add Framer Motion animations to all components

**Phase 4: Chat Panel Redesign (1-2 days)**
1. Redesign message layout with proper spacing, avatars, timestamps
2. Add markdown rendering with syntax highlighting
3. Add message actions: copy, retry
4. Redesign input area with auto-resize textarea, send button, shortcuts hint
5. Redesign suggestion cards with icons and hover effects

**Phase 5: Canvas Integration Polish (1 day)**
1. Custom Excalidraw theme matching design tokens
2. Floating toolbar for common actions
3. Zoom controls overlay
4. Smooth element entrance animations
5. Better `scrollToContent` behavior after AI draws

**Phase 6: Animations & Polish (1 day)**
1. Message entrance animations (slide + fade)
2. Panel resize with smooth transitions
3. Typing indicator refinement
4. Loading states and skeleton screens
5. Subtle hover/focus micro-interactions on all interactive elements

### Key Challenges

**Challenge 1: Excalidraw Theming**
- Problem: Excalidraw has its own design system and limited theming API
- Solution: Use CSS overrides for Excalidraw's internal classes + custom wrapper components for overlays
- Challenge: Excalidraw updates may break CSS overrides
- Mitigation: Pin Excalidraw version, isolate overrides in dedicated stylesheet

**Challenge 2: Resizable Panels**
- Problem: Need smooth resize without jank, with minimum widths, and keyboard accessibility
- Solution: Use `react-resizable-panels` library (battle-tested, accessible, performant)
- Target: <16ms resize latency, min-width 280px chat, 400px canvas

**Challenge 3: Markdown Rendering Performance**
- Problem: Long AI responses with code blocks could cause render lag
- Solution: Virtualized message list for long conversations, memoized markdown components
- Mitigation: Test with 100+ message conversations

## Expected Impact

| Change | Impact | Complexity |
|--------|--------|------------|
| Design tokens system | Consistent, themeable UI across all components | Low |
| Resizable panel layout | Professional feel, user control over workspace | Medium |
| Chat markdown rendering | Readable AI responses with code highlighting | Medium |
| Component library | Faster future development, visual consistency | Medium |
| Animations & micro-interactions | Delightful, premium feel | Low |
| Responsive layout | Usable on tablets and different screen sizes | Medium |

## Key Files

| File | Role |
|------|------|
| `packages/client/src/styles/tokens.css` | Design tokens (colors, spacing, typography) — NEW |
| `packages/client/src/styles/animations.css` | Animation keyframes and tokens — NEW |
| `packages/client/src/components/ui/` | Primitive component library — NEW |
| `packages/client/src/components/layout/PanelLayout.tsx` | Resizable panel system — NEW |
| `packages/client/src/components/layout/Header.tsx` | App header bar — NEW |
| `packages/client/src/components/layout/StatusBar.tsx` | Status bar — NEW |
| `packages/client/src/components/ChatPanel.tsx` | Redesigned chat panel — MODIFY |
| `packages/client/src/components/Canvas.tsx` | Enhanced canvas wrapper — MODIFY |
| `packages/client/src/App.tsx` | New layout structure — MODIFY |
| `packages/client/src/styles/index.css` | Updated with token imports — MODIFY |

## Consequences

### Positive
- Professional, premium UI that users enjoy using
- Design system enables rapid, consistent future development
- Responsive layout makes the tool accessible on more devices
- Markdown rendering makes AI responses actually readable
- Animations add delight without sacrificing performance
- Component library reduces code duplication

### Negative
- Additional dependencies (framer-motion, react-markdown, react-resizable-panels, rehype-highlight)
- Bundle size increase (~40-60KB gzipped for new deps)
- More complex component tree to maintain
- Excalidraw CSS overrides are fragile across version updates

### Risks and Mitigations

**Technical Risks:**
1. **Excalidraw CSS override breakage** — Custom styles may break on Excalidraw updates
   - *Mitigation:* Pin version, isolate overrides, test on upgrade
2. **Performance regression from animations** — Too many animated elements could cause jank
   - *Mitigation:* Use `will-change` sparingly, prefer CSS transforms, test on low-end devices
3. **Markdown XSS** — Rendering user/AI markdown could be a vector
   - *Mitigation:* Use `rehype-sanitize` to strip dangerous HTML

**UX Risks:**
1. **Over-designed** — Adding too much chrome that distracts from the core drawing experience
   - *Mitigation:* Keep canvas area clean, minimize overlays, user-test with real tasks

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Use a UI library (shadcn/ui, Radix) | Adds heavy dependency for a small component set. Custom primitives are lighter and fully tailored to our needs. Could reconsider if the app grows significantly. |
| Light mode first | Target audience (developers, designers) overwhelmingly prefers dark mode for creative tools. Dark-first with light mode support later. |
| Full Tailwind-only (no CSS variables) | Loses theming capability and makes design token updates harder. CSS custom properties give us the best of both — tokens for consistency, Tailwind for utility. |
| Ship incremental improvements | The current UI needs a cohesive overhaul, not patches. Incremental changes without a design system would create more inconsistency. |
| Use Excalidraw's built-in UI as-is | Excalidraw's default UI is designed for standalone use. We need custom overlays and tighter chat-canvas integration that their defaults don't support. |
