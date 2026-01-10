import React from 'react';
import { render } from '@testing-library/react';
import M3Popover from './M3Popover';

describe('M3Popover Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<M3Popover open={false} anchorEl={null} onClose={() => {}}>Content</M3Popover>);
    expect(container).toMatchSnapshot();
  });
});
