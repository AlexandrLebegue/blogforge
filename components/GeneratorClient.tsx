'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogConfig, BlogSiteConfig, GeneratedArticle, GenerationResult, PRESET_COLORS, BLOG_THEMES } from '@/models/Blog';
import ArticlePreview from '@/components/ArticlePreview';
import ResultsPanel from '@/components/ResultsPanel';

type Step = 'form' | 'generating' | 'results';

const DEFAULT_CONFIG: BlogConfig = {
  name: '',
  tagline: '',
  theme: '',
  primaryColor: '#6366F1',
  contentAbout: '',
  author: '',
};

const loadingSteps = [
  { label: 'Analyzing topic', icon: '🔍' },
  { label: 'Writing articles', icon: '✍️' },
  { label: 'Polishing content', icon: '✨' },
];

export default function GeneratorClient() {
  const [step, setStep] = useState<Step>('form');
  const [config, setConfig] = useState<BlogConfig>(DEFAULT_CONFIG);
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [siteConfig, setSiteConfig] = useState<BlogSiteConfig | null>(null);
  const [previewArticle, setPreviewArticle] = useState<GeneratedArticle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [progress, setProgress] = useState(0);
  const [customColor, setCustomColor] = useState('');

  const selectedColor = PRESET_COLORS.find(c => c.primary === config.primaryColor);

  const applyThemeColor = useCallback((primary: string) => {
    const found = PRESET_COLORS.find(c => c.primary === primary);
    const hover = found?.hover || primary;
    const light = found?.light || primary + '20';
    const rgb = found?.rgb || '99, 102, 241';
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-primary-hover', hover);
    document.documentElement.style.setProperty('--color-primary-light', light);
    document.documentElement.style.setProperty('--color-primary-rgb', rgb);
  }, []);

  const handleColorSelect = (color: typeof PRESET_COLORS[0]) => {
    setConfig(c => ({ ...c, primaryColor: color.primary }));
    applyThemeColor(color.primary);
  };

  const handleCustomColor = (hex: string) => {
    setCustomColor(hex);
    setConfig(c => ({ ...c, primaryColor: hex }));
    document.documentElement.style.setProperty('--color-primary', hex);
    document.documentElement.style.setProperty('--color-primary-hover', hex);
    document.documentElement.style.setProperty('--color-primary-light', hex + '20');
    document.documentElement.style.setProperty('--color-primary-rgb', '99, 102, 241');
  };

  const isFormValid = config.name.trim() && config.theme && config.contentAbout.trim();

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setError(null);
    setStep('generating');
    setProgress(0);

    // Animate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.random() * 8;
      });
    }, 400);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setProgress(100);
      setTimeout(() => {
        setArticles(data.articles);
        setSiteConfig(data.siteConfig || null);
        setUsedFallback(!!data.usedFallback);
        setStep('results');
        applyThemeColor(config.primaryColor);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('form');
      setProgress(0);
    }
  };

  const handleExportZip = async () => {
    const result: GenerationResult = { blogConfig: config, siteConfig: siteConfig!, articles };
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.name.toLowerCase().replace(/\s+/g, '-')}-blog.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const handleReset = () => {
    setStep('form');
    setConfig(DEFAULT_CONFIG);
    setArticles([]);
    setSiteConfig(null);
    setPreviewArticle(null);
    setUsedFallback(false);
    setError(null);
    setProgress(0);
    // Reset CSS vars
    document.documentElement.style.setProperty('--color-primary', '#6366F1');
    document.documentElement.style.setProperty('--color-primary-hover', '#4F46E5');
    document.documentElement.style.setProperty('--color-primary-light', '#EEF2FF');
    document.documentElement.style.setProperty('--color-primary-rgb', '99, 102, 241');
  };

  if (previewArticle) {
    return (
      <ArticlePreview
        article={previewArticle}
        blogConfig={config}
        onClose={() => setPreviewArticle(null)}
      />
    );
  }

  if (step === 'results') {
    return (
      <ResultsPanel
        articles={articles}
        blogConfig={config}
        onPreview={setPreviewArticle}
        onExportZip={handleExportZip}
        onReset={handleReset}
        error={error}
        usedFallback={usedFallback}
      />
    );
  }

  if (step === 'generating') {
    const currentStep = progress < 33 ? 0 : progress < 66 ? 1 : 2;
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 max-w-md w-full text-center shadow-xl border-0"
        >
          {/* Animated loader */}
          <div className="mb-8 flex justify-center">
            <div className="loading-container">
              {/* Orbiting dots */}
              <div className="loading-orbit">
                <div className="loading-dot" style={{ animation: 'orbit 2s linear infinite' }} />
                <div className="loading-dot" style={{ animation: 'orbit 2s linear infinite 0.5s' }} />
                <div className="loading-dot" style={{ animation: 'orbit 2s linear infinite 1s' }} />
                <div className="loading-dot" style={{ animation: 'orbit 2s linear infinite 1.5s' }} />
              </div>
              {/* Center brain */}
              <motion.div
                className="loading-brain"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🧠
              </motion.div>
            </div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Creating your blog...
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 mb-8 text-sm"
          >
            AI is crafting 3 unique articles for{' '}
            <span className="font-semibold text-indigo-600">{config.name}</span>
          </motion.p>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full progress-bar"
              style={{
                background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #6366F1 100%)',
                backgroundSize: '200% 100%',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <p className="text-sm font-semibold text-indigo-600 mb-6">{Math.round(progress)}%</p>

          {/* Step indicators */}
          <div className="flex justify-center gap-3">
            {loadingSteps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  i === currentStep
                    ? 'bg-indigo-100 text-indigo-700 loading-step active'
                    : i < currentStep
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <span>{i < currentStep ? '✓' : s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-xs text-gray-400"
          >
            This usually takes 20-40 seconds
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ── FORM STEP ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50">
      {/* Header */}
      <header className="generator-header">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="brand-logo">
            <span className="brand-icon">🔥</span>
            <span className="brand-text" style={{ fontFamily: 'var(--font-poppins)' }}>
              BlogForge<span> AI</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              ✨
            </motion.span>
            Powered by AI
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
            Create your blog in seconds
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Fill in a few details — AI generates 3 complete articles and a deployable Next.js blog for you.
          </p>
        </motion.div>

        {/* Steps indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          {[
            { n: 1, label: 'Blog Identity' },
            { n: 2, label: 'Colors & Theme' },
            { n: 3, label: 'Content Focus' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                style={{ background: 'var(--color-primary)', color: 'white' }}
              >
                {s.n}
              </motion.div>
              <span className="text-sm font-medium text-gray-600 hidden sm:block">{s.label}</span>
              {i < 2 && <span className="text-gray-300 mx-1">→</span>}
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >

            {/* Section 1: Blog Identity */}
            <motion.section
              whileHover={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
              className="card p-6 transition-shadow"
            >
              <h3 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: 'var(--color-primary)' }}>1</span>
                Blog Identity
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="label" htmlFor="blog-name">Blog Name *</label>
                  <input
                    id="blog-name"
                    type="text"
                    className="input-field"
                    placeholder="e.g., The Daily Dev, Travel Untamed..."
                    value={config.name}
                    onChange={e => setConfig(c => ({ ...c, name: e.target.value }))}
                    maxLength={60}
                  />
                </div>

                <div>
                  <label className="label" htmlFor="tagline">Tagline <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    id="tagline"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Tips for curious developers"
                    value={config.tagline}
                    onChange={e => setConfig(c => ({ ...c, tagline: e.target.value }))}
                    maxLength={120}
                  />
                </div>

                <div>
                  <label className="label" htmlFor="author">Author Name <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    id="author"
                    type="text"
                    className="input-field"
                    placeholder="e.g., Jane Smith"
                    value={config.author}
                    onChange={e => setConfig(c => ({ ...c, author: e.target.value }))}
                    maxLength={60}
                  />
                </div>
              </div>
            </motion.section>

            {/* Section 2: Theme & Color */}
            <motion.section
              whileHover={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
              className="card p-6 transition-shadow"
            >
              <h3 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: 'var(--color-primary)' }}>2</span>
                Colors & Theme
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="label">Blog Theme / Niche *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BLOG_THEMES.map(theme => (
                      <motion.button
                        key={theme}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConfig(c => ({ ...c, theme }))}
                        className="text-sm px-3 py-2 rounded-lg border font-medium transition-all text-left"
                        style={{
                          borderColor: config.theme === theme ? 'var(--color-primary)' : '#E5E7EB',
                          background: config.theme === theme ? 'var(--color-primary-light)' : 'white',
                          color: config.theme === theme ? 'var(--color-primary)' : '#374151',
                        }}
                      >
                        {theme}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Brand Color *</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_COLORS.map(color => (
                      <motion.button
                        key={color.primary}
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorSelect(color)}
                        title={color.name}
                        className="w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center shadow-sm"
                        style={{
                          background: color.primary,
                          borderColor: config.primaryColor === color.primary ? '#111827' : 'transparent',
                          transform: config.primaryColor === color.primary ? 'scale(1.15)' : 'scale(1)',
                        }}
                      >
                        {config.primaryColor === color.primary && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500">Custom:</label>
                    <input
                      type="color"
                      value={customColor || config.primaryColor}
                      onChange={e => handleCustomColor(e.target.value)}
                      className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                    />
                    <span className="text-sm font-mono text-gray-500">{config.primaryColor}</span>
                    {selectedColor && (
                      <span className="text-sm text-gray-400">— {selectedColor.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section 3: Content Focus */}
            <motion.section
              whileHover={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
              className="card p-6 transition-shadow"
            >
              <h3 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: 'var(--color-primary)' }}>3</span>
                Content Focus
              </h3>

              <div>
                <label className="label" htmlFor="content-about">
                  What should the articles be about? *
                </label>
                <textarea
                  id="content-about"
                  className="input-field resize-none"
                  rows={5}
                  placeholder="Describe the specific topic, audience, and tone you want. e.g., 'Python tips for beginner developers who want to build automation scripts. Friendly and practical tone.'"
                  value={config.contentAbout}
                  onChange={e => setConfig(c => ({ ...c, contentAbout: e.target.value }))}
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{config.contentAbout.length}/500</p>
              </div>
            </motion.section>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex gap-2"
                >
                  <span>⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={handleGenerate}
              disabled={!isFormValid}
              whileHover={isFormValid ? { scale: 1.02, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              className="btn btn-primary w-full justify-center text-base py-4 shadow-lg"
              style={!isFormValid ? { opacity: 0.5, cursor: 'not-allowed', transform: 'none' } : {}}
            >
              <span>✨</span>
              Generate 3 Articles with AI
            </motion.button>
          </motion.div>

          {/* PREVIEW SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-24 space-y-4">
              <div className="card p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wide">Live Preview</h3>
                {/* Mini blog preview */}
                <motion.div
                  className="rounded-lg overflow-hidden border border-gray-200"
                  whileHover={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)' }}
                >
                  {/* Fake navbar */}
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{ background: 'white', borderBottom: '1px solid #E5E7EB' }}
                  >
                    <span
                      className="font-bold text-sm truncate"
                      style={{ color: config.name ? 'var(--color-primary)' : '#D1D5DB' }}
                    >
                      {config.name || 'Your Blog Name'}
                    </span>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-200" />
                      <span className="w-2 h-2 rounded-full bg-gray-200" />
                    </div>
                  </div>
                  {/* Fake hero */}
                  <div
                    className="px-4 py-6 text-center"
                    style={{ background: `linear-gradient(135deg, var(--color-primary-light) 0%, #ffffff 100%)` }}
                  >
                    <div
                      className="font-bold text-base mb-1"
                      style={{ color: '#111827', fontFamily: 'var(--font-poppins)' }}
                    >
                      {config.name || 'Your Blog Name'}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      {config.tagline || config.theme || 'Your tagline here'}
                    </div>
                    <div
                      className="inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      Browse Articles →
                    </div>
                  </div>
                  {/* Fake article cards */}
                  <div className="p-3 bg-gray-50 space-y-2">
                    {['Article 1', 'Article 2', 'Article 3'].map((label, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-white rounded-lg p-3 border border-gray-100"
                      >
                        <div
                          className="w-12 h-1.5 rounded mb-2"
                          style={{ background: 'var(--color-primary-light)' }}
                        />
                        <div className="h-2 w-3/4 bg-gray-100 rounded mb-1.5" />
                        <div className="h-2 w-full bg-gray-100 rounded mb-1.5" />
                        <div className="h-2 w-2/3 bg-gray-100 rounded" />
                        <div
                          className="mt-2 text-xs font-semibold"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          Read more →
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* What you'll get */}
              <div className="card p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 text-sm mb-3">What you&apos;ll get</h3>
                <ul className="space-y-2">
                  {[
                    '3 full markdown articles',
                    'SEO-optimized frontmatter',
                    'Complete Next.js project',
                    'Themed with your colors',
                    'Downloadable ZIP file',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'var(--color-primary)' }}>✓</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
