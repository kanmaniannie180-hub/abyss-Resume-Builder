import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { templateLibrary, filterTemplates, getTemplateById } from '@/components/editor/templateLibrary';

const TEMPLATE_CONFIGS = {
  modern_pro: {
    id: 'modern_pro',
    name: 'Modern Pro',
    domain: 'IT • Tech',
    description: 'Clean developer resume with left accent bar and minimal tech aesthetic',
    ats: 5,
    photo: false,
    fontPrimary: 'Inter',
    fontSecondary: 'Inter',
    accent: '#2563EB',
    layout: 'left-bar'
  },
  executive_elite: {
    id: 'executive_elite',
    name: 'Executive Elite',
    domain: 'Management • Business',
    description: 'Centered leadership resume with structured sections',
    ats: 4,
    photo: true,
    fontPrimary: 'Merriweather',
    fontSecondary: 'Inter',
    accent: '#1F2937',
    layout: 'centered'
  },
  creative_flow: {
    id: 'creative_flow',
    name: 'Creative Flow',
    domain: 'Arts • Design',
    description: 'Editorial asymmetric design portfolio style',
    ats: 3,
    photo: true,
    fontPrimary: 'Playfair Display',
    fontSecondary: 'Lato',
    accent: '#E84A8A',
    layout: 'asymmetric'
  },
  minimal_edge: {
    id: 'minimal_edge',
    name: 'Minimal Edge',
    domain: 'Academic • Teacher',
    description: 'Ultra minimal whitespace for pure ATS optimization',
    ats: 5,
    photo: false,
    fontPrimary: 'Helvetica Neue',
    fontSecondary: 'Helvetica Neue',
    accent: '#6B7280',
    layout: 'minimal'
  },
  culinary_chef: {
    id: 'culinary_chef',
    name: 'Culinary Chef',
    domain: 'Culinary • Hospitality',
    description: 'Chef card style with header band and skill icons',
    ats: 3,
    photo: true,
    fontPrimary: 'Libre Baskerville',
    fontSecondary: 'Inter',
    accent: '#92400E',
    layout: 'header-band'
  },
  music_artist: {
    id: 'music_artist',
    name: 'Music Artist',
    domain: 'Music • Performing',
    description: 'Creative portfolio vibe with vertical rhythm blocks',
    ats: 2,
    photo: true,
    fontPrimary: 'Montserrat',
    fontSecondary: 'Montserrat',
    accent: '#7C3AED',
    layout: 'rhythm'
  },
  sports_athlete: {
    id: 'sports_athlete',
    name: 'Sports Athlete',
    domain: 'Sports • Athletics',
    description: 'Athletic card with dynamic side split layout',
    ats: 3,
    photo: true,
    fontPrimary: 'Oswald',
    fontSecondary: 'Inter',
    accent: '#DC2626',
    layout: 'split'
  },
  academic_scholar: {
    id: 'academic_scholar',
    name: 'Academic Scholar',
    domain: 'Research • Academia',
    description: 'Dense CV-style for research and publications',
    ats: 5,
    photo: false,
    fontPrimary: 'Crimson Text',
    fontSecondary: 'Inter',
    accent: '#1E3A8A',
    layout: 'dense'
  },
  security_force: {
    id: 'security_force',
    name: 'Security Force',
    domain: 'Security • Defense',
    description: 'Disciplined structured blocks for service records',
    ats: 4,
    photo: true,
    fontPrimary: 'Roboto Mono',
    fontSecondary: 'Roboto',
    accent: '#65A30D',
    layout: 'structured'
  },
  healthcare_care: {
    id: 'healthcare_care',
    name: 'Healthcare Care',
    domain: 'Medical • Healthcare',
    description: 'Soft clinical aesthetic with calm layout',
    ats: 5,
    photo: true,
    fontPrimary: 'Nunito',
    fontSecondary: 'Nunito',
    accent: '#0D9488',
    layout: 'clinical'
  },
  educator_plus: {
    id: 'educator_plus',
    name: 'Educator Plus',
    domain: 'Education • Teaching',
    description: 'Teaching focus with curriculum emphasis',
    ats: 5,
    photo: true,
    fontPrimary: 'Lora',
    fontSecondary: 'Inter',
    accent: '#4F46E5',
    layout: 'teaching'
  },
  project_manager: {
    id: 'project_manager',
    name: 'Project Manager',
    domain: 'Management • Tech',
    description: 'PM clarity with metrics emphasis',
    ats: 5,
    photo: true,
    fontPrimary: 'Source Sans Pro',
    fontSecondary: 'Source Sans Pro',
    accent: '#0369A1',
    layout: 'metrics'
  }
};

