import React from 'react';
import { render } from '@testing-library/react';
import SelectField from './SelectField';
import { M3ThemeProvider } from '../../theme/theme';

describe('SelectField Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(
      <M3ThemeProvider>
        <SelectField label="Test"><option>Test</option></SelectField>
      </M3ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
