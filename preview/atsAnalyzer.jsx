// Domain-specific keywords for ATS matching
export const domainKeywords = {
  IT: [
    'software', 'development', 'api', 'database', 'programming', 'cloud', 
    'system', 'architecture', 'agile', 'testing', 'deployment', 'code',
    'git', 'devops', 'CI/CD', 'microservices', 'frontend', 'backend'
  ],
  Management: [
    'operations', 'leadership', 'kpi', 'process', 'strategy', 'team',
    'budget', 'efficiency', 'optimization', 'planning', 'stakeholder',
    'project', 'coordination', 'delegation', 'analytics', 'roi'
  ],
  Sports: [
    'competition', 'training', 'performance', 'tournament', 'fitness',
    'athlete', 'team', 'coaching', 'discipline', 'endurance', 'strategy',
    'championship', 'athletic', 'sports', 'conditioning', 'technique'
  ],
  Culinary: [
    'cuisine', 'kitchen', 'chef', 'cooking', 'recipe', 'menu', 'food',
    'preparation', 'culinary', 'restaurant', 'dining', 'service',
    'plating', 'flavor', 'ingredients', 'sanitation', 'safety'
  ],
  Arts: [
    'design', 'creative', 'visual', 'portfolio', 'illustration', 'graphic',
    'art', 'aesthetic', 'composition', 'color', 'typography', 'branding',
    'ui/ux', 'sketch', 'photoshop', 'illustrator', 'creative direction'
  ],
  Teaching: [
    'education', 'curriculum', 'instruction', 'classroom', 'student',
    'lesson', 'assessment', 'pedagogy', 'learning', 'teaching', 'mentor',
    'evaluation', 'development', 'engagement', 'differentiation'
  ],
  Education: [
    'education', 'curriculum', 'instruction', 'classroom', 'student',
    'lesson', 'assessment', 'pedagogy', 'learning', 'teaching', 'academic',
    'educational', 'training', 'workshop', 'seminar'
  ],
  Music: [
    'performance', 'composition', 'music', 'instrument', 'orchestra',
    'recording', 'production', 'concert', 'repertoire', 'rehearsal',
    'arrangement', 'theory', 'notation', 'audio', 'mixing'
  ],
  Healthcare: [
    'patient', 'medical', 'clinical', 'healthcare', 'treatment', 'diagnosis',
    'nursing', 'care', 'health', 'wellness', 'therapy', 'physician',
    'hospital', 'emergency', 'medication', 'documentation'
  ],
  Security: [
    'security', 'surveillance', 'protection', 'safety', 'monitoring',
    'patrol', 'emergency', 'prevention', 'response', 'investigation',
    'compliance', 'risk', 'threat', 'incident', 'protocol'
  ],
  Academic: [
    'research', 'academic', 'publication', 'thesis', 'dissertation',
    'analysis', 'methodology', 'data', 'study', 'scholar', 'conference',
    'peer-review', 'journal', 'findings', 'hypothesis', 'theoretical'
  ],
  'Project Management': [
    'project', 'management', 'planning', 'execution', 'delivery', 'scope',
    'timeline', 'milestone', 'risk', 'stakeholder', 'agile', 'scrum',
    'budget', 'resources', 'coordination', 'pmi', 'gantt'
  ]
};

// Maximum achievable score (no resume is perfect)
const MAX_SCORE = 92;
const MIN_SCORE = 20;

