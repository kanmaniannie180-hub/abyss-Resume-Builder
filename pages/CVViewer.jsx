import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, Download, ArrowLeft } from 'lucide-react';
import ResumePreview from '@/components/editor/ResumePreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TEMPLATES = {
  't1': { name: 'Modern Pro', color: '#2563EB' },
  't2': { name: 'Executive', color: '#0B1F3B' },
  't3': { name: 'Creative Flow', color: '#14B8A6' },
};

export default function CVViewer() {
  const { resumeId } = useParams();
  const [generating, setGenerating] = useState(false);
  const previewRef = React.useRef(null);

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list()
  });

  const resume = resumes.find(r => r.id === resumeId);
  const template = resume?.templateId ? TEMPLATES[resume.templateId] : TEMPLATES['t1'];

  const generatePDF = async () => {
    if (!previewRef.current || !resume) return;
    
    setGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resume.name.replace(/\s+/g, '_')}_CV.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Resume not found</p>
          <Link to={createPageUrl('Home')}>
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">
            {resume.name} - CV
          </h1>
          <Button onClick={generatePDF} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </header>

      {/* CV Preview */}
      <div className="max-w-4xl mx-auto py-8">
        <div ref={previewRef} className="bg-white shadow-lg">
          <ResumePreview 
            data={resume}
            template={template}
            version={resume.version}
          />
        </div>
      </div>
    </div>
  );
}