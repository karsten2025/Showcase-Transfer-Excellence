import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { legalMappings } from '../legalMappings';

interface LegalLexikonProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalLexikon: React.FC<LegalLexikonProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[9998] bg-slate-900/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-4 md:inset-12 lg:inset-16 z-[9999] flex flex-col bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-labelledby="legal-lexikon-title"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <h2 id="legal-lexikon-title" className="text-lg font-bold text-slate-800 tracking-tight">
                Rechtliche Grundlagen
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {Object.entries(legalMappings).map(([key, m], i) => (
                  <motion.div
                    key={key}
                    className="rounded-lg border border-slate-100 bg-white p-6 hover:border-slate-200 transition-colors"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-slate-500 font-serif text-lg">§</span>
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                        {m.quelle}
                      </p>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-3">{m.label}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{m.beschreibung}</p>
                    <p className="mt-3 text-[10px] font-mono text-slate-400">{m.link}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Dokumentation schließen
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
