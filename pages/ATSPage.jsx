import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, CheckCircle, AlertTriangle, XCircle, 
  Sparkles, Save, TrendingUp, Target, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import AIAssistant from '@/components/editor/AIAssistant';
import { analyzeATS, getScoreInfo } from '@/components/preview/atsAnalyzer';

export default function ATSPage() {
  const params = new URLSearchParams(window.location.search);
  const initialVersion = params.get('version') || 'A';
  
  const [selectedVersion, setSelectedVersion] = useState(initialVersion);
  const [editedResume, setEditedResume] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const queryClient = useQueryClient();

  const { data: resumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list()
  });

  const resume = resumes.find(r => r.version === selectedVersion);

  useEffect(() => {
    if (resume) {
      setEditedResume(resume);
    }
  }, [resume?.id, selectedVersion]);

  useEffect(() => {
    if (editedResume) {
      const result = analyzeATS(editedResume, editedResume.domain || 'IT');
      setAnalysis(result);
    }
  }, [editedResume, editedResume?.domain]);

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

  const handleInlineEdit = (field, value) => {
    setEditedResume(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveMutation.mutate(editedResume);
  };

  const analyzeText = (text = '') => {
    const issues = [];
    const lowerText = text.toLowerCase();
    
    // Check for weak verbs
    if (/helped|assisted|responsible for|worked on|participated/i.test(text)) {
      issues.push({ type: 'warning', msg: 'Use stronger action verbs' });
    }
    
    // Check for metrics
    if (text.length > 50 && !/\d+%|\d+ years?|\d+x|\$\d+/i.test(text)) {
      issues.push({ type: 'warning', msg: 'Add quantifiable results' });
    }
    
    // Check length
    if (text.length > 400) {
      issues.push({ type: 'error', msg: 'Too long - reduce length' });
    }
    
    if (issues.length === 0) {
      return { type: 'success', msg: 'Good!' };
    }
    
    return issues[0];
  };

  const getStatusColor = (status) => {
    if (status?.type === 'success') return 'border-green-500 bg-green-50 dark:bg-green-900/10';
    if (status?.type === 'warning') return 'border-amber-500 bg-amber-50 dark:bg-amber-900/10';
    return 'border-red-500 bg-red-50 dark:bg-red-900/10';
  };

  const getStatusIcon = (status) => {
    if (status?.type === 'success') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status?.type === 'warning') return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  if (!editedResume || !editedResume.name) {
    return (
      <div className="h-screen bg-[#F8FAFC] dark:bg-[#0B1F3B] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 dark:text-white/50 mb-4">No resume found for ATS analysis</p>
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

        <h1 className="font-semibold text-[#0B1F3B] dark:text-white">ATS Analysis</h1>

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
        {/* Left: Analysis & Editable Resume */}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto p-6 space-y-6">
              
              {/* ATS Overview Card */}
              {analysis && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0B1F3B] dark:text-white mb-1">
                        ATS Analysis
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-white/60">
                        {editedResume.domain || 'IT'} Domain • Version {selectedVersion}
                      </p>
                    </div>
                    
                    {/* Score Ring */}
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="10"
                          className="dark:stroke-white/10"
                        />
                        <motion.circle
                          cx="56"
                          cy="56"
                          r="50"
                          fill="none"
                          stroke={getScoreInfo(analysis.score).color}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={314}
                          initial={{ strokeDashoffset: 314 }}
                          animate={{ strokeDashoffset: 314 - (314 * analysis.score / 100) }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold" style={{ color: getScoreInfo(analysis.score).color }}>
                          {analysis.score}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-white/50">/ 100</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 dark:text-white/50 mb-1">Keywords</p>
                      <p className="text-xl font-bold text-[#0B1F3B] dark:text-white">
                        {analysis.keywordScore}%
                      </p>
                    </div>
                    <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 dark:text-white/50 mb-1">Issues</p>
                      <p className="text-xl font-bold text-[#0B1F3B] dark:text-white">
                        {analysis.issues.length}
                      </p>
                    </div>
                    <div className="bg-white/60 dark:bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 dark:text-white/50 mb-1">Status</p>
                      <Badge 
                        className="text-xs font-semibold"
                        style={{ 
                          backgroundColor: getScoreInfo(analysis.score).color + '20',
                          color: getScoreInfo(analysis.score).color,
                          border: `1px solid ${getScoreInfo(analysis.score).color}`
                        }}
                      >
                        {getScoreInfo(analysis.score).label}
                      </Badge>
                    </div>
                  </div>

                  {/* Section Scores */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600 dark:text-white/60 mb-3">Section Breakdown</p>
                    {Object.entries(analysis.sectionScores).map(([section, score]) => {
                      const maxScore = section === 'experience' ? 25 : section === 'keywords' ? 25 : section === 'summary' ? 20 : section === 'skills' ? 15 : section === 'education' ? 10 : 5;
                      const percentage = (score / maxScore) * 100;
                      return (
                        <div key={section} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-700 dark:text-white/70 capitalize w-24">
                            {section}
                          </span>
                          <div className="flex-1 h-2 bg-white/40 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: percentage >= 80 ? '#22C55E' : percentage >= 50 ? '#F59E0B' : '#EF4444' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 dark:text-white/60 w-12 text-right">
                            {score}/{maxScore}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Issues & Fixes */}
              {analysis && analysis.issues.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#0B1F3B] dark:text-white flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-500" />
                    Pinpoint Issues & Fixes
                  </h3>
                  {analysis.issues.map((issue, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 rounded-xl border-2 ${
                        issue.severity === 'high' ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800' :
                        issue.severity === 'medium' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800' :
                        'border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {issue.severity === 'high' ? <XCircle className="h-5 w-5 text-red-600 mt-0.5" /> :
                         issue.severity === 'medium' ? <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" /> :
                         <Info className="h-5 w-5 text-blue-600 mt-0.5" />}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {issue.section}
                            </Badge>
                            <span className="text-xs text-slate-500">-{issue.impact} pts</span>
                          </div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                            {issue.msg}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-white/70 flex items-start gap-1">
                            <Sparkles className="h-3 w-3 mt-0.5 text-blue-500" />
                            {issue.fix}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Summary */}
              <motion.div 
                className={`p-4 rounded-xl border-2 transition-all ${getStatusColor(analyzeText(editedResume.summary))}`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white">Summary</h3>
                    {getStatusIcon(analyzeText(editedResume.summary))}
                  </div>
                  <span className="text-xs text-slate-500">{editedResume.summary?.length || 0}/300</span>
                </div>
                <textarea
                  value={editedResume.summary || ''}
                  onChange={(e) => handleInlineEdit('summary', e.target.value)}
                  onFocus={() => setEditingField('summary')}
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-white/80 resize-none outline-none min-h-[80px]"
                  placeholder="Professional summary..."
                />
                {analyzeText(editedResume.summary).type !== 'success' && (
                  <p className="text-xs text-amber-600 mt-1">{analyzeText(editedResume.summary).msg}</p>
                )}
              </motion.div>

              {/* Experience */}
              <div>
                <h3 className="font-semibold text-[#0B1F3B] dark:text-white mb-3">Experience</h3>
                {(editedResume.experience || []).map((exp, i) => (
                  <motion.div 
                    key={i}
                    className={`p-4 rounded-xl border-2 mb-3 transition-all ${getStatusColor(analyzeText(exp.description))}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{exp.role} at {exp.company}</span>
                        {getStatusIcon(analyzeText(exp.description))}
                      </div>
                    </div>
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => {
                        const newExp = [...editedResume.experience];
                        newExp[i] = { ...newExp[i], description: e.target.value };
                        setEditedResume(prev => ({ ...prev, experience: newExp }));
                      }}
                      onFocus={() => setEditingField('experience')}
                      className="w-full bg-transparent text-xs text-slate-600 dark:text-white/70 resize-none outline-none min-h-[60px]"
                      placeholder="Describe your achievements with metrics..."
                    />
                    {analyzeText(exp.description).type !== 'success' && (
                      <p className="text-xs text-amber-600 mt-1">{analyzeText(exp.description).msg}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Skills */}
              <motion.div 
                className="p-4 rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-900/10"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white">Skills</h3>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <input
                  value={(editedResume.skills || []).join(', ')}
                  onChange={(e) => handleInlineEdit('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  onFocus={() => setEditingField('skills')}
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-white/80 outline-none"
                  placeholder="Comma-separated skills..."
                />
                <p className="text-xs text-green-600 mt-1">
                  {editedResume.skills?.length || 0} skills listed - Good for ATS!
                </p>
              </motion.div>
            </div>
          </ScrollArea>
        </div>

        {/* Right: AI Assistant */}
        <div className="w-[320px] p-4 flex-shrink-0 border-l border-slate-200 dark:border-white/5">
          <AIAssistant 
            focusedField={editingField}
            domain={editedResume.domain || 'IT'}
            resumeData={editedResume}
          />
        </div>
      </div>
    </div>
  );
}