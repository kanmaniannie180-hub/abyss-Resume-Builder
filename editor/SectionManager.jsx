import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Award, Trophy, Book, Globe, Heart, FileText, Languages, Sparkles } from 'lucide-react';

const SECTION_LIBRARY = [
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'awards', label: 'Awards', icon: Trophy },
  { id: 'publications', label: 'Publications', icon: Book },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'volunteer', label: 'Volunteer Experience', icon: Heart },
  { id: 'portfolio', label: 'Portfolio', icon: FileText },
  { id: 'interests', label: 'Interests', icon: Sparkles },
  { id: 'training', label: 'Training & Workshops', icon: Globe }
];

export default function SectionManager({ onAddSection, existingSections = [] }) {
  const [showModal, setShowModal] = useState(false);

  const availableSections = SECTION_LIBRARY.filter(
    section => !existingSections.includes(section.id)
  );

  const handleAddSection = (section) => {
    onAddSection({
      id: section.id,
      title: section.label,
      type: 'custom',
      items: []
    });
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        className="w-full border-dashed border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Section
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            {availableSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleAddSection(section)}
                  className="p-4 border border-slate-200 dark:border-white/10 rounded-lg hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-all text-left group"
                >
                  <Icon className="h-5 w-5 text-slate-400 group-hover:text-[#2563EB] mb-2" />
                  <p className="text-sm font-medium text-[#0B1F3B] dark:text-white">
                    {section.label}
                  </p>
                </button>
              );
            })}
          </div>

          {availableSections.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">
              All available sections have been added
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}