'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AboutPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      await axios.post('/api/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setErrorMessage('An error occurred. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-light-gray py-12">
      <div className="container max-w-4xl">
        <div className="bg-white rounded-lg shadow-soft p-8 md:p-12 mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-dark mb-6">About</h1>

          <div className="prose max-w-none">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-soft rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-text-dark mb-2">{{AUTHOR_NAME}}</h2>
                <p className="text-text-gray">{{AUTHOR_TITLE}}</p>
              </div>
            </div>

            <div className="space-y-4 text-text-gray leading-relaxed">
              <p>{{ABOUT_BIO}}</p>
              <p>
                This blog is dedicated to sharing knowledge about <strong className="text-text-dark">{{THEME}}</strong>.
                Whether you&apos;re a beginner or an expert, you&apos;ll find tutorials, guides, and practical tips to help you.
              </p>
            </div>

            <div className="mt-8 p-6 bg-light-gray rounded-lg">
              <h3 className="text-xl font-heading font-semibold text-text-dark mb-4">🎯 Topics covered</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['{{CAT1_LABEL}}', '{{CAT2_LABEL}}', '{{CAT3_LABEL}}'].map((label) => (
                  <div key={label} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-semibold text-text-dark">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="contact" className="bg-white rounded-lg shadow-soft p-8 md:p-12">
          <h2 className="text-3xl font-heading font-bold text-text-dark mb-6">Contact</h2>
          <p className="text-text-gray mb-8">Have a question or suggestion? Reach out using the form below.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-text-dark mb-2">Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="input" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-text-dark mb-2">Email <span className="text-red-500">*</span></label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-text-dark mb-2">Subject <span className="text-red-500">*</span></label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="input" placeholder="Subject" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-text-dark mb-2">Message <span className="text-red-500">*</span></label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="textarea" placeholder="Your message..." />
            </div>

            {status === 'success' && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success">✅ Message sent successfully!</div>
            )}
            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">❌ {errorMessage}</div>
            )}

            <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
