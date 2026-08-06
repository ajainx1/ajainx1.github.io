<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# UI/UX Design System Rules

## Visual Standards
- **Spacing:** Strictly use a 4px/8px grid system (`p-1`=4px, `p-2`=8px, `p-4`=16px, `p-6`=24px, `p-8`=32px, `gap-2`=8px, `gap-4`=16px, `gap-6`=24px) for padding and margins.
- **Colors:** Use a modern, semantic color palette (e.g., Slate or Zinc for grays). Maintain a 4.5:1 contrast ratio for accessibility.
- **Typography:** Scale text using a clean hierarchy (`tracking-tight` for headings, `leading-relaxed` for body).

## UX Best Practices
- **Feedback:** Every button must have distinct `:hover`, `:focus-visible`, and `:active` states.
- **Loading:** Use skeleton placeholders instead of blank screens for async data.
- **Empty States:** Never show a blank page; always provide an illustration, a clear description, and a primary Call-to-Action (CTA) button.

