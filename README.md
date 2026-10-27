# major/explore

A mobile-first college major exploration flow for students: guided intake, an explainable shortlist,
side-by-side comparison, exploration side quests, reflection, a revised shortlist and a shareable summary.

## Run it

```sh
npm install
npm run dev
```

## Structure

- `src/styles.css` holds the design tokens (colors, fonts, radii) and shared classes.
- `src/components/` has the screen shell (header, progress, sticky footer) and small UI pieces (`Choice`, `Badge`, `CtaLink`, …).
- `src/screens/` has one file per step, routed in `src/App.jsx`.

Content is placeholder sample data; `[DATE]` and earnings ranges are still to be filled in.
