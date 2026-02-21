import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, FileDown, Globe, QrCode, Linkedin,
  Download, Share2, Loader2, CheckCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ThemeToggle from '@/components/ui/ThemeToggle';
import ResumePreview from '@/components/editor/ResumePreview';
import ATSScore from '@/components/preview/ATSScore';
import BiasAnalysis from '@/components/preview/BiasAnalysis';
import SalaryEstimate from '@/components/preview/SalaryEstimate';
import JobAlerts from '@/components/preview/JobAlerts';
import CareerInsights from '@/components/preview/CareerInsights';

const TEMPLATES = {
  't1': { name: 'Modern Pro', color: '#2563EB' },
  't2': { name: 'Executive', color: '#0B1F3B' },
  't3': { name: 'Creative Flow', color: '#14B8A6' },
  't4': { name: 'Minimal Edge', color: '#6366F1' },
  't5': { name: 'Tech Stack', color: '#0EA5E9' },
  't6': { name: 'Culinary Classic', color: '#DC2626' },
  't7': { name: 'Performer', color: '#EC4899' },
  't8': { name: 'Scholar', color: '#0B1F3B' },
  't9': { name: 'Developer', color: '#22C55E' },
  't10': { name: 'Artist Portfolio', color: '#8B5CF6' },
  't11': { name: 'Chef Signature', color: '#F59E0B' },
  't12': { name: 'Choreographer', color: '#6366F1' },
};

