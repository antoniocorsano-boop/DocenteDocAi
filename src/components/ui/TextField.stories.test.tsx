import React from 'react';
import { render } from '@testing-library/react';
import TextField from './TextField';

describe('TextField Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<TextField label="Test" />);
    expect(container).toMatchSnapshot();
  });
});
