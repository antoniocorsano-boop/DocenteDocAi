import React from 'react';
import { render } from '@testing-library/react';
import ThinkingIndicator from './ThinkingIndicator';

describe('ThinkingIndicator Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<ThinkingIndicator />);
    expect(container).toMatchSnapshot();
  });
});
