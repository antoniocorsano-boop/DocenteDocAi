// MD3 Gold Compliant
// FlexContainer - Explicit flex layout component using MD3 tokens only
import React from 'react';

export interface M3FlexContainerProps {
  children: React.ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flex?: string;
  minHeight?: string;
  background?: string;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  gap?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  role?: string;
}

export const M3FlexContainer: React.FC<M3FlexContainerProps> = ({
  children,
  direction = 'row',
  flex = 'var(--md-sys-flex-auto)',
  minHeight,
  background,
  justifyContent,
  alignItems,
  gap,
  style,
  ...ariaProps
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        flex,
        minHeight,
        background,
        justifyContent,
        alignItems,
        gap,
        ...style
      }}
      {...ariaProps}
    >
      {children}
    </div>
  );
};

export default M3FlexContainer;
