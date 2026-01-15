import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import ThinkingIndicator from './ThinkingIndicator';

describe('ThinkingIndicator Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<ThinkingIndicator />);
    expect(container).toMatchSnapshot();
  });
});

