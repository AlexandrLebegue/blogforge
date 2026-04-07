'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBook, FaRobot, FaRocket, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { Article } from '@/models/Article';
import ArticleList from '@/components/ArticleList';
import ChatInputPreview from '@/components/ChatInputPreview';

interface HomePageClientProps { articles: Article[]; }

export default function HomePageClient({ articles }: HomePageClientProps) {
  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

  const features = [
    { icon: '{{FEATURE1_ICON}}', title: '{{FEATURE1_TITLE}}', desc: '{{FEATURE1_DESC}}' },
    { icon: '{{FEATURE2_ICON}}', title: '{{FEATURE2_TITLE}}', desc: '{{FEATURE2_DESC}}' },
    { icon: '{{FEATURE3_ICON}}', title: '{{FEATURE3_TITLE}}', desc: '{{FEATURE3_DESC}}' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-soft py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute top-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-20 left-10 w-96 h-96 bg-success/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        </div>

        <div className="container relative z-10">
          <motion.div className="max-w-4xl mx-auto text-center" initial="initial" animate="animate" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-medium mb-6">
              <HiSparkles className="text-xl" />
              <span>{{HERO_BADGE}}</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-heading font-bold text-text-dark mb-6">
              {{HERO_TITLE_LINE1}}
              <span className="block text-accent mt-2 bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
                {{HERO_TITLE_LINE2}}
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-text-gray mb-8 leading-relaxed">
              {{HERO_SUBTITLE}}
            </motion.p>

            <motion.div variants={fadeInUp}>
              <ChatInputPreview />
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutoriels" className="btn btn-primary text-lg no-underline group">
                <FaBook className="inline mr-2" />
                Browse articles
                <motion.span className="inline-block ml-2" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </Link>
              <Link href="/chatbot" className="btn btn-secondary text-lg no-underline group">
                <FaRobot className="inline mr-2" />
                Ask a question
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container">
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300" whileHover={{ scale: 1.05 }}>
                <motion.div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"
                  whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-gray">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest articles */}
      <section className="py-16 bg-light-gray">
        <div className="container">
          <motion.div className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-dark">Latest articles</h2>
            <Link href="/tutoriels" className="text-accent hover:underline font-medium hidden sm:inline-flex items-center gap-2 group">
              See all articles
              <motion.svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </Link>
          </motion.div>

          <ArticleList articles={articles} showFeatured={false} />

          <motion.div className="text-center mt-12 sm:hidden" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/tutoriels" className="btn btn-primary no-underline">See all articles</Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        <div className="container relative z-10">
          <motion.div className="mx-auto text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <motion.div className="inline-block mb-6 text-6xl"
              animate={{ rotate: [0, 10, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              {{CTA_ICON}}
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-dark mb-6">{{CTA_TITLE}}</h2>
            <p className="text-xl text-text-gray mb-8">{{CTA_SUBTITLE}}</p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <motion.div variants={fadeInUp}>
                <Link href="/tutoriels" className="btn btn-primary text-lg no-underline">
                  <FaRocket className="inline mr-2" /> Start reading
                </Link>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Link href="/a-propos" className="btn btn-secondary text-lg no-underline">
                  <FaCheckCircle className="inline mr-2" /> Learn more
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
