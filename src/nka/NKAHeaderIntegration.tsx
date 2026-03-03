import React from 'react';
import NKAHeaderAuraButton from './NKAHeaderAuraButton';
import { useNKAStore } from './useNKAStore';

interface NKAHeaderIntegrationProps {
  onOpenNKA: () => void;
  onLongPressNKA: () => void;
}

const NKAHeaderIntegration: React.FC<NKAHeaderIntegrationProps> = ({ onOpenNKA, onLongPressNKA }) => {
  const { enabled, nodes } = useNKAStore();

  if (!enabled) return null;

  const hasNewNode = nodes.some(node => node.isNew);

  return (
    <NKAHeaderAuraButton
      hasNewNode={hasNewNode}
      onClick={onOpenNKA}
      onLongPress={onLongPressNKA}
    />
  );
};

export default NKAHeaderIntegration;

