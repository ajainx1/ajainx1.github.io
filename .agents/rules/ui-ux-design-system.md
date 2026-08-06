# UI/UX Design System Rules

## Visual Standards
- **Spacing:** Strictly use a 4px/8px grid system (`p-1`=4px, `p-2`=8px, `p-4`=16px, `p-6`=24px, `p-8`=32px, `gap-2`=8px, `gap-4`=16px, `gap-6`=24px) for all padding and margins.
- **Colors:** Use a modern, semantic color palette (e.g., Slate or Zinc for grays). Maintain a minimum 4.5:1 WCAG AA contrast ratio for readability and accessibility.
- **Typography:** Scale text using a clean hierarchy (`tracking-tight` for headings `h1`, `h2`, `h3`; `leading-relaxed` for body copy).

## UX Best Practices
- **Feedback:** Every button must have distinct `:hover`, `:focus-visible` (e.g., `focus-visible:outline-2 focus-visible:outline-emerald-500`), and `:active` (e.g., `active:scale-[0.98]`) interaction states.
- **Loading:** Use skeleton placeholders (`animate-pulse bg-slate-800/50 rounded-2xl`) instead of blank screens during async data fetches or loading states.
- **Empty States:** Never show a blank page; always provide an illustration or icon, a clear description, and a primary Call-to-Action (CTA) button.
