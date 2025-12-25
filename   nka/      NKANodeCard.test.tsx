import React from 'react';
import { render, screen } from '@testing-library/react';
import NKANodeCard from '../NKANodeCard';

test('renders NKANodeCard component', () => {
  render(<NKANodeCard />);
  const element = screen.getByText(/expected text/i);
  expect(element).toBeInTheDocument();
});