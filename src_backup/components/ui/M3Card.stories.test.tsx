import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import M3Card from './M3Card';

describe('M3Card Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<M3Card>Test content</M3Card>);
    expect(container).toMatchSnapshot();
  });
});

