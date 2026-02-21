import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function BiasAnalysis({ resumeData }) {
  const score = resumeData.biasScore ?? 100;
  const issuesCount = resumeData.biasIssues ?? 0;

  const [analysis, setAnalysis] = useState({
    genderedWords: [],
    weakVerbs: [],
    lengthIssues: [],
    score: score
  });

  useEffect(() => {
    if (resumeData.biasScore !== undefined) {
      setAnalysis(prev => ({ ...prev, score: resumeData.biasScore }));
    } else {
      analyzeResume();
    }
  }, [resumeData.biasScore, resumeData]);

  const analyzeResume = () => {
    const text = [
      resumeData.summary || '',
      ...(resumeData.experience || []).map(e => e.description || ''),
      ...(resumeData.projects || []).map(p => p.description || '')
    ].join(' ').toLowerCase();

    // Gendered words detection
    const genderedPatterns = [
      { word: 'aggressive', suggestion: 'assertive' },
      { word: 'chairman', suggestion: 'chairperson' },
      { word: 'manpower', suggestion: 'workforce' },
      { word: 'mankind', suggestion: 'humanity' },
      { word: 'salesman', suggestion: 'salesperson' },
      { word: 'fireman', suggestion: 'firefighter' },
    ];
    const foundGendered = genderedPatterns.filter(p => text.includes(p.word));

    // Weak verbs detection
    const weakVerbs = ['helped', 'worked on', 'responsible for', 'assisted', 'participated'];
    const foundWeak = weakVerbs.filter(v => text.includes(v));

    // Length issues
    const lengthIssues = [];
    if ((resumeData.summary?.length || 0) > 300) {
      lengthIssues.push('Summary is too long (>300 chars)');
    }
    if ((resumeData.summary?.length || 0) < 50) {
      lengthIssues.push('Summary is too short (<50 chars)');
    }
    
    const expWithLongDesc = (resumeData.experience || []).filter(e => (e.description?.length || 0) > 400);
    if (expWithLongDesc.length > 0) {
      lengthIssues.push(`${expWithLongDesc.length} experience entries too long`);
    }

    // Calculate score
    let score = 100;
    score -= foundGendered.length * 10;
    score -= foundWeak.length * 5;
    score -= lengthIssues.length * 10;

    setAnalysis({
      genderedWords: foundGendered,
      weakVerbs: foundWeak,
      lengthIssues,
      score: Math.max(0, score)
    });
  };

  const getScoreColor = () => {
    if (analysis.score >= 80) return 'text-green-600';
    if (analysis.score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const hasIssues = issuesCount > 0 || 
                    analysis.genderedWords.length > 0 || 
                    analysis.weakVerbs.length > 0 || 
                    analysis.lengthIssues.length > 0;

  const getStatusText = () => {
    if (score >= 90) return "Excellent - Bias-free";
    if (score >= 70) return "Good - Minor issues";
    if (score >= 50) return "Moderate - Review needed";
    return "High Bias - Action required";
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-5">
      <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white mb-4 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-[#14B8A6]" />
        Bias Analysis
      </h3>

      {!hasIssues ? (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle2 className="h-4 w-4" />
          {getStatusText()}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Gendered Words */}
          {analysis.genderedWords.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2">
                Gendered Words ({analysis.genderedWords.length})
              </p>
              <div className="space-y-1">
                {analysis.genderedWords.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-red-600 border-red-200 dark:border-red-900">
                      {item.word}
                    </Badge>
                    <span className="text-slate-400">→</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-900">
                      {item.suggestion}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weak Verbs */}
          {analysis.weakVerbs.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2">
                Weak Verbs ({analysis.weakVerbs.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {analysis.weakVerbs.map((verb, i) => (
                  <Badge key={i} variant="outline" className="text-amber-600 border-amber-200 dark:border-amber-900 text-xs">
                    {verb}
                  </Badge>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Replace with action verbs: Built, Led, Developed, Implemented
              </p>
            </div>
          )}

          {/* Length Issues */}
          {analysis.lengthIssues.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-white/50 mb-2">
                Length Issues ({analysis.lengthIssues.length})
              </p>
              <div className="space-y-1">
                {analysis.lengthIssues.map((issue, i) => (
                  <p key={i} className="text-xs text-slate-600 dark:text-white/60 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                    {issue}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500 dark:text-white/50">Bias Score</span>
          <span className={`font-semibold ${getScoreColor()}`}>{score}/100</span>
        </div>
        {issuesCount > 0 && (
          <p className="text-xs text-slate-400 mt-1">{issuesCount} issue{issuesCount !== 1 ? 's' : ''} detected</p>
        )}
      </div>
    </div>
  );
}