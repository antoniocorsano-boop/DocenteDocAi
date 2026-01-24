import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import TextField from './TextField';

describe('TextField Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<TextField label="Test" />);
    expect(container).toMatchSnapshot();
  });
});

