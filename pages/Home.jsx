import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { 
  FileText, Palette, Download, Share2, 
  CheckCircle, Sparkles, BarChart3, Link as LinkIcon,
  ArrowRight, ChevronRight
} from 'lucide-react';

import ThemeToggle from '@/components/ui/ThemeToggle';
import WavesLogo from '@/components/common/WavesLogo';

const templates = [
  { 
    id: 't1', 
    name: 'Modern Pro', 
    domain: 'IT', 
    style: 'Modern', 
    color: '#2563EB', 
    atsOptimized: true,
    hasPhoto: false,
    preview: { 
      name: 'Alex Morgan', 
      role: 'Frontend Developer',
      email: 'alex@email.com',
      summary: 'Frontend developer with 4+ years building responsive web applications.',
      skills: ['React', 'TypeScript', 'CSS'],
      experience: [{ company: 'PixelSoft', role: 'Senior Frontend Developer', period: '2021–Present' }]
    }
  },
  { 
    id: 't2', 
    name: 'Executive Classic', 
    domain: 'Management', 
    style: 'ATS', 
    color: '#0B1F3B',
    atsOptimized: true,
    hasPhoto: false,
    preview: { 
      name: 'Jordan Blake', 
      role: 'Operations Manager',
      email: 'jordan@email.com',
      summary: 'Results-driven operations manager with 8+ years leading teams.',
      skills: ['Leadership', 'Strategy', 'KPI Tracking'],
      experience: [{ company: 'GlobalTech Inc', role: 'Operations Manager', period: '2020–Present' }]
    }
  },
  { 
    id: 't3', 
    name: 'Creative Flow', 
    domain: 'Arts', 
    style: 'Creative', 
    color: '#14B8A6',
    atsOptimized: false,
    hasPhoto: true,
    preview: { 
      name: 'Maya Chen', 
      role: 'Visual Artist',
      email: 'maya@studio.com',
      summary: 'Contemporary artist specializing in mixed media and illustration.',
      skills: ['Illustration', 'Branding', 'Digital Art'],
      experience: [{ company: 'Independent Studio', role: 'Visual Artist', period: '2018–Present' }]
    }
  },
  { 
    id: 't5', 
    name: 'Culinary Craft', 
    domain: 'Culinary', 
    style: 'Creative', 
    color: '#F97316',
    atsOptimized: false,
    hasPhoto: true,
    preview: { 
      name: 'Marco Rossi', 
      role: 'Head Chef',
      email: 'marco@bella.com',
      summary: 'Passionate chef with 10+ years in Italian cuisine.',
      skills: ['Menu Design', 'Fine Dining', 'Team Leadership'],
      experience: [{ company: 'Bella Italiana', role: 'Head Chef', period: '2020–Present' }]
    }
  },
  { 
    id: 't7', 
    name: 'Sports Elite', 
    domain: 'Sports', 
    style: 'Performance', 
    color: '#22C55E',
    atsOptimized: false,
    hasPhoto: true,
    preview: { 
      name: 'Daniel Cruz', 
      role: 'Professional Athlete',
      email: 'daniel@athletics.com',
      summary: 'Endurance athlete specializing in marathon running.',
      skills: ['Endurance', 'Training', 'Nutrition'],
      experience: [{ company: 'Elite Athletics', role: 'Professional Runner', period: '2018–Present' }]
    }
  },
  { 
    id: 't9', 
    name: 'Security Shield', 
    domain: 'Security', 
    style: 'ATS', 
    color: '#475569',
    atsOptimized: true,
    hasPhoto: false,
    preview: { 
      name: 'Michael Grant', 
      role: 'Security Officer',
      email: 'michael@security.com',
      summary: 'Certified security professional with 7+ years experience.',
      skills: ['Surveillance', 'Safety', 'Risk Assessment'],
      experience: [{ company: 'SecurePro Inc', role: 'Security Officer', period: '2019–Present' }]
    }
  },
];

const steps = [
  { icon: Palette, title: 'Choose Template', desc: 'Select from ATS-optimized templates for your domain' },
  { icon: FileText, title: 'Edit Resume', desc: 'Add your details with AI-powered suggestions' },
  { icon: Download, title: 'Export & Share', desc: 'Download CV, generate portfolio, share instantly' },
];

