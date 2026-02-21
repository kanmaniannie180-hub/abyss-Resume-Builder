export const domainHeaders = {
  IT: {
    summary: "Professional Summary",
    skills: "Technical Skills",
    experience: "Work Experience",
    projects: "Projects",
    education: "Education",
    showProjects: true
  },

  Management: {
    summary: "Leadership Profile",
    skills: "Core Competencies",
    experience: "Management Experience",
    projects: "Key Initiatives",
    education: "Education",
    showProjects: true
  },

  Arts: {
    summary: "Creative Profile",
    skills: "Artistic Skills",
    experience: "Creative Experience",
    projects: "Portfolio Highlights",
    education: "Education",
    showProjects: true
  },

  Education: {
    summary: "Teaching Profile",
    skills: "Teaching Skills",
    experience: "Teaching Experience",
    projects: "Academic Contributions",
    education: "Education",
    showProjects: true
  },

  Culinary: {
    summary: "Culinary Profile",
    skills: "Culinary Skills",
    experience: "Kitchen Experience",
    projects: "Signature Dishes",
    education: "Culinary Training",
    showProjects: true
  },

  Music: {
    summary: "Musician Profile",
    skills: "Musical Skills",
    experience: "Performance Experience",
    projects: "Performances & Recordings",
    education: "Music Education",
    showProjects: true
  },

  Sports: {
    summary: "Athletic Profile",
    skills: "Sports Skills",
    experience: "Competitions",
    projects: "Training & Coaching",
    education: "Education & Certifications",
    showProjects: true
  },

  Academic: {
    summary: "Research Profile",
    skills: "Research Skills",
    experience: "Research Experience",
    projects: "Publications",
    education: "Academic Background",
    showProjects: true
  },

  Security: {
    summary: "Security Profile",
    skills: "Security Skills",
    experience: "Security Experience",
    projects: "Operations",
    education: "Training & Certifications",
    showProjects: true
  },

  Healthcare: {
    summary: "Clinical Profile",
    skills: "Clinical Skills",
    experience: "Clinical Experience",
    projects: "Patient Care",
    education: "Medical Education",
    showProjects: true
  },

  Teaching: {
    summary: "Teaching Profile",
    skills: "Instructional Skills",
    experience: "Teaching Experience",
    projects: "Academic Activities",
    education: "Education",
    showProjects: true
  },

  "Project Management": {
    summary: "Project Profile",
    skills: "Project Skills",
    experience: "Project Experience",
    projects: "Projects Delivered",
    education: "Education",
    showProjects: true
  }
};

export function getHeadersForDomain(domain) {
  return domainHeaders[domain] || domainHeaders.IT;
}