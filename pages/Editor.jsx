import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Save, Eye, Upload, FileText,
  Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ResumeForm from '@/components/editor/ResumeForm';
import ResumePreview from '@/components/editor/ResumePreview';
import AIAssistant from '@/components/editor/AIAssistant';

const DOMAINS = [
  'IT',
  'Management',
  'Arts',
  'Education',
  'Culinary',
  'Music',
  'Sports',
  'Academic',
  'Security',
  'Healthcare',
  'Teaching',
  'Project Management'
];

const TEMPLATES = {
  'modern_pro': { name: 'Modern Pro', color: '#2563EB', domain: 'IT' },
  'executive_elite': { name: 'Executive Elite', color: '#1F2937', domain: 'Management' },
  'creative_flow': { name: 'Creative Flow', color: '#E84A8A', domain: 'Arts' },
  'minimal_edge': { name: 'Minimal Edge', color: '#6B7280', domain: 'Education' },
  'culinary_chef': { name: 'Culinary Chef', color: '#92400E', domain: 'Culinary' },
  'music_artist': { name: 'Music Artist', color: '#7C3AED', domain: 'Music' },
  'sports_athlete': { name: 'Sports Athlete', color: '#DC2626', domain: 'Sports' },
  'academic_scholar': { name: 'Academic Scholar', color: '#1E3A8A', domain: 'Academic' },
  'security_force': { name: 'Security Force', color: '#65A30D', domain: 'Security' },
  'healthcare_care': { name: 'Healthcare Care', color: '#0D9488', domain: 'Healthcare' },
  'educator_plus': { name: 'Educator Plus', color: '#4F46E5', domain: 'Teaching' },
  'project_manager': { name: 'Project Manager', color: '#0369A1', domain: 'Project Management' }
};

const DOMAIN_TO_TEMPLATE = {
  'IT': 'modern_pro',
  'Management': 'executive_elite',
  'Arts': 'creative_flow',
  'Education': 'minimal_edge',
  'Culinary': 'culinary_chef',
  'Music': 'music_artist',
  'Sports': 'sports_athlete',
  'Academic': 'academic_scholar',
  'Security': 'security_force',
  'Healthcare': 'healthcare_care',
  'Teaching': 'educator_plus',
  'Project Management': 'project_manager'
};

