import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, MessageSquare, Send, Loader2, 
  Lightbulb, Check, Copy, RefreshCw
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { generateSuggestions } from './suggestionsDB';
import { isAutofillRequest, parseFillCommand, buildResumeFromCommand } from './resumeMocks';
import { getContextualPrompts, promptCategories } from './chatPrompts';

const domainSuggestions = {
  IT: {
    summary: [
      "Add years of experience with specific technologies",
      "Mention impact metrics (e.g., 'improved performance by 40%')",
      "Include cloud platforms you're proficient with",
      "Highlight leadership or mentorship experience",
      "Reference domain expertise (Frontend/Backend/Full-stack)",
      "Add certifications if relevant (AWS, Azure, GCP)",
      "Mention team collaboration and Agile experience",
      "Include technical depth (languages, frameworks, tools)",
      "Highlight problem-solving abilities with examples",
      "Reference scalability or performance achievements"
    ],
    skills: [
      "JavaScript/TypeScript", "React/Vue/Angular", "Node.js/Python/Go",
      "AWS/GCP/Azure", "Docker/Kubernetes", "CI/CD", "SQL/NoSQL",
      "REST APIs", "GraphQL", "Agile/Scrum", "Git", "Jenkins",
      "Terraform", "MongoDB", "PostgreSQL", "Redis", "Microservices",
      "System Design", "TDD/BDD", "Linux", "Nginx"
    ],
    experience: [
      "Start bullets with action verbs (Built, Developed, Led)",
      "Include quantifiable results and metrics",
      "Mention team size if you led projects",
      "Reference technologies used in each role",
      "Add context: problem → action → result",
      "Use numbers: X% faster, Y users, Z uptime",
      "Mention cross-functional collaboration",
      "Highlight innovations or process improvements",
      "Include code review or mentoring experience",
      "Reference production systems and scale"
    ],
    projects: [
      "Describe the problem solved and your approach",
      "Include tech stack and architecture decisions",
      "Add links to live demos or GitHub repos",
      "Mention user impact or performance gains",
      "Explain your specific role and contributions",
      "Add deployment and hosting details",
      "Include testing strategies used",
      "Mention challenges overcome"
    ]
  },
  Culinary: {
    summary: [
      "Highlight signature cuisines and cooking styles",
      "Mention awards, certifications, or notable restaurants",
      "Include leadership roles (Head Chef, Sous Chef)",
      "Reference menu development experience",
      "Add training background (culinary school, apprenticeships)",
      "Mention specialization (fine dining, catering, pastry)",
      "Include customer satisfaction or ratings",
      "Reference food cost management skills",
      "Add kitchen innovation examples",
      "Mention health and safety certifications"
    ],
    skills: [
      "Menu Development", "Food Costing", "Kitchen Management",
      "HACCP Certification", "Pastry Arts", "Garde Manger",
      "Wine Pairing", "Team Leadership", "Inventory Control",
      "Plating", "Butchery", "Sous Vide", "Molecular Gastronomy",
      "Vendor Relations", "Staff Training", "Recipe Development"
    ],
    experience: [
      "Mention covers served per night",
      "Include menu items you created",
      "Reference cost savings achieved",
      "Highlight team sizes managed",
      "Add revenue or profit improvements",
      "Mention customer reviews or ratings",
      "Include kitchen efficiency improvements",
      "Reference special dietary accommodations"
    ],
    projects: [
      "Describe signature dishes created",
      "Include special events catered",
      "Mention menu redesign projects",
      "Reference pop-up experiences",
      "Add collaborations with other chefs",
      "Include media features or publications"
    ]
  },
  Arts: {
    summary: [
      "Define your artistic identity and style",
      "Mention mediums and techniques mastered",
      "Include notable exhibitions or collections",
      "Reference commissions or collaborations"
    ],
    skills: [
      "Oil Painting", "Digital Art", "Sculpture", "Installation",
      "Printmaking", "Mixed Media", "Art Direction", "Curation",
      "Adobe Creative Suite", "3D Modeling"
    ],
    experience: [
      "List exhibitions with venues and dates",
      "Include collections that acquired your work",
      "Mention commissions and their scale",
      "Reference teaching or workshop experience"
    ],
    projects: [
      "Describe concept and execution",
      "Include dimensions and materials",
      "Mention reception or reviews",
      "Reference sales or awards"
    ]
  },
  Teacher: {
    summary: [
      "Specify subjects and grade levels",
      "Mention teaching methodologies used",
      "Include student achievement improvements",
      "Reference curriculum development"
    ],
    skills: [
      "Curriculum Design", "Classroom Management", "Differentiated Instruction",
      "Assessment Design", "IEP Development", "EdTech Tools",
      "Parent Communication", "Student Mentoring", "Data Analysis"
    ],
    experience: [
      "Include student achievement metrics",
      "Mention class sizes and demographics",
      "Reference programs you developed",
      "Highlight extracurricular leadership"
    ],
    projects: [
      "Describe innovative teaching methods",
      "Include outcomes and student feedback",
      "Mention grants or funding secured",
      "Reference published materials"
    ]
  },
  Dance: {
    summary: [
      "Define your dance styles and specialties",
      "Mention notable companies or productions",
      "Include choreography credits",
      "Reference training and certifications"
    ],
    skills: [
      "Ballet", "Contemporary", "Jazz", "Hip-Hop", "Ballroom",
      "Choreography", "Dance Pedagogy", "Movement Direction",
      "Improvisation", "Physical Theatre"
    ],
    experience: [
      "List productions and roles performed",
      "Include companies you've danced with",
      "Mention tours and venues",
      "Reference choreography commissions"
    ],
    projects: [
      "Describe original choreography",
      "Include premiere venues and dates",
      "Mention cast sizes and reviews",
      "Reference video/film work"
    ]
  }
};

