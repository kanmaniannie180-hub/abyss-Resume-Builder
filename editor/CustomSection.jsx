import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X, Award } from 'lucide-react';

export default function CustomSection({ 
  section, 
  data, 
  onUpdate, 
  onFocus 
}) {
  const items = data || [];

  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    onUpdate(updated);
  };

  const addItem = () => {
    const template = getItemTemplate(section.id);
    onUpdate([...items, template]);
  };

  const removeItem = (index) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const getItemTemplate = (sectionId) => {
    switch (sectionId) {
      case 'certifications':
        return { name: '', issuer: '', year: '' };
      case 'awards':
        return { title: '', organization: '', year: '' };
      case 'publications':
        return { title: '', publisher: '', year: '' };
      case 'languages':
        return { language: '', proficiency: '' };
      case 'volunteer':
        return { organization: '', role: '', period: '', description: '' };
      case 'training':
        return { name: '', provider: '', year: '' };
      case 'interests':
        return { name: '' };
      default:
        return { title: '', description: '' };
    }
  };

  const renderItem = (item, index) => {
    const sectionId = section.id;

    if (sectionId === 'certifications') {
      return (
        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="Certification Name"
            value={item.name || ''}
            onChange={(e) => updateItem(index, 'name', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
          <Input
            placeholder="Issuer"
            value={item.issuer || ''}
            onChange={(e) => updateItem(index, 'issuer', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
          <Input
            placeholder="Year"
            value={item.year || ''}
            onChange={(e) => updateItem(index, 'year', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
        </div>
      );
    }

    if (sectionId === 'awards') {
      return (
        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="Award Title"
            value={item.title || ''}
            onChange={(e) => updateItem(index, 'title', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
          <Input
            placeholder="Organization"
            value={item.organization || ''}
            onChange={(e) => updateItem(index, 'organization', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
          <Input
            placeholder="Year"
            value={item.year || ''}
            onChange={(e) => updateItem(index, 'year', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
        </div>
      );
    }

    if (sectionId === 'publications') {
      return (
        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="Publication Title"
            value={item.title || ''}
            onChange={(e) => updateItem(index, 'title', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm col-span-2"
          />
          <Input
            placeholder="Year"
            value={item.year || ''}
            onChange={(e) => updateItem(index, 'year', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
          <Input
            placeholder="Publisher"
            value={item.publisher || ''}
            onChange={(e) => updateItem(index, 'publisher', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm col-span-3"
          />
        </div>
      );
    }

    if (sectionId === 'languages') {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Language"
            value={item.language || ''}
            onChange={(e) => updateItem(index, 'language', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
          <Input
            placeholder="Proficiency (e.g., Native, Fluent)"
            value={item.proficiency || ''}
            onChange={(e) => updateItem(index, 'proficiency', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
        </div>
      );
    }

    if (sectionId === 'volunteer') {
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Organization"
              value={item.organization || ''}
              onChange={(e) => updateItem(index, 'organization', e.target.value)}
              className="bg-white dark:bg-white/5 text-sm"
            />
            <Input
              placeholder="Role"
              value={item.role || ''}
              onChange={(e) => updateItem(index, 'role', e.target.value)}
              className="bg-white dark:bg-white/5 text-sm"
            />
          </div>
          <Input
            placeholder="Period (e.g., 2020-2022)"
            value={item.period || ''}
            onChange={(e) => updateItem(index, 'period', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
          <Textarea
            placeholder="Description..."
            value={item.description || ''}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
            onFocus={() => onFocus?.(section.id)}
            className="bg-white dark:bg-white/5 text-sm h-16"
          />
        </div>
      );
    }

    if (sectionId === 'training') {
      return (
        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="Training Name"
            value={item.name || ''}
            onChange={(e) => updateItem(index, 'name', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm col-span-2"
          />
          <Input
            placeholder="Year"
            value={item.year || ''}
            onChange={(e) => updateItem(index, 'year', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm"
          />
          <Input
            placeholder="Provider"
            value={item.provider || ''}
            onChange={(e) => updateItem(index, 'provider', e.target.value)}
            className="bg-white dark:bg-white/5 text-sm col-span-3"
          />
        </div>
      );
    }

    if (sectionId === 'interests') {
      return (
        <Input
          placeholder="Interest"
          value={item.name || ''}
          onChange={(e) => updateItem(index, 'name', e.target.value)}
          className="bg-white dark:bg-white/5 text-sm"
        />
      );
    }

    // Default template
    return (
      <div className="space-y-2">
        <Input
          placeholder="Title"
          value={item.title || ''}
          onChange={(e) => updateItem(index, 'title', e.target.value)}
          className="bg-white dark:bg-white/5 text-sm"
        />
        <Textarea
          placeholder="Description..."
          value={item.description || ''}
          onChange={(e) => updateItem(index, 'description', e.target.value)}
          onFocus={() => onFocus?.(section.id)}
          className="bg-white dark:bg-white/5 text-sm h-16"
        />
      </div>
    );
  };

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg mb-3 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 z-10"
            onClick={() => removeItem(i)}
          >
            <X className="h-3 w-3" />
          </Button>
          {renderItem(item, i)}
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4 mr-1" /> Add {section.title}
      </Button>
    </div>
  );
}