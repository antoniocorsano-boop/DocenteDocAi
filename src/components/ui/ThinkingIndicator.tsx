import React from 'react';

interface ThinkingIndicatorProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  message = "Pensando...",
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30 ${className}`}>
      {/* Animated dots */}
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* Message */}
      <span className={`m3-thinking-indicator ${sizeClasses[size]} text-on-surface-variant`}>
        {message}
      </span>

      {/* Optional AI icon */}
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center ml-auto">
        <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
      </div>
    </div>
  );
};

export default ThinkingIndicator;