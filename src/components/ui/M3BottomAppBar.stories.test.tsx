import React from 'react';
import { render } from '@testing-library/react';
import M3BottomAppBar from './M3BottomAppBar';

describe('M3BottomAppBar Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<M3BottomAppBar>Test</M3BottomAppBar>);
    expect(container).toMatchSnapshot();
  });
});