export default function Preview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const initialVersion = params.get('version') || 'A';
  
  const [selectedVersion, setSelectedVersion] = useState(initialVersion);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState({});
  const previewRef = useRef(null);

  const { data: resumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list()
  });

  const selectedResume = resumes.find(r => r.version === selectedVersion) || {};
  const template = TEMPLATES[selectedResume.templateId] || TEMPLATES['t1'];

  const validateForExport = () => {
    const errors = [];
    if (!selectedResume.name) errors.push('name');
    if (!selectedResume.role) errors.push('role');
    if (!selectedResume.summary || selectedResume.summary.length < 30) errors.push('summary');
    if (!selectedResume.skills || selectedResume.skills.length < 3) errors.push('skills');
    return errors;
  };

  const handleGenerateCV = async () => {
    const errors = validateForExport();
    if (errors.length > 0) {
      alert(`Please complete required fields: ${errors.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create PDF
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 25.4;
      const contentWidth = pageWidth - (margin * 2);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, margin, contentWidth, pageHeight - (margin * 2));

      pdf.setTextColor(11, 31, 59);
      let yPos = margin + 15;

      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(selectedResume.name || '', margin + 10, yPos);
      yPos += 8;

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(37, 99, 235);
      pdf.text(selectedResume.role || '', margin + 10, yPos);
      yPos += 10;

      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      const contactLine = [selectedResume.email, selectedResume.phone, selectedResume.location].filter(Boolean).join(' • ');
      pdf.text(contactLine, margin + 10, yPos);
      yPos += 12;

      if (selectedResume.summary) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(11, 31, 59);
        pdf.text('SUMMARY', margin + 10, yPos);
        yPos += 5;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        const summaryLines = pdf.splitTextToSize(selectedResume.summary, contentWidth - 20);
        pdf.text(summaryLines, margin + 10, yPos);
        yPos += (summaryLines.length * 4) + 8;
      }

      if (selectedResume.skills?.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(11, 31, 59);
        pdf.text('SKILLS', margin + 10, yPos);
        yPos += 5;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text(selectedResume.skills.join(' • '), margin + 10, yPos);
        yPos += 10;
      }

      if (selectedResume.experience?.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(11, 31, 59);
        pdf.text('EXPERIENCE', margin + 10, yPos);
        yPos += 5;
        
        selectedResume.experience.forEach((exp) => {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.text(exp.role || '', margin + 10, yPos);
          yPos += 4;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(37, 99, 235);
          pdf.text(`${exp.company || ''} • ${exp.startDate || ''} - ${exp.endDate || 'Present'}`, margin + 10, yPos);
          yPos += 4;
          
          pdf.setTextColor(80, 80, 80);
          const descLines = pdf.splitTextToSize(exp.description || '', contentWidth - 20);
          pdf.text(descLines, margin + 10, yPos);
          yPos += (descLines.length * 4) + 6;
        });
      }

      if (selectedResume.education?.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(11, 31, 59);
        pdf.text('EDUCATION', margin + 10, yPos);
        yPos += 5;
        
        selectedResume.education.forEach((edu) => {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.text(edu.degree || '', margin + 10, yPos);
          yPos += 4;
          
          pdf.setFont('helvetica', 'normal');
          pdf.text(`${edu.institution || ''} • ${edu.year || ''}`, margin + 10, yPos);
          yPos += 6;
        });
      }

      if (selectedResume.projects?.length > 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(11, 31, 59);
        pdf.text('PROJECTS', margin + 10, yPos);
        yPos += 5;
        
        selectedResume.projects.forEach((proj) => {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.text(proj.title || '', margin + 10, yPos);
          yPos += 4;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(80, 80, 80);
          const projLines = pdf.splitTextToSize(proj.description || '', contentWidth - 20);
          pdf.text(projLines, margin + 10, yPos);
          yPos += (projLines.length * 4) + 2;
          
          if (proj.tech?.length > 0) {
            pdf.setFontSize(8);
            pdf.setTextColor(120, 120, 120);
            pdf.text(`Tech: ${proj.tech.join(', ')}`, margin + 10, yPos);
            yPos += 6;
          }
        });
      }

      // Convert to blob and upload
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `cv_${selectedResume.id}.pdf`, { type: 'application/pdf' });
      
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Save URL to resume
      await base44.entities.Resume.update(selectedResume.id, {
        cvUrl: file_url
      });
      
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setGeneratedItems(prev => ({ ...prev, cv: true }));
      
      // Download file
      pdf.save(`${selectedResume.name || 'Resume'}_${selectedVersion}_CV.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const buildPortfolioData = (resumeData) => {
    return {
      id: resumeData?.id ?? "demo",
      version: selectedVersion,
      name: resumeData?.name ?? "John Doe",
      role: resumeData?.role ?? "Professional",
      email: resumeData?.email ?? "",
      phone: resumeData?.phone ?? "",
      location: resumeData?.location ?? "",
      summary: resumeData?.summary ?? "",
      profileImage: resumeData?.profileImage ?? "",
      skills: resumeData?.skills ?? [],
      experience: resumeData?.experience ?? [],
      projects: resumeData?.projects ?? [],
      education: resumeData?.education ?? [],
      linkedin: resumeData?.linkedin ?? "",
      github: resumeData?.github ?? "",
    };
  };

  const handleGeneratePortfolio = () => {
    const errors = validateForExport();
    if (errors.length > 0) {
      alert(`Please complete required fields: ${errors.join(', ')}`);
      return;
    }

    if (!selectedResume?.id) {
      alert('Resume not found');
      return;
    }

    navigate(`${createPageUrl('Portfolio')}?id=${selectedResume.id}`);
  };

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setGeneratedItems(prev => ({ ...prev, qr: true }));
    setIsGenerating(false);

    // Navigate to share page
    navigate(`${createPageUrl('Share')}?version=${selectedVersion}`);
  };

  const handleExportResume = async () => {
    const errors = validateForExport();
    if (errors.length > 0) {
      alert(`Please complete required fields: ${errors.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    
    try {
      const element = previewRef.current;
      if (!element) {
        alert('Preview not found');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Convert to blob and upload
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `resume_${selectedResume.id}.pdf`, { type: 'application/pdf' });
      
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Save URL to resume
      await base44.entities.Resume.update(selectedResume.id, {
        resumePdfUrl: file_url
      });
      
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setGeneratedItems(prev => ({ ...prev, resume: true }));
      
      // Download file
      pdf.save(`${selectedResume.name || 'Resume'}_${selectedVersion}.pdf`);
    } catch (error) {
      console.error('Resume PDF generation failed:', error);
      alert('Failed to generate Resume PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLinkedIn = () => {
    const portfolioUrl = `${window.location.origin}${createPageUrl('Portfolio')}?id=${selectedResume.id}`;
    window.open(`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Portfolio&certUrl=${encodeURIComponent(portfolioUrl)}`, '_blank');
  };

  return (
    <div className="h-screen bg-[#F8FAFC] dark:bg-[#0B1F3B] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-[#0B1F3B]/80 border-b border-slate-200 dark:border-white/5 flex items-center px-4 gap-4 flex-shrink-0">
        <Link to={createPageUrl('Editor')}>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <h1 className="font-semibold text-[#0B1F3B] dark:text-white">Preview & Export</h1>

        {/* Resume A/B Toggle */}
        <Tabs value={selectedVersion} onValueChange={setSelectedVersion}>
          <TabsList className="h-8 bg-slate-100 dark:bg-white/5">
            <TabsTrigger value="A" className="text-xs h-6 px-3 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
              Resume A
            </TabsTrigger>
            <TabsTrigger value="B" className="text-xs h-6 px-3 data-[state=active]:bg-[#14B8A6] data-[state=active]:text-white">
              Resume B
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1" />
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Resume Preview */}
        <div className="flex-1 bg-slate-100 dark:bg-[#0B1F3B]/50 overflow-auto p-6">
          <div className="max-w-[595px] mx-auto" ref={previewRef}>
            {selectedResume.name ? (
              <ResumePreview data={selectedResume} template={template} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                    <FileDown className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No Resume {selectedVersion} found</p>
                  <Link to={createPageUrl('Editor')}>
                    <Button className="mt-4 bg-[#2563EB]">Create Resume</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Insights & Actions */}
        <div className="w-[400px] border-l border-slate-200 dark:border-white/5 flex-shrink-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* Insights */}
              <div>
                <h2 className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mb-3">
                  Insights
                </h2>
                <div className="space-y-4">
                  <CareerInsights domain={selectedResume.domain || 'IT'} />
                  
                  <div>
                    <ATSScore resumeData={selectedResume} />
                    <Link to={createPageUrl('ATSPage') + `?version=${selectedVersion}`}>
                      <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                        View ATS Analysis <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div>
                    <BiasAnalysis resumeData={selectedResume} />
                    <Link to={createPageUrl('BiasPage') + `?version=${selectedVersion}`}>
                      <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                        View Bias Analysis <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                      </Button>
                    </Link>
                  </div>
                  
                  <SalaryEstimate resumeData={selectedResume} domain={selectedResume.domain || 'IT'} />
                </div>
              </div>

              {/* Job Alerts */}
              <div>
                <h2 className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mb-3">
                  Job Opportunities
                </h2>
                <JobAlerts resumeData={selectedResume} domain={selectedResume.domain || 'IT'} />
              </div>

              {/* Outputs */}
              <div>
                <h2 className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider mb-3">
                  Outputs
                </h2>
                <div className="space-y-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full justify-start bg-[#2563EB] hover:bg-[#1d4ed8] transition-all duration-300"
                      onClick={handleGenerateCV}
                      disabled={isGenerating}
                    >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : generatedItems.cv ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <FileDown className="h-4 w-4 mr-2" />
                    )}
                    Generate CV PDF
                    </Button>
                    </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full justify-start bg-[#14B8A6] hover:bg-[#0d9488] transition-all duration-300"
                      onClick={handleGeneratePortfolio}
                      disabled={isGenerating}
                    >
                    {generatedItems.portfolio ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <Globe className="h-4 w-4 mr-2" />
                    )}
                    Generate Portfolio
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleGenerateQR}
                  >
                    {generatedItems.qr ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <QrCode className="h-4 w-4 mr-2" />
                    )}
                    Generate QR Code
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleLinkedIn}
                  >
                    <Linkedin className="h-4 w-4 mr-2 text-[#0A66C2]" />
                    Share to LinkedIn
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-[#0f172a] hover:bg-[#1e293b] text-white border-[#334155]"
                    onClick={async () => {
                      await handleExportResume();
                      window.open('https://www.naukri.com/mnjuser/profile', '_blank');
                    }}
                    disabled={isGenerating}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Resume {selectedVersion} to Naukri
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                    onClick={handleExportResume}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : generatedItems.resume ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export Resume PDF
                    </Button>
                    </motion.div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}