const keywordMap = {
  tech: ['python', 'react', 'developer', 'software', 'cloud', 'ai', 'code', 'frontend', 'backend', 'data'],
  business: ['manager', 'operations', 'finance', 'sales', 'business', 'leadership', 'strategy'],
  creative: ['design', 'artist', 'creative', 'media', 'visual', 'illustration', 'brand'],
  culinary: ['chef', 'kitchen', 'culinary', 'restaurant', 'cook', 'menu', 'cuisine'],
  education: ['teacher', 'education', 'curriculum', 'student', 'classroom', 'teaching'],
  sports: ['athlete', 'training', 'coach', 'sports', 'fitness', 'performance'],
  security: ['security', 'safety', 'surveillance', 'protection', 'officer']
};

function detectDomain(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  
  for (const domain in keywordMap) {
    if (keywordMap[domain].some(k => lower.includes(k))) {
      return domain;
    }
  }
  return null;
}

export default function AIAssistant({ focusedField, domain, resumeData, onResumeUpdate }) {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [smartSuggestions, setSmartSuggestions] = useState([]);

  // Generate smart AI suggestions
  useEffect(() => {
    const suggestions = generateSuggestions(resumeData, domain);
    setSmartSuggestions(suggestions);
  }, [domain, resumeData.summary, resumeData.skills, resumeData.role, resumeData.experience]);

  // Detect domain from resume text
  const resumeText = `${resumeData.name} ${resumeData.role} ${resumeData.summary} ${(resumeData.skills || []).join(' ')}`;
  const detectedDomain = detectDomain(resumeText);
  const activeDomain = detectedDomain || domain;
  
  const suggestions = domainSuggestions[activeDomain] || domainSuggestions.IT;
  const currentSuggestions = suggestions[focusedField] || suggestions.summary;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Check for autofill request
    if (isAutofillRequest(userMessage)) {
      const cmd = parseFillCommand(userMessage);
      const autoData = buildResumeFromCommand(cmd, domain);
      
      if (onResumeUpdate) {
        onResumeUpdate(prev => ({
          ...prev,
          ...autoData,
          domain: cmd.domain || prev.domain || domain
        }));
      }
      
      const domainName = cmd.domain || domain;
      const levelName = cmd.level === 'student' ? 'Student' : 'Professional';
      const customizations = [];
      
      if (cmd.name) customizations.push(`name set to **${cmd.name}**`);
      if (cmd.domain) customizations.push(`domain set to **${domainName}**`);
      
      const customText = customizations.length > 0 
        ? `\n\nCustomizations: ${customizations.join(', ')}.`
        : '';
      
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✨ I've filled your resume with a **${levelName} ${domainName}** profile!${customText}\n\nYou can now edit any section to personalize it. The template and suggestions have been adapted to match this domain.` 
      }]);
      setIsLoading(false);
      return;
    }

    try {
      const resumeContext = `
Current resume data:
- Name: ${resumeData.name || 'Not set'}
- Role: ${resumeData.role || 'Not set'}
- Summary: ${resumeData.summary || 'Not set'}
- Skills: ${(resumeData.skills || []).join(', ') || 'Not set'}
- Experience: ${resumeData.experience?.length || 0} entries
- Education: ${resumeData.education?.length || 0} entries
- Projects: ${resumeData.projects?.length || 0} entries
`.trim();

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Abyss AI, an expert career assistant for resume writing. The user is creating a ${domain} resume.

${resumeContext}

User question: ${userMessage}

Provide helpful, actionable advice. Be concise but thorough. Focus on ATS optimization, impact metrics, and professional language. If the user asks about their current resume, reference the specific data above.`,
        add_context_from_internet: false
      });

      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasContent = resumeData?.name || resumeData?.summary || resumeData?.skills?.length > 0;
  const contextualPrompts = getContextualPrompts(focusedField, domain, hasContent);
  const quickPrompts = contextualPrompts.slice(0, 8);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0B1F3B]/50 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#14B8A6] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white">Abyss AI</h3>
            <p className="text-[10px] text-slate-500 dark:text-white/50">Resume Assistant</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-2 bg-slate-100 dark:bg-white/5 flex-shrink-0">
          <TabsTrigger value="suggestions" className="flex-1 text-xs">
            <Lightbulb className="h-3 w-3 mr-1" /> Suggestions
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex-1 text-xs">
            <MessageSquare className="h-3 w-3 mr-1" /> Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="flex-1 flex flex-col overflow-hidden m-0 p-4 pt-2">
          <div className="mb-3 flex-shrink-0">
            <Badge variant="outline" className="text-[10px] text-[#2563EB] border-[#2563EB]/30 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              AI Suggestions for {domain}
            </Badge>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {smartSuggestions.map((suggestion, i) => (
                <div 
                  key={i}
                  className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg text-[11px] text-slate-600 dark:text-white/70 flex items-start gap-2 group cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors leading-relaxed"
                  onClick={() => handleCopy(suggestion, i)}
                >
                  <Lightbulb className="h-3 w-3 text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{suggestion}</span>
                  {copiedIndex === i ? (
                    <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                  ) : (
                    <Copy className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  )}
                </div>
              ))}

            {/* Skill suggestions for skills field */}
            {focusedField === 'skills' && (
              <div className="mt-4">
                <p className="text-[10px] text-slate-500 dark:text-white/50 mb-2">Recommended for {activeDomain}:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestions.skills.map((skill, i) => (
                    <Badge 
                      key={i}
                      variant="outline"
                      className="text-[10px] cursor-pointer hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-colors"
                      onClick={() => handleCopy(skill, i + 100)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 pt-2 pb-3">
            {chatMessages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-[11px] font-semibold text-slate-600 dark:text-white/70">Quick Actions:</p>
                
                {/* Contextual Prompts */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {quickPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setChatInput(prompt);
                          setTimeout(() => handleChat(), 100);
                        }}
                        className="px-2 py-1 text-[10px] bg-gradient-to-r from-blue-50 to-purple-50 dark:from-white/5 dark:to-white/5 hover:from-blue-100 hover:to-purple-100 dark:hover:from-white/10 dark:hover:to-white/10 text-blue-700 dark:text-white/80 rounded-md transition-all border border-blue-200/50 dark:border-white/10"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categorized Prompts */}
                <div className="space-y-2.5 mt-4">
                  {Object.entries(promptCategories).map(([category, prompts]) => (
                    <div key={category}>
                      <p className="text-[9px] font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wide mb-1.5">
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {prompts.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setChatInput(prompt);
                              setTimeout(() => handleChat(), 100);
                            }}
                            className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/70 rounded transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-2">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-xl text-[11px] leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-[#2563EB] text-white px-3 py-2.5' 
                          : 'bg-white dark:bg-white/5 text-slate-700 dark:text-white/90 border border-slate-200 dark:border-white/10 px-3 py-2.5 shadow-sm'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown
                          className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                          components={{
                            h1: ({children}) => <h1 className="text-xs font-bold text-[#0B1F3B] dark:text-white mb-1.5 uppercase tracking-wide">{children}</h1>,
                            h2: ({children}) => <h2 className="text-xs font-semibold text-[#0B1F3B] dark:text-white mb-1.5">{children}</h2>,
                            h3: ({children}) => <h3 className="text-[11px] font-semibold text-slate-600 dark:text-white/70 mb-1">{children}</h3>,
                            p: ({children}) => <p className="mb-1.5 leading-relaxed text-[11px]">{children}</p>,
                            strong: ({children}) => <strong className="font-semibold text-[#2563EB] dark:text-[#60A5FA]">{children}</strong>,
                            ul: ({children}) => <ul className="space-y-0.5 my-1.5 ml-3">{children}</ul>,
                            ol: ({children}) => <ol className="space-y-0.5 my-1.5 ml-3 list-decimal">{children}</ol>,
                            li: ({children}) => <li className="text-[10px] leading-relaxed">• {children}</li>,
                            code: ({inline, children}) => inline ? (
                              <code className="px-1 py-0.5 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] rounded text-[10px] font-mono">{children}</code>
                            ) : (
                              <code className="block bg-slate-100 dark:bg-white/5 p-1.5 rounded text-[10px] my-1.5">{children}</code>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing your resume...
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-slate-200 dark:border-white/10 pt-3 px-4 pb-3 bg-white dark:bg-[#0B1F3B]/50">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChat()}
              placeholder="Ask Abyss AI..."
              className="text-xs bg-slate-50 dark:bg-white/5 flex-1 h-9"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={handleChat}
              disabled={isLoading || !chatInput.trim()}
              className="bg-[#2563EB] hover:bg-[#1d4ed8] h-9 w-9 flex-shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}