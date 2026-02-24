import { renderWithM3Theme } from './test-utils';
import React from 'react';
import { render } from '@testing-library/react';
import M3Chip from './M3Chip';

describe('M3Chip Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<M3Chip label="Test Chip" />);
    expect(container).toMatchSnapshot();
  });
});






