// MD3 Compliant M3CircularProgress Component
// Indeterminate circular progress indicator per MD3 spec
import React from 'react';

export interface M3CircularProgressProps {
  size?: 'small' | 'medium' | 'large';
  'aria-label'?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP = {
  small: 24,
  medium: 40,
  large: 56,
};

const M3CircularProgress: React.FC<M3CircularProgressProps> = ({
  size = 'medium',
  'aria-label': ariaLabel = 'Loading',
  style,
}) => {
  const px = SIZE_MAP[size];
  const stroke = px / 8;
  const r = (px - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <svg
      role="progressbar"
      aria-label={ariaLabel}
      aria-busy="true"
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      style={{
        animationName: 'md3-circular-spin',
        animationDuration: 'var(--md-sys-motion-duration-extra-long4)',
        animationTimingFunction: 'var(--md-sys-motion-easing-standard)',
        animationIterationCount: 'infinite',
        ...style,
      }}
    >
      <style>{`
        @keyframes md3-circular-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes md3-circular-dash {
          0% { stroke-dashoffset: ${circumference}; }
          50% { stroke-dashoffset: ${circumference * 0.25}; }
          100% { stroke-dashoffset: ${circumference}; }
        }
      `}</style>
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        fill="none"
        stroke="var(--md-sys-color-primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.75}
        style={{
          animationName: 'md3-circular-dash',
          animationDuration: 'var(--md-sys-motion-duration-extra-long4)',
          animationTimingFunction: 'var(--md-sys-motion-easing-emphasized)',
          animationIterationCount: 'infinite',
        }}
      />
    </svg>
  );
};

export default M3CircularProgress;
