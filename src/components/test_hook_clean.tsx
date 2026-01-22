// Test file for Phase 6 Hook Testing - Clean MD3 Compliant Code
// This file follows MD3 guidelines to test successful commits

import React from 'react';

export const TestCleanComponent: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--md-sys-color-surface)',
        padding: 'var(--md-sys-spacing-4)',
        borderRadius: 'var(--md-sys-shape-corner-medium)'
      }}
    >
      <span
        style={{
          color: 'var(--md-sys-color-on-surface)',
          fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
          fontSize: 'var(--md-sys-typescale-body-large-font-size)'
        }}
      >
        This should pass ESLint checks
      </span>
    </div>
  );
};