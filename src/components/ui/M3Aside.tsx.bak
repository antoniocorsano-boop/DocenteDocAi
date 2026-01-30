// MD3 Gold Compliant
// M3Aside - Semantic aside with MD3 styling
import React from 'react';

export interface M3AsideProps {
  children: React.ReactNode;
  flex?: string;
  flexBasis?: string;
  background?: string;
  borderRight?: string;
  zIndex?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export const M3Aside: React.FC<M3AsideProps> = ({
  children,
  flex = 'var(--md-sys-flex-none)',
  flexBasis,
  background = 'var(--md-sys-color-surface)',
  borderRight,
  zIndex,
  style,
  ...ariaProps
}) => {
  return (
    <aside
      style={{
        flex,
        flexBasis,
        background,
        borderRight,
        zIndex,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        ...style
      }}
      {...ariaProps}
    >
      {children}
    </aside>
  );
};

export default M3Aside;
