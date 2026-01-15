import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import M3Menu from './M3Menu';

describe('M3Menu Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<M3Menu items={[]} open={false} onClose={() => {}} />);
    expect(container).toMatchSnapshot();
  });
});





