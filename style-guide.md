Here's a `StyleGuide.md` file suitable for inclusion in your project. It sets out visual and development standards for a clean, extensible **Tailwind-based** productivity app UI.

---

````markdown
# 🧭 FocusHub UI Style Guide

This style guide defines the visual and structural principles for FocusHub. It provides guidance for consistent UI design across all components and pages using **Tailwind CSS**. All developers and designers should adhere to this document.

---

## 🎨 1. Design Principles

- **Minimalist:** Focus on content, not decoration.
- **Distraction-Free:** Use whitespace and soft contrast to avoid visual clutter.
- **Responsive:** All views must render cleanly on mobile, tablet, and desktop.
- **Modular:** Each UI component should be standalone, reusable, and decoupled.
- **Accessible:** Aim for WCAG AA compliance as a minimum.

---

## 🧩 2. Framework & Tools

- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)
- **Custom Colours & Fonts**: Defined in `main.css` (Tailwind config extension)
- **Icon Library**: [Lucide Icons](https://lucide.dev/) via React components
- **Component Patterns**: Follow Atomic Design principles (`atoms`, `molecules`, `organisms`)
- **Dark Mode**: Fully supported (toggleable or system-aware)

---

## 🎨 3. Colour Palette

All colours must be defined in `main.css` (or `tailwind.config.js`) using semantic names:

```css
/* Example in main.css */
:root {
  --color-bg: #ffffff;
  --color-bg-dark: #1a1a1a;
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-accent: #22c55e;
  --color-text: #1e293b;
  --color-muted: #94a3b8;
}
````

Use Tailwind’s `theme` extension to reference them:

```js
extend: {
  colors: {
    bg: 'var(--color-bg)',
    primary: 'var(--color-primary)',
    // ...
  }
}
```

---

## 📄 4. Page Guidelines

### Home / Timer View

* Clean layout, large central timer
* Big, accessible start/pause/reset buttons
* If task is selected, show title prominently
* Session type (Focus / Break) indicated by subtle colour shift
* Mobile: timer full-width, controls below

### Task List

* Minimal card list
* Drag to reorder (eventually)
* Each task: title, est. Pomodoros, status badge
* Add/edit form in a modal or slide-in pane

### Session Log

* Chronological view
* Grouped by day
* Each entry: time, task (if any), type, notes
* Optional summary stats at top

### Settings

* Sections: Preferences, Durations, Appearance
* Toggle switches, sliders, dropdowns

### Auth / Onboarding

* Full-screen minimal panel
* Clean form fields
* Friendly microcopy ("Welcome back", "Let's get focused")

---

## 🔤 5. Typography

* **Font**: System UI stack or `Inter`
* **Sizes**:

  * Heading: `text-xl`, `text-2xl`, `font-bold`
  * Body: `text-base`, `text-sm`, `leading-relaxed`
* **Readability First**: Never cram text, always add spacing (`mt-2`, `mb-4`, `px-4`)

---

## 🔧 6. Component Best Practices

* Use Tailwind’s utility classes over custom CSS where possible
* Avoid inline styles unless necessary
* Components must:

  * Be responsive
  * Have accessible labels
  * Support keyboard navigation

---

## 📱 7. Mobile-First Responsiveness

* Design starts at mobile width (`sm:` and up)
* Use flex/grid layouts and spacing for collapsible layouts
* Hide non-essential elements on small screens

---

## 📤 8. Future Extensions

The style guide should evolve with:

* Custom themes
* Focus mode overlays
* Plugin-like microtools (habit tracker, calendar view)

Update this document as new components are introduced.

---

