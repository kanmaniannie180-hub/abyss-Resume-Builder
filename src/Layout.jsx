import React from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AuthProvider } from '@/components/context/AuthContext';
import CustomCursor from '@/components/common/CustomCursor';

export default function Layout({ children, currentPageName }) {
  // Pages that should not have any layout wrapper
  const fullScreenPages = ['Splash', 'Editor', 'Preview', 'Portfolio'];

  return (
    <ThemeProvider>
      <AuthProvider>
        <CustomCursor />
        <style>{`
          :root {
            --color-navy: #0B1F3B;
            --color-blue: #2563EB;
            --color-teal: #14B8A6;
            --color-white: #F8FAFC;
          }
          
          .dark {
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
          }
          
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(37, 99, 235, 0.3) transparent;
          }
          
          *::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          *::-webkit-scrollbar-track {
            background: transparent;
          }
          
          *::-webkit-scrollbar-thumb {
            background-color: rgba(37, 99, 235, 0.3);
            border-radius: 3px;
          }
          
          *::-webkit-scrollbar-thumb:hover {
            background-color: rgba(37, 99, 235, 0.5);
          }
        `}</style>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}