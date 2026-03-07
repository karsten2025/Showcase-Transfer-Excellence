import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { legalMappings } from '../legalMappings';

interface LegalTooltipProps {
  paramKey: 'haertefallAlter' | 'transferDauer' | 'nettoAufstockung' | 'abfindungsfaktor' | 'sprinterPraemie' | 'qualifizierungsBudget';
}

export const LegalTooltip: React.FC<LegalTooltipProps> = ({ paramKey }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mapping = legalMappings[paramKey];

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        left: rect.left,
        top: rect.top - 8,
      });
    }
  };

  const handleShow = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    updatePosition();
    setVisible(true);
  };

  const handleHide = () => {
    hideTimeoutRef.current = setTimeout(() => setVisible(false), 100);
  };

  useEffect(() => {
    if (visible) updatePosition();
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [visible]);

  if (!mapping) return null;

  const tooltipContent = (
    <div
      className="fixed z-[9999] w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-2xl text-left"
      style={{
        left: position.left,
        top: position.top,
        transform: 'translateY(-100%)',
      }}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
    >
      <p className="text-xs font-bold text-indigo-600 mb-1">{mapping.quelle}</p>
      <p className="text-xs text-slate-600 mb-1">{mapping.beschreibung}</p>
      <p className="text-[10px] text-slate-500 font-mono">{mapping.link}</p>
      {/* Pfeil nach unten zum §-Icon */}
      <div
        className="absolute left-6 -bottom-2 w-3 h-3 rotate-45 bg-white border-r border-b border-slate-200 shadow-[2px_2px_2px_rgba(0,0,0,0.05)]"
        aria-hidden
      />
    </div>
  );

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        className="text-slate-400 hover:text-blue-600 hover:drop-shadow-[0_0_6px_rgba(37,99,235,0.6)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1 font-serif text-sm transition-all duration-200"
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
        aria-label={`Rechtliche Grundlage: ${mapping.quelle}`}
      >
        §
      </button>
      {visible &&
        createPortal(
          tooltipContent,
          document.body
        )}
    </div>
  );
};
