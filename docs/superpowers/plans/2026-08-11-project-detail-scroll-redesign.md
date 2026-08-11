# Project Detail Scroll Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the ProjectDetail image slider with a scrolling brand hero, project information, and an uncropped vertical parallax gallery.

**Architecture:** `ProjectDetail` remains a client component and uses its existing scroll container as the source of truth for parallax. It will track only the container’s scroll position and derive a small `translateY` offset for each gallery image; CSS owns layout, visual hierarchy, theme tokens, and all motion suppression.

**Tech Stack:** Next.js 14, React 18, TypeScript, CSS Modules, `next/image`.

## Global Constraints

- Modify only `components/ProjectDetail/ProjectDetail.tsx` and `components/ProjectDetail/ProjectDetail.module.css`.
- Do not add dependencies, change `ProjectData`, touch Turno assets, or alter global theme tokens.
- Hero is black, starts at the top of the detail content under the global nav, stays in normal scroll flow, and only its logo animates on opening.
- In dark mode the detail accent is light lilac; in light mode it is dark lilac.
- Gallery images must retain their whole source image with `object-fit: contain`; the wheel/touch scroll must remain continuous and must not control a slider.
- Honor `prefers-reduced-motion` by disabling logo and parallax movement.
- This repository has no automated test runner; verification uses `npm run build` plus the explicit browser checks in Task 3.

---

## File Structure

- Modify `components/ProjectDetail/ProjectDetail.tsx`: remove all slider interactions and render the hero, existing project metadata, and a scroll-driven gallery.
- Modify `components/ProjectDetail/ProjectDetail.module.css`: style the in-flow hero, logo-only intro animation, themed information layout, uncropped gallery and responsive/reduced-motion rules.

### Task 1: Replace slider behavior with scroll-driven gallery markup

**Files:**
- Modify: `components/ProjectDetail/ProjectDetail.tsx:1-246`
- Test: browser checks described in Task 3; no test framework exists in `package.json`.

**Interfaces:**
- Consumes: `selectedProject.images: string[]`, `selectedProject.logoImage: string`, and `closeProject()` from `useNav()`.
- Produces: an inline `transform: translateY(...)` style on each `styles.galleryImage` wrapper, derived from the scroll container’s current offset.

- [ ] **Step 1: Establish the no-slider baseline**

Run: `npm run build`

Expected: PASS before the refactor; this confirms any later compiler error was introduced by the refactor.

- [ ] **Step 2: Remove slider-only state, callbacks, effects and controls**

In `ProjectDetail.tsx`, replace the slider state with the following component state and refs:

```tsx
const [isVisible, setIsVisible] = useState(false);
const [scrollTop, setScrollTop] = useState(0);
const containerRef = useRef<HTMLDivElement>(null);
```

Delete `currentSlide`, `isAnimating`, interval/touch refs, `goToSlide`, `nextSlide`, `prevSlide`, `manualNav`, the auto-advance effect, touch handlers, and ArrowLeft/ArrowRight handling. Keep a keyboard effect that only closes the project for `Escape`.

- [ ] **Step 3: Reset intro and scroll state for each opened project**

Keep the existing two-`requestAnimationFrame` visibility transition but reset the scroll state and DOM scroll position before showing the logo:

```tsx
useEffect(() => {
  if (!selectedProject) {
    setIsVisible(false);
    return;
  }

  setScrollTop(0);
  containerRef.current?.scrollTo({ top: 0 });
  const raf = requestAnimationFrame(() => {
    requestAnimationFrame(() => setIsVisible(true));
  });
  return () => cancelAnimationFrame(raf);
}, [selectedProject]);
```

- [ ] **Step 4: Render a normal-flow black hero with logo-only entry animation**

Attach `ref={containerRef}` and `onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}` to the existing `.container`. Replace the hero’s slider subtree with the logo and back button only:

```tsx
<div className={styles.heroBlock}>
  <div className={`${styles.logoCenter} ${isVisible ? styles.logoCenterVisible : ''}`}>
    <Image
      src={proj.logoImage}
      alt={`${proj.title} logo`}
      width={192}
      height={192}
      priority
    />
  </div>
  <button className={styles.backBtn} onClick={closeProject} aria-label="Volver a proyectos">
    <span className={styles.backArrow}>←</span>
    <span className={styles.backLabel}>volver</span>
  </button>
</div>
```

Do not render `sliderWrapper`, slides, overlay, indicators or directional buttons.

- [ ] **Step 5: Append a gallery after the complete information block**

Add this gallery after `.infoBlock` so metadata and technologies all precede it. Use `height`/`width` values that match the wide source images while CSS preserves the full image:

```tsx
<section className={styles.gallery} aria-label={`Galería de ${proj.title}`}>
  {proj.images.map((src, index) => {
    const offset = ((scrollTop / 12 + index * 9) % 36) - 18;
    return (
      <figure key={src} className={styles.galleryItem}>
        <div className={styles.galleryImage} style={{ transform: `translateY(${offset}px)` }}>
          <Image
            src={src}
            alt={`${proj.title}: captura ${index + 1}`}
            width={2930}
            height={1466}
            sizes="(max-width: 768px) 100vw, 92vw"
          />
        </div>
      </figure>
    );
  })}
</section>
```

The calculation is intentionally bounded to ±18px, so the motion is decorative and does not turn into slider-like state changes.

- [ ] **Step 6: Verify the component compiles**

Run: `npm run build`

Expected: PASS with no TypeScript errors and no references to removed slider identifiers.

- [ ] **Step 7: Commit the behavior refactor**

```bash
git add components/ProjectDetail/ProjectDetail.tsx
git commit -m "feat: replace project slider with scroll gallery"
```

