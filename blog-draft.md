# How I Built a Blog System Into My Portfolio (And Why I Did It)

So here's the thing — I wanted to write blogs, but I didn't want to deal with the usual hassle. You know, logging into some CMS, clicking through menus, formatting stuff. I just wanted to **write and publish from anywhere**.

That's when I thought: why not build my own blog API?

## The Problem I Was Trying to Solve

My portfolio was looking good. Clean design, dark mode, all the usual stuff a developer portfolio has. But something was missing — a place to share what I'm learning, building, and breaking.

I could've used Medium or Dev.to, sure. But I wanted the content on *my* site. My domain. My design. My rules.

The catch? I didn't want to open VS Code every time I wanted to write something. I wanted to post from Postman, from my phone, from anywhere really.

## Building the API

So I built a simple REST API. Here's what it does:

- **POST /api/blog** — Creates a new blog post
- **GET /api/blog** — Fetches all published posts with pagination

The POST endpoint is protected by a password header. Nothing fancy, just enough so random people can't flood my blog with spam.

The blog content? Pure markdown. I write in markdown, store it in MongoDB, and render it on the frontend. Simple.

Here's roughly what the request looks like:

```json
{
  "title": "My First Real n8n Workflow",
  "body": "# Your markdown content here...",
  "description": "A short description",
  "tags": ["n8n", "Automation"],
  "isStarred": true
}
```

Send this with the right password header, and boom — blog is live.

## Why MongoDB?

Initially, I tried storing blogs as local markdown files. It worked fine on localhost. But then I deployed to Vercel and reality hit me — Vercel's serverless functions run on a read-only filesystem.

So I switched to MongoDB. Now my blogs live in a database, and I can create, read, or update them from anywhere. The API just talks to MongoDB.

If you're building something similar, save yourself the headache. Go with a database from the start.

## The Frontend Features

The blog section isn't just a list of posts. I added a few things to make it actually useful:

**Search** — There's a search bar that filters posts by title, description, or tags. It's debounced, so it doesn't hammer the API on every keystroke.

**Pagination** — 20 posts per page, with a sliding window pagination. You know, those numbered buttons that show 5 pages at a time and shift as you navigate.

**Curated Section** — On desktop, there's a sidebar showing starred posts. On mobile, it's a drawer that slides in from the right. These are blogs I want people to see first.

**Consistent Cards** — Every blog card has the same height. The description gets truncated so things don't look messy.

Nothing revolutionary, but it feels polished.

## The Part About Writing

Here's the thing about writing blogs — my rough notes are a mess. Random thoughts, typos, incomplete sentences. Not exactly publishable.

So I set up a little system. I dump my rough notes into ChatGPT and tell it: "You're my technical blog writer. Turn this into something readable."

It takes my chaos and gives me clean, human-friendly drafts. I review, tweak, and publish.

This blog you're reading? Started as rough voice notes about what I built today.

## Things I Learned

Building this taught me a few things:

1. **Vercel's filesystem is read-only** — Learned this the hard way. Don't try to write files in serverless functions.

2. **Mongoose caching matters** — In development, your MongoDB connection can get recreated on every hot reload. Cache it properly or you'll see memory issues.

3. **Dynamic metadata is powerful** — Each blog has its own Open Graph tags. When you share a blog link on WhatsApp, it shows the right title and description. Small detail, big impact.

4. **Start with an API** — Even if you're building a personal site, having an API gives you flexibility. I can automate blog posts, integrate with other tools, or build a mobile app later.

## What's Next

I want to hook this up with n8n or some automation tool. Imagine: I write a note, send it to an AI, get a draft, review it, and it auto-publishes to my portfolio. All without opening a browser.

That's the dream. And with this API in place, it's actually doable.

## Wrapping Up

If you're a developer thinking about starting a blog — just build something simple. You don't need Gatsby or a headless CMS. A Next.js API route, MongoDB, and some markdown rendering goes a long way.

The code for all of this is on my GitHub. Feel free to poke around if you're curious.

And if you made it this far, thanks for reading. Now go build something.

Happy learning, and Namaste 🙏

— Omkar Chebale