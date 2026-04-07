'use client';

import { useEffect, useState } from 'react';
import { BlogConfig, GeneratedArticle } from '@/models/Blog';
import { parseMarkdownToHtml } from '@/lib/markdown';
import { PRESET_COLORS } from '@/models/Blog';

interface Props {
  article: GeneratedArticle;
  blogConfig: BlogConfig;
  onClose: () => void;
}

function darkenHex(hex: string, amount = 25): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return hex;
  return `#${[parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)]
    .map(v => Math.max(0, v - amount).toString(16).padStart(2, '0')).join('')}`;
}

function lightenHex(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return '#EEF2FF';
  return `#${[parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)]
    .map(v => Math.min(255, v + 185).toString(16).padStart(2, '0')).join('')}`;
}

export default function ArticlePreview({ article, blogConfig, onClose }: Props) {
  const [htmlContent, setHtmlContent] = useState('');
  const primary = blogConfig.primaryColor || '#6366F1';
  const primaryHover = darkenHex(primary);
  const primaryLight = PRESET_COLORS.find(c => c.primary === primary)?.light || lightenHex(primary);

  useEffect(() => {
    setHtmlContent(parseMarkdownToHtml(article.content));
  }, [article.content]);

  // Inject theme into the preview
  const themeStyle = `
    :root {
      --color-primary: ${primary};
      --color-primary-hover: ${primaryHover};
      --color-primary-light: ${primaryLight};
    }
  `;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Exit Preview Bar */}
      <div className="bg-[#111827] text-white px-4 py-2.5 flex items-center justify-between text-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="font-medium">Preview Mode</span>
          <span className="text-[#9CA3AF]">—</span>
          <span className="text-[#D1D5DB]">{blogConfig.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#9CA3AF] hidden sm:block">This is how your blog will look</span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium"
          >
            ✕ Close Preview
          </button>
        </div>
      </div>

      {/* Cloned blog layout */}
      <div style={{ '--color-primary': primary, '--color-primary-hover': primaryHover, '--color-primary-light': primaryLight } as React.CSSProperties}>
        <style>{themeStyle}</style>

        {/* Cloned Navbar (from yala allemagne pattern) */}
        <header
          className="sticky top-10 z-40 bg-white/95 backdrop-blur border-b border-[#E5E7EB]"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="#" className="font-bold text-xl no-underline" style={{ color: primary, fontFamily: 'var(--font-poppins), sans-serif' }}>
                {blogConfig.name}
              </a>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-[#6B7280] hover:text-[#111827] font-medium no-underline text-sm transition-colors">Home</a>
                <a href="#" className="text-[#6B7280] hover:text-[#111827] font-medium no-underline text-sm transition-colors">Articles</a>
              </nav>
              <button
                className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all"
                style={{ background: primary }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </header>

        {/* Article page */}
        <main>
          <div className="py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb */}
              <div className="mb-6">
                <a href="#" className="text-sm font-medium no-underline" style={{ color: primary }}>
                  ← Back to Articles
                </a>
              </div>

              <article>
                {/* Article header */}
                <header className="mb-10">
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: primaryLight, color: primary }}
                    >
                      {article.category}
                    </span>
                    <span className="text-[#9CA3AF] text-xs">{article.readingTime} min read</span>
                    <span className="text-[#9CA3AF] text-xs hidden sm:block">·</span>
                    <time className="text-[#9CA3AF] text-xs">
                      {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>

                  <h1
                    className="text-3xl md:text-4xl font-bold text-[#111827] mb-4 leading-tight"
                    style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
                  >
                    {article.title}
                  </h1>

                  <p className="text-lg text-[#6B7280] leading-relaxed mb-6">
                    {article.excerpt}
                  </p>

                  {/* Author bar */}
                  <div
                    className="flex items-center gap-4 py-4 px-5 rounded-xl"
                    style={{ background: primaryLight }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ background: primary }}
                    >
                      {(article.author || blogConfig.name).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-[#111827] text-sm">{article.author || blogConfig.name}</div>
                      <div className="text-xs text-[#6B7280]">{blogConfig.tagline || blogConfig.theme}</div>
                    </div>
                  </div>
                </header>

                {/* Article content */}
                <div
                  className="prose-article"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {/* Tags footer */}
                {article.tags.length > 0 && (
                  <footer className="mt-12 pt-6 border-t border-[#E5E7EB]">
                    <h4 className="text-sm font-semibold text-[#6B7280] mb-3 uppercase tracking-wide">Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map(tag => (
                        <a
                          key={tag}
                          href="#"
                          className="text-sm px-3 py-1 rounded-full no-underline font-medium transition-colors"
                          style={{ background: primaryLight, color: primary }}
                        >
                          #{tag}
                        </a>
                      ))}
                    </div>
                  </footer>
                )}

                {/* CTA */}
                <div
                  className="mt-12 p-6 rounded-xl text-center"
                  style={{ background: `linear-gradient(135deg, ${primaryLight} 0%, #ffffff 100%)`, border: `1px solid ${primary}33` }}
                >
                  <h3 className="font-bold text-[#111827] text-lg mb-2" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
                    Enjoying {blogConfig.name}?
                  </h3>
                  <p className="text-[#6B7280] text-sm mb-4">Get more articles like this one straight to your inbox.</p>
                  <button
                    className="btn text-white text-sm px-6 py-2.5"
                    style={{ background: primary }}
                  >
                    Subscribe for Free
                  </button>
                </div>
              </article>
            </div>
          </div>

          {/* Related articles placeholder */}
          <section className="py-12 bg-[#F9FAFB] border-t border-[#E5E7EB]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2
                className="text-2xl font-bold text-[#111827] mb-6"
                style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
              >
                More Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => (
                  <div key={i} className="card p-5">
                    <div
                      className="w-16 h-5 rounded mb-3"
                      style={{ background: primaryLight }}
                    />
                    <div className="h-3 w-3/4 bg-[#F3F4F6] rounded mb-2" />
                    <div className="h-3 w-full bg-[#F3F4F6] rounded mb-2" />
                    <div className="h-3 w-2/3 bg-[#F3F4F6] rounded" />
                    <div className="mt-3 text-sm font-semibold" style={{ color: primary }}>Read more →</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[#E5E7EB] py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-lg" style={{ color: primary, fontFamily: 'var(--font-poppins), sans-serif' }}>
                  {blogConfig.name}
                </span>
                {blogConfig.tagline && (
                  <p className="text-sm text-[#6B7280] mt-1">{blogConfig.tagline}</p>
                )}
              </div>
              <p className="text-sm text-[#9CA3AF]">
                © {new Date().getFullYear()} {blogConfig.author || blogConfig.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
