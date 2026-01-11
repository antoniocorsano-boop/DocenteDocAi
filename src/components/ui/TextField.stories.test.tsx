import React from 'react';
import { render } from '@testing-library/react';
import TextField from './TextField';
import { M3ThemeProvider } from '../../theme/theme';

describe('TextField Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(
      <M3ThemeProvider>
        <TextField label="Test" />
      </M3ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
