import React from 'react';

export type M3BottomAppBarProps = React.HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

const baseStyle: React.CSSProperties = {
  width: '100%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '0.75rem 1rem',
  backgroundColor: '#fff',
  borderTop: '1px solid #e0e0e0',
  boxSizing: 'border-box',
};

function M3BottomAppBar({ children, elevated, style, className, ...props }: M3BottomAppBarProps) {
  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        boxShadow: elevated ? '0 -2px 8px rgba(0,0,0,0.12)' : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default M3BottomAppBar;
