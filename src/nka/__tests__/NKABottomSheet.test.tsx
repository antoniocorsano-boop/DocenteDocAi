import { render, screen, fireEvent } from '@testing-library/react';
import NKABottomSheet from '../NKABottomSheet';

describe('NKABottomSheet', () => {
  const nodes = [
    { id: '1', label: 'Nodo 1', color: '80', elevation: 1, depth: 0.5, shape: 'circle', actions: [] },
    { id: '2', label: 'Nodo 2', color: '90', elevation: 2, depth: 0.7, shape: 'pill', actions: [] },
  ];

  it('renders when open and calls onNodeSelect', () => {
    const onNodeSelect = vi.fn();
    render(
      <NKABottomSheet open={true} nodes={nodes} onClose={() => {}} onNodeSelect={onNodeSelect} />
    );
    expect(screen.getByText('Nodo 1')).toBeInTheDocument();
    expect(screen.getByText('Nodo 2')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button')[1]); // Click second node
    expect(onNodeSelect).toHaveBeenCalled();
  });

  it('does not render when open is false', () => {
    render(
      <NKABottomSheet open={false} nodes={nodes} onClose={() => {}} onNodeSelect={() => {}} />
    );
    expect(screen.queryByText('Nodo 1')).toBeNull();
  });
});
