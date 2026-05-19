# IvoryMist Landing — Consolidated Documentation

This file merges the previous README and completion summary into a single reference for the consolidated landing components.

## Overview

This folder provides a unified landing component bundle for IvoryMist:

- `Landing.jsx` — contains `HeroSection`, `Navbar`, `FeatureCards`, and `ParticleBackground` as named exports (also default-exports `HeroSection`).
- `landing.css` — single stylesheet with fonts, global utilities, navbar, hero, feature cards, and particle styles.
- `index.js` — re-exports components from `Landing` and imports `landing.css`.

Design highlights:

- Glassmorphism, neon purple glow, bokeh and particle effects.
- Responsive layout (desktop → tablet → mobile).
- Lightweight particle system using the Canvas API.
- Hero CTA buttons, floating cards, and feature grid.

## Usage

Import the components and styles from the landing folder:

```jsx
import { HeroSection, Navbar } from "./landing";
// landing.css is imported by index.js automatically

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
    </>
  );
}

export default App;
```

## Notes

- The Google Fonts `@import` is included at the top of `landing.css` (must remain first).
- All previous separate files were consolidated; if you need a single component extracted again, import from `Landing.jsx` or split as needed.
- If you deploy to environments with strict PostCSS rules, ensure `@import` remains the first line of `landing.css`.

## Maintenance

- To tweak styles, edit `landing.css`.
- To adjust behavior or content, edit `Landing.jsx` and keep prop-friendly APIs in mind.

---

Created by consolidation script — IvoryMist Landing Bundle
