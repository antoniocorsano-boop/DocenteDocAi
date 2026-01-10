import React from 'react';
import { render } from '@testing-library/react';
import BarChart from './BarChart';

describe('BarChart Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(<BarChart data={[{label: 'Test', value: 10}]} color="#000" />);
    expect(container).toMatchSnapshot();
  });
});
