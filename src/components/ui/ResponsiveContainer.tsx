// MD3 Gold Compliant
// Container responsive con breakpoints
// Audit: febbraio 2026

import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  centered?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = true,
  centered = true
}) => {
  const maxWidthMap = {
    sm: '640px',   // Mobile landscape
    md: '768px',   // Tablet portrait
    lg: '1024px',  // Tablet landscape / Small desktop
    xl: '1280px',  // Desktop
    full: '100%'
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: maxWidthMap[maxWidth],
        margin: centered ? '0 auto' : '0',
        padding: padding ? 'var(--md-sys-spacing-4)' : '0'
      }}
    >
      {children}
    </div>
  );
};

// Hook per responsive breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isTouchDevice: breakpoint === 'mobile' || breakpoint === 'tablet'
  };
};

export default ResponsiveContainer;
