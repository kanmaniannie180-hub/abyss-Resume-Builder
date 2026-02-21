const profilePrompts = [
  "Change my name",
  "Update my role/title",
  "Edit my email",
  "Update my phone number",
  "Change my location",
  "Add profile photo",
  "Remove profile photo",
  "Update summary",
  "Make summary shorter",
  "Make summary more professional",
  "Make summary ATS-friendly",
  "Rewrite summary",
  "Add LinkedIn link",
  "Update contact details",
  "Reset profile information"
];

const resumePrompts = [
  "Add new skill",
  "Remove a skill",
  "Add work experience",
  "Edit experience",
  "Add education",
  "Update education",
  "Add certification",
  "Add project",
  "Edit project",
  "Improve bullet points",
  "Make resume stronger",
  "Make resume concise",
  "Make resume detailed",
  "Add achievements",
  "Add responsibilities",
  "Improve wording",
  "Make resume ATS optimized",
  "Highlight leadership",
  "Highlight technical skills",
  "Rewrite entire resume"
];

const domainPrompts = [
  "Change domain to IT",
  "Change domain to Sports",
  "Change domain to Culinary",
  "Change domain to Arts",
  "Change domain to Management",
  "Change domain to Education",
  "Change domain to Music",
  "Change domain to Healthcare",
  "Change domain to Security",
  "Change domain to Teaching",
  "Change domain to Academic",
  "Change domain to Project Management",
  "Change role to Student",
  "Change role to Professional",
  "Change role to Fresher"
];

const templatePrompts = [
  "Change template",
  "Switch to Modern template",
  "Switch to Creative template",
  "Switch to Minimal template",
  "Apply template to Resume A",
  "Apply template to Resume B",
  "Use same template for both resumes",
  "Preview templates",
  "Show more templates",
  "Change resume color theme",
  "Change resume font",
  "Make resume more modern",
  "Make resume more creative",
  "Make resume minimal",
  "Reset template"
];

const aiPrompts = [
  "You fill the resume",
  "Generate sample resume",
  "Create resume for my domain",
  "Auto-fill resume",
  "Generate professional resume",
  "Generate student resume",
  "Improve my resume",
  "Suggest improvements",
  "Analyze my resume",
  "Detect bias in resume"
];

const outputPrompts = [
  "Generate CV PDF",
  "Generate Resume PDF",
  "Download resume",
  "Preview resume",
  "Export resume",
  "Generate QR for resume",
  "Generate QR for CV",
  "Share resume link",
  "Create portfolio",
  "Open portfolio"
];

const twinPrompts = [
  "Copy Resume A to B",
  "Copy Resume B to A",
  "Switch to Resume A",
  "Switch to Resume B",
  "Edit Resume A",
  "Edit Resume B",
  "Apply template to A",
  "Apply template to B",
  "Generate A for IT",
  "Generate B for Sports"
];

const suggestionPrompts = [
  "Show suggestions",
  "Hide suggestions",
  "Refresh suggestions",
  "Suggestions for my domain",
  "Suggestions for my role"
];

export const abyssPrompts = [
  ...profilePrompts,
  ...resumePrompts,
  ...domainPrompts,
  ...templatePrompts,
  ...aiPrompts,
  ...outputPrompts,
  ...twinPrompts,
  ...suggestionPrompts
];

// Context-aware prompts based on focused field or domain
export function getContextualPrompts(focusedField, domain, hasContent) {
  // If focused on specific field
  if (focusedField === 'summary') {
    return [
      "Update summary",
      "Make summary shorter",
      "Make summary more professional",
      "Make summary ATS-friendly",
      "Rewrite summary",
      "Improve wording"
    ];
  }
  
  if (focusedField === 'skills') {
    return [
      "Add new skill",
      "Remove a skill",
      "Suggest skills for my domain",
      "Add technical skills",
      "Highlight technical skills"
    ];
  }
  
  if (focusedField === 'experience') {
    return [
      "Add work experience",
      "Edit experience",
      "Improve bullet points",
      "Add achievements",
      "Add responsibilities",
      "Make resume stronger"
    ];
  }
  
  if (focusedField === 'education') {
    return [
      "Add education",
      "Update education",
      "Add certification"
    ];
  }
  
  if (focusedField === 'projects') {
    return [
      "Add project",
      "Edit project",
      "Improve project descriptions"
    ];
  }
  
  // If no content yet, suggest autofill
  if (!hasContent) {
    return [
      "You fill the resume",
      "Generate professional resume",
      "Generate student resume",
      "Auto-fill resume",
      "Create resume for my domain"
    ];
  }
  
  // Domain-specific suggestions
  const domainSpecific = [
    `Generate ${domain} resume`,
    `Suggestions for ${domain}`,
    "Make resume ATS optimized",
    "Improve my resume",
    "Analyze my resume"
  ];
  
  return domainSpecific;
}

export const promptCategories = {
  'Profile': profilePrompts.slice(0, 6),
  'Content': resumePrompts.slice(0, 6),
  'AI Actions': aiPrompts.slice(0, 5),
  'Templates': templatePrompts.slice(0, 4),
  'Export': outputPrompts.slice(0, 4)
};