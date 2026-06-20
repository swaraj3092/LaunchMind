Design a premium, modern web app called "LaunchMind" — 
an AI-powered Zero-to-One Execution Engine for students and 
early-stage builders.

DESIGN PHILOSOPHY
- Aesthetic: Dark-first, premium SaaS. Think Linear.app meets 
  Notion AI meets Vercel dashboard.
- Feel: Calm confidence. Not flashy — purposeful. Every element 
  earns its place.
- Motion language: Smooth, physics-based transitions. 
  Staggered fade-ins. No jarring jumps.
- Glassmorphism cards on dark backgrounds with subtle borders 
  (1px rgba white 8-12%).

COLOR SYSTEM
- Background: #0A0A0F (near black with blue undertone)
- Surface: #111118
- Card: #16161F
- Border: rgba(255,255,255,0.08)
- Primary accent: #7C6AF7 (soft electric violet)
- Secondary accent: #3ECFCF (teal/cyan)
- Warning/risk: #F7A04B (amber)
- Success: #4BF7A0 (mint green)
- Text primary: #F0F0FF
- Text secondary: #8888AA
- Gradient hero: linear from #1A0F3C to #0A0A0F

TYPOGRAPHY
- Headings: "Geist" or "Inter" — weight 600-700, tight letter spacing
- Body: "Inter" — weight 400, relaxed line height 1.6
- Monospace accents (for scores, codes): "JetBrains Mono"
- Use font size scale: 12 / 14 / 16 / 20 / 24 / 32 / 48px

SCREENS TO DESIGN (total 6 screens)

---

SCREEN 1: LANDING / HERO PAGE
Layout: Full viewport dark hero, centered content.

Top navbar (floating, glass blur):
- Logo left: small violet lightning bolt icon + "LaunchMind" wordmark
- Nav links center: How it works | Examples | About
- CTA right: "Start Building →" filled violet button, rounded-full, 
  subtle glow on hover

Hero section:
- Eyebrow tag: small pill badge — "AI-Powered Execution Engine" 
  with violet left border
- H1 (48px bold): "Stop dreaming. Start building." with "building" 
  in violet-to-teal gradient text
- Subtext (18px, secondary color): "Turn your vague idea into a 
  structured execution plan — with AI that interrogates your thinking, 
  not just generates lists."
- Two CTAs: Primary "Launch Your Idea →" (violet filled), 
  Secondary "See an Example" (ghost, bordered)
- Below CTAs: 3 small trust stats inline — 
  "Built in 7 days" · "Gemini-Powered" · "100% Free"

Background: Subtle animated mesh gradient (violet + teal nodes, 
very slow movement). Add floating blurred glow orbs (violet 400px 
blur at 15% opacity, teal 300px blur at 10% opacity).

Below hero — 3 feature cards in a row (glass cards):
- Card 1: Icon (brain) — "Idea Interrogation" — "AI asks the 
  questions you forgot to ask yourself"
- Card 2: Icon (warning triangle) — "Assumption Mapping" — 
  "Surface the 3 beliefs that could kill your idea before you build"
- Card 3: Icon (rocket) — "Execution Roadmap" — 
  "30/60/90-day plan with a concrete Day 1 action"

---

SCREEN 2: IDEA INPUT — STEP 1
Full-page centered layout. Progress indicator at top (3 dots: 
Step 1 active, 2 and 3 inactive).

Header: "What's your idea?" (32px)
Subtext: "Don't overthink it. One rough sentence is enough." 
(14px, secondary)

Large textarea (glass card style):
- Placeholder: "e.g. I want to build an app that helps students 
  find study partners near them..."
- 120px tall minimum, expands on type
- Subtle violet glow border on focus
- Character counter bottom right (secondary color)

Below textarea: 
- Inline context selectors (pill toggle groups):
  "Your role:" — [Student] [Founder] [Creator] [Professional]
  "Timeline:" — [1 week] [1 month] [3 months] [6 months]
  "Team:" — [Solo] [2-3 people] [4-5 people]
- These are styled as pill selects — selected state: 
  violet background, white text. Unselected: glass border.

CTA: "Analyze My Idea →" (full width violet button, 52px height, 
rounded-xl, hover: slight scale up 1.02 + glow intensifies)

---

SCREEN 3: CLARIFYING QUESTIONS — STEP 2
Conversational UI. NOT a form — feels like a smart chat.

Left panel (30% width): 
- Shows the original idea in a card (teal left border accent)
- Below: "Processing..." animation → transitions to 
  "Idea received" with a checkmark

