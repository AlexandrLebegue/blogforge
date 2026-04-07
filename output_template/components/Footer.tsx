'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaRobot, FaBook, FaInfoCircle, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/', label: 'Home', icon: FaHome },
    { href: '/chatbot', label: 'Chatbot', icon: FaRobot },
    { href: '/tutoriels', label: 'Articles', icon: FaBook },
    { href: '/a-propos', label: 'About', icon: FaInfoCircle },
  ];

  return (
    <footer className="bg-off-white border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h3 className="text-xl font-heading font-bold text-text-dark mb-4">{{BLOG_NAME}}</h3>
            <p className="text-text-gray text-sm leading-relaxed mb-4">{{BLOG_TAGLINE}}</p>
            <motion.div className="flex items-center gap-1 text-text-gray text-sm" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Made with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}>
                <FaHeart className="text-red-500 mx-1" />
              </motion.span> for {{THEME}}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h4 className="text-lg font-heading font-semibold text-text-dark mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.li key={link.href} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + (index * 0.05) }}>
                    <Link href={link.href} className="text-text-gray hover:text-accent transition-colors text-sm no-underline inline-flex items-center gap-2 group">
                      <Icon className="text-base group-hover:scale-110 transition-transform" />
                      <span>{link.label}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h4 className="text-lg font-heading font-semibold text-text-dark mb-4">Contact</h4>
            <p className="text-text-gray text-sm mb-4">Questions or feedback? Reach out!</p>
            <Link href="/a-propos#contact" className="inline-flex items-center text-accent hover:underline text-sm">
              Contact form →
            </Link>
          </motion.div>
        </div>

        <motion.div className="mt-8 pt-8 border-t border-border" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-text-gray text-sm">© {currentYear} {{AUTHOR_NAME}}. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
