import { renderWithM3Theme } from './test-utils';
import React from 'react';
import { render } from '@testing-library/react';
import M3ExpressiveCard from './M3ExpressiveCard';

describe('M3ExpressiveCard Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(
      <M3ExpressiveCard
        icon="test-icon"
        title="Test Title"
        description="Test description"
      />
    );
    expect(container).toMatchSnapshot();
  });
});






