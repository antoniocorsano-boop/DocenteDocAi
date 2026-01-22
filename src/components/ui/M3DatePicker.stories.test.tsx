import { renderWithM3Theme } from './test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import M3DatePicker from './M3DatePicker';

describe('M3DatePicker Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<M3DatePicker label="Test" />);
    expect(container).toMatchSnapshot();
  });
});





