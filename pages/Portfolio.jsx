import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Linkedin, MessageCircle } from "lucide-react";
import FloatingContact from "@/components/common/FloatingContact";

export default function Portfolio() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const [name, setName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState(null);

  const { data: resume, isLoading } = useQuery({
    queryKey: ['resume', id],
    queryFn: () => base44.entities.Resume.get(id),
    enabled: !!id,
    staleTime: Infinity
  });

  useEffect(() => {
    if (resume?.email) {
      setContactEmail(resume.email);
    }
  }, [resume]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    if (!contactEmail) {
      alert("Recipient email missing");
      return;
    }

    if (!name || !senderEmail || !message) {
      setFormStatus('error');
      return;
    }

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(
`Sender: ${senderEmail}

Message:
${message}`
    );

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=${subject}&body=${body}`;
    
    window.open(gmailURL, "_blank");
    
    setFormStatus('success');
    setName('');
    setSenderEmail('');
    setMessage('');
    setTimeout(() => setFormStatus(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No portfolio data found</p>
          <Button onClick={() => navigate(createPageUrl('Editor'))}>
            Go to Editor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header with glass effect */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto py-4 px-6 flex justify-between items-center">
          <Link
            to={createPageUrl("Editor") + `?version=${resume.version}`}
            className="group flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Editor
          </Link>
          <nav className="flex gap-8 text-sm font-medium">
            <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all">About</a>
            <a href="#experience" className="text-slate-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all">Experience</a>
            <a href="#projects" className="text-slate-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all">Projects</a>
            <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero with gradient */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-5" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            initial={false} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block"
            >
              <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full shadow-lg">
                ✨ Available for opportunities
              </span>
            </motion.div>
            
            <h1 className="text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              Hi, I'm {resume.name}
            </h1>
            
            <p className="text-2xl text-slate-600 max-w-2xl font-light">
              {resume.role}
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="inline-block">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Get in Touch</h3>
                <p className="text-sm text-slate-600 mb-4">Available for opportunities</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {resume.linkedin && (
                  <motion.a
                    href={resume.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-3 bg-[#0A66C2] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </motion.a>
                )}
              </div>
            </div>
            
            {/* Contact Info Display */}
            {(resume.email || resume.phone || resume.location) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Contact Information</h3>
                <div className="space-y-2.5 text-sm">
                  {resume.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <a 
                        href={`mailto:${resume.email}`} 
                        className="hover:text-blue-600 transition-colors break-all"
                        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                      >
                        {resume.email}
                      </a>
                    </div>
                  )}
                  {resume.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <a href={`tel:${resume.phone}`} className="hover:text-blue-600 transition-colors">
                        {resume.phone}
                      </a>
                    </div>
                  )}
                  {resume.location && (
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600">📍</span>
                      <span className="text-slate-600">{resume.location}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* About with card design */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-12 flex flex-col justify-center"
              >
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4">About Me</span>
                <h2 className="text-4xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Passionate & Driven
                </h2>
                {resume.summary ? (
                  <>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">{resume.summary}</p>
                    {resume.skills.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {resume.skills.slice(0, 6).map((skill, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-500 mb-3">Add a professional summary</p>
                    <Link to={createPageUrl('Editor') + `?version=${resume.version}`}>
                      <Button size="sm" variant="outline">Add Summary</Button>
                    </Link>
                  </div>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 flex items-center justify-center"
              >
                <div className="w-full h-full flex items-center justify-center">
                  {resume.profileImage ? (
                    <img 
                      src={resume.profileImage} 
                      alt={resume.name}
                      className="w-80 h-80 object-cover rounded-2xl shadow-2xl"
                    />
                  ) : (
                    <div className="w-72 h-72 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                      <span className="text-8xl text-white font-bold">
                        {resume.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience with timeline */}
      <section id="experience" className="py-24 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Career Journey</span>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-2">
                Experience
              </h2>
            </div>
            
            {resume.experience.length > 0 ? (
              <div className="space-y-8 relative">
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-500 hidden md:block" />
                
                {resume.experience.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="md:ml-20 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border border-slate-100">
                      <div className="absolute left-8 top-8 w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full hidden md:block shadow-lg" style={{ marginLeft: '-40px' }} />
                      
                      <div className="flex flex-col md:flex-row md:justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-1">{exp.role || 'Role'}</h3>
                          <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {exp.company || 'Company'}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-sm font-medium rounded-full mt-2 md:mt-0 w-fit">
                          {exp.startDate || ''} - {exp.endDate || 'Present'}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{exp.description || ''}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 mb-4">Add your work experience</p>
                <Link to={createPageUrl('Editor') + `?version=${resume.version}`}>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Add Experience</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Projects grid */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Portfolio</span>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-2">
                Featured Projects
              </h2>
            </div>
            
            {resume.projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {resume.projects.map((project, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-slate-100"
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/80">{project.title?.charAt(0) || 'P'}</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {project.title || 'Project'}
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-4">{project.description || ''}</p>
                      
                      {project.tech && project.tech.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map((t, j) => (
                            <span 
                              key={j} 
                              className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium rounded-lg border border-blue-100"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all group-hover:text-purple-600"
                        >
                          View Project 
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-500 mb-4">Share your projects</p>
                <Link to={createPageUrl('Editor') + `?version=${resume.version}`}>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">Add Projects</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact with form */}
      <section id="contact" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bTAtOHYyaDJ2LTJoLTJ6bTQgNHYyaDJ2LTJoLTJ6bS00LTR2Mmgydi0yaC0yem0wIDh2Mmgydi0yaC0yem00LTR2Mmgydi0yaC0yem0tNCA0djJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-xl text-white text-sm font-semibold rounded-full mb-6">
                Get in Touch
              </span>
              <h2 className="text-5xl font-bold text-white mb-4">
                Let's Work Together
              </h2>
              <p className="text-xl text-white/90 font-light">
                Have a question or want to collaborate? Send me a message!
              </p>
            </div>

            {/* Contact Form */}
            <motion.form
              onSubmit={handleContactSubmit}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 space-y-4"
            >
              <div>
                <label className="block text-white text-sm font-medium mb-2">Your Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Sender Email</label>
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Recipient Email</label>
                <Input
                  type="email"
                  value={contactEmail}
                  readOnly
                  className="bg-white/10 border-white/20 text-white/70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Message</label>
                <Textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
              >
                {formStatus === 'success' ? '✓ Message Sent!' : formStatus === 'error' ? '✗ Error - Try Again' : 'Send Message'}
              </Button>
            </motion.form>

            {/* Social Links */}
            <div className="flex justify-center gap-6 mt-12">
              {resume.email && (
                <motion.a 
                  href={`mailto:${resume.email}?subject=${encodeURIComponent('Regarding Opportunities')}&body=${encodeURIComponent(`Hello ${resume.name.split(' ')[0]},\n\nI came across your portfolio and would like to connect regarding potential opportunities.\n\nBest regards`)}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-6 py-3 bg-white/10 backdrop-blur-xl text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  Email
                </motion.a>
              )}
              {resume.linkedin && (
                <motion.a 
                  href={resume.linkedin} 
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-6 py-3 bg-white/10 backdrop-blur-xl text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  LinkedIn
                </motion.a>
              )}
              {resume.github && (
                <motion.a 
                  href={resume.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-6 py-3 bg-white/10 backdrop-blur-xl text-white font-medium rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  GitHub
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-slate-400">
            © 2026 {resume.name} • Built with <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-semibold">Abyss</span>
          </p>
        </div>
      </footer>

      {/* Floating Contact Bar */}
      <FloatingContact 
        email={resume.email}
        phone={resume.phone}
        linkedin={resume.linkedin}
        name={resume.name}
      />
    </div>
  );
}