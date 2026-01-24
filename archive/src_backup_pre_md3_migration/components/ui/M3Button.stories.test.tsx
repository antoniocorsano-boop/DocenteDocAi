import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import M3Button from './M3Button';

describe('M3Button Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<M3Button>Click me</M3Button>);
    expect(container).toMatchSnapshot();
  });
});