const TEMPLATE_IDS = Object.keys(TEMPLATE_CONFIGS);

const TEMPLATE_DOMAIN_MAP = {
  modern_pro: 'it',
  executive_elite: 'manager',
  creative_flow: 'design',
  minimal_edge: 'teacher',
  culinary_chef: 'culinary',
  music_artist: 'music',
  sports_athlete: 'sports',
  academic_scholar: 'academic',
  security_force: 'security',
  healthcare_care: 'healthcare',
  educator_plus: 'education',
  project_manager: 'pm'
};

const DOMAIN_PROFILES = {
  it: {
    name: 'Alex Morgan',
    role: 'Frontend Developer',
    email: 'alex@email.com',
    phone: '+1 555 123 456',
    location: 'San Francisco, CA',
    summary: 'Frontend developer with 4+ years building responsive web applications using React and modern frameworks.',
    skills: ['React', 'TypeScript', 'CSS', 'UI Design', 'Tailwind'],
    experience: [
      {
        role: 'Senior Frontend Developer',
        company: 'PixelSoft',
        startDate: '2021',
        endDate: 'Present',
        description: 'Built dashboards for 50k+ users with modern React architecture'
      },
      {
        role: 'Frontend Developer',
        company: 'NovaTech',
        startDate: '2019',
        endDate: '2021',
        description: 'Developed UI component library used across 8 products'
      }
    ],
    education: [{ degree: 'BSc Computer Science', institution: 'UC Berkeley', year: '2019' }],
    projects: [{ title: 'Design System', description: 'Component library', tech: ['React', 'Storybook'] }]
  },
  manager: {
    name: 'Jordan Blake',
    role: 'Operations Manager',
    email: 'jordan@email.com',
    phone: '+1 555 234 567',
    location: 'New York, NY',
    summary: 'Results-driven operations manager optimizing processes and leading cross-functional teams.',
    skills: ['Leadership', 'Process Optimization', 'Strategy', 'Budgeting'],
    experience: [
      {
        role: 'Operations Manager',
        company: 'CoreLogix',
        startDate: '2019',
        endDate: 'Present',
        description: 'Reduced operational costs by 18% while improving team efficiency'
      },
      {
        role: 'Supervisor',
        company: 'TransitCo',
        startDate: '2016',
        endDate: '2019',
        description: 'Managed team of 40 staff members across multiple shifts'
      }
    ],
    education: [{ degree: 'MBA', institution: 'NYU Stern', year: '2016' }],
    projects: [{ title: 'Process Overhaul', description: 'Streamlined operations', tech: ['Lean', 'Six Sigma'] }]
  },
  design: {
    name: 'Olivia Hart',
    role: 'Creative Director',
    email: 'olivia@email.com',
    phone: '+1 555 345 678',
    location: 'Los Angeles, CA',
    summary: 'Award-winning creative director specializing in branding and storytelling.',
    skills: ['Art Direction', 'Brand Strategy', 'Campaigns', 'Storytelling'],
    experience: [
      {
        role: 'Creative Director',
        company: 'MediaCo',
        startDate: '2021',
        endDate: 'Present',
        description: 'Led 15+ campaigns for Fortune 500 brands'
      },
      {
        role: 'Art Director',
        company: 'Digital Studios',
        startDate: '2017',
        endDate: '2021',
        description: 'Creative direction for major advertising campaigns'
      }
    ],
    education: [{ degree: 'BA Design', institution: 'NYU', year: '2017' }],
    projects: [{ title: 'Rebrand Campaign', description: 'Major brand refresh', tech: ['Adobe CC', 'Figma'] }]
  },
  teacher: {
    name: 'Emily Carter',
    role: 'Mathematics Teacher',
    email: 'emily@email.com',
    phone: '+1 555 456 789',
    location: 'Boston, MA',
    summary: 'Dedicated math educator improving student achievement through engaging instruction.',
    skills: ['Curriculum', 'Classroom Management', 'Assessment', 'STEM'],
    experience: [
      {
        role: 'Math Teacher',
        company: 'Lincoln High',
        startDate: '2018',
        endDate: 'Present',
        description: 'Improved student pass rate by 25% through innovative teaching'
      },
      {
        role: 'Tutor',
        company: 'EduCare',
        startDate: '2016',
        endDate: '2018',
        description: 'Mentored 60+ students in mathematics and problem-solving'
      }
    ],
    education: [{ degree: 'BEd Mathematics', institution: 'Boston College', year: '2016' }],
    projects: [{ title: 'STEM Program', description: 'Math enrichment', tech: ['EdTech', 'Khan Academy'] }]
  },
  culinary: {
    name: 'Marco Alvarez',
    role: 'Executive Chef',
    email: 'marco@email.com',
    phone: '+1 555 567 890',
    location: 'Miami, FL',
    summary: 'Innovative chef specializing in Mediterranean cuisine and menu design.',
    skills: ['Menu Design', 'Plating', 'Kitchen Management', 'Food Safety'],
    experience: [
      {
        role: 'Executive Chef',
        company: 'Bella Cucina',
        startDate: '2020',
        endDate: 'Present',
        description: 'Won Miami Culinary Award for innovative Mediterranean dishes'
      },
      {
        role: 'Sous Chef',
        company: 'Grand Hotel',
        startDate: '2017',
        endDate: '2020',
        description: 'Led kitchen team of 12 and developed seasonal menus'
      }
    ],
    education: [{ degree: 'Culinary Arts Diploma', institution: 'Le Cordon Bleu', year: '2017' }],
    projects: [{ title: 'Farm-to-Table Menu', description: 'Seasonal offerings', tech: ['Sustainability'] }]
  },
  music: {
    name: 'Lena Rivers',
    role: 'Singer-Songwriter',
    email: 'lena@email.com',
    phone: '+1 555 678 901',
    location: 'Nashville, TN',
    summary: 'Independent music artist performing live and producing original compositions.',
    skills: ['Vocals', 'Songwriting', 'Stage Performance', 'Guitar'],
    experience: [
      {
        role: 'Performer',
        company: 'Live Tours',
        startDate: '2019',
        endDate: 'Present',
        description: 'Performed 50+ concerts across North America'
      },
      {
        role: 'Studio Artist',
        company: 'Indie Records',
        startDate: '2017',
        endDate: '2019',
        description: 'Produced and released 2 albums with critical acclaim'
      }
    ],
    education: [{ degree: 'Music Production', institution: 'Berklee', year: '2017' }],
    projects: [{ title: 'Debut Album', description: 'Original songs', tech: ['Pro Tools', 'Ableton'] }]
  },
  sports: {
    name: 'David Cole',
    role: 'Professional Athlete',
    email: 'david@email.com',
    phone: '+1 555 789 012',
    location: 'Chicago, IL',
    summary: 'Competitive athlete with national-level achievements and team leadership.',
    skills: ['Speed', 'Endurance', 'Teamwork', 'Strategy'],
    experience: [
      {
        role: 'Team Captain',
        company: 'City FC',
        startDate: '2021',
        endDate: 'Present',
        description: 'Led team to league championship with MVP performance'
      },
      {
        role: 'Player',
        company: 'United FC',
        startDate: '2018',
        endDate: '2021',
        description: 'Top scorer for 2 consecutive seasons'
      }
    ],
    education: [{ degree: 'Sports Science', institution: 'State University', year: '2018' }],
    projects: [{ title: 'Youth Training', description: 'Coaching program', tech: ['Fitness', 'Nutrition'] }]
  },
  academic: {
    name: 'Dr. Sarah Kim',
    role: 'Research Scientist',
    email: 'sarah@email.com',
    phone: '+1 555 890 123',
    location: 'Cambridge, MA',
    summary: 'Researcher focused on machine learning and data analysis.',
    skills: ['Python', 'Research', 'Machine Learning', 'Publications'],
    experience: [
      {
        role: 'Research Fellow',
        company: 'MIT Lab',
        startDate: '2020',
        endDate: 'Present',
        description: 'Published 10 papers on AI and machine learning algorithms'
      },
      {
        role: 'PhD Scholar',
        company: 'Stanford',
        startDate: '2016',
        endDate: '2020',
        description: 'Conducted AI research with focus on neural networks'
      }
    ],
    education: [{ degree: 'PhD Computer Science', institution: 'Stanford', year: '2020' }],
    projects: [{ title: 'ML Framework', description: 'Research tool', tech: ['Python', 'TensorFlow'] }]
  },
  security: {
    name: 'Michael Torres',
    role: 'Security Officer',
    email: 'michael@email.com',
    phone: '+1 555 901 234',
    location: 'Dallas, TX',
    summary: 'Experienced security professional ensuring safety and compliance.',
    skills: ['Surveillance', 'Risk Management', 'Patrol', 'Crisis Response'],
    experience: [
      {
        role: 'Senior Officer',
        company: 'SecureCorp',
        startDate: '2019',
        endDate: 'Present',
        description: 'Managed security operations for high-profile corporate facility'
      },
      {
        role: 'Guard',
        company: 'SafeWatch',
        startDate: '2016',
        endDate: '2019',
        description: 'Facility protection and incident response'
      }
    ],
    education: [{ degree: 'Security Training Certificate', institution: 'Security Academy', year: '2016' }],
    projects: [{ title: 'Security Protocol', description: 'Safety procedures', tech: ['Surveillance Tech'] }]
  },
  healthcare: {
    name: 'Nina Patel',
    role: 'Registered Nurse',
    email: 'nina@email.com',
    phone: '+1 555 012 345',
    location: 'Seattle, WA',
    summary: 'Compassionate nurse providing patient-centered care.',
    skills: ['Patient Care', 'Clinical Skills', 'Medication', 'Monitoring'],
    experience: [
      {
        role: 'Registered Nurse',
        company: 'City Hospital',
        startDate: '2020',
        endDate: 'Present',
        description: 'Providing ICU care for critical patients'
      },
      {
        role: 'Nurse',
        company: 'HealthCare+',
        startDate: '2018',
        endDate: '2020',
        description: 'Ward care and patient monitoring'
      }
    ],
    education: [{ degree: 'BSc Nursing', institution: 'University of Washington', year: '2018' }],
    projects: [{ title: 'Patient Protocol', description: 'Care improvement', tech: ['EMR Systems'] }]
  },
  education: {
    name: 'Daniel Brooks',
    role: 'Science Educator',
    email: 'daniel@email.com',
    phone: '+1 555 123 456',
    location: 'Portland, OR',
    summary: 'STEM educator developing innovative learning programs.',
    skills: ['STEM', 'Teaching', 'Labs', 'Curriculum'],
    experience: [
      {
        role: 'Teacher',
        company: 'STEM Academy',
        startDate: '2019',
        endDate: 'Present',
        description: 'Developed hands-on lab programs for science courses'
      },
      {
        role: 'Instructor',
        company: 'EduLabs',
        startDate: '2017',
        endDate: '2019',
        description: 'Led workshops and science demonstrations'
      }
    ],
    education: [{ degree: 'MEd Science', institution: 'Oregon State', year: '2017' }],
    projects: [{ title: 'STEM Workshop', description: 'Student program', tech: ['Lab Equipment'] }]
  },
  pm: {
    name: 'Sophia Nguyen',
    role: 'Project Manager',
    email: 'sophia@email.com',
    phone: '+1 555 234 567',
    location: 'Austin, TX',
    summary: 'Certified PM delivering complex digital projects.',
    skills: ['Agile', 'Scrum', 'Planning', 'Stakeholders'],
    experience: [
      {
        role: 'Project Manager',
        company: 'TechFlow',
        startDate: '2021',
        endDate: 'Present',
        description: 'Successfully launched 10+ digital products on time and budget'
      },
      {
        role: 'Coordinator',
        company: 'SoftWorks',
        startDate: '2018',
        endDate: '2021',
        description: 'Coordinated team delivery and sprint planning'
      }
    ],
    education: [{ degree: 'MBA PMP', institution: 'UT Austin', year: '2018' }],
    projects: [{ title: 'Product Launch', description: 'Mobile app', tech: ['Jira', 'Confluence'] }]
  }
};