export default function Editor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const templateId = params.get('template') || 't1';
  const resumeId = params.get('resume');
  const [selectedVersion, setSelectedVersion] = useState('A');
  
  const emptyResume = {
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certificates: [],
    linkedin: '',
    github: '',
    portfolio_url: '',
    domainFields: {}
  };
  
  // Independent resume states
  const [resumeAState, setResumeAState] = useState({
    data: JSON.parse(JSON.stringify(emptyResume)),
    domain: 'IT',
    templateId: templateId
  });
  
  const [resumeBState, setResumeBState] = useState({
    data: JSON.parse(JSON.stringify(emptyResume)),
    domain: 'IT',
    templateId: templateId
  });
  
  const [focusedField, setFocusedField] = useState('summary');
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [localSaveStatus, setLocalSaveStatus] = useState(null);

  // Active resume accessors - always return current version's state
  const activeState = selectedVersion === 'A' ? resumeAState : resumeBState;
  const setActiveState = selectedVersion === 'A' ? setResumeAState : setResumeBState;
  
  const resumeData = activeState.data;
  const domain = activeState.domain;
  
  const setResumeData = (data) => {
    const newData = typeof data === 'function' ? data(activeState.data) : data;
    setActiveState({ ...activeState, data: JSON.parse(JSON.stringify(newData)) });
  };
  
  const setDomain = (newDomain) => {
    const newTemplateId = DOMAIN_TO_TEMPLATE[newDomain];
    setActiveState({ 
      ...activeState, 
      domain: newDomain,
      templateId: newTemplateId 
    });
  };

  const { data: existingResumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list()
  });

  // Load existing resume if resumeId provided
  useEffect(() => {
    if (resumeId) {
      const resume = existingResumes.find(r => r.id === resumeId);
      if (resume) {
        const version = resume.version || 'A';
        const clonedData = JSON.parse(JSON.stringify(resume));
        if (version === 'A') {
          setResumeAState({
            data: clonedData,
            domain: resume.domain || 'IT',
            templateId: resume.templateId || templateId
          });
        } else {
          setResumeBState({
            data: clonedData,
            domain: resume.domain || 'IT',
            templateId: resume.templateId || templateId
          });
        }
        setSelectedVersion(version);
      }
    }
  }, [resumeId, existingResumes]);

  // Find existing resume A and B
  const resumeA = existingResumes.find(r => r.version === 'A');
  const resumeB = existingResumes.find(r => r.version === 'B');

  // Load Resume A from local storage or backend on mount
  useEffect(() => {
    const stored = localStorage.getItem('abyss_resume_A');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResumeAState({
          data: JSON.parse(JSON.stringify(parsed)),
          domain: parsed.domain || 'IT',
          templateId: parsed.templateId || templateId
        });
      } catch (e) {
        console.error('Failed to parse stored resume A', e);
      }
    } else if (resumeA) {
      setResumeAState({
        data: JSON.parse(JSON.stringify(resumeA)),
        domain: resumeA.domain || 'IT',
        templateId: resumeA.templateId || templateId
      });
    }
  }, [resumeA?.id, templateId]);

  // Load Resume B from local storage or backend on mount
  useEffect(() => {
    const stored = localStorage.getItem('abyss_resume_B');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResumeBState({
          data: JSON.parse(JSON.stringify(parsed)),
          domain: parsed.domain || 'IT',
          templateId: parsed.templateId || templateId
        });
      } catch (e) {
        console.error('Failed to parse stored resume B', e);
      }
    } else if (resumeB) {
      setResumeBState({
        data: JSON.parse(JSON.stringify(resumeB)),
        domain: resumeB.domain || 'IT',
        templateId: resumeB.templateId || templateId
      });
    }
  }, [resumeB?.id, templateId]);

  // Show restored message on version switch
  useEffect(() => {
    setLocalSaveStatus('restored');
    setTimeout(() => setLocalSaveStatus(null), 1500);
  }, [selectedVersion]);

  // Auto-save Resume A to local storage
  useEffect(() => {
    if (resumeAState.data.name || resumeAState.data.role || resumeAState.data.summary) {
      localStorage.setItem('abyss_resume_A', JSON.stringify({ 
        ...resumeAState.data, 
        version: 'A', 
        domain: resumeAState.domain,
        templateId: resumeAState.templateId 
      }));
      if (selectedVersion === 'A') {
        setLocalSaveStatus('saved');
        setTimeout(() => setLocalSaveStatus(null), 1500);
      }
    }
  }, [resumeAState, selectedVersion]);

  // Auto-save Resume B to local storage
  useEffect(() => {
    if (resumeBState.data.name || resumeBState.data.role || resumeBState.data.summary) {
      localStorage.setItem('abyss_resume_B', JSON.stringify({ 
        ...resumeBState.data, 
        version: 'B', 
        domain: resumeBState.domain,
        templateId: resumeBState.templateId 
      }));
      if (selectedVersion === 'B') {
        setLocalSaveStatus('saved');
        setTimeout(() => setLocalSaveStatus(null), 1500);
      }
    }
  }, [resumeBState, selectedVersion]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const targetResume = selectedVersion === 'A' ? resumeA : resumeB;
      const payload = { 
        ...data, 
        version: selectedVersion, 
        domain: activeState.domain, 
        templateId: activeState.templateId 
      };
      
      if (targetResume) {
        return base44.entities.Resume.update(targetResume.id, payload);
      } else {
        return base44.entities.Resume.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    },
    onError: () => {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    }
  });

  const validateResume = () => {
    const newErrors = {};
    
    if (!resumeData.name || resumeData.name.length < 2) {
      newErrors.name = 'Enter a valid full name';
    }
    if (!resumeData.role || resumeData.role.length < 2) {
      newErrors.role = 'Enter your role or target title';
    }
    if (!resumeData.summary || resumeData.summary.length < 30) {
      newErrors.summary = 'Summary should be 30-300 characters';
    }
    if (!resumeData.skills || resumeData.skills.length < 3) {
      newErrors.skills = 'Add at least 3 skills';
    }
    if (resumeData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (resumeData.linkedin && !resumeData.linkedin.startsWith('http')) {
      newErrors.linkedin = 'Enter valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateResume()) {
      saveMutation.mutate(resumeData);
    }
  };

  const buildPortfolioData = (resume) => {
    return {
      id: resume?.id ?? "demo",
      version: selectedVersion,
      name: resume?.name ?? "John Doe",
      role: resume?.role ?? "Professional",
      email: resume?.email ?? "",
      phone: resume?.phone ?? "",
      location: resume?.location ?? "",
      summary: resume?.summary ?? "",
      profileImage: resume?.profileImage ?? "",
      skills: resume?.skills ?? [],
      experience: resume?.experience ?? [],
      projects: resume?.projects ?? [],
      education: resume?.education ?? [],
      linkedin: resume?.linkedin ?? "",
      github: resume?.github ?? "",
    };
  };

  const handleGeneratePortfolio = () => {
    const targetResume = selectedVersion === 'A' ? resumeA : resumeB;
    if (targetResume?.id) {
      navigate(`${createPageUrl('Portfolio')}?id=${targetResume.id}`);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            role: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            summary: { type: 'string' },
            skills: { type: 'array', items: { type: 'string' } },
            experience: { type: 'array', items: { type: 'object' } },
            education: { type: 'array', items: { type: 'object' } }
          }
        }
      });
      
      if (extracted.status === 'success' && extracted.output) {
        const clonedOutput = JSON.parse(JSON.stringify(extracted.output));
        setResumeData(prev => ({ ...prev, ...clonedOutput }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const template = TEMPLATES[activeState.templateId] || TEMPLATES['modern_pro'];

  return (
    <div className="h-screen bg-[#0B1F3B] flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-[#0B1F3B] border-b border-white/5 flex items-center px-6 gap-6 flex-shrink-0">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        {/* Resume A/B Toggle */}
        <Tabs value={selectedVersion} onValueChange={setSelectedVersion}>
          <TabsList className="h-9 bg-white/5 border border-white/10 rounded-none">
            <TabsTrigger value="A" className="text-xs px-6 rounded-none data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:border-0 text-white/60">
              Resume A
            </TabsTrigger>
            <TabsTrigger value="B" className="text-xs px-6 rounded-none data-[state=active]:bg-[#14B8A6] data-[state=active]:text-white data-[state=active]:border-0 text-white/60">
              Resume B
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Upload */}
        <label className="cursor-pointer">
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleUpload} />
          <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
            <span><Upload className="h-3 w-3 mr-1" /> Upload</span>
          </Button>
        </label>

        {/* Domain Selector */}
        <Select value={domain} onValueChange={setDomain}>
          <SelectTrigger className="w-40 h-8 text-xs bg-white dark:bg-white/5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOMAINS.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Template Name */}
        <Badge variant="outline" className="text-xs" style={{ borderColor: template.color, color: template.color }}>
          {template.name}
        </Badge>

        <div className="flex-1" />

        <ThemeToggle />

        {/* Local Save Status */}
        {localSaveStatus && (
          <span className="text-xs text-slate-500 dark:text-white/50">
            {localSaveStatus === 'restored' ? '📂 Restored' : '💾 Saved locally'}
          </span>
        )}

        {/* Save */}
         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
           <Button 
             size="sm" 
             onClick={handleSave}
             disabled={saveMutation.isPending}
             className={`h-8 text-xs transition-all duration-300 ${
               saveStatus === 'success' ? 'bg-green-600 hover:bg-green-600' :
               saveStatus === 'error' ? 'bg-red-600 hover:bg-red-600' :
               'bg-[#2563EB] hover:bg-[#1d4ed8]'
             }`}
           >
          {saveMutation.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : saveStatus === 'success' ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : saveStatus === 'error' ? (
            <AlertCircle className="h-3 w-3 mr-1" />
          ) : (
            <Save className="h-3 w-3 mr-1" />
          )}
          {saveStatus === 'success' ? 'Saved to cloud ☁️' : saveStatus === 'error' ? 'Error' : 'Save to cloud'}
          </Button>
          </motion.div>

        {/* Preview & Export */}
        <Link to={createPageUrl('Preview') + `?version=${selectedVersion}`}>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Eye className="h-3 w-3 mr-1" /> Preview & Export
          </Button>
        </Link>

        {/* Portfolio */}
        <Button size="sm" onClick={handleGeneratePortfolio} className="h-8 text-xs bg-[#14B8A6] hover:bg-[#0d9488]">
          <FileText className="h-3 w-3 mr-1" /> Portfolio
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden gap-8 p-8">
        {/* Left: Form */}
        <div className="w-[380px] flex-shrink-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <ResumeForm 
                data={resumeData}
                onChange={setResumeData}
                onFocus={setFocusedField}
                domain={domain}
                errors={errors}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Center: Preview */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[595px] mx-auto">
            <motion.div
              key={`preview-${selectedVersion}-${activeState.templateId}-${domain}`}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
              <ResumePreview 
                key={`${selectedVersion}-${domain}`}
                data={resumeData} 
                template={template} 
                version={selectedVersion}
                domain={domain}
              />
            </motion.div>
          </div>
        </div>

        {/* Right: AI Assistant */}
        <div className="w-[360px] flex-shrink-0">
          <AIAssistant 
            focusedField={focusedField}
            domain={domain}
            resumeData={resumeData}
            onResumeUpdate={setResumeData}
          />
        </div>
      </div>
    </div>
  );
}