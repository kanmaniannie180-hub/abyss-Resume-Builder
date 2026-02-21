import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Salary data in INR (Lakhs Per Annum) - India Market
const salaryData = {
  IT: {
    'Software Engineer': { min: 6, max: 25 },
    'Frontend Developer': { min: 5, max: 20 },
    'Backend Developer': { min: 6, max: 22 },
    'Full Stack Developer': { min: 7, max: 28 },
    'DevOps Engineer': { min: 8, max: 30 },
    'Data Scientist': { min: 10, max: 35 },
    'Product Manager': { min: 12, max: 40 },
    default: { min: 4, max: 18 }
  },
  Management: {
    'Operations Manager': { min: 8, max: 25 },
    'Project Manager': { min: 10, max: 30 },
    'General Manager': { min: 12, max: 35 },
    'Business Analyst': { min: 6, max: 18 },
    'HR Manager': { min: 7, max: 20 },
    default: { min: 6, max: 20 }
  },
  Culinary: {
    'Head Chef': { min: 5, max: 15 },
    'Sous Chef': { min: 3, max: 8 },
    'Executive Chef': { min: 8, max: 20 },
    'Pastry Chef': { min: 3, max: 10 },
    default: { min: 2.5, max: 8 }
  },
  Arts: {
    'Art Director': { min: 6, max: 18 },
    'Graphic Designer': { min: 3, max: 12 },
    'Illustrator': { min: 3, max: 10 },
    'Creative Director': { min: 8, max: 25 },
    default: { min: 2.5, max: 10 }
  },
  Education: {
    'High School Teacher': { min: 3, max: 8 },
    'College Professor': { min: 6, max: 18 },
    'Special Education': { min: 3.5, max: 9 },
    'Principal': { min: 8, max: 20 },
    default: { min: 3, max: 8 }
  },
  Teaching: {
    'High School Teacher': { min: 3, max: 8 },
    'College Professor': { min: 6, max: 18 },
    'Curriculum Developer': { min: 5, max: 12 },
    'Academic Coordinator': { min: 4, max: 10 },
    default: { min: 3, max: 8 }
  },
  Music: {
    'Music Director': { min: 4, max: 15 },
    'Music Teacher': { min: 2.5, max: 7 },
    'Sound Engineer': { min: 3, max: 10 },
    'Music Producer': { min: 5, max: 18 },
    default: { min: 2.5, max: 8 }
  },
  Sports: {
    'Sports Coach': { min: 3, max: 12 },
    'Fitness Trainer': { min: 2, max: 8 },
    'Sports Manager': { min: 5, max: 15 },
    'Physiotherapist': { min: 4, max: 12 },
    default: { min: 2.5, max: 10 }
  },
  Academic: {
    'Researcher': { min: 6, max: 20 },
    'Lecturer': { min: 5, max: 15 },
    'PhD Scholar': { min: 3, max: 8 },
    'Dean': { min: 12, max: 30 },
    default: { min: 4, max: 15 }
  },
  Security: {
    'Security Officer': { min: 3, max: 10 },
    'Security Manager': { min: 5, max: 15 },
    'Security Analyst': { min: 6, max: 18 },
    'Chief Security Officer': { min: 10, max: 25 },
    default: { min: 3, max: 12 }
  },
  Healthcare: {
    'Nurse': { min: 3, max: 10 },
    'Doctor': { min: 8, max: 40 },
    'Healthcare Administrator': { min: 6, max: 20 },
    'Medical Officer': { min: 7, max: 25 },
    default: { min: 4, max: 15 }
  },
  Dance: {
    'Dance Instructor': { min: 2, max: 6 },
    'Choreographer': { min: 3, max: 12 },
    'Ballet Master': { min: 4, max: 15 },
    'Dance Director': { min: 5, max: 18 },
    default: { min: 2, max: 6 }
  },
  'Project Management': {
    'Project Manager': { min: 10, max: 30 },
    'Program Manager': { min: 12, max: 35 },
    'PMO Lead': { min: 15, max: 40 },
    'Scrum Master': { min: 8, max: 20 },
    default: { min: 8, max: 25 }
  }
};

