/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */

import { renderWithM3Theme } from '../ui/test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import DonutChart from './DonutChart';

describe('DonutChart Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<DonutChart data={[{label: 'Test', value: 10, color: 'var(--md-sys-color-primary)'}]} />);
    expect(container).toMatchSnapshot();
  });
});









// TODO: Add Playwright snapshot test and link to CHECKLIST.md phase X
