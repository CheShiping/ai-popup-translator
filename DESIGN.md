# Design System: 划词 AI 翻译桌面工具

## 1. Visual Theme & Atmosphere

A restrained, cockpit-precise interface with confident asymmetric layouts and fluid spring-physics motion. The atmosphere is clinical yet warm — like a well-lit architecture studio at midnight. Every pixel serves a function; nothing screams for attention.

**Density:** 6/10 — Cockpit Dense for settings/dashboard, Art Gallery Airy for the translation popup
**Variance:** 7/10 — Offset Asymmetric, no centered hero layouts
**Motion:** 6/10 — Fluid CSS with spring-physics, perpetual micro-interactions on active elements

The interface operates on two scales:
- **Micro** (translation popup): 360px floating window, minimal chrome, maximum readability
- **Macro** (settings/history): Full desktop application with dense information architecture

---

## 2. Color Palette & Roles

### Dark Theme (Default)

| Token | Hex | Role |
|-------|-----|------|
| **Obsidian Canvas** | #0E0F14 | Primary background — off-black with subtle cool undertone |
| **Slate Surface** | #161821 | Card, panel, popup backgrounds |
| **Slate Raised** | #1E2030** | Hover states, selected items, input backgrounds |
| **Whisper Border** | #252838 | 1px structural lines, dividers, card edges |
| **Fog Muted** | #6B7280** | Secondary text, timestamps, metadata |
| **Ash Secondary** | #9CA3AF** | Tertiary text, icon defaults |
| **Snow Primary** | #F1F1F4 | Primary text, headings, high-emphasis content |
| **Amber Signal** | #E8A838 | Single accent — CTAs, active states, focus rings, saved indicators |
| **Amber Haze** | #E8A838 at 12% opacity | Accent background tint for active nav items |
| **Emerald Confirm** | #34D399** | Success states, "saved" indicators, copy confirmation |
| **Ruby Alert** | #F87171** | Error states, destructive actions |
| **Violet Phonetic** | #A78BFA | Phonetic transcription, distinct from accent |

### Light Theme

| Token | Hex | Role |
|-------|-----|------|
| **Paper Canvas** | #F8F9FA | Primary background |
| **Pure Surface** | #FFFFFF | Card, panel, popup backgrounds |
| **Cloud Raised** | #F1F3F5 | Hover states, selected items |
| **Silver Border** | #E2E5E9 | 1px structural lines |
| **Slate Muted** | #6B7280 | Secondary text |
| **Ink Primary** | #1A1D27 | Primary text |
| **Amber Signal** | #D4922A | Single accent (slightly deeper for light bg contrast) |
| **Emerald Confirm** | #059669 | Success states |
| **Ruby Alert** | #DC2626 | Error states |

