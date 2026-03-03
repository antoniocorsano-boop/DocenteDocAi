import { renderWithM3Theme } from './test-utils';
// MD3 Compliant
import React from 'react';
import { render } from '@testing-library/react';
import M3ChoiceCard from './M3ChoiceCard';

describe('M3ChoiceCard Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(<M3ChoiceCard icon="test" label="Test" onClick={() => {}} selected={false} />);
    expect(container).toMatchSnapshot();
  });
});

