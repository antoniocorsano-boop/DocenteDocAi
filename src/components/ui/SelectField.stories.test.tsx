import { renderWithM3Theme } from '../test-utils';
// LEGACY - MD3 Non-compliant
import React from 'react';
import { render } from '@testing-library/react';
import SelectField from './SelectField';

describe('SelectField Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = renderWithM3Theme(
      <SelectField label="Test"><option>Test</option></SelectField>
    );
    expect(container).toMatchSnapshot();
  });
});





