import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { getHeadersForDomain } from './domainHeaders';

export default function ResumePreview({ data, template, version = 'A', domain = 'IT' }) {
  const accentColor = template?.color || '#2563EB';
  const isVersionA = version === 'A';
  const headers = getHeadersForDomain(domain);

  // Resume A: Sidebar layout with avatar
  // Resume B: Centered layout without avatar
  
  if (!isVersionA) {
    // Resume B: Centered, no avatar, teal accent
    return (
      <div className="bg-white rounded-lg shadow-lg min-h-[842px] text-[11px] leading-relaxed font-sans w-[595px]">
        {/* Centered Header */}
        <div className="text-center pt-10 pb-6 border-b-2 border-[#14B8A6]/20">
          <h1 className="text-3xl font-bold text-[#0B1F3B] mb-2">
            {data.name || 'Your Name'}
          </h1>
          <p className="text-base font-medium text-[#14B8A6] mb-3">
            {data.role || 'Your Role'}
          </p>
          <div className="w-32 h-px bg-[#CBD5E1] mx-auto mb-3" />
          <div className="flex justify-center gap-4 text-[10px] text-slate-500">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>•</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>•</span>}
            {data.location && <span>{data.location}</span>}
          </div>
        </div>

        {/* Content */}
        <div className="px-12 py-6 max-w-[520px] mx-auto">
          {/* Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#14B8A6] border-b border-slate-200 pb-1">
                {headers.summary}
              </h2>
              <p className="text-slate-600 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Skills */}
          {data.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#14B8A6] border-b border-slate-200 pb-1">
                {headers.skills}
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 text-[10px] border border-[#14B8A6] text-[#14B8A6] rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {data.experience?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#14B8A6] border-b border-slate-200 pb-1">
                {headers.experience}
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-[13px] text-[#0B1F3B]">{exp.role || 'Role'}</h3>
                    <p className="text-slate-500 text-[12px]">{exp.company || 'Company'}</p>
                    <span className="text-[11px] text-slate-400">
                      {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                    </span>
                    {exp.description && (
                      <p className="text-slate-600 text-[11px] mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {headers.showProjects !== false && data.projects?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#14B8A6] border-b border-slate-200 pb-1">
                {headers.projects}
              </h2>
              <div className="space-y-3">
                {data.projects.map((proj, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-[#0B1F3B]">{proj.title || 'Project'}</h3>
                    {proj.description && (
                      <p className="text-slate-600 text-[10px] mt-1">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education?.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#14B8A6] border-b border-slate-200 pb-1">
                {headers.education}
              </h2>
              <div className="space-y-2">
                {data.education.map((edu, i) => (
                  <div key={i} className="text-center">
                    <h3 className="font-semibold text-[#0B1F3B]">{edu.degree || 'Degree'}</h3>
                    <p className="text-slate-500 text-[11px]">{edu.institution || 'Institution'} • {edu.year || 'Year'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Resume A: Sidebar layout with avatar
  return (
    <div className="bg-white rounded-lg shadow-lg min-h-[842px] text-[11px] leading-relaxed font-sans flex w-[595px]">
      {/* Sidebar */}
      <div className="w-[240px] bg-[#0B1F3B] p-6 flex-shrink-0 rounded-l-lg">
        {/* Avatar */}
        {data.profileImage ? (
          <img 
            src={data.profileImage}
            alt={data.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white/10 shadow-lg"
          />
        ) : (
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
            style={{ backgroundColor: accentColor }}
          >
            {(data.name || 'JD').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
        )}
        
        {/* Name */}
        <h1 className="text-xl font-bold text-white text-center mb-2">
          {data.name || 'Your Name'}
        </h1>
        <p className="text-xs text-slate-300 text-center mb-6">
          {data.role || 'Your Role'}
        </p>

        {/* Contact */}
        <div className="space-y-2 mb-8 text-slate-300 text-[11px]">
          {data.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span className="truncate">{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{data.location}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {data.skills?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-blue-300">
              {headers.skills}
            </h2>
            <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              {data.skills.map((skill, i) => (
                <div key={i}>• {skill}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Name Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-1">
            {data.name || 'Your Name'}
          </h1>
          <p className="text-base font-medium mb-2" style={{ color: accentColor }}>
            {data.role || 'Your Role'}
          </p>
          <div className="w-20 h-0.5 mb-2" style={{ backgroundColor: accentColor }} />
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wide mb-2 text-[#0B1F3B]">
              {headers.summary}
            </h2>
            <p className="text-slate-600 text-[11.5px] leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wide mb-3 text-[#0B1F3B]">
              {headers.experience}
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-[12.5px] text-[#0F172A]">{exp.role || 'Role'}</h3>
                      <p className="text-slate-500 text-[11px]">{exp.company || 'Company'}</p>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 text-[11px] mt-1.5 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {headers.showProjects !== false && data.projects?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wide mb-3 text-[#0B1F3B]">
              {headers.projects}
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-[#0F172A]">{proj.title || 'Project'}</h3>
                  {proj.description && (
                    <p className="text-slate-600 text-[11px] mt-1">{proj.description}</p>
                  )}
                  {proj.tech?.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {proj.tech.map((t, j) => (
                        <span 
                          key={j} 
                          className="text-[9px] px-2 py-0.5 rounded"
                          style={{ backgroundColor: accentColor + '15', color: accentColor }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-wide mb-3 text-[#0B1F3B]">
              {headers.education}
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-[12px] text-[#0F172A]">{edu.degree || 'Degree'}</h3>
                  <p className="text-slate-500 text-[11px]">{edu.institution || 'Institution'} • {edu.year || 'Year'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}