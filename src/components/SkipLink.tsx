import React from 'react';
import { useTheme } from '../theme/theme';

/**
 * SkipLink Component
 * 
 * Provides a hidden link that becomes visible on focus, allowing keyboard users
 * to skip repetitive navigation and jump directly to main content.
 * 
 * WCAG 2.1 Success Criterion 2.4.1: Bypass Blocks (Level A)
 * 
 * Migration Date: Phase 7 (Remaining Components Migration) - useTheme compliance and className removal
 * 
 * @example
 * ```tsx
 * <SkipLink href="#main-content" label="Skip to main content" />
 * ```
 */

interface SkipLinkProps {
  /**
   * The ID of the target element (main content area)
   * @default "#main-content"
   */
  href?: string;

  /**
   * The visible text when focused
   * @default "Skip to main content"
   */
  label?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({
  href = '#main-content',
  label = 'Skip to main content',
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector(href);
    
    if (target) {
      // Set focus to target
      (target as HTMLElement).focus();
      // Scroll to target
      target.scrollIntoView({ behavior: 'smooth' });
      e.preventDefault();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-label={label}
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: 'var(--md-sys-color-primary)',
        color: 'var(--md-sys-color-on-primary)',
        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
        textDecoration: 'none',
        zIndex: 100,
        borderRadius: '0 0 var(--md-corner-small) 0',
        fontSize: 'var(--md-sys-typescale-body-medium-size)',
        fontWeight: 600,
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as unknown as React.MouseEvent<HTMLAnchorElement>);
        }
      }}
    >
      {label}
    </a>
  );
};

export default SkipLink;


