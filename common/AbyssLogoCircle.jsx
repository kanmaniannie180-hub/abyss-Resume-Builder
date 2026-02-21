import React from 'react';

export default function AbyssLogoCircle({ size = 'splash' }) {
  const sizeClasses = {
    splash: 'w-40 h-40',
    nav: 'w-9 h-9',
    profile: 'w-20 h-20'
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center flex-shrink-0`}
      style={{
        background: 'radial-gradient(circle at 30% 30%, #eaf2ff, #cddcff)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.25), inset 0 2px 6px rgba(255,255,255,0.4), 0 0 40px rgba(168, 85, 247, 0.2)'
      }}
    >
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6996cf9fa9acf20b3ad3d828/28392be20_image.png"
        alt="Abyss"
        className="w-[85%] h-[85%] object-contain"
      />
    </div>
  );
}