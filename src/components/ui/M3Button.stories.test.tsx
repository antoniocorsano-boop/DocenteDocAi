import React from 'react';
import { render } from '@testing-library/react';
import M3Button from './M3Button';

describe('M3Button Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<M3Button>Click me</M3Button>);
    expect(container).toMatchSnapshot();
  });
});
