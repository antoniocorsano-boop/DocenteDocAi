import React from 'react';
import { render } from '@testing-library/react';
import TextArea from './TextArea';

describe('TextArea Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<TextArea />);
    expect(container).toMatchSnapshot();
  });
});
