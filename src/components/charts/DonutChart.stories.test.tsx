import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import DonutChart from './DonutChart';

describe('DonutChart Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<DonutChart data={[{label: 'Test', value: 10, color: sys.colors.000}]} />);
    expect(container).toMatchSnapshot();
  });
});





