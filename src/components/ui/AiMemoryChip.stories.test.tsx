import React from 'react';
import { render } from '@testing-library/react';
import AiMemoryChip from './AiMemoryChip';

describe('AiMemoryChip Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<AiMemoryChip label="Test Context" />);
    expect(container).toMatchSnapshot();
  });
});
