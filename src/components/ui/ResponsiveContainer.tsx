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
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: 'var(--md-sys-percent-100)'
  };

  return (
    <div
      style={{
        width: 'var(--md-sys-percent-100)',
        maxWidth: maxWidthMap[maxWidth],
        margin: centered ? '0 var(--md-sys-margin-auto)' : '0',
        padding: padding ? 'var(--md-sys-spacing-4)' : '0'
      }}
    >
      {children}
    </div>
  );
};

const getBreakpoint = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
};

export const useBreakpoint = (): { breakpoint: 'mobile' | 'tablet' | 'desktop'; isMobile: boolean; isTablet: boolean; isDesktop: boolean; isTouchDevice: boolean } => {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>(getBreakpoint);

  React.useEffect(() => {
    const updateBreakpoint = () => setBreakpoint(getBreakpoint());
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