### Task 2: Restyle ProjectDetail for the new composition and themes

**Files:**
- Modify: `components/ProjectDetail/ProjectDetail.module.css:5-539`
- Test: browser checks described in Task 3; no test framework exists in `package.json`.

**Interfaces:**
- Consumes: `styles.logoCenterVisible`, `styles.gallery`, `styles.galleryItem`, and `styles.galleryImage` from Task 1.
- Produces: an in-flow responsive layout whose parallax transform is not overridden except for reduced-motion users.

- [ ] **Step 1: Replace slider selectors with hero/logo animation selectors**

Delete `.sliderWrapper`, `.slide`, `.slideActive`, `.sliderOverlay`, `.sliderArrow*`, `.indicators`, `.indicator*` and their light-mode overrides. Keep `.heroBlock` in normal flow and add these logo rules:

```css
.logoCenter {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: scale(0.86);
  transition: opacity 480ms var(--ease-out), transform 620ms var(--ease-out);
}

.logoCenterVisible {
  opacity: 1;
  transform: scale(1);
}

.logoCenter img {
  width: clamp(112px, 15vw, 192px);
  height: auto;
  filter: brightness(0) invert(1);
}
```

- [ ] **Step 2: Set the hero’s placement and black treatment**

Keep `.container` as the sole scrollport. Set hero height to `clamp(280px, 46vh, 520px)`, retain only lower corner radii, and use black in both themes. Do not introduce `position: sticky` or `position: fixed` to either hero or logo. Adjust its top content padding only as needed so it begins within the frame and beneath the global navigation’s visual space.

- [ ] **Step 3: Add local lilac accent variables and apply the reference-like information hierarchy**

Define local custom properties on `.section` and override them in the existing light-mode scope:

```css
.section {
  --project-accent: #c9b8ff;
  --project-accent-muted: rgba(201, 184, 255, 0.7);
}

:global([data-theme="light"]) .section {
  --project-accent: #55427a;
  --project-accent-muted: rgba(85, 66, 122, 0.72);
}
```

Use `--project-accent` for `.projectTitle`, and `--project-accent-muted` for `.metaLabel`, `.techLabel`, category chips, and other detail accents. Retain `--color-text` and `--color-text-muted` for values and body copy so contrast remains consistent with the rest of the site.

- [ ] **Step 4: Add full-image gallery styles**

Add a gallery after the tech styles:

```css
.gallery {
  display: grid;
  gap: clamp(24px, 4vw, 56px);
  padding-top: clamp(40px, 8vw, 112px);
}

.galleryItem {
  margin: 0;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-surface) 65%, transparent);
}

.galleryImage {
  display: grid;
  place-items: center;
  will-change: transform;
}

.galleryImage img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 85dvh;
  object-fit: contain;
}
```

Use a small vertical padding on `.galleryItem` if needed to prevent the ±18px transform from clipping an image edge. Do not use `fill`, `object-fit: cover`, fixed aspect-ratio cropping, or sticky positioning.

- [ ] **Step 5: Add mobile and reduced-motion rules**

Within the existing `max-width: 768px` block, reduce hero height, gallery gaps, and image max-height while retaining one-column metadata and full-width images. Add:

```css
@media (prefers-reduced-motion: reduce) {
  .logoCenter { transition: none; }
  .galleryImage { transform: none !important; }
}
```

- [ ] **Step 6: Verify styles compile cleanly**

Run: `npm run build`

Expected: PASS. Confirm the CSS Module exports exactly the class names referenced in Task 1.

- [ ] **Step 7: Commit the visual redesign**

```bash
git add components/ProjectDetail/ProjectDetail.module.css
git commit -m "style: redesign project detail scroll layout"
```

### Task 3: Validate interaction, motion, responsiveness and themes

**Files:**
- Modify: none unless a failure found in Tasks 1–2 requires a targeted correction.
- Test: manual browser validation and `npm run build`.

**Interfaces:**
- Consumes: completed `ProjectDetail` component and CSS module.
- Produces: verified behavior without slider controls or visual regressions.

- [ ] **Step 1: Run production validation**

Run: `npm run build`

Expected: PASS with Next.js production compilation completing successfully.

- [ ] **Step 2: Validate dark mode in a desktop browser**

Open the portfolio, select `turno.uy`, and verify:

```text
Hero begins at the detail content’s top edge below the nav.
Hero is black with only the centered Turno logo and back button.
Only the logo animates when the detail opens.
Scrolling moves the hero upward until it is no longer visible.
Title and detail labels use light lilac; body copy remains legible.
```

- [ ] **Step 3: Validate gallery behavior**

Scroll from technologies through the gallery and verify:

```text
All seven images appear in their configured order.
Every screenshot is completely visible and not cropped.
Scrolling continuously moves through the document; no image is sticky.
Images shift subtly within their own sections instead of changing slide state.
No autoplay, arrows, dots, horizontal swipe navigation, or left/right keyboard navigation remains.
Escape and the back button return to the projects view.
```

- [ ] **Step 4: Validate light mode, mobile and reduced motion**

Toggle light mode, repeat the hero and gallery checks, and confirm the title/labels become dark lilac while the hero remains black. Repeat at a ≤768px viewport and confirm the metadata stacks and images are still fully visible. Enable `prefers-reduced-motion: reduce` in browser rendering emulation and confirm that the logo appears without a transition and gallery images do not translate.

- [ ] **Step 5: Commit any validation correction only if one was necessary**

```bash
git add components/ProjectDetail/ProjectDetail.tsx components/ProjectDetail/ProjectDetail.module.css
git commit -m "fix: polish project detail scroll experience"
```

Skip this commit when validation introduces no changes.
