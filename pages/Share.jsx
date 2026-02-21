import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, Copy, CheckCircle, Linkedin, 
  Download, QrCode, Share2, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Share() {
  const params = new URLSearchParams(window.location.search);
  const version = params.get('version') || 'A';

  const [copied, setCopied] = useState(false);

  const { data: resumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list()
  });

  const resume = resumes.find(r => r.version === version) || {};
  
  // Frozen QR URLs using useRef - NEVER change once set
  const qrLinksRef = useRef(null);
  
  if (!qrLinksRef.current && resume?.id) {
    const portfolioUrl = `${window.location.origin}${createPageUrl('Portfolio')}?id=${resume.id}`;
    
    qrLinksRef.current = {
      cvUrl: resume.cvUrl || '',
      resumePdfUrl: resume.resumePdfUrl || '',
      portfolioUrl,
      qrCodeCV: resume.cvUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(resume.cvUrl)}` : '',
      qrCodeResume: resume.resumePdfUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(resume.resumePdfUrl)}` : ''
    };
  }

  const { cvUrl = '', resumePdfUrl = '', portfolioUrl = '', qrCodeCV = '', qrCodeResume = '' } = qrLinksRef.current || {};

  const handleCopy = () => {
    if (portfolioUrl) {
      navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkedIn = () => {
    if (portfolioUrl) {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`, '_blank');
    }
  };

  const handleDownloadCV = () => {
    if (resume?.id) {
      window.location.href = createPageUrl('CVViewer') + `/${resume.id}`;
    }
  };

  const downloadQR = (url, name) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.name || 'Resume'}_${name}_QR.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1F3B]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B1F3B]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Preview')}>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-[#0B1F3B] dark:text-white">Share Resume {version}</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {!resume.name ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center">
              <Share2 className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-white/50 mb-4">No resume found to share</p>
            <Link to={createPageUrl('Editor')}>
              <Button className="bg-[#2563EB]">Create Resume</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#0B1F3B] dark:text-white mb-2">QR Codes</h2>
              <p className="text-slate-500 dark:text-white/50">Download and share your resume in multiple formats</p>
            </div>



            {/* 2 QR Codes Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* CV PDF QR */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="flex flex-col items-center gap-2 text-[#0B1F3B] dark:text-white">
                      <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                        <Download className="h-5 w-5 text-[#2563EB]" />
                      </div>
                      <span className="text-sm">CV PDF</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {qrCodeCV ? (
                      <>
                        <div className="p-3 bg-white rounded-lg shadow-md mb-3">
                          <img 
                            src={qrCodeCV} 
                            alt="CV PDF QR Code"
                            className="w-32 h-32"
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-white/50 text-center mb-3">
                          Scan to download CV
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-xs"
                          onClick={() => downloadQR(qrCodeCV, 'CV')}
                        >
                          <Download className="h-3 w-3 mr-1" /> Download
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-xs text-slate-500 dark:text-white/50 mb-3">
                          Generate CV PDF first
                        </p>
                        <Link to={createPageUrl('Preview') + `?version=${version}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Generate PDF
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resume PDF QR */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="flex flex-col items-center gap-2 text-[#0B1F3B] dark:text-white">
                      <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center">
                        <Download className="h-5 w-5 text-[#14B8A6]" />
                      </div>
                      <span className="text-sm">Resume PDF</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    {qrCodeResume ? (
                      <>
                        <div className="p-3 bg-white rounded-lg shadow-md mb-3">
                          <img 
                            src={qrCodeResume} 
                            alt="Resume PDF QR Code"
                            className="w-32 h-32"
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-white/50 text-center mb-3">
                          Scan to download PDF
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-xs"
                          onClick={() => downloadQR(qrCodeResume, 'Resume')}
                        >
                          <Download className="h-3 w-3 mr-1" /> Download
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-xs text-slate-500 dark:text-white/50 mb-3">
                          Generate Resume PDF first
                        </p>
                        <Link to={createPageUrl('Preview') + `?version=${version}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Generate PDF
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Share Links Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0B1F3B] dark:text-white">
                    <Share2 className="h-5 w-5 text-[#14B8A6]" />
                    Share & Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-white/50 mb-1 block">Portfolio Link</label>
                    <div className="flex gap-2">
                      <Input 
                        value={portfolioUrl}
                        readOnly
                        className="bg-slate-50 dark:bg-white/5 text-sm"
                      />
                      <Button 
                        variant="outline"
                        onClick={handleCopy}
                        className="flex-shrink-0"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <Button 
                      className="w-full justify-start bg-[#0A66C2] hover:bg-[#004182]"
                      onClick={handleLinkedIn}
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      Share to LinkedIn
                    </Button>

                    <Link to={createPageUrl('Preview') + `?version=${version}`}>
                      <Button 
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Generate CV PDF
                      </Button>
                    </Link>

                    {resume?.id && (
                     <Link to={`${createPageUrl('Portfolio')}?id=${resume.id}`}>
                       <Button 
                         variant="outline"
                         className="w-full justify-start"
                       >
                         <Globe className="h-4 w-4 mr-2" />
                         View Portfolio
                       </Button>
                     </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resume Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-[#0B1F3B] to-[#1e3a5f] text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {resume.profileImage ? (
                      <img 
                        src={resume.profileImage} 
                        alt={resume.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-[#2563EB] to-[#14B8A6]"
                      >
                        {(resume.name || 'JD').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{resume.name}</h3>
                      <p className="text-[#14B8A6]">{resume.role}</p>
                      <div className="flex gap-4 mt-2 text-sm text-white/60">
                        {resume.email && <span>{resume.email}</span>}
                        {resume.location && <span>{resume.location}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/50">Resume Version</p>
                      <p className="text-2xl font-bold text-[#14B8A6]">{version}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}