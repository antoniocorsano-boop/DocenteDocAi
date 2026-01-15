import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import M3RatingBar from './M3RatingBar';

describe('M3RatingBar Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<M3RatingBar value={3} />);
    expect(container).toMatchSnapshot();
  });
});