### Color Rules
- Maximum 1 accent color (Amber Signal). Saturation: ~75%
- The "AI Purple/Blue Neon" aesthetic is STRICTLY BANNED
- No pure black (#000000). Obsidian Canvas is the darkest
- All text meets WCAG AA contrast minimums
- Accent is NEVER used for body text — only for interactive elements and status

---

## 3. Typography Rules

### Font Stack

`css
/* Display & UI */
--font-display: 'Geist', 'Satoshi', -apple-system, sans-serif;

/* Body & Reading */
--font-body: 'Geist', 'Satoshi', -apple-system, sans-serif;

/* Monospace — Code, Phonetic, Timestamps */
--font-mono: 'Geist Mono', 'JetBrains Mono', 'Cascadia Code', monospace;
`

### Type Scale

| Token | Size | Line-height | Weight | Usage |
|-------|------|-------------|--------|-------|
| 	ext-xs | 11px | 1.3 | 500 | Timestamps, badges, keyboard hints |
| 	ext-sm | 13px | 1.4 | 400 | Secondary text, labels, metadata |
| 	ext-base | 14px | 1.5 | 400 | Body text, settings rows |
| 	ext-lg | 16px | 1.4 | 500 | Popup translation result |
| 	ext-xl | 20px | 1.3 | 600 | Word/phrase display in popup |
| 	ext-2xl | 28px | 1.2 | 700 | Hero word when space allows |
| 	ext-mono | 12px | 1.4 | 400 | Phonetic, timestamps, code |

### Typography Rules
- **Display:** Geist — track-tight (-0.02em), controlled scale, weight-driven hierarchy
- **Body:** Geist — relaxed leading (1.5), 65ch max-width for reading areas
- **Mono:** Geist Mono — for phonetic transcription, timestamps, keyboard shortcuts
- **BANNED:** Inter (strictly forbidden), system fonts for display, generic serif fonts
- **Dashboard Constraint:** All numbers (timestamps, counts) use Monospace
- **No gradient text** on headers
- **No text smaller than 11px**

---

## 4. Component Stylings

### Buttons

**Primary (Accent Fill):**
- Background: Amber Signal
- Text: Obsidian Canvas (dark text on amber)
- Padding: 8px 16px
- Border-radius: 6px
- Font: Geist, 13px, weight 500
- Active state: translateY(1px) + brightness(0.92)
- No outer glow, no neon shadow

**Secondary (Ghost):**
- Background: transparent
- Border: 1px solid Whisper Border
- Text: Ash Secondary
- Hover: background Slate Raised, text Snow Primary
- Active: translateY(1px)

**Icon Only:**
- Size: 32x32px touch target
- Border-radius: 6px
- Color: Fog Muted → Snow Primary on hover
- Background: transparent → Slate Raised on hover

### Translation Popup

- Width: 360px (fixed, no responsive scaling)
- Background: Slate Surface
- Border: 1px solid Whisper Border
- Border-radius: 10px
- Shadow: 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)
- No header bar — content-first layout
- Entry animation: scale(0.96) → scale(1) + opacity 0→1, 180ms spring-out
- Exit: opacity 1→0, 100ms ease-in

### History Panel

- Width: 320px
- Height: 100vh (full height, right side)
- Background: Slate Surface
- Border-left: 1px solid Whisper Border
- Entry: translateX(100%) → translateX(0), 200ms spring-out
- Group headers: sticky, 12px mono uppercase, letter-spacing 0.05em
- Search input: full-width, Slate Raised background, no border (borderless design)

### Settings Panel

- Width: 480px
- Centered modal with backdrop overlay
- Background: Slate Surface
- Border-radius: 12px
- Settings rows: 48px height, flex, space-between
- Toggle switches: 36x20px pill, Amber Signal when active

### Cards (History Items)

- Padding: 12px 16px
- No visible border — separated by spacing and subtle background shift
- Hover: background Slate Raised
- Active/selected: left 2px Amber Signal border accent
- Word: Geist, 14px, weight 600, Snow Primary
- Translation: Geist, 13px, Fog Muted
- Timestamp: Geist Mono, 11px, Fog Muted

### Inputs

- Background: Slate Raised
- Border: 1px solid Whisper Border → Amber Signal on focus
- Border-radius: 6px
- Padding: 8px 12px
- Font: Geist, 14px
- No floating labels — label above, error below
- Focus ring: 2px Amber Signal at 30% opacity

### Loaders

- Skeletal shimmer matching exact layout dimensions
- No circular spinners
- Shimmer animation: gradient sweep, 1.5s infinite

### Toast Notifications

- Position: bottom-center, 16px from bottom
- Background: Slate Raised
- Border: 1px solid Whisper Border
- Border-radius: 8px
- Padding: 10px 16px
- Auto-dismiss: 2s
- Entry: translateY(8px) → 0 + opacity fade, 150ms

---

## 5. Layout Principles

### Desktop Shell
- Full viewport height, no scroll
- Taskbar: fixed bottom, 48px height, backdrop-blur(20px)
- Desktop area: remaining space, centered content

### Translation Popup
- Positioned at mouse cursor (with screen-edge collision detection)
- NOT centered — appears near the selection
- Asymmetric internal layout: word top-left, phonetic top-right, translation center, example bottom

