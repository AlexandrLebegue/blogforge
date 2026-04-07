'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogConfig, GeneratedArticle } from '@/models/Blog';
import { articleToMarkdown } from '@/lib/markdown';

interface Props {
  articles: GeneratedArticle[];
  blogConfig: BlogConfig;
  onPreview: (article: GeneratedArticle) => void;
  onExportZip: () => void;
  onReset: () => void;
  error: string | null;
  usedFallback: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function ResultsPanel({ articles, blogConfig, onPreview, onExportZip, onReset, error, usedFallback }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleCopyMarkdown = async (article: GeneratedArticle) => {
    const md = articleToMarkdown(article);
    await navigator.clipboard.writeText(md);
    setCopied(article.slug);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExportZip();
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadSingle = (article: GeneratedArticle) => {
    const md = articleToMarkdown(article);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-indigo-50/50">
      {/* Header */}
      <header className="generator-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-ghost text-sm py-2 px-3"
            >
              ← New Blog
            </motion.button>
            <div className="h-6 w-px bg-gray-200" />
            <Link href="/" className="brand-logo">
              <span className="brand-icon">🔥</span>
              <span className="brand-text hidden sm:inline" style={{ fontFamily: 'var(--font-poppins)' }}>
                BlogForge<span> AI</span>
              </span>
            </Link>
          </div>
          <motion.button
            onClick={handleExport}
            disabled={exporting}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary shadow-lg"
          >
            {exporting ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  ⏳
                </motion.span>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <span>📦</span>
                <span>Download Project ZIP</span>
              </>
            )}
          </motion.button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white text-center shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="success-checkmark mx-auto mb-4"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </svg>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Your blog is ready! 🎉
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-lg"
            >
              <strong>{blogConfig.name}</strong> — {articles.length} articles generated successfully
            </motion.p>
            
            {usedFallback && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 text-sm text-white/70 flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span>Generated with fallback mode</span>
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: 'Articles', value: articles.length, icon: '📄' },
            { label: 'Total Words', value: articles.reduce((sum, a) => sum + a.content.split(/\s+/).length, 0).toLocaleString(), icon: '✍️' },
            { label: 'Categories', value: [...new Set(articles.map(a => a.category))].length, icon: '🏷️' },
            { label: 'Reading Time', value: `${articles.reduce((sum, a) => sum + (a.readingTime || 5), 0)} min`, icon: '⏱️' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="card p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-poppins)' }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Articles section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-poppins)' }}>
            <span>📚</span>
            Generated Articles
          </h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {articles.map((article, index) => (
              <motion.div
                key={article.slug}
                variants={fadeInUp}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)' }}
                className="card p-6 shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Article number badge */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-md"
                      style={{ background: `var(--color-primary)` }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Article info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {article.title}
                      </h3>
                      <span
                        className="flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full"
                        style={{
                          background: 'var(--color-primary-light)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {article.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <span>📅</span> {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span> {article.readingTime || 5} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <span>✏️</span> {article.author}
                      </span>
                    </div>

                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 4).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600"
                          >
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 4 && (
                          <span className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-500">
                            +{article.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        onClick={() => onPreview(article)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-primary text-sm py-2"
                      >
                        <span>👁️</span>
                        <span>Preview</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleCopyMarkdown(article)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-secondary text-sm py-2"
                      >
                        <span>{copied === article.slug ? '✓' : '📋'}</span>
                        <span>{copied === article.slug ? 'Copied!' : 'Copy MD'}</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleDownloadSingle(article)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-ghost text-sm py-2"
                      >
                        <span>⬇️</span>
                        <span>Download</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Next steps section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 card p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-poppins)' }}>
            <span>🚀</span>
            Next Steps
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Download ZIP',
                description: 'Click the button above to download your complete Next.js project.',
                icon: '📦',
              },
              {
                step: '2',
                title: 'Install & Run',
                description: 'Unzip, run npm install, then npm run dev to preview locally.',
                icon: '💻',
              },
              {
                step: '3',
                title: 'Deploy',
                description: 'Push to GitHub and deploy on Vercel, Netlify, or any host.',
                icon: '🌐',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl mx-auto mb-3">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-gray-900 mb-1">{item.title}</div>
                <p className="text-xs text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA to create another */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-500 mb-4">Want to create another blog?</p>
          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-ghost text-base"
          >
            <span>✨</span>
            <span>Start Over</span>
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
