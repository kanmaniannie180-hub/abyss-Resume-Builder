// Template metadata and registry

export const templateLibrary = [
  {
    id: "modern_pro",
    name: "Modern Pro",
    domain: ["IT", "Software", "Engineering"],
    category: "Professional",
    atsFriendly: true,
    photoSupported: true,
    color: "#2563EB",
    description: "Clean modern layout for technical roles"
  },
  {
    id: "executive_elite",
    name: "Executive Elite",
    domain: ["Management", "Business", "Executive"],
    category: "Professional",
    atsFriendly: true,
    photoSupported: true,
    color: "#1F2937",
    description: "Premium executive resume template"
  },
  {
    id: "creative_flow",
    name: "Creative Flow",
    domain: ["Arts", "Design", "Media"],
    category: "Creative",
    atsFriendly: false,
    photoSupported: true,
    color: "#E84A8A",
    description: "Visual layout for creative professionals"
  },
  {
    id: "minimal_edge",
    name: "Minimal Edge",
    domain: ["Education", "Academic"],
    category: "Professional",
    atsFriendly: true,
    photoSupported: false,
    color: "#6B7280",
    description: "Clean minimalist design for educators"
  },
  {
    id: "culinary_chef",
    name: "Culinary Chef",
    domain: ["Culinary", "Hospitality"],
    category: "Specialized",
    atsFriendly: true,
    photoSupported: true,
    color: "#92400E",
    description: "Chef & kitchen experience layout"
  },
  {
    id: "music_artist",
    name: "Music Artist",
    domain: ["Music", "Arts", "Entertainment"],
    category: "Creative",
    atsFriendly: false,
    photoSupported: true,
    color: "#7C3AED",
    description: "Artistic layout for musicians"
  },
  {
    id: "sports_athlete",
    name: "Sports Athlete",
    domain: ["Sports", "Fitness", "Athletics"],
    category: "Specialized",
    atsFriendly: true,
    photoSupported: true,
    color: "#DC2626",
    description: "Athletic achievement showcase"
  },
  {
    id: "academic_scholar",
    name: "Academic Scholar",
    domain: ["Academic", "Research", "Education"],
    category: "Professional",
    atsFriendly: true,
    photoSupported: false,
    color: "#1E3A8A",
    description: "Research-focused academic CV"
  },
  {
    id: "security_force",
    name: "Security Force",
    domain: ["Security", "Military", "Law Enforcement"],
    category: "Specialized",
    atsFriendly: true,
    photoSupported: true,
    color: "#65A30D",
    description: "Security professional template"
  },
  {
    id: "healthcare_care",
    name: "Healthcare Care",
    domain: ["Healthcare", "Medical", "Nursing"],
    category: "Specialized",
    atsFriendly: true,
    photoSupported: true,
    color: "#0D9488",
    description: "Medical professional layout"
  },
  {
    id: "educator_plus",
    name: "Educator Plus",
    domain: ["Teaching", "Education"],
    category: "Professional",
    atsFriendly: true,
    photoSupported: true,
    color: "#4F46E5",
    description: "Teaching experience focused"
  },
  {
    id: "project_manager",
    name: "Project Manager",
    domain: ["Project Management", "Management", "IT"],
    category: "Professional",
    atsFriendly: true,
    photoSupported: true,
    color: "#0369A1",
    description: "Project leadership template"
  }
];

export function getTemplatesByDomain(domain) {
  if (!domain || domain === "All") return templateLibrary;
  return templateLibrary.filter(t => t.domain.includes(domain));
}

export function filterTemplates(domain, atsOnly, photoOnly) {
  return templateLibrary.filter(t => {
    if (domain !== "All" && !t.domain.includes(domain)) return false;
    if (atsOnly && !t.atsFriendly) return false;
    if (photoOnly && !t.photoSupported) return false;
    return true;
  });
}

export function getTemplateById(id) {
  return templateLibrary.find(t => t.id === id) || templateLibrary[0];
}