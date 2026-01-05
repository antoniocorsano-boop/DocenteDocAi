import React from 'react';

/**
 * SkipLink Component
 * 
 * Provides a hidden link that becomes visible on focus, allowing keyboard users
 * to skip repetitive navigation and jump directly to main content.
 * 
 * WCAG 2.1 Success Criterion 2.4.1: Bypass Blocks (Level A)
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

  /**
   * CSS class for custom styling
   */
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({
  href = '#main-content',
  label = 'Skip to main content',
  className = '',
}) => {
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
      className={`skip-link ${className}`}
      aria-label={label}
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: 'var(--sys-primary)',
        color: 'var(--sys-on-primary)',
        padding: '8px 16px',
        textDecoration: 'none',
        zIndex: 100,
        borderRadius: '0 0 4px 0',
        fontSize: '14px',
        fontWeight: 600,
        // Show on focus
        '&:focus': {
          top: 0,
        },
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as any);
        }
      }}
    >
      {label}
    </a>
  );
};

export default SkipLink;