Right panel (70% width):
Questions appear one at a time with staggered animation 
(each fades in 200ms after previous):
- Question card: glass card, violet left border, question text bold
- Below each: free-text input OR 3-option pill select depending 
  on question type
- "Next →" button appears after user types/selects
- Progress bar at top of right panel fills as questions answered

After all 5 questions answered:
- "Analyzing your idea..." loading state
- Animated: spinning violet ring + pulsing dots
- Text cycles: "Mapping assumptions..." → "Building your plan..." 
  → "Almost ready..."
- Transitions to Screen 4 with a smooth full-page slide

---

SCREEN 4: RESULTS DASHBOARD — MAIN OUTPUT
This is the hero screen. Two-column layout.

LEFT SIDEBAR (280px fixed):
- User's idea summary (teal card, truncated to 2 lines)
- Idea Clarity Score: Large circular progress ring 
  (violet to teal gradient arc). Score number center in JetBrains 
  Mono. Below: label "Clarity Score" + short 1-line verdict
- Feasibility badge: pill — Low / Medium / High 
  (colored amber / teal / mint respectively)
- Three nav items below: 
  [Assumptions] [Roadmap] [Week 1 Plan]
  Active state: violet left border + slightly lighter background
- Bottom of sidebar: "Export Plan" ghost button

RIGHT MAIN AREA (flex-1):

Section A — ASSUMPTION CARDS (default view)
Header: "Kill-Check: 3 Assumptions to Validate First" (20px bold)
Subtext: "Your plan only works if these are true. Validate before building."

3 cards in a column, each glass card with:
- Left border color: amber (unvalidated), mint (validated)
- Top row: Assumption number badge + risk level pill 
  (High Risk / Medium Risk)
- Assumption statement (bold, 16px)
- Below: "Why this matters" expandable section (chevron toggle)
- Bottom row: "Mark as Validated ✓" ghost button 
  (turns mint when clicked)
Cards have hover: subtle lift (translateY -2px) + border brightens

Section B — ROADMAP (tab switch)
Horizontal timeline with 3 phases: 
[30 Days] [60 Days] [90 Days]
Each phase is a tall glass card:
- Phase header: phase name + icon
- 3-4 milestone items as checklist rows 
  (unchecked by default, checkable)
- Milestone: circle checkbox + text + small tag (Build/Validate/Launch)
Between cards: arrow connector with gradient line

Section C — WEEK 1 PLAN (tab switch)
7-day breakdown. Grid layout: days as columns.
Each day card (compact):
- Day number header (teal accent)
- 1-2 task items
- Time estimate badge (e.g. "2 hrs")
Bottom of section:
DAY 1 ACTION hero card (full width, violet gradient background):
- "🚀 Your First Move — Do this today"
- Large bold action statement (20px)
- Sub-note: "This is the smallest step that creates real momentum."

---

SCREEN 5: EXPORT / SHARE PANEL
Slide-in right drawer (not a new page):

Header: "Export Your Plan"
Three export cards:
- "Download PDF" — icon + button
- "Copy to Notion" — icon + coming soon pill
- "Share Link" — generates unique URL, copy button

Below: "Start Over with New Idea" link (secondary text, small)

---

SCREEN 6: EXAMPLE / DEMO PAGE (from landing CTA)
Shows a pre-filled walkthrough with a sample idea 
("A mobile app to help freelancers track unpaid invoices").
All screens shown in a vertical scroll with glass frame mockups.
Purpose: lets users see output before committing.

---

COMPONENT LIBRARY TO BUILD:
- Glass card (dark bg + subtle border + backdrop-blur)
- Violet filled button (with glow hover state)
- Ghost button (border only, fills on hover)
- Pill badge (various colors for status)
- Circular progress ring (gradient arc)
- Animated loading spinner (violet ring)
- Expandable accordion card
- Pill toggle group (multi-select)
- Progress step indicator (3-step dots)
- Horizontal timeline connector

---

MICRO-INTERACTIONS TO NOTE FOR DEVS:
- All cards: hover lift (translateY -2px, 150ms ease)
- Buttons: scale(1.02) on hover, scale(0.98) on click
- Page transitions: fade + slide up (300ms)
- Question cards: staggered fade-in (200ms delay each)
- Score ring: animated fill on load (1s ease-out)
- Assumption cards: flip-to-mint animation when validated
- Loading screen: text cycles with typewriter effect

FIGMA NOTES:
- Use Auto Layout everywhere
- Build mobile responsive (375px breakpoint)
- Export as component set with variants 
  (default / hover / active / disabled)
- Use variables for all colors (enables light mode later)
- Add prototype flows connecting all 6 screens