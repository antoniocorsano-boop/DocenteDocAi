import React from 'react';
import { render } from '@testing-library/react';
import CategoryCard from './CategoryCard';
import { M3ThemeProvider } from '../../theme/theme';

describe('CategoryCard Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(
      <M3ThemeProvider>
        <CategoryCard id="test" label="Test" icon="test" color="blue" isSelected={false} onClick={() => {}} />
      </M3ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
