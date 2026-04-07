'use client';

import { motion } from 'framer-motion';
import { FaServer, FaBolt, FaLightbulb, FaRobot } from 'react-icons/fa';
import Link from 'next/link';
import { Article } from '@/models/Article';
import ArticleList from '@/components/ArticleList';

interface TutorielsPageClientProps {
  cat1Articles: Article[];
  cat2Articles: Article[];
  cat3Articles: Article[];
}

export default function TutorielsPageClient({
  cat1Articles,
  cat2Articles,
  cat3Articles
}: TutorielsPageClientProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const categories = [
    {
      id: '{{CAT1}}',
      title: '{{CAT1_LABEL}}',
      description: `${cat1Articles.length} article${cat1Articles.length > 1 ? 's' : ''}`,
      icon: FaServer,
      color: 'bg-green-500'
    },
    {
      id: '{{CAT2}}',
      title: '{{CAT2_LABEL}}',
      description: `${cat2Articles.length} article${cat2Articles.length > 1 ? 's' : ''}`,
      icon: FaBolt,
      color: 'bg-purple-500'
    },
    {
      id: '{{CAT3}}',
      title: '{{CAT3_LABEL}}',
      description: `${cat3Articles.length} article${cat3Articles.length > 1 ? 's' : ''}`,
      icon: FaLightbulb,
      color: 'bg-yellow-500'
    }
  ];

  const articlesByCategory = [cat1Articles, cat2Articles, cat3Articles];

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-heading font-bold text-text-dark mb-4"
          >
            Articles & Tutorials
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-text-gray"
          >
            {{TUTORIALS_SUBTITLE}}
          </motion.p>
        </motion.div>

        {/* Quick Links */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.a
                key={category.id}
                href={`#${category.id}`}
                className="card hover:-translate-y-1 no-underline group"
                variants={fadeInUp}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className={`w-12 h-12 ${category.color} bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className={`w-6 h-6 ${category.color.replace('bg-', 'text-')}`} />
                  </motion.div>
                  <div>
                    <h3 className="font-heading font-semibold text-text-dark group-hover:text-accent mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-text-gray">
                      {category.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Category Sections */}
        {categories.map((category, index) => {
          const articles = articlesByCategory[index];
          const Icon = category.icon;
          if (articles.length === 0) return null;
          return (
            <motion.section 
              key={category.id}
              id={category.id} 
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className={`w-10 h-10 ${category.color} bg-opacity-10 rounded-full flex items-center justify-center`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className={`w-5 h-5 ${category.color.replace('bg-', 'text-')}`} />
                </motion.div>
                <h2 className="text-3xl font-heading font-bold text-text-dark">
                  {category.title}
                </h2>
              </div>
              <ArticleList articles={articles} />
            </motion.section>
          );
        })}

        {/* CTA Section */}
        <motion.div 
          className="bg-white rounded-lg shadow-soft p-8 text-center mt-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaRobot className="text-5xl text-accent" />
          </motion.div>
          <h3 className="text-2xl font-heading font-bold text-text-dark mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <p className="text-text-gray mb-6">
            Ask our AI chatbot for personalized recommendations
          </p>
          <Link href="/chatbot" className="btn btn-primary no-underline">
            <FaRobot className="inline mr-2" />
            Ask a question
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