const benefits = [
  { icon: CheckCircle, title: 'ATS-Friendly', desc: 'Optimized for applicant tracking systems' },
  { icon: LinkIcon, title: 'Portfolio', desc: 'Auto-generated professional portfolio' },
  { icon: Sparkles, title: 'AI Insights', desc: 'Smart suggestions and improvements' },
  { icon: Share2, title: 'Shareable', desc: 'QR codes and LinkedIn integration' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1F3B]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0B1F3B]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8">
               <WavesLogo size="small" />
             </div>
             <span className="font-bold text-xl text-[#0B1F3B] dark:text-white">Abyss</span>
           </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to={createPageUrl('Templates')}>
              <Button variant="ghost" className="text-slate-600 dark:text-white/70">Templates</Button>
            </Link>
            <Link to={createPageUrl('Editor')}>
              <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg">
                Create Resume
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <WavesLogo size="default" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0B1F3B] dark:text-white mb-6">
              Welcome to <span className="bg-gradient-to-r from-[#2563EB] to-[#14B8A6] bg-clip-text text-transparent">Abyss</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-white/60 max-w-2xl mx-auto">
              Build professional resumes, generate stunning portfolios, and accelerate your career with AI-powered insights.
            </p>
          </motion.div>

          {/* Featured Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#0B1F3B] dark:text-white">Featured Templates</h2>
              <Link to={createPageUrl('Templates')} className="text-[#2563EB] hover:text-[#1d4ed8] text-sm flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {templates.map((template, i) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                >
                  <Link to={createPageUrl('Editor') + `?template=${template.id}`}>
                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#0F2744] border border-white/5 p-6 transition-all duration-300 relative overflow-hidden group-hover:border-white/10 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      {/* Mini resume preview */}
                      <div className="aspect-[3/4] bg-white dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 mb-3 p-3 relative overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                        {/* ATS Badge */}
                        {template.atsOptimized && (
                          <div className="absolute top-2 right-2 z-10">
                            <span className="text-[7px] px-1.5 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 rounded font-medium uppercase tracking-wide">
                              ATS
                            </span>
                          </div>
                        )}
                        
                        {/* Header */}
                        <div className="flex items-start gap-2 mb-2">
                          {template.hasPhoto ? (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${template.color} 0%, ${template.color}dd 100%)` }}>
                              {template.preview.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          ) : null}
                          <div className="flex-1">
                            <div className="text-[10px] font-bold text-[#0B1F3B] dark:text-white mb-0.5">{template.preview.name}</div>
                            <div className="text-[8px]" style={{ color: template.color }}>{template.preview.role}</div>
                            <div className="text-[7px] text-slate-400 mt-0.5">{template.preview.email}</div>
                          </div>
                        </div>
                        
                        {/* Summary */}
                        <div className="mb-2">
                          <div className="text-[6px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: template.color }}>Summary</div>
                          <div className="text-[7px] text-slate-600 dark:text-white/60 leading-tight">{template.preview.summary}</div>
                        </div>
                        
                        {/* Skills */}
                        <div className="mb-2">
                          <div className="text-[6px] font-semibold uppercase tracking-wide mb-1" style={{ color: template.color }}>Skills</div>
                          <div className="flex flex-wrap gap-1">
                            {template.preview.skills.map((skill, idx) => (
                              <span key={idx} className="text-[6px] px-1.5 py-0.5 rounded" style={{ backgroundColor: template.color + '20', color: template.color }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Experience */}
                        <div>
                          <div className="text-[6px] font-semibold uppercase tracking-wide mb-1" style={{ color: template.color }}>Experience</div>
                          <div className="text-[7px] font-medium text-[#0B1F3B] dark:text-white">{template.preview.experience[0].role}</div>
                          <div className="text-[6px] text-slate-500 dark:text-white/50">{template.preview.experience[0].company} • {template.preview.experience[0].period}</div>
                        </div>
                        
                        {/* Accent */}
                        <div className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-1.5" style={{ backgroundColor: template.color }} />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-lg text-[#F8FAFC] relative z-10">{template.name}</h3>
                        {template.atsOptimized && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                          >
                            <CheckCircle className="h-4 w-4 text-green-400 relative z-10" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs text-white/40 relative z-10 uppercase tracking-wider">{template.domain} • {template.style}</p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-lg font-semibold text-[#0B1F3B] dark:text-white mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
               {steps.map((step, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 * i + 0.4 }}
                   whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)' }}
                   className="relative"
                 >
                   <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 text-center transition-all duration-300">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#2563EB]/10 to-[#14B8A6]/10 rounded-xl flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-[#2563EB]" />
                    </div>
                    <span className="absolute -top-3 left-6 bg-[#2563EB] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold text-[#0B1F3B] dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-white/60">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-lg font-semibold text-[#0B1F3B] dark:text-white mb-8 text-center">Why Abyss?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {benefits.map((benefit, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ scale: 1.05, y: -4 }}
                   transition={{ duration: 0.2 }}
                   className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-5 text-center hover:shadow-lg transition-shadow duration-300"
                 >
                  <div className="w-10 h-10 mx-auto mb-3 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="h-5 w-5 text-[#14B8A6]" />
                  </div>
                  <h3 className="font-medium text-sm text-[#0B1F3B] dark:text-white mb-1">{benefit.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-white/50">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center"
          >
            <Link to={createPageUrl('Templates')}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:from-[#1d4ed8] hover:to-[#0d9488] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  Browse Templates
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}