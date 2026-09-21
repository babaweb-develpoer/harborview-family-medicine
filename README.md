# Harborview Family Medicine

A single-page, premium dark-mode website concept for a family medicine clinic, built as a portfolio piece.

**Live demo:** enable GitHub Pages on this repo (Settings > Pages) to get a public URL, or open `index.html` directly.

## Features

- Fully responsive single-page layout (mobile, tablet, desktop)
- Hero section with looping background video and reduced-motion fallback
- Scroll-reveal animations using `IntersectionObserver` and CSS scroll-driven animations (`animation-timeline: view()`), no scroll-jank libraries
- Appointment booking form with client-side validation, inline errors, and a success state
- Accessible testimonial carousel (scroll-snap, keyboard/dot navigation)
- Dark theme with a locked single accent color, WCAG AA contrast throughout
- Zero build step: plain HTML, CSS, and vanilla JavaScript

## Stack

- HTML5 / CSS3 (custom properties, CSS Grid, `clamp()`, scroll-driven animations)
- Vanilla JavaScript (no frameworks, no build tools)
- [Phosphor Icons](https://phosphoricons.com/) for iconography
- Google Fonts: Outfit (display) + Work Sans (body)

## Running locally

No build step required. Serve the folder with any static file server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes

This is a sample/demo site built for a portfolio. The clinic, doctor, and patient testimonials are fictional. The booking form is frontend-only and does not submit anywhere.
