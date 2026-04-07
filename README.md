# 🔥 BlogForge AI

**AI-powered blog generator** — Create stunning blogs with AI in seconds. Enter your blog name and topic, get 3 complete articles plus a deployable Next.js blog.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## ✨ Features

- **🚀 Lightning Fast** — Generate 3 complete articles in under 60 seconds
- **🎨 Fully Customizable** — Choose colors, themes, and your niche
- **📦 Export Ready** — Download a complete Next.js project
- **✍️ SEO Optimized** — Every article comes with meta tags and keywords
- **🎯 10+ Themes** — Tech, Travel, Food, Lifestyle, Finance and more
- **🔒 No Lock-in** — You own everything, deploy anywhere

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- OpenAI API key or Google AI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/blogforge-ai.git
cd blogforge-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local and add your API keys
# OPENAI_API_KEY=your_openai_key
# GOOGLE_AI_API_KEY=your_google_ai_key

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating blogs!

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# Set your API keys
export OPENAI_API_KEY=your_openai_key
export GOOGLE_AI_API_KEY=your_google_ai_key

# Build and run with Docker Compose
docker-compose up -d blogforge

# View logs
docker-compose logs -f blogforge
```

### Build Docker Image Manually

```bash
# Build the image
docker build \
  --build-arg OPENAI_API_KEY=$OPENAI_API_KEY \
  --build-arg GOOGLE_AI_API_KEY=$GOOGLE_AI_API_KEY \
  -t blogforge-ai .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e GOOGLE_AI_API_KEY=$GOOGLE_AI_API_KEY \
  --name blogforge-ai \
  blogforge-ai
```

### Development with Docker

```bash
# Run development container with hot reload
docker-compose --profile dev up blogforge-dev
```

### Docker Compose Services

| Service | Port | Description |
|---------|------|-------------|
| `blogforge` | 3000 | Production build |
| `blogforge-dev` | 3001 | Development with hot reload |

### Health Check

The app includes a health endpoint for container orchestration:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "BlogForge AI",
  "version": "1.0.0"
}
```

## 📁 Project Structure

```
blog-generator/
├── app/
│   ├── page.tsx              # Landing page
│   ├── generator/
│   │   └── page.tsx          # Generator form
│   ├── api/
│   │   ├── generate/         # Article generation API
│   │   ├── export/           # ZIP export API
│   │   └── health/           # Health check API
│   └── layout.tsx            # Root layout
├── components/
│   ├── LandingPage.tsx       # Beautiful landing page
│   ├── GeneratorClient.tsx   # Blog generator form
│   ├── ResultsPanel.tsx      # Results display
│   └── ArticlePreview.tsx    # Article preview
├── lib/
│   ├── ai_services.ts        # AI integration (OpenAI/Google)
│   └── markdown.ts           # Markdown utilities
├── models/
│   └── Blog.ts               # TypeScript types
├── output_template/          # Template for exported blogs
├── Dockerfile                # Production Docker image
├── Dockerfile.dev            # Development Docker image
└── docker-compose.yml        # Docker Compose config
```

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes* | OpenAI API key for GPT models |
| `GOOGLE_AI_API_KEY` | Yes* | Google AI API key (alternative) |

*At least one AI API key is required.

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker (Self-hosted)

See [Docker Deployment](#-docker-deployment) section above.

### Other Platforms

The project exports as a standard Next.js application, compatible with:
- Netlify
- Railway
- Render
- Google Cloud Run
- AWS Amplify
- Any Node.js host

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

---

Built with ❤️ and AI by BlogForge Team
