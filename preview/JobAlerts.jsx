import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Building2, ExternalLink } from 'lucide-react';

// India-only job listings
const jobDatabase = {
  IT: [
    { title: 'Senior Software Engineer', company: 'Infosys', location: 'Bangalore, India', type: 'Full-time', match: 95 },
    { title: 'Full Stack Developer', company: 'TCS', location: 'Hyderabad, India', type: 'Full-time', match: 92 },
    { title: 'Frontend Developer', company: 'Wipro', location: 'Pune, India', type: 'Full-time', match: 88 },
    { title: 'Backend Engineer', company: 'Razorpay', location: 'Bangalore, India', type: 'Full-time', match: 85 },
    { title: 'DevOps Engineer', company: 'Paytm', location: 'Noida, India', type: 'Full-time', match: 82 },
    { title: 'Software Architect', company: 'HCL Technologies', location: 'Chennai, India', type: 'Full-time', match: 80 },
    { title: 'React Developer', company: 'Zomato', location: 'Gurugram, India', type: 'Full-time', match: 78 },
    { title: 'Tech Lead', company: 'Flipkart', location: 'Bangalore, India', type: 'Full-time', match: 75 },
    { title: 'Junior Developer', company: 'Freshworks', location: 'Chennai, India', type: 'Full-time', match: 72 },
    { title: 'API Developer', company: 'CRED', location: 'Bangalore, India', type: 'Full-time', match: 70 },
    { title: 'Mobile Developer', company: 'Dream11', location: 'Mumbai, India', type: 'Full-time', match: 68 },
  ],
  Culinary: [
    { title: 'Head Chef', company: 'Taj Hotels', location: 'Mumbai, India', type: 'Full-time', match: 95 },
    { title: 'Sous Chef', company: 'ITC Hotels', location: 'Delhi, India', type: 'Full-time', match: 90 },
    { title: 'Executive Chef', company: 'Oberoi Hotels', location: 'Bangalore, India', type: 'Full-time', match: 88 },
    { title: 'Pastry Chef', company: 'Leela Palace', location: 'Udaipur, India', type: 'Full-time', match: 85 },
    { title: 'Line Cook', company: 'Social Offline', location: 'Pune, India', type: 'Full-time', match: 80 },
    { title: 'Catering Chef', company: 'Foodhall', location: 'Mumbai, India', type: 'Full-time', match: 78 },
    { title: 'Private Chef', company: 'Elite Catering', location: 'Delhi, India', type: 'Full-time', match: 75 },
    { title: 'Kitchen Manager', company: 'Zomato Kitchen', location: 'Gurugram, India', type: 'Full-time', match: 72 },
    { title: 'Recipe Developer', company: 'MTR Foods', location: 'Bangalore, India', type: 'Contract', match: 70 },
    { title: 'Culinary Instructor', company: 'IHM Delhi', location: 'Delhi, India', type: 'Full-time', match: 68 },
    { title: 'Food Stylist', company: 'Food Network India', location: 'Mumbai, India', type: 'Freelance', match: 65 },
  ],
  Arts: [
    { title: 'Senior Art Director', company: 'Ogilvy India', location: 'Mumbai, India', type: 'Full-time', match: 95 },
    { title: 'Graphic Designer', company: 'Lenskart', location: 'Bangalore, India', type: 'Full-time', match: 90 },
    { title: 'Creative Director', company: 'DDB Mudra', location: 'Mumbai, India', type: 'Full-time', match: 88 },
    { title: 'Illustrator', company: 'Tinkle Comics', location: 'Delhi, India', type: 'Contract', match: 85 },
    { title: 'UX Designer', company: 'Swiggy', location: 'Bangalore, India', type: 'Full-time', match: 82 },
    { title: 'Brand Designer', company: 'CRED', location: 'Bangalore, India', type: 'Full-time', match: 80 },
    { title: 'Motion Designer', company: 'TVF Media', location: 'Mumbai, India', type: 'Full-time', match: 78 },
    { title: 'Exhibition Designer', company: 'National Gallery', location: 'Delhi, India', type: 'Full-time', match: 75 },
    { title: 'Art Teacher', company: 'Srishti School', location: 'Bangalore, India', type: 'Full-time', match: 72 },
    { title: 'Gallery Manager', company: 'Kochi Biennale', location: 'Kochi, India', type: 'Full-time', match: 70 },
    { title: 'Digital Artist', company: 'Zynga India', location: 'Bangalore, India', type: 'Full-time', match: 68 },
  ],
  Teacher: [
    { title: 'High School Teacher', company: 'DPS Schools', location: 'Delhi, India', type: 'Full-time', match: 95 },
    { title: 'College Professor', company: 'IIT Bombay', location: 'Mumbai, India', type: 'Full-time', match: 92 },
    { title: 'Special Education', company: 'Ryan International', location: 'Pune, India', type: 'Full-time', match: 88 },
    { title: 'Curriculum Developer', company: "Byju's", location: 'Bangalore, India', type: 'Full-time', match: 85 },
    { title: 'ESL Teacher', company: 'British Council', location: 'Delhi, India', type: 'Full-time', match: 82 },
    { title: 'Principal', company: 'Kendriya Vidyalaya', location: 'Chennai, India', type: 'Full-time', match: 80 },
    { title: 'Online Instructor', company: 'Unacademy', location: 'Remote', type: 'Part-time', match: 78 },
    { title: 'Academic Advisor', company: 'BITS Pilani', location: 'Pilani, India', type: 'Full-time', match: 75 },
    { title: 'Tutor', company: 'Vedantu', location: 'Bangalore, India', type: 'Part-time', match: 72 },
    { title: 'Department Head', company: 'St. Xavier\'s College', location: 'Mumbai, India', type: 'Full-time', match: 70 },
    { title: 'Education Consultant', company: 'ETS India', location: 'Remote', type: 'Contract', match: 68 },
  ],
  Dance: [
    { title: 'Bharatanatyam Instructor', company: 'Kalakshetra', location: 'Chennai, India', type: 'Full-time', match: 95 },
    { title: 'Choreographer', company: 'Bollywood Productions', location: 'Mumbai, India', type: 'Contract', match: 92 },
    { title: 'Dance Director', company: 'Shiamak Davar Institute', location: 'Mumbai, India', type: 'Full-time', match: 88 },
    { title: 'Hip Hop Teacher', company: 'Dance Paradise', location: 'Bangalore, India', type: 'Part-time', match: 85 },
    { title: 'Contemporary Dancer', company: 'Attakkalari', location: 'Bangalore, India', type: 'Full-time', match: 82 },
    { title: 'Dance Therapist', company: 'Fortis Healthcare', location: 'Delhi, India', type: 'Full-time', match: 80 },
    { title: 'Kathak Master', company: 'Sangeet Natak Akademi', location: 'Delhi, India', type: 'Full-time', match: 78 },
    { title: 'Fitness Instructor', company: 'Cult.fit', location: 'Bangalore, India', type: 'Part-time', match: 75 },
    { title: 'Backup Dancer', company: 'Sony TV', location: 'Mumbai, India', type: 'Contract', match: 72 },
    { title: 'Dance Judge', company: 'Dance India Dance', location: 'Mumbai, India', type: 'Freelance', match: 70 },
    { title: 'Studio Owner', company: 'Independent', location: 'Pune, India', type: 'Self-employed', match: 68 },
  ],
};

