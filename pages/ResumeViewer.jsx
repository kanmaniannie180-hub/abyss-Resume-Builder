import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, FileText } from 'lucide-react';
import ResumePreview from '@/components/editor/ResumePreview';

const TEMPLATES = {
  't1': { name: 'Modern Pro', color: '#2563EB' },
  't2': { name: 'Executive', color: '#0B1F3B' },
  't3': { name: 'Creative Flow', color: '#14B8A6' },
};

export default function ResumeViewer() {
  const { resumeId } = useParams();

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list()
  });

  const resume = resumes.find(r => r.id === resumeId);
  const template = resume?.templateId ? TEMPLATES[resume.templateId] : TEMPLATES['t1'];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto py-4 px-6 flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">
            {resume.name} - Resume {resume.version}
          </h1>
          <Link to={createPageUrl('CVViewer') + `/${resumeId}`}>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View as PDF
            </Button>
          </Link>
        </div>
      </header>

      {/* Resume Preview */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
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