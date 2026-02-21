// Centralized bias analysis with null-safe normalization

const BIAS_PATTERNS = {
  gender: [
    { word: 'manpower', replacement: 'workforce', severity: 'high' },
    { word: 'chairman', replacement: 'chairperson', severity: 'high' },
    { word: 'salesman', replacement: 'salesperson', severity: 'high' },
    { word: 'businessman', replacement: 'businessperson', severity: 'moderate' },
    { word: 'policeman', replacement: 'police officer', severity: 'moderate' },
    { word: 'fireman', replacement: 'firefighter', severity: 'moderate' },
    { word: 'freshman', replacement: 'first-year student', severity: 'mild' },
  ],
  age: [
    { word: 'young professional', replacement: 'professional', severity: 'moderate' },
    { word: 'recent graduate', replacement: 'graduate', severity: 'mild' },
    { word: 'seasoned', replacement: 'experienced', severity: 'mild' },
    { word: 'years old', replacement: '', severity: 'high' },
  ],
  passive: [
    { word: 'helped with', replacement: 'led', severity: 'moderate' },
    { word: 'worked on', replacement: 'delivered', severity: 'moderate' },
    { word: 'responsible for', replacement: 'managed', severity: 'mild' },
    { word: 'assisted', replacement: 'collaborated', severity: 'mild' },
  ]
};

export function normalizeResume(resume) {
  if (!resume) {
    return {
      summary: '',
      experience: [],
      skills: [],
      education: [],
      projects: [],
      domain: 'IT',
      profileImage: null,
      id: null
    };
  }

  return {
    summary: resume.summary || '',
    experience: resume.experience || [],
    skills: resume.skills || [],
    education: resume.education || [],
    projects: resume.projects || [],
    domain: resume.domain || 'IT',
    profileImage: resume.profileImage || null,
    id: resume.id || null
  };
}

export function analyzeBias(resume) {
  const r = normalizeResume(resume);
  
  const issues = [];
  let score = 100;

  // Combine all text
  const text = [
    r.summary,
    ...r.experience.map(e => e.description || ''),
    ...r.projects.map(p => p.description || '')
  ].join(' ').toLowerCase();

  // Check each pattern
  Object.entries(BIAS_PATTERNS).forEach(([type, patterns]) => {
    patterns.forEach(pattern => {
      if (text.includes(pattern.word.toLowerCase())) {
        issues.push({ ...pattern, type });
        
        // Deduct score based on severity
        if (pattern.severity === 'high') score -= 15;
        else if (pattern.severity === 'moderate') score -= 8;
        else if (pattern.severity === 'mild') score -= 3;
      }
    });
  });

  // Photo bias
  if (r.profileImage) {
    issues.push({
      word: 'Profile Photo',
      replacement: 'Remove photo',
      type: 'photo',
      severity: 'moderate',
      description: 'Photos can introduce unconscious bias in ATS screening'
    });
    score -= 10;
  }

  // Clamp score (never perfect, never too low)
  score = Math.max(40, Math.min(score, 95));

  return {
    score,
    issues: issues.length,
    issuesList: issues
  };
}

export function replaceBiasWords(resume) {
  const r = normalizeResume(resume);

  const replaceText = (text) => {
    let result = text || '';
    Object.values(BIAS_PATTERNS).flat().forEach(pattern => {
      const regex = new RegExp(pattern.word, 'gi');
      result = result.replace(regex, pattern.replacement);
    });
    return result;
  };

  return {
    ...r,
    summary: replaceText(r.summary),
    experience: r.experience.map(e => ({
      ...e,
      description: replaceText(e.description || '')
    })),
    projects: r.projects.map(p => ({
      ...p,
      description: replaceText(p.description || '')
    }))
  };
}

export function getBiasColor(severity) {
  if (severity === 'high') return '#ef4444';
  if (severity === 'moderate') return '#f59e0b';
  return '#22c55e';
}

export function getBiasStatus(issuesList) {
  if (!issuesList || issuesList.length === 0) {
    return {
      label: "Excellent! Your resume is bias-free.",
      level: "none",
      color: "#22c55e"
    };
  }

  const hasHigh = issuesList.some(i => i.severity === "high");
  const hasModerate = issuesList.some(i => i.severity === "moderate");

  if (hasHigh) {
    return {
      label: "High bias risk detected. Immediate fixes recommended.",
      level: "high",
      color: "#ef4444"
    };
  }

  if (hasModerate) {
    return {
      label: "Moderate bias detected. Review suggestions below.",
      level: "moderate",
      color: "#f59e0b"
    };
  }

  return {
    label: "Minor subjective wording detected.",
    level: "mild",
    color: "#818cf8"
  };
}

export function getScoreLabel(score) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Moderate";
  return "High Risk";
}

export { BIAS_PATTERNS };