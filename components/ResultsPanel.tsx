'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogConfig } from '@/models/Blog';

interface Props {
  blogConfig: BlogConfig;
  onExportZip: () => void;
  onReset: () => void;
  error: string | null;
}

export default function ResultsPanel({ blogConfig, onExportZip, onReset, error }: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExportZip();
    } finally {
      setExporting(false);
    }
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
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

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
              <strong>{blogConfig.name}</strong> — complete site generated successfully
            </motion.p>
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

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
        >
          {[
            { label: 'Blog Name', value: blogConfig.name, icon: '📝' },
            { label: 'Theme', value: blogConfig.theme, icon: '🎨' },
            { label: 'Author', value: blogConfig.author || blogConfig.name, icon: '✏️' },
            { label: 'Color', value: blogConfig.primaryColor, icon: '🎨' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="card p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <div className="text-sm font-bold text-gray-900 truncate" style={{ fontFamily: 'var(--font-poppins)' }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* What's in the ZIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-8 mb-10"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-poppins)' }}>
            <span>📦</span>
            What&apos;s in your ZIP
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '🏠', title: 'Home page', desc: 'Hero, features, article feed and CTA' },
              { icon: '📚', title: 'Tutorials page', desc: 'Filterable article listing by category' },
              { icon: '🤖', title: 'AI Chatbot', desc: 'Built-in chatbot powered by your content' },
              { icon: '👤', title: 'About page', desc: 'Author bio and blog description' },
              { icon: '✍️', title: 'Markdown editor', desc: 'Write and publish new articles in-browser' },
              { icon: '🎨', title: 'Themed design', desc: `Custom colors: ${blogConfig.primaryColor}` },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-50"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-poppins)' }}>
            <span>🚀</span>
            Next Steps
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Download ZIP',
                description: 'Click the button above to download your complete Next.js project.',
                icon: '📦',
              },
              {
                title: 'Install & Run',
                description: 'Unzip, run npm install, then npm run dev to preview locally.',
                icon: '💻',
              },
              {
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
