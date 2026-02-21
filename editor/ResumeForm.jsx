import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, X, User, Briefcase, GraduationCap, 
  FolderKanban, Award, Link as LinkIcon, Trash2
} from 'lucide-react';
import AvatarUpload from './AvatarUpload';
import SectionManager from './SectionManager';
import CustomSection from './CustomSection';
import { domainHeaders } from './domainHeaders';

const FormSection = ({ title, icon: Icon, children, onDelete, canDelete = true }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-white/10">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#2563EB]" />
        <h3 className="font-medium text-sm text-[#0B1F3B] dark:text-white">{title}</h3>
      </div>
      {canDelete && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
    {children}
  </div>
);

const FieldError = ({ error }) => error ? (
  <p className="text-red-500 text-xs mt-1">{error}</p>
) : null;

const CORE_SECTIONS = ['summary', 'experience'];

export default function ResumeForm({ 
  data, 
  onChange, 
  onFocus, 
  domain,
  errors = {} 
}) {
  const [customSections, setCustomSections] = useState(data.customSections || []);

  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const addCustomSection = (section) => {
    const updated = [...customSections, section];
    setCustomSections(updated);
    onChange({ ...data, customSections: updated, [section.id]: [] });
  };

  const removeCustomSection = (sectionId) => {
    const updated = customSections.filter(s => s.id !== sectionId);
    setCustomSections(updated);
    const newData = { ...data, customSections: updated };
    delete newData[sectionId];
    onChange(newData);
  };

  const updateCustomSectionData = (sectionId, items) => {
    onChange({ ...data, [sectionId]: items });
  };

  // Get domain-aware section titles
  const getSectionTitle = (baseTitle, sectionKey) => {
    const headers = domainHeaders[domain];
    return headers?.[sectionKey] || baseTitle;
  };

  const updateArrayField = (field, index, key, value) => {
    const arr = [...(data[field] || [])];
    arr[index] = { ...arr[index], [key]: value };
    onChange({ ...data, [field]: arr });
  };

  const addArrayItem = (field, template) => {
    const arr = [...(data[field] || []), template];
    onChange({ ...data, [field]: arr });
  };

  const removeArrayItem = (field, index) => {
    const arr = (data[field] || []).filter((_, i) => i !== index);
    onChange({ ...data, [field]: arr });
  };

  const updateSkills = (value) => {
    const skills = value.split(',').map(s => s.trim()).filter(Boolean);
    onChange({ ...data, skills });
  };

  const domainFields = {
    IT: [
      { key: 'programmingLanguages', label: 'Programming Languages', placeholder: 'JavaScript, Python, Java' },
      { key: 'frameworks', label: 'Frameworks', placeholder: 'React, Node.js, Django' },
      { key: 'tools', label: 'Tools', placeholder: 'Git, Docker, AWS' },
      { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/username' },
    ],
    Culinary: [
      { key: 'cuisines', label: 'Cuisines', placeholder: 'Italian, French, Asian Fusion' },
      { key: 'kitchenSkills', label: 'Kitchen Skills', placeholder: 'Pastry, Grill, Sous Vide' },
      { key: 'menuSpecialization', label: 'Menu Specialization', placeholder: 'Fine Dining, Catering' },
      { key: 'awards', label: 'Culinary Awards', placeholder: 'Michelin Star, James Beard' },
    ],
    Arts: [
      { key: 'mediums', label: 'Mediums', placeholder: 'Oil, Acrylic, Digital' },
      { key: 'exhibitions', label: 'Exhibitions', placeholder: 'Gallery names, years' },
      { key: 'performances', label: 'Performances', placeholder: 'Shows, installations' },
      { key: 'styles', label: 'Art Styles', placeholder: 'Contemporary, Abstract' },
    ],
    Teacher: [
      { key: 'subjects', label: 'Subjects', placeholder: 'Mathematics, Science' },
      { key: 'gradesTaught', label: 'Grades Taught', placeholder: 'K-12, College' },
      { key: 'certifications', label: 'Teaching Certifications', placeholder: 'State License, TESOL' },
      { key: 'research', label: 'Research', placeholder: 'Publications, papers' },
    ],
    Dance: [
      { key: 'danceStyles', label: 'Dance Styles', placeholder: 'Ballet, Contemporary, Hip-Hop' },
      { key: 'performances', label: 'Performances', placeholder: 'Productions, tours' },
      { key: 'choreography', label: 'Choreography', placeholder: 'Original works' },
      { key: 'competitions', label: 'Competitions', placeholder: 'Awards, placements' },
    ],
  };

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex justify-center pb-2">
        <AvatarUpload 
          name={data.name}
          imageUrl={data.profileImage}
          onImageChange={(url) => updateField('profileImage', url)}
        />
      </div>

      {/* Basic Info */}
      <FormSection title="Basic Information" icon={User} canDelete={false}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-slate-500 dark:text-white/60">Full Name *</Label>
            <Input
              value={data.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              onFocus={() => onFocus?.('name')}
              placeholder="John Doe"
              className={`mt-1 bg-white dark:bg-white/5 ${errors.name ? 'border-red-500' : ''}`}
            />
            <FieldError error={errors.name} />
          </div>
          <div>
            <Label className="text-xs text-slate-500 dark:text-white/60">Role/Title *</Label>
            <Input
              value={data.role || ''}
              onChange={(e) => updateField('role', e.target.value)}
              onFocus={() => onFocus?.('role')}
              placeholder="Software Engineer"
              className={`mt-1 bg-white dark:bg-white/5 ${errors.role ? 'border-red-500' : ''}`}
            />
            <FieldError error={errors.role} />
          </div>
          <div>
            <Label className="text-xs text-slate-500 dark:text-white/60">Email</Label>
            <Input
              type="email"
              value={data.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="john@example.com"
              className={`mt-1 bg-white dark:bg-white/5 ${errors.email ? 'border-red-500' : ''}`}
            />
            <FieldError error={errors.email} />
          </div>
          <div>
            <Label className="text-xs text-slate-500 dark:text-white/60">Phone</Label>
            <Input
              value={data.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+1 234 567 8900"
              className="mt-1 bg-white dark:bg-white/5"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs text-slate-500 dark:text-white/60">Location</Label>
            <Input
              value={data.location || ''}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="San Francisco, CA"
              className="mt-1 bg-white dark:bg-white/5"
            />
          </div>
        </div>
      </FormSection>

      {/* Summary */}
      <div className="group">
        <FormSection 
          title={getSectionTitle('Professional Summary', 'summary')} 
          icon={User}
          canDelete={false}
        >
        <div>
          <Label className="text-xs text-slate-500 dark:text-white/60">Summary * (30-300 chars)</Label>
          <Textarea
            value={data.summary || ''}
            onChange={(e) => updateField('summary', e.target.value)}
            onFocus={() => onFocus?.('summary')}
            placeholder="Experienced professional with expertise in..."
            className={`mt-1 h-24 bg-white dark:bg-white/5 ${errors.summary ? 'border-red-500' : ''}`}
          />
          <div className="flex justify-between mt-1">
            <FieldError error={errors.summary} />
            <span className="text-xs text-slate-400">{(data.summary || '').length}/300</span>
          </div>
        </div>
        </FormSection>
      </div>

      {/* Skills */}
      <div className="group">
        <FormSection 
          title={getSectionTitle('Skills', 'skills')} 
          icon={Award}
          onDelete={() => removeCustomSection('skills')}
        >
        <div>
          <Label className="text-xs text-slate-500 dark:text-white/60">Skills * (comma separated, min 3)</Label>
          <Input
            value={(data.skills || []).join(', ')}
            onChange={(e) => updateSkills(e.target.value)}
            onFocus={() => onFocus?.('skills')}
            placeholder="React, Node.js, Team Leadership"
            className={`mt-1 bg-white dark:bg-white/5 ${errors.skills ? 'border-red-500' : ''}`}
          />
          <FieldError error={errors.skills} />
          {data.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-[#2563EB]/10 text-[#2563EB]">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
        </FormSection>
      </div>

      {/* Experience */}
      <div className="group">
        <FormSection 
          title={getSectionTitle('Experience', 'experience')} 
          icon={Briefcase}
          canDelete={false}
        >
        {(data.experience || []).map((exp, i) => (
          <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg mb-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removeArrayItem('experience', i)}
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input
                placeholder="Company"
                value={exp.company || ''}
                onChange={(e) => updateArrayField('experience', i, 'company', e.target.value)}
                className="bg-white dark:bg-white/5 text-sm"
              />
              <Input
                placeholder="Role"
                value={exp.role || ''}
                onChange={(e) => updateArrayField('experience', i, 'role', e.target.value)}
                className="bg-white dark:bg-white/5 text-sm"
              />
              <Input
                placeholder="Start Date"
                value={exp.startDate || ''}
                onChange={(e) => updateArrayField('experience', i, 'startDate', e.target.value)}
                className="bg-white dark:bg-white/5 text-sm"
              />
              <Input
                placeholder="End Date"
                value={exp.endDate || ''}
                onChange={(e) => updateArrayField('experience', i, 'endDate', e.target.value)}
                className="bg-white dark:bg-white/5 text-sm"
              />
            </div>
            <Textarea
              placeholder="Description with metrics..."
              value={exp.description || ''}
              onChange={(e) => updateArrayField('experience', i, 'description', e.target.value)}
              onFocus={() => onFocus?.('experience')}
              className="bg-white dark:bg-white/5 text-sm h-20"
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Experience
        </Button>
        </FormSection>
      </div>

      {/* Education */}
      <div className="group">
        <FormSection 
          title={getSectionTitle('Education', 'education')} 
          icon={GraduationCap}
          onDelete={() => removeCustomSection('education')}
        >
        {(data.education || []).map((edu, i) => (
          <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg mb-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removeArrayItem('education', i)}
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Degree"
                value={edu.degree || ''}
                onChange={(e) => updateArrayField('education', i, 'degree', e.target.value)}
                className="bg-white dark:bg-white/5 text-sm"
              />
              <Input
                placeholder="Institution"
                value={edu.institution || ''}
                onChange={(e) => updateArrayField('education', i, 'institution', e.target.value)}
                className="bg-white dark:bg-white/5 text-sm"
              />
              <Input
                placeholder="Year"
                value={edu.year || ''}
                onChange={(e) => updateArrayField('education', i, 'year', e.target.value)}
                className="bg-white dark:bg-white/5 text-sm"
              />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Education
        </Button>
        </FormSection>
      </div>

      {/* Projects */}
      <div className="group">
        <FormSection 
          title={getSectionTitle('Projects', 'projects')} 
          icon={FolderKanban}
          onDelete={() => removeCustomSection('projects')}
        >
        {(data.projects || []).map((proj, i) => (
          <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg mb-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removeArrayItem('projects', i)}
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="space-y-2">
              <Input
                placeholder="Project Title"
                value={proj.title || ''}
                onChange={(e) => updateArrayField('projects', i, 'title', e.target.value)}
                className="bg-white dark:bg-white/5 text-sm"
              />
              <Textarea
                placeholder="Project description..."
                value={proj.description || ''}
                onChange={(e) => updateArrayField('projects', i, 'description', e.target.value)}
                onFocus={() => onFocus?.('projects')}
                className="bg-white dark:bg-white/5 text-sm h-16"
              />
              <Input
                placeholder="Tech: React, Node.js"
                value={(proj.tech || []).join(', ')}
                onChange={(e) => updateArrayField('projects', i, 'tech', e.target.value.split(',').map(s => s.trim()))}
                className="bg-white dark:bg-white/5 text-sm"
              />
              <Input
                placeholder="Link (optional)"
                value={proj.link || ''}
                onChange={(e) => updateArrayField('projects', i, 'link', e.target.value)}
                className="bg-white dark:bg-white/5 text-sm"
              />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('projects', { title: '', description: '', tech: [], link: '' })}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Project
        </Button>
        </FormSection>
      </div>

      {/* Custom Sections */}
      {customSections.map((section) => (
        <div key={section.id} className="group">
          <FormSection 
            title={section.title} 
            icon={Award}
            onDelete={() => removeCustomSection(section.id)}
          >
            <CustomSection
              section={section}
              data={data[section.id]}
              onUpdate={(items) => updateCustomSectionData(section.id, items)}
              onFocus={onFocus}
            />
          </FormSection>
        </div>
      ))}

      {/* Domain-specific fields */}
      {domain && domainFields[domain] && (
        <FormSection title={`${domain} Details`} icon={Award}>
          <div className="space-y-3">
            {domainFields[domain].map(field => (
              <div key={field.key}>
                <Label className="text-xs text-slate-500 dark:text-white/60">{field.label}</Label>
                <Input
                  value={data.domainFields?.[field.key] || ''}
                  onChange={(e) => updateField('domainFields', { ...data.domainFields, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="mt-1 bg-white dark:bg-white/5"
                />
              </div>
            ))}
          </div>
        </FormSection>
      )}

      {/* Add Section */}
      <SectionManager 
        onAddSection={addCustomSection}
        existingSections={customSections.map(s => s.id)}
      />

      {/* Links */}
      <div className="group">
        <FormSection title="Links" icon={LinkIcon} canDelete={false}>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-500 dark:text-white/60">LinkedIn</Label>
              <Input
                value={data.linkedin || ''}
                onChange={(e) => updateField('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className={`mt-1 bg-white dark:bg-white/5 ${errors.linkedin ? 'border-red-500' : ''}`}
              />
              <FieldError error={errors.linkedin} />
            </div>
            <div>
              <Label className="text-xs text-slate-500 dark:text-white/60">Portfolio</Label>
              <Input
                value={data.portfolio_url || ''}
                onChange={(e) => updateField('portfolio_url', e.target.value)}
                placeholder="https://yourportfolio.com"
                className="mt-1 bg-white dark:bg-white/5"
              />
            </div>
          </div>
        </FormSection>
      </div>
    </div>
  );
}