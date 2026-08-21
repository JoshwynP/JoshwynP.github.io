# Joshwyn Parekh Portfolio

Personal portfolio site for [joshwynp.github.io](https://joshwynp.github.io).

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- [React Bits](https://reactbits.dev/) components (LiquidEther, StaggeredMenu, BlurText)
- Three.js + GSAP

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Source code and build configuration |
| `gh-pages` | Production build output (auto-deployed) |
| `Testing` | Archived experimental branch (safe to delete) |

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` trigger GitHub Actions to build and deploy `dist/` to the `gh-pages` branch, which powers GitHub Pages.

## Project structure

```
src/
  App.tsx              # Main page layout and content
  components/          # UI components (React Bits + custom)
public/
  assets/              # Resume PDF, favicon/logo
```

## Updating content

- **Projects, bio, links:** edit `src/App.tsx`
- **Resume:** replace `public/assets/JoshwynParekhResume4A.pdf`
- **Logo/favicon:** replace `public/assets/LOGO_STEAM-LiDHMAmV.png`
