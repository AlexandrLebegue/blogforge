# {{BLOG_NAME}}

{{BLOG_TAGLINE}}

Generated with **Blog Generator AI**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/              # Next.js App Router pages
│   ├── api/          # API routes (chatbot, contact, health)
│   ├── articles/     # Article detail pages
│   ├── chatbot/      # AI chatbot page
│   ├── tutoriels/    # Articles listing by category
│   └── a-propos/     # About & contact page
├── components/       # React components
├── content/          # Markdown articles
├── lib/              # Utilities (markdown parser, AI services)
└── models/           # TypeScript types
```

## Features

- 📝 Markdown-based articles with frontmatter
- 🤖 AI-powered chatbot assistant
- 🎨 Beautiful, responsive design with Tailwind CSS
- ⚡ Built with Next.js 15 and React 19
- 📱 Mobile-first responsive layout
- 🔍 SEO optimized

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

- `REACT_APP_OPENROUTER_API_KEY` — Your OpenRouter API key for the chatbot
- `NEXT_PUBLIC_SITE_URL` — Your deployed site URL
