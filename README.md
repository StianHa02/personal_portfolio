# Personal Portfolio

An interactive personal portfolio featuring a scroll-driven Rubik's Cube animation built from scratch on the HTML5 Canvas 2D API — no Three.js, no WebGL. The cube starts scrambled and solves itself as you scroll through the page.

---

## Features

- **Scroll-driven Rubik's Cube** — custom 3D renderer using Canvas 2D with perspective projection, painter's algorithm depth sorting, and 8-move keyframe animation sequence
- **Bento grid layout** — projects, skills, about, and contact sections built with a reusable `BentoBox` component
- **Contact form** — powered by [Resend](https://resend.com) via a Next.js API route, no third-party client-side services
- **Right dot navigation** — fixed sidebar nav that tracks the active section via IntersectionObserver
- **Toast notifications** — auto-dismissing feedback toasts with slide-up animation
- **Fully responsive** — mobile-first layout with adaptive cube sizing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + inline styles |
| 3D Rendering | HTML5 Canvas 2D (custom) |
| Email | Resend |
| Deployment | Vercel |
| Fonts | Cormorant Garamond, Inter |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/StianHa02/personal_website
cd personal_website
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
personal_portfolio/
├── app/
│   ├── page.tsx                 # Root page – scroll tracking, section wiring, cube opacity
│   ├── layout.tsx               # Global layout – fonts, meta, CSS import
│   ├── globals.css              # Tailwind import + site-wide resets
│   ├── favicon.ico
│   └── components/
│       ├── CubeRenderer.tsx     # Canvas 2D Rubik's Cube renderer & animation
│       ├── Hero.tsx             # Landing section – name, tagline
│       ├── Projects.tsx         # Project cards with category filters
│       ├── Skills.tsx           # Skills & Technologies grid + legend
│       ├── About.tsx            # Bio, contact form, academic journey
│       ├── Footer.tsx           # Closing section – social links
│       ├── theme-provider.tsx   # Dark / light theme context (unused)
│       ├── index.ts             # Barrel re-exports
│       │
│       └── ui/
│           ├── BentoBox.tsx     # Reusable card primitive used everywhere
│           ├── RightDotNav.tsx  # Fixed dot-nav sidebar (desktop only)
│           └── index.ts         # UI barrel re-exports
├── public/
│   └── images/
│       └── projects/            # Project preview screenshots
└── README.md
```

---

## The Cube

The Rubik's Cube is rendered entirely with the Canvas 2D API — no WebGL or external 3D library.

**How it works:**

1. `buildSolved()` constructs a 3×3×3 array of 27 pieces, each with 6 sticker slots
2. 8 moves are applied in reverse to create the scrambled starting state
3. The same 8 moves are recorded as keyframes (`KF`) — one fully-applied state per move
4. As `sp` (scroll progress 0→1) advances, the renderer interpolates between keyframes
5. Each frame: faces are projected with perspective, sorted by Z depth (painter's algorithm), and drawn with rounded corners via `quadraticCurveTo`

The cube auto-rotates on the Y axis continuously while the scroll position drives the solve animation.

---


## License

MIT — feel free to use this as inspiration for your own portfolio.
