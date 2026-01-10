import React from 'react';
import { render } from '@testing-library/react';
import M3ExpressiveCard from './M3ExpressiveCard';

describe('M3ExpressiveCard Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(
      <M3ExpressiveCard
        icon="test-icon"
        title="Test Title"
        description="Test description"
      />
    );
    expect(container).toMatchSnapshot();
  });
});