export default function JobAlerts({ resumeData, domain }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const domainJobs = jobDatabase[domain] || jobDatabase.IT;
    // Randomize match percentages slightly based on skills match
    const skillsCount = resumeData.skills?.length || 0;
    const adjustedJobs = domainJobs.map(job => ({
      ...job,
      match: Math.max(50, job.match - Math.floor(Math.random() * 10) + (skillsCount > 5 ? 5 : 0))
    })).sort((a, b) => b.match - a.match);
    
    setJobs(adjustedJobs);
  }, [domain, resumeData]);

  if (!resumeData.role) {
    return (
      <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-5">
        <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white mb-4 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#2563EB]" />
          Job Alerts
        </h3>
        <p className="text-sm text-slate-500 dark:text-white/50">
          Add your target role to see relevant job opportunities
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-[#0B1F3B] dark:text-white flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#2563EB]" />
          Job Alerts
          <Badge className="text-[10px] bg-[#2563EB]/10 text-[#2563EB]">{jobs.length} matches</Badge>
        </h3>
      </div>

      <Button
        size="sm"
        className="w-full text-xs h-8 mb-3 bg-[#0ea5e9] hover:bg-[#0284c7]"
        onClick={() => {
          const role = resumeData.role?.replace(/\s+/g, '-').toLowerCase() || 'software-engineer';
          const location = resumeData.location?.replace(/\s+/g, '-').toLowerCase() || 'bangalore';
          window.open(`https://www.naukri.com/${role}-jobs-in-${location}`, '_blank');
        }}
      >
        <ExternalLink className="h-3 w-3 mr-1" />
        View Jobs on Naukri
      </Button>

      <div className="space-y-3 max-h-80 overflow-auto pr-2">
        {jobs.map((job, i) => (
          <div 
            key={i}
            className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium text-sm text-[#0B1F3B] dark:text-white">{job.title}</h4>
              <Badge 
                variant="outline" 
                className={`text-[10px] ${
                  job.match >= 85 ? 'border-green-500 text-green-600' :
                  job.match >= 70 ? 'border-amber-500 text-amber-600' :
                  'border-slate-300 text-slate-500'
                }`}
              >
                {job.match}% match
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-white/50">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Badge variant="outline" className="text-[10px]">{job.type}</Badge>
              <ExternalLink className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}