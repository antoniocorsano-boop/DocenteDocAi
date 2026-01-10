import React from 'react';
import { render } from '@testing-library/react';
import M3Menu from './M3Menu';

describe('M3Menu Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<M3Menu items={[]} open={false} onClose={() => {}} />);
    expect(container).toMatchSnapshot();
  });
});
