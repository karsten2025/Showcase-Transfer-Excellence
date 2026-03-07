import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  ariaLabel?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  ariaLabel = 'Weitere Informationen',
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const tooltipContent = (
    <div
      className="fixed z-[9999] w-52 min-w-[10rem] max-w-[14rem] rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-lg text-left"
      style={{
        left: position.left,
        top: position.top,
        transform: 'translateY(-100%)',
      }}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
    >
      <p className="text-xs text-slate-600 leading-relaxed whitespace-normal break-words">
        {text}
      </p>
      <div
        className="absolute left-6 -bottom-2 w-3 h-3 rotate-45 bg-slate-50 border-r border-b border-slate-200 shadow-[2px_2px_2px_rgba(0,0,0,0.05)]"
        aria-hidden
      />
    </div>
  );

  return (
    <div className="relative inline-flex shrink-0">
      <button
        ref={buttonRef}
        type="button"
        className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/30 rounded p-0.5 transition-colors duration-200"
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
        aria-label={ariaLabel}
      >
        <Info className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
      {visible && createPortal(tooltipContent, document.body)}
    </div>
  );
};
