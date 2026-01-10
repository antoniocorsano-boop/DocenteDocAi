import React from 'react';
import { render } from '@testing-library/react';
import DonutChart from './DonutChart';

describe('DonutChart Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<DonutChart data={[{label: 'Test', value: 10, color: '#000'}]} />);
    expect(container).toMatchSnapshot();
  });
});
