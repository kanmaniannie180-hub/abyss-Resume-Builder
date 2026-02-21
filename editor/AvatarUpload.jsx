import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AvatarUpload({ name, imageUrl, onImageChange }) {
  const [uploading, setUploading] = useState(false);

  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AB';

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onImageChange(file_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
  };

  return (
    <div className="relative w-28 h-28 group">
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-[#0B1F3B] shadow-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </>
      ) : (
        <div 
          className="w-full h-full rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-white dark:border-[#0B1F3B] shadow-lg"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)' }}
        >
          {initials}
        </div>
      )}

      {/* Upload Overlay */}
      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center cursor-pointer transition-opacity">
        <Camera className="h-8 w-8 text-white" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      {uploading && (
        <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}