function TemplatePreview({ template, data }) {
  const layoutStyles = {
    left_bar: { borderLeft: `4px solid ${template.accent}` },
    centered: { textAlign: 'center' },
    asymmetric: { display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '20px' },
    minimal: { padding: '40px 60px' },
    header_band: {},
    rhythm: { display: 'flex', flexDirection: 'column', gap: '24px' },
    split: { display: 'grid', gridTemplateColumns: '3fr 2fr' },
    dense: { fontSize: '10px', lineHeight: '1.3' },
    structured: { display: 'flex', flexDirection: 'column', gap: '16px' },
    clinical: { padding: '40px', backgroundColor: '#F9FAFB' },
    teaching: {},
    metrics: {}
  };

  const style = layoutStyles[template.layout] || {};

  return (
    <div className="resume-page bg-white shadow-2xl overflow-hidden" style={{ height: '92vh', aspectRatio: '1 / 1.414', ...style }}>
      {/* Header Band for culinary */}
      {template.layout === 'header-band' && (
        <div className="h-32 flex items-center justify-center" style={{ backgroundColor: template.accent }}>
          <div className="text-center text-white">
            <div style={{ fontFamily: template.fontPrimary, fontSize: '28px', fontWeight: 'bold' }}>
              {data.name}
            </div>
            <div style={{ fontFamily: template.fontSecondary, fontSize: '16px', marginTop: '4px' }}>
              {data.role}
            </div>
          </div>
        </div>
      )}

      <div className="p-8" style={{ fontFamily: template.fontSecondary }}>
        {/* Header - varies by layout */}
        {template.layout !== 'header-band' && (
          <div className={template.layout === 'centered' ? 'text-center mb-6' : 'mb-6'}>
            <div style={{ 
              fontFamily: template.fontPrimary, 
              fontSize: template.layout === 'creative_flow' ? '30px' : template.layout === 'minimal' ? '24px' : '28px',
              fontWeight: 'bold',
              color: template.accent 
            }}>
              {data.name}
            </div>
            <div style={{ fontSize: '14px', marginTop: '4px', color: '#6B7280' }}>
              {data.role}
            </div>
            {template.layout === 'centered' && (
              <div style={{ fontSize: '11px', marginTop: '8px', color: '#9CA3AF' }}>
                {data.email} • {data.phone} • {data.location}
              </div>
            )}
          </div>
        )}

        {/* Template badge */}
        <div style={{ fontSize: '9px', letterSpacing: '1.6px', textTransform: 'uppercase', opacity: 0.5, marginBottom: '16px' }}>
          {template.name} • {template.domain}
        </div>

        {/* Summary */}
        <div className="mb-4">
          <div style={{ 
            fontSize: template.layout === 'dense' ? '11px' : '13px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: template.accent 
          }}>
            SUMMARY
          </div>
          <div style={{ fontSize: template.layout === 'dense' ? '10px' : '12px', lineHeight: '1.6', color: '#374151' }}>
            {data.summary}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div style={{ 
            fontSize: template.layout === 'dense' ? '11px' : '13px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: template.accent 
          }}>
            SKILLS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.skills.map((skill, i) => (
              <span 
                key={i}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  backgroundColor: template.layout === 'creative_flow' ? `${template.accent}20` : '#F3F4F6',
                  borderRadius: template.layout === 'creative_flow' ? '20px' : '4px',
                  color: template.layout === 'creative_flow' ? template.accent : '#4B5563'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <div style={{ 
            fontSize: template.layout === 'dense' ? '11px' : '13px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: template.accent 
          }}>
            EXPERIENCE
          </div>
          {data.experience.slice(0, 2).map((exp, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ 
                fontSize: template.layout === 'dense' ? '11px' : '13px',
                fontWeight: 'bold',
                color: '#1F2937'
              }}>
                {exp.role}
              </div>
              <div style={{ fontSize: '11px', color: template.accent, marginTop: '2px' }}>
                {exp.company} • {exp.startDate} - {exp.endDate}
              </div>
              <div style={{ fontSize: template.layout === 'dense' ? '10px' : '11px', color: '#6B7280', marginTop: '4px', lineHeight: '1.5' }}>
                {exp.description}
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div>
          <div style={{ 
            fontSize: template.layout === 'dense' ? '11px' : '13px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: template.accent 
          }}>
            EDUCATION
          </div>
          {data.education.map((edu, i) => (
            <div key={i} style={{ fontSize: template.layout === 'dense' ? '10px' : '11px', marginBottom: '6px' }}>
              <div style={{ fontWeight: 'bold', color: '#1F2937' }}>{edu.degree}</div>
              <div style={{ color: '#6B7280' }}>{edu.institution} • {edu.year}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateInfoPanel({ template, templateConfig, onUseForA, onUseForB, selectedDomain, setSelectedDomain, atsOnly, setAtsOnly, photoOnly, setPhotoOnly }) {
  const stars = '⭐'.repeat(templateConfig?.ats || 0);
  
  return (
    <div className="template-info" style={{
      width: '320px',
      padding: '24px',
      background: 'linear-gradient(180deg, #0f1b2e, #0b1323)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      height: '100vh',
      overflowY: 'auto'
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '1.6px', textTransform: 'uppercase', opacity: 0.6 }}>
        Template Preview
      </div>
      
      <div style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.2' }}>
        {template.name}
      </div>
      
      {/* Metadata Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {template.atsFriendly && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
            ATS Friendly
          </Badge>
        )}
        {template.photoSupported && (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">
            Photo
          </Badge>
        )}
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
          {template.domain[0]}
        </Badge>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">
          {template.category}
        </Badge>
      </div>
      
      <div style={{ fontSize: '14px', color: '#D1D5DB', lineHeight: '1.6', marginTop: '4px' }}>
        {template.description}
      </div>
      
      {/* Filter Section */}
      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter className="w-3 h-3" />
          FILTERS
        </div>
        
        <div className="space-y-3">
          <div>
            <label style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px', display: 'block' }}>Domain</label>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Domains</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Management">Management</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Culinary">Culinary</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={atsOnly}
              onChange={(e) => setAtsOnly(e.target.checked)}
              style={{ width: '14px', height: '14px' }}
            />
            ATS Friendly Only
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={photoOnly}
              onChange={(e) => setPhotoOnly(e.target.checked)}
              style={{ width: '14px', height: '14px' }}
            />
            Photo Support Only
          </label>
        </div>
      </div>
      
      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px' }}>ATS Score</div>
        <div style={{ fontSize: '18px' }}>{stars}</div>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px' }}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onUseForA}
            style={{
              background: 'linear-gradient(90deg, #2563EB, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              transition: 'box-shadow 0.3s'
            }}
            className="hover:shadow-lg hover:shadow-blue-500/50"
          >
            Use for Resume A
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onUseForB}
            style={{
              background: 'linear-gradient(90deg, #14B8A6, #0d9488)',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              transition: 'box-shadow 0.3s'
            }}
            className="hover:shadow-lg hover:shadow-teal-500/50"
          >
            Use for Resume B
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default function Templates() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [atsOnly, setAtsOnly] = useState(false);
  const [photoOnly, setPhotoOnly] = useState(false);
  const [filteredList, setFilteredList] = useState(templateLibrary);
  
  useEffect(() => {
    const filtered = filterTemplates(selectedDomain, atsOnly, photoOnly);
    setFilteredList(filtered);
    if (filtered.length > 0 && currentIndex >= filtered.length) {
      setCurrentIndex(0);
    }
  }, [selectedDomain, atsOnly, photoOnly]);
  
  const currentTemplate = filteredList[currentIndex] || templateLibrary[0];
  const templateConfig = TEMPLATE_CONFIGS[currentTemplate.id];
  const domain = TEMPLATE_DOMAIN_MAP[currentTemplate.id];
  const resumeData = DOMAIN_PROFILES[domain];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredList.length - 1 ? 0 : prev + 1));
  };

  const handleUseForA = () => {
    const storedA = localStorage.getItem('abyss_resume_A');
    const resume = storedA ? JSON.parse(storedA) : { name: '', role: '', email: '', phone: '', location: '', summary: '', skills: [], experience: [], education: [], projects: [] };
    resume.templateId = currentTemplate.id;
    resume.domain = currentTemplate.domain[0]; // Set primary domain from template
    localStorage.setItem('abyss_resume_A', JSON.stringify(resume));
    navigate(`${createPageUrl('Editor')}?version=A`);
  };

  const handleUseForB = () => {
    const storedB = localStorage.getItem('abyss_resume_B');
    const resume = storedB ? JSON.parse(storedB) : { name: '', role: '', email: '', phone: '', location: '', summary: '', skills: [], experience: [], education: [], projects: [] };
    resume.templateId = currentTemplate.id;
    resume.domain = currentTemplate.domain[0]; // Set primary domain from template
    localStorage.setItem('abyss_resume_B', JSON.stringify(resume));
    navigate(`${createPageUrl('Editor')}?version=B`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#0B1F3B' }}>
      {/* Left: Template Info Panel */}
      <TemplateInfoPanel 
        template={currentTemplate} 
        templateConfig={templateConfig}
        onUseForA={handleUseForA} 
        onUseForB={handleUseForB}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        atsOnly={atsOnly}
        setAtsOnly={setAtsOnly}
        photoOnly={photoOnly}
        setPhotoOnly={setPhotoOnly}
      />

      {/* Center: Resume Preview */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: '#1E293B'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTemplate.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <TemplatePreview template={templateConfig} data={resumeData} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right: Navigation Arrows */}
      <div style={{
        width: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        backgroundColor: '#0f1b2e'
      }}>
        <motion.button
          onClick={handlePrevious}
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center' }}
        >
          {currentIndex + 1} / {filteredList.length}
        </motion.div>

        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </div>
  );
}