import React from 'react';
import { render } from '@testing-library/react';
import InfoCard from './InfoCard';

describe('InfoCard Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<InfoCard />);
    expect(container).toMatchSnapshot();
  });
});
