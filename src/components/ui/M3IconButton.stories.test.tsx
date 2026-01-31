/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

import { renderWithM3Theme } from './test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import M3IconButton from './M3IconButton';

describe('M3IconButton Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(
      <M3IconButton icon="test-icon" ariaLabel="Test button" />
    );
    expect(container).toMatchSnapshot();
  });
});









// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
