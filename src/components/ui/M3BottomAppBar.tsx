import React from 'react';

export type M3BottomAppBarProps = React.HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

const baseStyle: React.CSSProperties = {
  width: '100%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--md-sys-spacing-3)',
  padding: 'var(--md-sys-spacing-3) var(--md-sys-spacing-4)',
  backgroundColor: 'var(--md-sys-color-surface)',
  borderTop: '1px solid var(--md-sys-color-outline-variant)',
  boxSizing: 'border-box',
};

function M3BottomAppBar({ children, elevated, style, className, ...props }: M3BottomAppBarProps): React.ReactElement {
  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        boxShadow: elevated ? 'var(--md-sys-elevation2)' : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default M3BottomAppBar;
