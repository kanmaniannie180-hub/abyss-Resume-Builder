import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, TrendingUp, XCircle, Info } from 'lucide-react';
import { analyzeATS, getScoreInfo } from './atsAnalyzer';

export default function ATSScore({ resumeData }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (resumeData) {
      const result = analyzeATS(resumeData, resumeData.domain || 'IT');
      setAnalysis(result);
    }
  }, [resumeData, resumeData?.domain]);

  if (!analysis) return null;

  const { score, issues } = analysis;
  const scoreInfo = getScoreInfo(score);

  const getSeverityIcon = (severity) => {
    if (severity === 'high') return <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />;
    if (severity === 'medium') return <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0" />;
    return <Info className="h-3 w-3 text-blue-500 flex-shrink-0" />;
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-5">
      <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-[#2563EB]" />
        ATS Score
      </h3>

      {/* Score Circle */}
      <div className="flex items-center gap-6 mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="8"
              className="dark:stroke-white/10"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke={scoreInfo.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={264}
              initial={{ strokeDashoffset: 264 }}
              animate={{ strokeDashoffset: 264 - (264 * score / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className="text-2xl font-bold"
              style={{ color: scoreInfo.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}
            </motion.span>
            <span className="text-[10px] text-slate-500 dark:text-white/50">/ 100</span>
          </div>
        </div>

        <div>
          <p className="font-medium" style={{ color: scoreInfo.color }}>{scoreInfo.label}</p>
          <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {scoreInfo.message}
          </p>
        </div>
      </div>

      {/* Top Issues */}
      {issues.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 dark:text-white/50">Top Issues:</p>
          {issues.slice(0, 3).map((issue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-xs"
            >
              {getSeverityIcon(issue.severity)}
              <div className="flex-1">
                <p className="text-slate-700 dark:text-white/80 font-medium">{issue.msg}</p>
                <p className="text-slate-500 dark:text-white/50 mt-0.5">{issue.fix}</p>
              </div>
            </motion.div>
          ))}
          {issues.length > 3 && (
            <p className="text-xs text-slate-400 dark:text-white/40 mt-2">
              +{issues.length - 3} more issues
            </p>
          )}
        </div>
      )}

      {score >= 85 && (
        <div className="flex items-center gap-2 text-green-600 text-xs mt-3 bg-green-50 dark:bg-green-900/10 p-2 rounded-lg">
          <CheckCircle className="h-4 w-4" />
          ATS-optimized and recruiter-ready!
        </div>
      )}
    </div>
  );
}