// Advanced ATS analysis function
export function analyzeATS(resume, domain = 'IT') {
  const issues = [];
  let score = 0;
  let summaryScore = 0;
  let experienceScore = 0;
  let skillsScore = 0;
  let keywordScore = 0;
  let educationScore = 0;
  let formatScore = 0;

  // Track if resume has metrics anywhere (major penalty if not)
  let hasMetricsAnywhere = false;

  // 1. SUMMARY ANALYSIS (20 points max)
  if (!resume.summary || resume.summary.length < 50) {
    issues.push({
      section: 'Summary',
      type: 'critical',
      severity: 'high',
      msg: 'Summary too short or missing',
      fix: 'Add a 80-200 character summary highlighting your role, years of experience, specialization, and key impact',
      impact: 10
    });
    summaryScore = 0;
  } else {
    const words = resume.summary.split(' ').length;
    const hasMetrics = /\d/.test(resume.summary);
    const hasRoleKeywords = /(manager|developer|designer|engineer|specialist|analyst|coordinator)/i.test(resume.summary);
    const hasActionWords = /(led|managed|developed|achieved|improved|increased|reduced|delivered)/i.test(resume.summary);
    const isGeneric = /(results-driven|detail-oriented|team player|hard worker)/i.test(resume.summary);
    
    if (words >= 15 && words <= 50) summaryScore += 6;
    else if (words >= 10) summaryScore += 3;
    
    if (hasRoleKeywords) summaryScore += 4;
    if (hasMetrics) { 
      summaryScore += 6;
      hasMetricsAnywhere = true;
    }
    if (hasActionWords) summaryScore += 4;
    
    if (isGeneric) {
      issues.push({
        section: 'Summary',
        type: 'warning',
        severity: 'medium',
        msg: 'Generic phrases detected',
        fix: 'Replace "results-driven" and similar clichés with specific achievements',
        impact: 3
      });
      summaryScore -= 3;
    }

    if (!hasMetrics) {
      issues.push({
        section: 'Summary',
        type: 'warning',
        severity: 'medium',
        msg: 'No measurable impact in summary',
        fix: 'Add numbers like "5+ years", "30% improvement", or "managed team of 10"',
        impact: 6
      });
    }

    if (resume.summary.length > 300) {
      summaryScore -= 2;
    }
  }

  // 2. EXPERIENCE ANALYSIS (25 points max)
  if (!resume.experience || resume.experience.length === 0) {
    issues.push({
      section: 'Experience',
      type: 'critical',
      severity: 'high',
      msg: 'No experience listed',
      fix: 'Add at least one role (internship, part-time, or full-time)',
      impact: 15
    });
    experienceScore = 0;
  } else {
    let expWithMetrics = 0;
    let expWithActionVerbs = 0;
    let totalExpQuality = 0;

    resume.experience.forEach((exp, idx) => {
      let expScore = 0;
      const hasDescription = exp.description && exp.description.length >= 50;
      const hasMetrics = exp.description && /\d+%|\d+ (years?|months?|projects?|people|members|million|thousand|clients?)|\$\d+|increased|decreased|improved|reduced/i.test(exp.description);
      const hasActionVerbs = exp.description && /(led|managed|developed|implemented|achieved|improved|increased|reduced|delivered|created|designed|built|launched|optimized)/i.test(exp.description);
      const hasWeakVerbs = exp.description && /helped|assisted|responsible for|worked on|participated|involved in/i.test(exp.description);
      const hasDomainKeywords = exp.description && (domainKeywords[domain] || []).some(kw => 
        exp.description.toLowerCase().includes(kw.toLowerCase())
      );

      if (exp.role && exp.company) expScore += 3;
      if (hasDescription) expScore += 4;
      if (hasMetrics) {
        expScore += 7;
        expWithMetrics++;
        hasMetricsAnywhere = true;
      }
      if (hasActionVerbs) {
        expScore += 5;
        expWithActionVerbs++;
      }
      if (hasDomainKeywords) expScore += 3;
      if (hasWeakVerbs) expScore -= 2;

      totalExpQuality += expScore;

      if (!hasMetrics && hasDescription && idx === 0) {
        issues.push({
          section: 'Experience',
          type: 'warning',
          severity: 'medium',
          msg: `${exp.role || 'Position ' + (idx + 1)} lacks quantifiable metrics`,
          fix: 'Add numbers: "Increased efficiency by 25%", "Managed 10 projects", "Reduced costs by $50K"',
          impact: 7
        });
      }

      if (hasWeakVerbs && !issues.some(i => i.msg.includes('weak verbs'))) {
        issues.push({
          section: 'Experience',
          type: 'info',
          severity: 'low',
          msg: 'Using weak action verbs',
          fix: 'Replace "helped", "assisted" with "Led", "Developed", "Implemented", "Achieved"',
          impact: 3
        });
      }
    });

    // Average quality capped at 25 points
    experienceScore = Math.min(25, totalExpQuality / resume.experience.length * (resume.experience.length > 1 ? 1.2 : 1));
  }

  // 3. SKILLS ANALYSIS (15 points max)
  if (!resume.skills || resume.skills.length < 3) {
    issues.push({
      section: 'Skills',
      type: 'critical',
      severity: 'high',
      msg: 'Too few skills listed',
      fix: 'Add 8-12 relevant skills (technical, soft, and domain-specific)',
      impact: 10
    });
    skillsScore = 0;
  } else {
    const domainRelevant = (domainKeywords[domain] || []).filter(kw => 
      resume.skills.some(skill => skill.toLowerCase().includes(kw.toLowerCase()))
    ).length;

    if (resume.skills.length >= 8 && resume.skills.length <= 15) skillsScore += 8;
    else if (resume.skills.length >= 5) skillsScore += 5;
    else skillsScore += 3;

    if (domainRelevant >= 3) skillsScore += 7;
    else if (domainRelevant >= 1) skillsScore += 4;

    if (resume.skills.length < 6) {
      issues.push({
        section: 'Skills',
        type: 'warning',
        severity: 'medium',
        msg: 'Too few skills listed',
        fix: 'Add 8-12 relevant skills (technical, soft, and domain-specific)',
        impact: 8
      });
    }

    if (resume.skills.length > 20) {
      issues.push({
        section: 'Skills',
        type: 'info',
        severity: 'low',
        msg: 'Too many skills may dilute focus',
        fix: 'Focus on 8-15 most relevant skills for your target role',
        impact: 3
      });
      skillsScore -= 3;
    }
  }

  // 4. KEYWORD MATCHING (25 points max)
  const keywords = domainKeywords[domain] || domainKeywords['IT'];
  const resumeText = JSON.stringify(resume).toLowerCase();
  
  let matchedCount = 0;
  keywords.forEach(keyword => {
    if (resumeText.includes(keyword.toLowerCase())) {
      matchedCount++;
    }
  });

  const keywordMatchRatio = matchedCount / keywords.length;
  const keywordPercentage = Math.round(keywordMatchRatio * 100);

  if (keywordMatchRatio >= 0.6) keywordScore = 25;
  else if (keywordMatchRatio >= 0.45) keywordScore = 20;
  else if (keywordMatchRatio >= 0.3) keywordScore = 15;
  else if (keywordMatchRatio >= 0.2) keywordScore = 10;
  else keywordScore = 5;

  if (keywordMatchRatio < 0.3) {
    issues.push({
      section: 'Keywords',
      type: 'critical',
      severity: 'high',
      msg: `Low keyword match for ${domain} (${keywordPercentage}%)`,
      fix: `Add domain-specific terms like: ${keywords.slice(0, 5).join(', ')}`,
      impact: 15
    });
  } else if (keywordMatchRatio < 0.45) {
    issues.push({
      section: 'Keywords',
      type: 'warning',
      severity: 'medium',
      msg: `Moderate keyword match (${keywordPercentage}%)`,
      fix: `Increase usage of: ${keywords.slice(0, 5).join(', ')}`,
      impact: 10
    });
  }

  // 5. EDUCATION ANALYSIS (10 points max)
  if (!resume.education || resume.education.length === 0) {
    issues.push({
      section: 'Education',
      type: 'warning',
      severity: 'medium',
      msg: 'Education section missing',
      fix: 'Add degree, institution, and graduation year',
      impact: 10
    });
    educationScore = 0;
  } else {
    educationScore = 10;
  }

  // 6. FORMATTING CHECKS (5 points max)
  if (!resume.email) {
    issues.push({
      section: 'Contact',
      type: 'critical',
      severity: 'high',
      msg: 'Missing email address',
      fix: 'Add professional email for recruiters to reach you',
      impact: 5
    });
    formatScore = 0;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.email)) {
    issues.push({
      section: 'Contact',
      type: 'warning',
      severity: 'medium',
      msg: 'Invalid email format',
      fix: 'Ensure email follows standard format: name@domain.com',
      impact: 3
    });
    formatScore = 2;
  } else {
    formatScore = 5;
  }

  // Calculate total score
  score = summaryScore + experienceScore + skillsScore + keywordScore + educationScore + formatScore;

  // PENALTY SYSTEM
  if (!hasMetricsAnywhere) {
    issues.push({
      section: 'Overall',
      type: 'critical',
      severity: 'high',
      msg: 'No quantifiable metrics found anywhere',
      fix: 'Add numbers, percentages, or measurable results throughout your resume',
      impact: 8
    });
    score -= 8;
  }

  // Realism cap - no resume is perfect
  score = Math.min(score, MAX_SCORE);
  score = Math.max(score, MIN_SCORE);

  // Calculate section scores for UI
  const sectionScores = {
    summary: Math.round(summaryScore),
    experience: Math.round(experienceScore),
    skills: Math.round(skillsScore),
    keywords: Math.round(keywordScore),
    education: educationScore,
    formatting: formatScore
  };

  return {
    score: Math.round(score),
    keywordScore: keywordPercentage,
    issues: issues.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }),
    sectionScores,
    strengths: score >= 85 ? ['Strong ATS optimization'] : [],
    matchedKeywords: keywords.filter(k => resumeText.includes(k.toLowerCase()))
  };
}

// Helper to get score label and color
export function getScoreInfo(score) {
  if (score >= 85) return { label: 'Strong', color: '#22C55E', message: 'ATS-optimized and recruiter-ready' };
  if (score >= 70) return { label: 'Good', color: '#3B82F6', message: 'Minor improvements recommended' };
  if (score >= 55) return { label: 'Needs Improvement', color: '#F59E0B', message: 'Several areas need attention' };
  return { label: 'Weak', color: '#EF4444', message: 'Major improvements required' };
}