import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import Snackbar from './Snackbar';

describe('Snackbar Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<Snackbar />);
    expect(container).toMatchSnapshot();
  });
});






