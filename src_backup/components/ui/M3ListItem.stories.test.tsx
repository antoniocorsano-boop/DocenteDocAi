import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import M3ListItem from './M3ListItem';

describe('M3ListItem Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<M3ListItem headline="Test" />);
    expect(container).toMatchSnapshot();
  });
});

