# Project Context — Omkar Chebale Portfolio

## What This Is

A production portfolio + blog platform for an AI Engineer / Full-Stack Developer.
Live at **https://omkarchebale.vercel.app/** — repo at `github.com/Chebaleomkar/portfolio-2.0`.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · MongoDB Atlas · Pinecone · Framer Motion · Vercel

---

## Architecture Overview

```
Browser → Next.js (Vercel Edge) → MongoDB Atlas (data)
                                 → Pinecone (vector search)
                                 → Gmail SMTP (emails)
                                 → ML API on Render (FastAPI, optional)
```

**Design system:** Dark-only theme. Background `#0a0a0a`, accent `emerald-400/500`, secondary `amber-400`, text `white/gray-300/gray-400/gray-500`. Inter font. All cards use `border border-white/5 bg-white/[0.02]` pattern.

---

## Directory Map

```
app/
  page.tsx              → Landing: Hero, Services, Skills, FeaturedWork, Stats, Testimonials
  layout.tsx            → Root layout (ThemeProvider forced dark, Footer)
  about/page.tsx        → Bio, experience timeline, education
  blogs/page.tsx        → Blog listing with search, tag filters, pagination
  blogs/[slug]/page.tsx → Single blog (markdown, KaTeX math, recommendations)
  blogs/preview/page.tsx→ Client-side markdown preview tool
  skills/page.tsx       → Full skills display
  api/
    blog/               → GET (list), POST (create, password-protected)
    blog/[slug]/        → GET (single), PATCH (update flags)
    search/             → GET full-text search with relevance scoring
    search/suggest/     → GET autocomplete (titles + tags)
    recommendations/    → GET pre-computed similar blogs
    newsletter/         → POST subscribe, GET count
    send-email/         → POST contact form
    getpdf/             → GET stream PDF from Google Drive
    express-ai/         → POST Ollama LLM (local, optional)
    webview/preview/    → GET render HTML for n8n webhooks

components/
  Hero.tsx              → Gradient text, TypeAnimation, mouse spotlight, scroll indicator
  navbar.tsx            → Fixed navbar with backdrop-blur on scroll
  Services.tsx          → 4 service cards (AI, Full-Stack, Automation, Consulting)
  Skills.tsx            → Category-grouped skill badges with scroll reveal
  FeaturedWork.tsx      → Bento grid of client projects with impact metrics
  StatsSection.tsx      → Animated counters on scroll
  Testimonials.tsx      → Client reviews (dark theme)
  Footer.tsx            → Contact form + nav + socials
  ScrollReveal.tsx      → Reusable framer-motion viewport animation wrapper
  BlogList.tsx          → Blog listing with tag filter chips, sort, Cmd+K integration
  BlogCard.tsx          → Individual blog list item
  SearchBar.tsx         → Debounced search input + Ctrl+K shortcut badge
  search/SearchCommand.tsx → Full command palette overlay (instant search, keyboard nav)
  BlogRecommendations.tsx  → AI-powered related posts widget
  CuratedSidebar.tsx    → Featured/starred blogs sidebar
  Pagination.tsx        → Sliding window page nav
  ShareButtons.tsx      → Social sharing (copy, Twitter, LinkedIn, WhatsApp)
  NewsletterForm.tsx    → Multi-topic email subscription
  BlogSkeleton.tsx      → Loading shimmer states

hooks/
  useSearch.ts          → Search state: debounce, cache (60s TTL), AbortController, localStorage recents

lib/
  mongodb.ts            → Connection pooling with DNS SRV fallback
  blog-actions.ts       → Server-side getBlogPosts (cached, supports search + tags + sort)
  blog.ts               → getBlogPostBySlug
  email.ts              → Nodemailer templates (welcome, newsletter broadcast, admin alerts)

models/
  Blog.ts               → title, slug (unique), description, content, tags[], external?, published, isStarred
  Recommendation.ts     → blogSlug (unique) → recommendations[]{slug, title, description, score}
  Subscriber.ts         → email (unique), name?, topics[], isActive

ml/                     → Python batch pipeline: train.py fetches blogs → embeds via Google AI → stores in Pinecone → computes recommendations
ml-api/                 → FastAPI server: /embed-blog endpoint called by Next.js after() on blog creation
```

---

## Key Patterns

**Auth:** Blog admin = `password` header matched against `BLOG_PASSWORD` env. ML API = `X-API-Secret` header.

**Search:** Two strategies — (1) MongoDB `$text` with `$meta: textScore` for relevance, (2) regex fallback with fuzzy matching. Client uses `Ctrl+K` command palette with in-memory caching.

**Caching:** CDN headers (`s-maxage` + `stale-while-revalidate`). React `cache()` for request deduplication. Client-side 60s TTL Map cache in useSearch.

**Background tasks:** `next/server` `after()` runs email notifications + ML API calls after blog creation without blocking the response.

**Animations:** `ScrollReveal` component wraps sections with framer-motion `useInView`. Hero uses CSS `animate-hero-fade-in`. Skill badges have `hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]` glow.

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection |
| `BLOG_PASSWORD` | Yes | Admin blog operations |
| `GMAIL_USER` | Yes | Nodemailer sender |
| `GMAIL_APP_PASSWORD` | Yes | Gmail app-specific password |
| `ML_API_URL` | No | FastAPI endpoint for embeddings |
| `ML_API_SECRET` | No | ML API auth token |
| `PINECONE_API_KEY` | No | Vector database (ML pipeline) |
| `GOOGLE_API_KEY` | No | Google AI embeddings (ML pipeline) |

