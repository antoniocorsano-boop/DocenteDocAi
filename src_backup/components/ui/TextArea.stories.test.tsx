import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import TextArea from './TextArea';

describe('TextArea Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<TextArea />);
    expect(container).toMatchSnapshot();
  });
});

