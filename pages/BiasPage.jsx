import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, AlertCircle, Save, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { analyzeBias, replaceBiasWords, getBiasColor, getBiasStatus } from '@/components/preview/biasAnalyzer';

const BIAS_PATTERNS = {
  gender: [
    { word: 'aggressive', replacement: 'assertive', severity: 'high' },
    { word: 'chairman', replacement: 'chairperson', severity: 'high' },
    { word: 'manpower', replacement: 'workforce', severity: 'high' },
    { word: 'mankind', replacement: 'humanity', severity: 'high' },
    { word: 'salesman', replacement: 'salesperson', severity: 'high' },
    { word: 'fireman', replacement: 'firefighter', severity: 'high' },
    { word: 'female', replacement: 'professional', severity: 'high' },
    { word: 'male', replacement: 'professional', severity: 'high' },
    { word: 'woman', replacement: 'professional', severity: 'high' },
    { word: 'man', replacement: 'professional', severity: 'high' },
    { word: 'girl', replacement: 'team member', severity: 'high' },
    { word: 'boy', replacement: 'team member', severity: 'high' },
  ],
  age: [
    { word: 'young', replacement: '', severity: 'moderate' },
    { word: 'senior', replacement: 'experienced', severity: 'moderate' },
    { word: 'aged', replacement: '', severity: 'high' },
    { word: 'elderly', replacement: '', severity: 'high' },
    { word: 'junior', replacement: 'associate', severity: 'moderate' },
    { word: 'youthful', replacement: '', severity: 'moderate' },
    { word: 'mature', replacement: 'experienced', severity: 'mild' },
  ],
  nationality: [
    { word: 'indian', replacement: '', severity: 'high' },
    { word: 'american', replacement: '', severity: 'high' },
    { word: 'asian', replacement: '', severity: 'high' },
    { word: 'european', replacement: '', severity: 'high' },
    { word: 'african', replacement: '', severity: 'high' },
    { word: 'chinese', replacement: '', severity: 'high' },
  ],
  marital: [
    { word: 'married', replacement: '', severity: 'high' },
    { word: 'single', replacement: '', severity: 'high' },
    { word: 'divorced', replacement: '', severity: 'high' },
    { word: 'widow', replacement: '', severity: 'high' },
  ],
  subjective: [
    { word: 'dynamic', replacement: 'results-driven', severity: 'mild' },
    { word: 'energetic', replacement: 'proactive', severity: 'mild' },
    { word: 'hardworking', replacement: 'dedicated', severity: 'mild' },
    { word: 'passionate', replacement: 'committed', severity: 'mild' },
    { word: 'enthusiastic', replacement: 'motivated', severity: 'mild' },
  ],
  weak: [
    { word: 'helped', replacement: 'facilitated', severity: 'mild' },
    { word: 'worked on', replacement: 'developed', severity: 'mild' },
    { word: 'responsible for', replacement: 'led', severity: 'mild' },
    { word: 'assisted', replacement: 'collaborated', severity: 'mild' },
    { word: 'participated', replacement: 'contributed', severity: 'mild' },
  ],
};

