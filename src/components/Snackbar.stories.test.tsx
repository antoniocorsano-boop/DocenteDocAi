import React from 'react';
import { render } from '@testing-library/react';
import Snackbar from './Snackbar';

describe('Snackbar Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<Snackbar />);
    expect(container).toMatchSnapshot();
  });
});