---

## Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npx tsx scripts/seed-recommendations.ts  # Seed recommendations from ML output
```

---

## Conventions

- **Styling:** Tailwind only, no CSS modules. Dark theme hardcoded (forced via next-themes).
- **Components:** `"use client"` only when needed (hooks, events). Prefer server components.
- **Icons:** `react-icons` (Hi* prefix from Heroicons) for most UI. `lucide-react` for shadcn components.
- **Data:** Static data in `utils/data.ts`. Dynamic data from MongoDB via `lib/` functions.
- **Pages:** Each page renders its own `<Navbar />` (fixed, handles its own scroll state).
- **Forms:** react-hook-form + zod validation.
- **Toast:** react-hot-toast (primary). sonner is installed but unused — avoid adding new sonner usage.
- **Commits:** Lowercase, descriptive. Format: `verb: short description` (e.g., `add Ctrl+K search command palette`).

---

## What NOT to Change Without Understanding

- `lib/mongodb.ts` has a complex DNS fallback — don't simplify it, it fixes a real SRV resolution bug on some hosts.
- `after()` in `api/blog/route.ts` POST — background tasks are intentional, don't move them before the response.
- The `$text` index in `models/Blog.ts` — search API depends on it.
- `BLOG_PASSWORD` header auth — it's simple by design (single-user CMS, no sessions needed).
- `ml/` and `ml-api/` are Python — they run independently from the Next.js app.

---

## Features That Can Be Built Next

### High-Value Additions

1. **Blog Admin Dashboard** — A protected `/admin` route with a simple UI to create/edit/delete/star blogs, view subscriber stats, and trigger recommendation recomputation. Currently all admin ops are API-only.

2. **Blog View Counter + Analytics** — Track views per blog post (MongoDB increment on each visit), show view counts on cards, build a simple `/admin/analytics` page with charts (recharts is already installed).

3. **Table of Contents (TOC)** — Auto-generated sticky sidebar TOC for long blog posts by parsing markdown headings. Highlight current section on scroll.

4. **Reading Progress Bar** — A thin emerald progress bar at the top of blog posts showing how far the reader has scrolled.

5. **Blog Series / Collections** — Group related blog posts into ordered series (e.g., "LLM from Scratch Part 1, 2, 3") with next/prev navigation between posts in a series.

6. **Comment System** — Lightweight comments on blog posts. Options: (a) build custom with MongoDB, (b) integrate Giscus (GitHub Discussions-based, free, dark theme support).

7. **RSS Feed** — Auto-generated `/feed.xml` for blog subscribers who prefer RSS readers. Easy with Next.js route handlers.

8. **Sitemap Generation** — Dynamic `/sitemap.xml` that auto-includes all published blog slugs. Helps SEO significantly.

### Interactive / Visual Enhancements

9. **Project Showcase Redesign** — The `Projects.tsx` component still uses light-theme styling. Redesign it for dark theme and add it to the landing page with browser-frame mockups around screenshots.

10. **Interactive Timeline** — Replace the static about page experience section with a vertical animated timeline. Each milestone expands on click/hover to show details.

11. **Blog Code Block Enhancements** — Add copy-to-clipboard button on code blocks, language label badge, and line numbers. Currently uses plain react-markdown code rendering.

12. **Dark/Light Mode Toggle** — The theme provider supports it but it's forced to dark. If you want to support light mode, remove `forcedTheme="dark"` and show the toggle in navbar.

13. **Smooth Page Transitions** — Add framer-motion `AnimatePresence` at the layout level for cross-page transitions (fade/slide between routes).

14. **Blog Reactions** — Emoji reactions on blog posts (like Dev.to). Simple MongoDB array of {emoji, count} per blog. No auth needed — increment on click.

### Backend / Platform Features

15. **Blog Draft System** — Add `status: 'draft' | 'published' | 'archived'` to Blog schema. Allow saving drafts via API before publishing. Show drafts in admin dashboard.

16. **Scheduled Publishing** — Add `publishAt: Date` to Blog schema. A cron job or Vercel cron checks for posts whose `publishAt` has passed and sets `published: true`.

17. **Image Upload for Blogs** — Currently blog images must be hosted externally. Add Cloudinary or Vercel Blob integration for drag-and-drop image uploads in the preview editor.

18. **Webhook System** — Notify external services (Slack, Discord, n8n) when certain events happen (new blog published, new subscriber, etc.). Already partially exists with the n8n webview route.

19. **API Rate Limiting** — Add basic rate limiting to public endpoints (newsletter, contact form, search) to prevent abuse. Can use Vercel KV or in-memory with next-rate-limit.

20. **Blog Import/Export** — Import blogs from markdown files or export all blogs as a ZIP of markdown files for backup/migration.

### AI-Powered Features

21. **AI Blog Summary** — Auto-generate a TL;DR summary for each blog post using an LLM. Store in the Blog schema, show at the top of long posts.

22. **Semantic Search Upgrade** — Instead of MongoDB text search, route search queries through Pinecone for true semantic matching (the infrastructure already exists in the ML pipeline).

23. **AI Writing Assistant** — Enhance the `/blogs/preview` editor with AI suggestions: auto-complete, grammar check, or "expand this paragraph" using Gemini API.

24. **Personalized Recommendations** — Track which tags/topics a visitor reads (localStorage) and surface recommendations tailored to their interests on the blog listing page.

25. **Chat with Blog** — A small chat widget on blog posts where visitors can ask questions about the content. RAG pipeline already exists — just need a frontend chat UI + API route.
