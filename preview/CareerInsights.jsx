import React from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';

const careerInsights = {
  IT: {
    strengths: [
      "Strong logical and analytical thinking",
      "High demand across industries",
      "Opportunities for remote/global work",
      "Continuous learning & innovation environment"
    ],
    improve: [
      "Build real-world projects portfolio",
      "Improve system design & architecture knowledge"
    ]
  },
  Management: {
    strengths: [
      "Leadership and decision-making opportunities",
      "Strategic impact on business growth",
      "Cross-functional collaboration exposure",
      "High career progression potential"
    ],
    improve: [
      "Develop data-driven decision skills",
      "Strengthen stakeholder communication"
    ]
  },
  Arts: {
    strengths: [
      "Creative self-expression and originality",
      "Portfolio-driven recognition",
      "Freelance and independent career options",
      "Growing digital content demand"
    ],
    improve: [
      "Build consistent personal brand",
      "Expand commercial design skills"
    ]
  },
  Culinary: {
    strengths: [
      "Hands-on creative profession",
      "Global career mobility",
      "Entrepreneurship opportunities",
      "High demand in hospitality sector"
    ],
    improve: [
      "Learn modern plating & presentation",
      "Develop kitchen management skills"
    ]
  },
  Sports: {
    strengths: [
      "Performance-driven recognition",
      "Strong discipline & teamwork",
      "Coaching and mentoring pathways",
      "Health & fitness industry growth"
    ],
    improve: [
      "Document achievements professionally",
      "Develop sports analytics awareness"
    ]
  },
  Healthcare: {
    strengths: [
      "High social impact profession",
      "Stable global demand",
      "Respected and trusted career",
      "Diverse specialization options"
    ],
    improve: [
      "Improve patient communication skills",
      "Stay updated with medical technology"
    ]
  },
  Education: {
    strengths: [
      "Knowledge sharing and mentorship",
      "Long-term societal contribution",
      "Stable career progression",
      "Academic specialization pathways"
    ],
    improve: [
      "Adopt modern teaching tools",
      "Develop digital learning content"
    ]
  },
  Teaching: {
    strengths: [
      "Knowledge sharing and mentorship",
      "Long-term societal contribution",
      "Stable career progression",
      "Academic specialization pathways"
    ],
    improve: [
      "Adopt modern teaching tools",
      "Develop digital learning content"
    ]
  },
  Music: {
    strengths: [
      "Creative performance career",
      "Global audience reach",
      "Multiple revenue streams",
      "Artistic identity development"
    ],
    improve: [
      "Build digital presence",
      "Expand genre versatility"
    ]
  },
  Security: {
    strengths: [
      "Critical organizational role",
      "High demand in digital era",
      "Strong risk management impact",
      "Government & corporate opportunities"
    ],
    improve: [
      "Upgrade cybersecurity tools knowledge",
      "Gain certifications"
    ]
  },
  Academic: {
    strengths: [
      "Research and innovation focus",
      "Thought leadership opportunities",
      "Global collaboration",
      "Publication-driven recognition"
    ],
    improve: [
      "Increase research publications",
      "Strengthen grant writing skills"
    ]
  },
  "Project Management": {
    strengths: [
      "Cross-functional team coordination",
      "Strategic planning impact",
      "Budget and timeline management",
      "High organizational value"
    ],
    improve: [
      "Master agile methodologies",
      "Develop stakeholder negotiation skills"
    ]
  }
};

export default function CareerInsights({ domain }) {
  const data = careerInsights[domain] || careerInsights.IT;

  return (
    <div className="bg-[#0f172a] dark:bg-white/5 border border-[#1e293b] dark:border-white/10 rounded-xl p-4 mb-4">
      <h3 className="text-sm font-semibold text-[#93c5fd] dark:text-blue-400 mb-3 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" />
        Career Insights
      </h3>

      {/* Strengths */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-[#22c55e] mb-2 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Why this career fits you
        </h4>
        <ul className="space-y-1 pl-4">
          {data.strengths.map((strength, i) => (
            <li key={i} className="text-xs text-[#cbd5e1] dark:text-white/70 list-disc">
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div>
        <h4 className="text-xs font-semibold text-[#f59e0b] mb-2">
          What to improve
        </h4>
        <ul className="space-y-1 pl-4">
          {data.improve.map((item, i) => (
            <li key={i} className="text-xs text-[#cbd5e1] dark:text-white/70 list-disc">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}