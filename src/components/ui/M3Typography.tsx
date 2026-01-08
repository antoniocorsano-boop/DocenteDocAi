import React from 'react';

export interface M3TypographyProps {
  variant: 'display-large' | 'display-medium' | 'display-small' |
           'headline-large' | 'headline-medium' | 'headline-small' |
           'title-large' | 'title-medium' | 'title-small' |
           'body-large' | 'body-medium' | 'body-small' |
           'label-large' | 'label-medium' | 'label-small';
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const M3Typography: React.FC<M3TypographyProps> = ({
  variant,
  children,
  style = {},
  className = ''
}) => {
  const baseClass = `m3-${variant.replace('-', '-')}`;

  return (
    <span
      className={`${baseClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </span>
  );
};

export default M3Typography;