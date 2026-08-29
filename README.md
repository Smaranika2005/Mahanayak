# মহানায়ক — Mahanayak

A single-page, illustration-driven tribute site to Uttam Kumar — one full-bleed
hand-illustrated poster as the entire canvas, a floating glassmorphic music
player pulling from an unlisted YouTube playlist, and a live count of everyone
currently on the page. Not a conventional landing page — a mood piece built to
feel like the poster itself has come alive.

## ✨ Features

- **Full-bleed responsive artwork** — a custom illustrated three-panel portrait
  of Uttam Kumar with the "মহানায়ক" title painted directly into the piece.
  Separate landscape and portrait compositions ship for desktop and mobile
  (not a cropped single image), swapped at the breakpoint.
- **Spotify-style music player** — a glassmorphic bar floating over the artwork,
  playing exclusively from a private/unlisted YouTube playlist via the YouTube
  IFrame Player API. Full transport controls (play/pause, next/prev, seek,
  volume, shuffle, repeat), with the YouTube player itself completely hidden —
  no visible video, no YouTube branding.
- **Live viewer count** — a real-time presence pill in the top-right corner
  showing how many people are on the site right now.
- **"Tap to Begin" intro** — a deliberate first-interaction moment (browsers
  block autoplay-with-sound) designed as part of the aesthetic rather than a
  jarring permission popup.
- **Fully responsive, mobile-first player** — every control reachable without
  a tap-to-expand step, 44×44px minimum touch targets, safe-area-aware padding
  for iOS.
- **Palette sampled entirely from the artwork itself** — sepia, aged-paper
  tones and a deep maroon accent, no colors introduced outside the illustration.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [Supabase Realtime Presence](https://supabase.com/docs/guides/realtime/presence) for the live viewer count
- Deployed on [Vercel](https://vercel.com/)

## 🚀 Getting Started

```bash
git clone https://github.com/<your-username>/mahanayak.git
cd mahanayak
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_YT_PLAYLIST_ID=your_unlisted_playlist_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## 📸 Credits

Illustration and concept: Smaranika Porel.
Built as a personal tribute to Mahanayak Uttam Kumar.
