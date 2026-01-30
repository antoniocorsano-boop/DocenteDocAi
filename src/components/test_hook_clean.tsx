// Test file for Phase 6 Hook Testing - Clean MD3 Compliant Code
// This file follows MD3 guidelines to test successful commits

import React from 'react';

export const TestCleanComponent: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--app-color-surface)',
        padding: 'var(--app-spacing-container)',
        borderRadius: 'var(--md-sys-shape-corner-medium)'
      }}
    >
      <span
        style={{
          color: 'var(--app-color-on-surface)',
          fontFamily: 'var(--md-sys-typescale-body-large-font-family)',
          fontSize: 'var(--app-text-body)'
        }}
      >
        This should pass ESLint checks
      </span>
    </div>
  );
};