### History Panel
- Fixed right side, full height
- Slide-in from right (translateX animation)
- Sticky search at top
- Scrollable content area below
- Group headers stick to top while scrolling

### Settings Modal
- Centered overlay
- Backdrop: Obsidian Canvas at 60% opacity + blur(4px)
- Single column layout, max-width 480px
- Close button: top-right, icon only

### Spacing System
- Base unit: 4px
- Component padding: 12px, 16px
- Section spacing: 24px
- Between related items: 8px
- Between unrelated groups: 16px

### Grid
- No CSS Grid for main layout — flexbox only
- No percentage-based flex math
- Fixed widths for panels (320px, 360px, 480px)
- No 3-column equal layouts

---

## 6. Motion & Interaction

### Animation Engine
- All animations use 	ransform and opacity only
- Never animate 	op, left, width, height
- GPU-accelerated via will-change: transform, opacity

### Timing

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Button hover | 120ms | ease-out |
| Button active (press) | 80ms | ease-out |
| Popup appear | 180ms | cubic-bezier(0.16, 1, 0.3, 1) (spring-out) |
| Popup disappear | 100ms | ease-in |
| Panel slide-in | 200ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Toast appear | 150ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Toast disappear | 100ms | ease-in |
| Theme crossfade | 300ms | ease |
| List item stagger | 50ms delay between items | ease-out |

### Spring Physics
- Use cubic-bezier(0.16, 1, 0.3, 1) for "spring-out" feel
- Use cubic-bezier(0.4, 0, 0.2, 1) for standard transitions
- No bounce, no elastic — confident and precise

### Micro-interactions
- Buttons: translateY(1px) on press (tactile feedback)
- Cards: subtle scale(1.01) on hover
- Toggle: smooth 150ms color transition
- Search input: focus ring fade-in 120ms

### Staggered Reveals
- History list items: cascade delay of 30ms each on initial load
- Settings sections: stagger fade-in on panel open

---

## 7. Anti-Patterns (BANNED)

### Visual
- ❌ No emojis anywhere in the interface
- ❌ No Inter font (use Geist or Satoshi)
- ❌ No pure black (#000000) — use Obsidian Canvas
- ❌ No neon/outer glow shadows
- ❌ No oversaturated accents (max 80% saturation)
- ❌ No gradient text on headers
- ❌ No 3-column equal card layouts
- ❌ No centered Hero sections
- ❌ No overlapping elements — clean spatial separation always
- ❌ No custom mouse cursors
- ❌ No scroll arrows, bouncing chevrons, "scroll to explore"
- ❌ No broken image links — use SVG or nothing

### Content
- ❌ No generic names ("John Doe", "Acme Corp")
- ❌ No fake round numbers ("99.99%", "50%")
- ❌ No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionary")
- ❌ No filler text: "Click here", "Learn more", "Get started"
- ❌ No placeholder lorem ipsum in final UI

### Technical
- ❌ No animating 	op, left, width, height
- ❌ No setTimeout for animations — use CSS transitions
- ❌ No layout shift on hover (reserve space for hover states)
- ❌ No fixed z-index values above 1000
- ❌ No !important in component styles

---

## 8. Iconography

- **Source:** Lucide Icons (consistent stroke-width: 1.5px)
- **Sizes:** 16px (inline), 20px (buttons), 24px (nav)
- **Color:** inherits from parent, defaults to Fog Muted
- **Style:** outline only, no filled variants
- **Animation:** subtle rotate(90°) on expand/collapse, 150ms

---

## 9. Accessibility

- Minimum touch target: 32x32px
- Focus-visible: 2px Amber Signal outline, 2px offset
- Keyboard navigation: Tab order follows visual order
- Screen readers: aria-labels on all icon buttons
- Color is never the only indicator — pair with icons or text
- Reduced motion: respect prefers-reduced-motion: reduce

---

*Design System Version: 1.0 | Tech Stack: Tauri 2 + React 18 | Last Updated: 2026-08-11*