export default function SalaryEstimate({ resumeData, domain }) {
  const [estimate, setEstimate] = useState({ min: 0, max: 0, mid: 0 });
  const [factors, setFactors] = useState({ exp: 0, skills: 0, edu: false });

  useEffect(() => {
    calculateSalary();
  }, [resumeData, domain]);

  const calculateSalary = () => {
    const domainData = salaryData[domain] || salaryData.IT;
    const role = resumeData.role?.toLowerCase() || '';

    // Find matching role
    let baseRange = domainData.default;
    for (const [key, range] of Object.entries(domainData)) {
      if (key !== 'default' && role.includes(key.toLowerCase())) {
        baseRange = range;
        break;
      }
    }

    // Adjust for experience
    const expYears = resumeData.experience?.length || 0;
    const expMultiplier = 1 + (expYears * 0.05);

    // Adjust for skills
    const skillsBonus = Math.min((resumeData.skills?.length || 0) * 0.02, 0.15);

    // Adjust for education
    const hasAdvancedDegree = resumeData.education?.some(e => 
      e.degree?.toLowerCase().includes('master') || e.degree?.toLowerCase().includes('phd')
    );
    const eduBonus = hasAdvancedDegree ? 0.1 : 0;

    const totalMultiplier = expMultiplier + skillsBonus + eduBonus;

    const adjustedMin = Math.round(baseRange.min * totalMultiplier * 10) / 10;
    const adjustedMax = Math.round(baseRange.max * totalMultiplier * 10) / 10;

    setEstimate({
      min: adjustedMin,
      max: adjustedMax,
      mid: Math.round((adjustedMin + adjustedMax) / 2 * 10) / 10
    });

    setFactors({
      exp: expYears,
      skills: resumeData.skills?.length || 0,
      edu: hasAdvancedDegree
    });
  };

  const formatCurrency = (num) => {
    return `₹${num} LPA`;
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-5">
      <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white mb-4 flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-green-600" />
        Salary Estimate
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Based on your role, experience, skills, and education in the {domain} domain. Estimates may vary by location.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>

      {!resumeData.role ? (
        <p className="text-sm text-slate-500 dark:text-white/50">
          Add your target role to see salary estimates
        </p>
      ) : (
        <>
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-[#0B1F3B] dark:text-white">
              {formatCurrency(estimate.mid)}
            </p>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Indian Market Estimate
            </p>
          </div>

          <div className="relative h-2 bg-slate-100 dark:bg-white/10 rounded-full mb-2">
            <div 
              className="absolute inset-y-0 rounded-full bg-gradient-to-r from-green-400 to-green-600"
              style={{ left: '10%', right: '10%' }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-green-600 rounded-full"
              style={{ left: '50%', transform: 'translate(-50%, -50%)' }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-500 dark:text-white/50 mb-4">
            <span>{formatCurrency(estimate.min)}</span>
            <span>{formatCurrency(estimate.max)}</span>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 space-y-2">
            <p className="text-[10px] font-semibold text-slate-600 dark:text-white/70 uppercase tracking-wide">
              Why this estimate?
            </p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1" />
                <p className="text-xs text-slate-600 dark:text-white/60">
                  <span className="font-medium">{domain}</span> domain base range: {formatCurrency(salaryData[domain]?.default?.min || 4)} - {formatCurrency(salaryData[domain]?.default?.max || 18)}
                </p>
              </div>
              {factors.exp > 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                  <p className="text-xs text-slate-600 dark:text-white/60">
                    <span className="font-medium">{factors.exp}</span> years of experience (+{factors.exp * 5}% boost)
                  </p>
                </div>
              )}
              {factors.skills > 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1" />
                  <p className="text-xs text-slate-600 dark:text-white/60">
                    <span className="font-medium">{factors.skills}</span> skills listed (+{Math.min(factors.skills * 2, 15)}% boost)
                  </p>
                </div>
              )}
              {factors.edu && (
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1" />
                  <p className="text-xs text-slate-600 dark:text-white/60">
                    Advanced degree (Master's/PhD) (+10% boost)
                  </p>
                </div>
              )}
              <div className="flex items-start gap-2 pt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mt-0.5" />
                <p className="text-[10px] text-slate-500 dark:text-white/50 italic">
                  Based on Indian market data for metro cities
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}