export default function BiasPage() {
  const params = new URLSearchParams(window.location.search);
  const initialVersion = params.get('version') || 'A';
  
  const [selectedVersion, setSelectedVersion] = useState(initialVersion);
  const [editedResume, setEditedResume] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const queryClient = useQueryClient();

  const { data: resumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list()
  });

  const resume = resumes.find(r => r.version === selectedVersion) || {};

  useEffect(() => {
    setEditedResume(resume);
    if (resume.name) {
      analyzeForBias();
    }
  }, [resume]);

  // Auto-update on edits
  useEffect(() => {
    if (editedResume?.name) {
      analyzeForBias();
    }
  }, [editedResume?.summary, editedResume?.experience, editedResume?.profileImage]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (resume.id) {
        return base44.entities.Resume.update(resume.id, data);
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    }
  });

  const analyzeForBias = async () => {
    if (!editedResume) return;
    
    const result = analyzeBias(editedResume);
    setHighlights(result.issuesList || []);

    // Save bias score to resume
    if (editedResume.id) {
      await base44.entities.Resume.update(editedResume.id, {
        biasScore: result.score,
        biasIssues: result.issues
      });
      
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    }
  };

  const handleReplace = (field, oldWord, newWord) => {
    if (field === 'summary') {
      const newText = editedResume.summary.replace(new RegExp(oldWord, 'gi'), newWord);
      setEditedResume(prev => ({ ...prev, summary: newText }));
    } else if (field.startsWith('experience_')) {
      const index = parseInt(field.split('_')[1]);
      const newExp = [...editedResume.experience];
      newExp[index].description = newExp[index].description.replace(new RegExp(oldWord, 'gi'), newWord);
      setEditedResume(prev => ({ ...prev, experience: newExp }));
    }
    analyzeForBias();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-[#ff4d4f33] text-[#ff4d4f] border border-[#ff4d4f66]';
      case 'moderate': return 'bg-[#faad1433] text-[#faad14] border border-[#faad1466]';
      case 'mild': return 'bg-[#52c41a33] text-[#52c41a] border border-[#52c41a66]';
      default: return 'bg-[#722ed133] text-[#722ed1] border border-[#722ed166]';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'gender': return 'text-red-600 border-red-300';
      case 'age': return 'text-orange-600 border-orange-300';
      case 'nationality': return 'text-red-600 border-red-300';
      case 'marital': return 'text-red-600 border-red-300';
      case 'subjective': return 'text-blue-600 border-blue-300';
      case 'weak': return 'text-amber-600 border-amber-300';
      case 'photo': return 'text-purple-600 border-purple-300';
      default: return 'text-slate-600 border-slate-300';
    }
  };

  const highlightText = (text, field) => {
    if (!text) return '';
    let highlighted = text;
    
    highlights.filter(h => h.type !== 'photo').forEach((pattern) => {
      const regex = new RegExp(`\\b${pattern.word}\\b`, 'gi');
      highlighted = highlighted.replace(regex, (match) => 
        `<mark class="${getSeverityColor(pattern.severity)} px-2 py-0.5 rounded-md cursor-pointer hover:shadow-lg transition-all font-medium" title="${pattern.type} bias - ${pattern.severity} severity">${match}</mark>`
      );
    });
    
    return highlighted;
  };

  const calculateBiasScore = () => {
    if (highlights.length === 0) return 95; // Never perfect 100
    
    let penalty = 0;
    highlights.forEach(h => {
      if (h.severity === 'high') penalty += 15;
      else if (h.severity === 'moderate') penalty += 8;
      else if (h.severity === 'mild') penalty += 3;
    });
    
    return Math.max(40, 100 - penalty);
  };

  const handleSave = () => {
    saveMutation.mutate(editedResume);
  };

  if (!editedResume || !editedResume.name) {
    return (
      <div className="h-screen bg-[#F8FAFC] dark:bg-[#0B1F3B] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 dark:text-white/50 mb-4">No resume found for bias analysis</p>
          <Link to={createPageUrl('Editor')}>
            <Button className="bg-[#2563EB]">Create Resume</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F8FAFC] dark:bg-[#0B1F3B] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-[#0B1F3B]/80 border-b border-slate-200 dark:border-white/5 flex items-center px-4 gap-4 flex-shrink-0">
        <Link to={createPageUrl('Preview') + `?version=${selectedVersion}`}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <h1 className="font-semibold text-[#0B1F3B] dark:text-white">Bias Analysis</h1>

        <Tabs value={selectedVersion} onValueChange={setSelectedVersion}>
          <TabsList className="h-8 bg-slate-100 dark:bg-white/5">
            <TabsTrigger value="A" className="text-xs h-6 px-3">Resume A</TabsTrigger>
            <TabsTrigger value="B" className="text-xs h-6 px-3">Resume B</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1" />
        
        <Button 
          size="sm" 
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="h-8 text-xs bg-[#14B8A6] hover:bg-[#0d9488]"
        >
          <Save className="h-3 w-3 mr-1" /> Save Changes
        </Button>

        <ThemeToggle />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Resume with Highlights */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto p-6 space-y-6">
              {/* Bias Score */}
              {(() => {
                const score = calculateBiasScore();
                const status = getBiasStatus(highlights);
                return (
                  <div 
                    className="p-6 rounded-2xl border transition-all"
                    style={{
                      background: status.level === 'none' ? 'linear-gradient(to br, #16a34a22, #22c55e11)' :
                                  status.level === 'high' ? 'linear-gradient(to br, #ef444422, #ef444411)' :
                                  status.level === 'moderate' ? 'linear-gradient(to br, #f59e0b22, #f59e0b11)' :
                                  'linear-gradient(to br, #6366f122, #818cf811)',
                      borderColor: status.color
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Bias-Free Score</h3>
                      <span className="text-4xl font-bold" style={{ color: status.color }}>
                        {score}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-white/70">
                      {status.label}
                    </p>
                  </div>
                );
              })()}

              {/* Heatmap Legend */}
              <div className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-white/80 mb-3">🎨 Heatmap Legend</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#ff4d4f33] border border-[#ff4d4f66] rounded" />
                    <span className="text-xs font-medium text-[#ff4d4f]">High Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#faad1433] border border-[#faad1466] rounded" />
                    <span className="text-xs font-medium text-[#faad14]">Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#52c41a33] border border-[#52c41a66] rounded" />
                    <span className="text-xs font-medium text-[#52c41a]">Mild</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#722ed133] border border-[#722ed166] rounded" />
                    <span className="text-xs font-medium text-[#722ed1]">Subjective</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white mb-3">Summary</h3>
                <div 
                  className="text-sm text-slate-700 dark:text-white/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightText(editedResume.summary, 'summary') }}
                />
              </div>

              {/* Experience */}
              <div>
                <h3 className="font-semibold text-[#0B1F3B] dark:text-white mb-3">Experience</h3>
                {(editedResume.experience || []).map((exp, i) => (
                  <div 
                    key={i}
                    className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 mb-3"
                  >
                    <p className="font-medium text-sm mb-2">{exp.role} at {exp.company}</p>
                    <div 
                      className="text-xs text-slate-600 dark:text-white/70 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: highlightText(exp.description, `experience_${i}`) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right: Suggestions */}
        <div className="w-[360px] p-4 flex-shrink-0 border-l border-slate-200 dark:border-white/5">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Detected Issues ({highlights.length})
                </h3>
              </div>

              {highlights.length === 0 ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-900">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    ✓ No bias issues detected! Your resume uses inclusive language.
                  </p>
                </div>
              ) : (
                highlights.map((pattern, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={getTypeColor(pattern.type)}>
                        {pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1)} Bias
                      </Badge>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        pattern.severity === 'high' ? 'bg-red-100 text-red-700' :
                        pattern.severity === 'moderate' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {pattern.severity}
                      </span>
                    </div>
                    
                    {pattern.type === 'photo' ? (
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-white/80 mb-2">
                          {pattern.word}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-white/60 mb-3">
                          {pattern.description}
                        </p>
                        <Button
                          size="sm"
                          className="w-full text-xs bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => {
                            setEditedResume(prev => ({ ...prev, profileImage: '' }));
                            analyzeForBias();
                          }}
                        >
                          🗑️ Remove Photo
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-medium line-through text-slate-500">{pattern.word}</span>
                          {pattern.replacement && (
                            <>
                              <ArrowRight className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-semibold text-[#14B8A6]">{pattern.replacement}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-white/60 mb-3">
                          {pattern.type === 'gender' ? 'Use gender-neutral language for inclusivity' :
                           pattern.type === 'age' ? 'Age indicators can introduce bias' :
                           pattern.type === 'nationality' ? 'Nationality/ethnicity can introduce bias' :
                           pattern.type === 'marital' ? 'Marital status is irrelevant to job performance' :
                           pattern.type === 'subjective' ? 'Replace subjective terms with concrete achievements' :
                           'Use action verbs to show impact'}
                        </p>
                        {pattern.replacement && (
                         <Button
                           size="sm"
                           className="w-full text-xs bg-[#14B8A6] hover:bg-[#0d9488] text-white"
                           onClick={async () => {
                             const fixed = replaceBiasWords(editedResume);
                             setEditedResume(fixed);
                             if (fixed.id) {
                               await saveMutation.mutateAsync(fixed);
                             }
                           }}
                         >
                           ✓ Replace All
                         </Button>
                        )}
                      </>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}