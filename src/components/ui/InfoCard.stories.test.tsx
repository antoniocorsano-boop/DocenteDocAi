import React from 'react';
import { render } from '@testing-library/react';
import InfoCard from './InfoCard';
import { M3ThemeProvider } from '../../theme/theme';

describe('InfoCard Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(
      <M3ThemeProvider>
        <InfoCard />
      </M3ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
