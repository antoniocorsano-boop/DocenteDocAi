import React from 'react';
import { render } from '@testing-library/react';
import M3Dialog from './M3Dialog';

describe('M3Dialog Story Snapshots', () => {
  it('renders default story correctly', () => {
    const { container } = render(
      <M3Dialog title="Test Dialog" onClose={() => {}}>
        Test content
      </M3Dialog>
    );
    expect(container).toMatchSnapshot();
  });
});
