import { renderWithM3Theme } from './test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import UseCaseCard from './UseCaseCard';

describe('UseCaseCard Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<UseCaseCard scenario="Test" steps={["Step 1"]} />);
    expect(container).toMatchSnapshot();
  });
});






