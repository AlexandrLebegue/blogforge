'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

// ── Particles ────────────────────────────────────────────────────────────────

function FloatingParticle({ delay, size, x, y, color = 'bg-white/10' }: {
  delay: number; size: number; x: string; y: string; color?: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} backdrop-blur-sm`}
      style={{ width: size, height: size, left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.7, 0], scale: [0, 1, 0.4], y: [0, -120, -240] }}
      transition={{ duration: 7 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function OrbitRing({ size, duration, delay }: { size: number; duration: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-indigo-300/20"
      style={{ width: size, height: size, top: '50%', left: '50%', marginLeft: -size / 2, marginTop: -size / 2 }}
      animate={{ rotate: 360, scale: [1, 1.04, 1] }}
      transition={{ rotate: { duration, repeat: Infinity, ease: 'linear' }, scale: { duration: 4, repeat: Infinity, delay } }}
    />
  );
}

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };

// ── Carousel slides — focus on features, UI, AI agent ────────────────────────

const slides = [
  {
    id: 'ai-agent',
    label: '🤖 AI Agent',
    accent: 'from-violet-600 to-indigo-600',
    accentLight: 'from-violet-50 to-indigo-50',
    accentBorder: 'border-violet-200',
    title: 'AI Agent that searches for you',
    subtitle: 'Just ask in plain English. The AI agent finds, filters, and surfaces the exact articles your readers need — no search bar required.',
    ui: (
      <div className="flex flex-col gap-3">
        {/* Chat UI mockup */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <span className="text-white text-sm font-semibold">AI Article Agent</span>
            <span className="ml-auto text-white/70 text-xs">● Online</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="self-end bg-indigo-600 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
              Find me beginner guides about automations
            </div>
            <div className="flex gap-2 items-start max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs shrink-0">AI</div>
              <div className="bg-gray-100 text-gray-800 text-sm rounded-2xl rounded-tl-sm px-4 py-2">
                Found <strong>4 articles</strong> matching your query ✨
              </div>
            </div>
            {/* Result chips */}
            {['Home Automation Basics', 'Your First YAML Script', 'Scene & Trigger Guide'].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-xs font-medium text-indigo-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {t}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'editor',
    label: '✍️ Markdown Editor',
    accent: 'from-emerald-600 to-teal-600',
    accentLight: 'from-emerald-50 to-teal-50',
    accentBorder: 'border-emerald-200',
    title: 'Rich Markdown editor built-in',
    subtitle: 'A beautiful, distraction-free editor with live preview, syntax highlighting, image uploads and a full toolbar. Write like a pro from day one.',
    ui: (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-100 px-4 py-2.5 flex items-center gap-1 flex-wrap">
          {['B', 'I', 'H1', 'H2', '—', '🔗', '📷', '{ }', '≡'].map((t, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.15, backgroundColor: '#EEF2FF' }}
              className="w-7 h-7 rounded text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors flex items-center justify-center"
            >
              {t}
            </motion.button>
          ))}
        </div>
        {/* Editor area */}
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="p-4 text-xs font-mono text-gray-500 leading-relaxed">
            <span className="text-violet-500"># </span><span className="text-gray-800 font-semibold">My First Post</span>{'\n\n'}
            <span className="text-violet-500">## </span><span className="text-gray-700">Introduction</span>{'\n\n'}
            <span className="text-gray-600">This is **bold** and *italic*.</span>
          </div>
          <div className="p-4 text-xs text-gray-700 leading-relaxed bg-gray-50/50">
            <p className="font-bold text-base text-gray-900 mb-1">My First Post</p>
            <p className="font-semibold text-sm text-gray-700 mb-1">Introduction</p>
            <p>This is <strong>bold</strong> and <em>italic</em>.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'ui',
    label: '🎨 Beautiful UI',
    accent: 'from-pink-600 to-rose-500',
    accentLight: 'from-pink-50 to-rose-50',
    accentBorder: 'border-pink-200',
    title: 'Stunning Tailwind CSS interface',
    subtitle: 'Every blog is generated with a polished, mobile-first design. Custom colors, typography, and layouts — all powered by Tailwind CSS.',
    ui: (
      <div className="flex flex-col gap-3">
        {/* Color palette */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Brand Colors</p>
          <div className="flex gap-2 flex-wrap">
            {[
              'bg-indigo-500', 'bg-violet-500', 'bg-pink-500', 'bg-emerald-500',
              'bg-amber-500', 'bg-cyan-500', 'bg-rose-500', 'bg-teal-500',
            ].map((c, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.3, rotate: 8 }}
                className={`w-8 h-8 rounded-xl ${c} shadow-sm cursor-pointer`}
              />
            ))}
          </div>
        </div>
        {/* Typography preview */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Typography</p>
          <p className="text-2xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>Heading Style</p>
          <p className="text-sm text-gray-500 mt-1">Body text with perfect line-height and spacing.</p>
          <div className="mt-2 flex gap-2">
            <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg">Primary</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">Secondary</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'deploy',
    label: '🚀 One-Click Deploy',
    accent: 'from-orange-500 to-amber-500',
    accentLight: 'from-orange-50 to-amber-50',
    accentBorder: 'border-orange-200',
    title: 'Export & deploy in seconds',
    subtitle: 'Download a complete Next.js project, fully configured. Push to Vercel, Netlify, or any host with zero setup.',
    ui: (
      <div className="flex flex-col gap-3">
        <div className="bg-gray-950 rounded-2xl p-4 font-mono text-xs leading-loose">
          {[
            { prompt: '$', cmd: ' npx create-next-app my-blog', color: 'text-green-400' },
            { prompt: '', cmd: '✓ Blog generated successfully', color: 'text-emerald-300' },
            { prompt: '', cmd: '✓ 3 articles created', color: 'text-emerald-300' },
            { prompt: '', cmd: '✓ Tailwind CSS configured', color: 'text-emerald-300' },
            { prompt: '$', cmd: ' vercel deploy', color: 'text-yellow-300' },
            { prompt: '', cmd: '🎉 Live at my-blog.vercel.app', color: 'text-cyan-300' },
          ].map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex gap-2"
            >
              <span className="text-indigo-400 select-none">{line.prompt}</span>
              <span className={line.color}>{line.cmd}</span>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['Vercel', 'Netlify', 'Railway'].map((host) => (
            <div key={host} className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-center text-xs font-semibold text-gray-600 shadow-sm">
              {host}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const features = [
  { icon: '🤖', title: 'AI Article Agent', description: 'Smart agent that searches and surfaces articles for readers using natural language queries.' },
  { icon: '✍️', title: 'Markdown Editor', description: 'Full-featured editor with live preview, toolbar, syntax highlighting and image uploads.' },
  { icon: '🎨', title: 'Tailwind UI', description: 'Beautiful, mobile-first designs generated with Tailwind CSS. Your brand, your colors.' },
  { icon: '📦', title: 'Export Ready', description: 'Download a complete Next.js project, deploy anywhere. You own everything.' },
  { icon: '✍️', title: 'SEO Optimized', description: 'Meta tags, Open Graph, sitemaps and optimized frontmatter — all generated automatically.' },
  { icon: '🔒', title: 'No Lock-in', description: 'Open source output. Modify, extend, and self-host with zero vendor dependency.' },
];

const steps = [
  { number: '01', title: 'Name Your Blog', description: 'Enter your blog name, tagline, and pick a niche that matches your vision.', icon: '✏️' },
  { number: '02', title: 'Customize Your Brand', description: 'Choose from preset color palettes or pick your own hex codes and typography.', icon: '🎨' },
  { number: '03', title: 'AI Does the Rest', description: 'Describe your topic — the AI builds your full blog with articles, editor and AI agent.', icon: '🤖' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [slide, setSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  const next = () => setSlide((p) => (p + 1) % total);
  const prev = () => setSlide((p) => (p - 1 + total) % total);

  useEffect(() => {
    if (autoPlay) {
      timerRef.current = setInterval(next, 5000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, slide]);

  const current = slides[slide];

  return (
    <div className="min-h-screen bg-off-white overflow-hidden">

      {/* ── Navbar ──────────────────────────────────────────────────────────────── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-[0_4px_24px_0_rgba(99,102,241,0.10)]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo + subtitle */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.span className="text-2xl" whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} transition={{ duration: 0.4 }}>
              🔥
            </motion.span>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-gray-900" style={{ fontFamily: 'var(--font-poppins)' }}>
                BlogForge<span className="text-indigo-600"> AI</span>
              </span>
              <span className="text-[11px] text-gray-400 font-medium tracking-wide">
                AI-powered blog builder &amp; agent
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a href="#features" className="hidden sm:block text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hidden sm:block text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
              How it works
            </a>
            <Link href="/generator" className="btn-landing-primary">
              <span>Start Now</span>
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        {/* Ombre fade below navbar */}
        <div className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(79,70,229,0.25) 0%, transparent 100%)' }} />

        {/* Rich particle field */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Bubbles rising */}
          {[
            { d:0, s:8, x:'8%', y:'70%', c:'bg-white/15' },
            { d:0.8, s:14, x:'18%', y:'75%', c:'bg-indigo-300/20' },
            { d:1.6, s:6, x:'28%', y:'80%', c:'bg-white/10' },
            { d:0.3, s:10, x:'42%', y:'85%', c:'bg-purple-300/20' },
            { d:2.1, s:16, x:'55%', y:'72%', c:'bg-white/10' },
            { d:1.1, s:7, x:'65%', y:'78%', c:'bg-indigo-200/20' },
            { d:0.6, s:12, x:'75%', y:'68%', c:'bg-white/15' },
            { d:1.9, s:9, x:'85%', y:'80%', c:'bg-pink-300/15' },
            { d:2.7, s:5, x:'92%', y:'65%', c:'bg-white/10' },
            { d:3.2, s:11, x:'35%', y:'60%', c:'bg-cyan-300/15' },
            { d:0.4, s:8, x:'50%', y:'90%', c:'bg-white/10' },
            { d:1.5, s:6, x:'12%', y:'55%', c:'bg-violet-300/15' },
          ].map((p, i) => <FloatingParticle key={i} delay={p.d} size={p.s} x={p.x} y={p.y} color={p.c} />)}

          {/* Glowing orbs (static) */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', top: '10%', right: '-5%' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)', bottom: '5%', left: '-5%' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />

          {/* Orbit rings around center-right */}
          <div className="absolute" style={{ top: '25%', right: '8%' }}>
            <OrbitRing size={160} duration={18} delay={0} />
            <OrbitRing size={260} duration={30} delay={1} />
            <OrbitRing size={360} duration={45} delay={2} />
          </div>
        </div>

        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-indigo-100 shadow-lg shadow-indigo-500/10 mb-8"
          >
            <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>✨</motion.span>
            <span className="text-sm font-semibold text-indigo-600">AI Blog Builder + AI Search Agent</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-poppins)', textShadow: '0 4px 30px rgba(0,0,0,0.2)' }}
          >
            Build a blog with
            <br />
            <span
              className="relative inline-block bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #c7d2fe 0%, #818cf8 20%, #ffffff 40%, #a5b4fc 60%, #818cf8 80%, #c7d2fe 100%)',
                backgroundSize: '200% auto',
                animation: 'shimmer-text 6s linear infinite',
              }}
            >
              a real AI agent
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10"
          >
            BlogForge AI generates a complete, beautifully designed blog — with a built-in Markdown editor
            and an AI agent that helps your readers find exactly what they&apos;re looking for.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/generator">
              <motion.button
                className="btn-hero-primary"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Start Now — Free</span>
                <span className="text-xl">🚀</span>
              </motion.button>
            </Link>
            <motion.a
              href="#showcase"
              className="btn-hero-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>See Features</span>
              <span>↓</span>
            </motion.a>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-white/60"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── Feature Carousel ─────────────────────────────────────────────────────── */}
      <section id="showcase" className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              Everything in one place
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              A beautiful interface, a smart AI agent, a full editor — all generated for you in under 60 seconds.
            </p>
          </motion.div>

          {/* Tab pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {slides.map((s, i) => (
              <motion.button
                key={s.id}
                onClick={() => { setAutoPlay(false); setSlide(i); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  i === slide
                    ? `bg-gradient-to-r ${s.accent} text-white shadow-md`
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s.label}
              </motion.button>
            ))}
          </div>

          {/* Carousel */}
          <div
            className="relative"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`rounded-3xl bg-gradient-to-br ${current.accentLight} border ${current.accentBorder} p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center`}
              >
                {/* Left: copy */}
                <div className="flex flex-col gap-5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${current.accent} text-white font-bold text-sm w-fit shadow`}
                  >
                    {current.label}
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 }}
                    className="text-3xl font-bold text-gray-900 leading-snug"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {current.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.26 }}
                    className="text-gray-600 text-base leading-relaxed"
                  >
                    {current.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Link href="/generator">
                      <motion.button
                        className="btn-landing-primary text-sm py-2.5 px-5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span>Try it now</span>
                        <span>→</span>
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>

                {/* Right: live UI mockup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {current.ui}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next */}
            <button
              onClick={() => { setAutoPlay(false); prev(); }}
              className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-xl text-gray-500 hover:text-indigo-600 hover:shadow-lg transition-all z-10"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() => { setAutoPlay(false); next(); }}
              className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-xl text-gray-500 hover:text-indigo-600 hover:shadow-lg transition-all z-10"
              aria-label="Next"
            >
              ›
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAutoPlay(false); setSlide(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === slide ? 'w-7 h-2.5 bg-indigo-600' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-off-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              Three steps to your blog
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              No technical skills needed. Just answer a few questions and let AI do the heavy lifting.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={fadeUp} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-300 to-transparent" />
                )}
                <motion.div
                  className="step-card group"
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="step-number">{step.number}</span>
                    <span className="text-3xl group-hover:scale-110 transition-transform">{step.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              Everything you need
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              A complete platform — from AI generation to beautiful UI and intelligent search.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)' }}
                className="feature-card"
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 cta-gradient" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        {/* CTA particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { d:0, s:10, x:'5%', y:'60%' }, { d:1, s:8, x:'15%', y:'70%' },
            { d:2, s:12, x:'80%', y:'65%' }, { d:0.5, s:6, x:'90%', y:'50%' },
            { d:1.5, s:9, x:'50%', y:'80%' },
          ].map((p, i) => <FloatingParticle key={i} delay={p.d} size={p.s} x={p.x} y={p.y} />)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <span className="text-6xl">🔥</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
            Ready to build your blog?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Start for free — no credit card required. Your complete blog with AI agent and editor will be ready in under a minute.
          </p>
          <Link href="/generator">
            <motion.button
              className="btn-cta"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Start Now — It&apos;s Free</span>
              <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>→</motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────────── */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-bold text-white text-lg leading-none" style={{ fontFamily: 'var(--font-poppins)' }}>
                  BlogForge<span className="text-indigo-400"> AI</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">AI-powered blog builder &amp; agent</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/generator" className="hover:text-white transition-colors">Generator</Link>
              <span className="text-gray-700">•</span>
              <span>Built with ❤️ and AI</span>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © {new Date().getFullYear()} BlogForge AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
