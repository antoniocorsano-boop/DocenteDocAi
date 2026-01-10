import React from 'react';
import { render } from '@testing-library/react';
import ActionTile from './ActionTile';

describe('ActionTile Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<ActionTile title="Test Action" subtitle="Test subtitle" onClick={() => {}} />);
    expect(container).toMatchSnapshot();
  });
});
