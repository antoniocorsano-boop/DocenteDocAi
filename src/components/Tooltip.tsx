import React from 'react';

interface TooltipProps {
  label: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ label, children, position = 'top' }) => {
  const [visible, setVisible] = React.useState(false);
  let timeout: number | undefined;

  const show = () => {
    timeout = window.setTimeout(() => setVisible(true), 350);
  };
  const hide = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <span className="m3-tooltip-wrapper" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} tabIndex={0}>
      {children}
      {visible && (
        <span className={`m3-tooltip m3-tooltip-${position}`} role="tooltip">
          {label}
        </span>
      )}
      <style>{`
        .m3-tooltip-wrapper { position: relative; display: inline-block; outline: none; }
        .m3-tooltip {
          position: absolute;
          z-index: 3000;
          background: var(--sys-on-surface, #222);
          color: var(--sys-surface, #fff);
          font-size: 0.92rem;
          font-weight: 500;
          padding: 0.38em 1em;
          border-radius: var(--md-corner-8); /* MD3 fix */
          box-shadow: var(--md-elevation-1); /* MD3 fix */
          white-space: pre;
          pointer-events: none;
          opacity: 0.97;
          animation: tooltip-in 0.18s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .m3-tooltip-top { left: 50%; bottom: 120%; transform: translateX(-50%); margin-bottom: 8px; }
        .m3-tooltip-bottom { left: 50%; top: 120%; transform: translateX(-50%); margin-top: 8px; }
        .m3-tooltip-left { right: 120%; top: 50%; transform: translateY(-50%); margin-right: 8px; }
        .m3-tooltip-right { left: 120%; top: 50%; transform: translateY(-50%); margin-left: 8px; }
        @keyframes tooltip-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 0.97; transform: scale(1); }
        }
      `}</style>
    </span>
  );
};

export default Tooltip;
