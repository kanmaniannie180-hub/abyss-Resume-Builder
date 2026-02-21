import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export default function FloatingContact({ email, phone, name }) {
  const [toast, setToast] = React.useState('');

  const validEmail = email && email.includes('@') && email.includes('.');
  const validPhone = phone && phone.length >= 8;

  const handleEmail = () => {
    if (!validEmail) {
      setToast('❌ No valid email available');
      setTimeout(() => setToast(''), 2000);
      return;
    }

    const subject = encodeURIComponent("You're Hired 🎉");
    const body = encodeURIComponent(
      `Hello ${name || ''},\n\nWe are pleased to inform you that we would like to discuss an opportunity with you.\n\nBest regards`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const copyPhone = async () => {
    if (!validPhone) {
      setToast('❌ No phone number available');
      setTimeout(() => setToast(''), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(phone);
      setToast('📋 Phone copied to clipboard!');
      setTimeout(() => setToast(''), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = phone;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setToast('📋 Phone copied to clipboard!');
      setTimeout(() => setToast(''), 2000);
    }
  };

  if (!validEmail && !validPhone) return null;

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8 flex flex-col gap-3 z-40"
      >
        {/* WhatsApp */}
        {validPhone && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyPhone}
            className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
            title="Copy WhatsApp Number"
          >
            <MessageCircle className="h-5 w-5" />
          </motion.button>
        )}

        {/* Call */}
        {validPhone && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyPhone}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
            title="Copy Phone Number"
          >
            <Phone className="h-5 w-5" />
          </motion.button>
        )}
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 right-8 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}