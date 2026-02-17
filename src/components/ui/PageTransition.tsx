// MD3 Gold Compliant
// Page transition wrapper con fade effect
// Audit: febbraio 2026

import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  isLoading?: boolean;
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isLoading = false,
  duration = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade in
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Reset on loading
  useEffect(() => {
    if (isLoading) {
      setIsVisible(false);
    } else {
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity ${duration}ms var(--md-sys-motion-easing-standard), transform ${duration}ms var(--md-sys-motion-easing-standard)`
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
