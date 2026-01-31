// Bottom sheet modal for NKA map
import * as React from 'react';
import './nka-responsive.css';
import { NKANode } from './types';
import NKANodeCard from './NKANodeCard';
import NKAForceMap from './NKAForceMap';
import { playNkaSound } from './sound';
// import { generateWizardForNode } from './wizardAI';
import { generateWizardForNodeLLM } from './wizardAI.llm';
import { NKAWizardStep } from './wizardAI';
import GameMode from './GameMode';


interface NKABottomSheetProps {
  open: boolean;
  nodes: readonly NKANode[];
  onClose: () => void;
  onNodeSelect: (node: NKANode) => void;
}


const NKABottomSheet: React.FC<NKABottomSheetProps> = ({ open, nodes, onClose, onNodeSelect }) => {
  // Advanced: sound feedback, force map, wizard, game mode
  const [selectedNode, setSelectedNode] = React.useState<NKANode | null>(null);
  const [showWizard, setShowWizard] = React.useState<boolean>(false);
  const [wizardSteps, setWizardSteps] = React.useState<NKAWizardStep[]>([]);
  const [wizardLoading, setWizardLoading] = React.useState<boolean>(false);
  const [showGame, setShowGame] = React.useState<boolean>(false);
  const handleNodeSelect = React.useCallback((node: NKANode) => {
    try {
      playNkaSound('node');
    } catch (err) {
      console.warn('[NKA] Sound play error:', err);
    }
    setSelectedNode(node);
    setShowWizard(true);
    // Call onNodeSelect synchronously so callers don't depend on async LLM generation
    onNodeSelect(node);
    setWizardLoading(true);

    // Fire-and-forget: generate wizard steps asynchronously and update state when ready
    (async () => {
      try {
        const steps = await generateWizardForNodeLLM(node, {});
        setWizardSteps(steps);
      } catch (err) {
        console.warn('[NKA] Wizard generation error:', err);
        // swallow LLM errors; UI will show fallback if needed
      } finally {
        setWizardLoading(false);
      }
    })();
  }, [onNodeSelect]);

  if (!open) return null;
  return (
    <>
      {/* Backdrop to close modal */}
      <div
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'var(--md-sys-viewport-width-full)',
          height: 'var(--md-sys-viewport-height-full)',
          background: 'rgba(0,0,0,0.32)',
          zIndex: 'var(--md-sys-z-modal)', // --md-sys-z-modal
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mappa neurale"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          width: 'min(100vw, calc(var(--md-sys-spacing-20) * 7.5))',
          background: 'var(--md-sys-color-surface)',
          borderTopLeftRadius: 'var(--md-sys-shape-corner-large)',
          borderTopRightRadius: 'var(--md-sys-shape-corner-large)',
          boxShadow: 'var(--md-sys-elevation3)',
          zIndex: 'var(--md-sys-z-modal)', // --md-sys-z-modal + 1
          padding: 'var(--md-sys-spacing-6) var(--md-sys-spacing-4) var(--md-sys-spacing-4) var(--md-sys-spacing-4)',
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-4)',
        }}
      >
        <div style={{ width: '100%', marginBottom: 'var(--md-sys-spacing-4)' }}>
          <NKAForceMap nodes={nodes} onNodeSelect={handleNodeSelect} />
          {/* List fallback for accessibility and actions */}
          {nodes.map((node: NKANode) => (
            <NKANodeCard key={node.id} node={node} onSelect={() => handleNodeSelect(node)} />
          ))}
        </div>
        <button
          onClick={onClose}
          aria-label="Chiudi mappa neurale"
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            background: 'none',
            border: 'none',
            color: 'var(--app-color-on-surface-variant)',
            fontSize: 28,
            cursor: 'pointer',
            borderRadius: 'var(--md-sys-shape-corner-full)',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--md-sys-motion-duration-medium) var(--md-sys-motion-easing-standard)',
          }}
        >×</button>
      {/* Wizard AI generativo */}
      {showWizard && selectedNode && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            top: '10vh',
            transform: 'translateX(-50%)',
            background: 'var(--md-sys-color-surface-container)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            boxShadow: 'var(--md-sys-elevation2)',
            padding: 'var(--md-sys-spacing-6)',
            zIndex: 'var(--md-sys-z-tooltip)', // --md-sys-z-tooltip
            minWidth: 320,
            maxWidth: 480,
          }}
        >
          <h4 style={{ margin: 0, color: 'var(--md-sys-color-on-surface)' }}>Wizard: {selectedNode.label}</h4>
          {wizardLoading ? (
            <div style={{ color: 'var(--app-color-on-surface-variant)' }}>Generazione wizard AI…</div>
          ) : (
            <ul style={{ padding: 0, margin: 'var(--md-sys-spacing-4) 0', listStyle: 'none' }}>
              {wizardSteps.map((step: NKAWizardStep) => (
                <li key={step.id} style={{ marginBottom: 'var(--md-sys-spacing-3)' }}>
                  <strong style={{ color: 'var(--md-sys-color-primary)' }}>{step.title}</strong>
                  <div style={{ color: 'var(--app-color-on-surface-variant)' }}>{step.description}</div>
                  {step.actions.map((a: string) => (
                    <button
                      key={a}
                      style={{
                        background: 'var(--md-sys-color-primary)',
                        color: 'var(--md-sys-color-on-primary)',
                        border: 'none',
                        borderRadius: 'var(--md-sys-shape-corner-small)',
                        padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
                        font: 'inherit',
                        cursor: 'pointer',
                        marginRight: 'var(--md-sys-spacing-2)',
                        marginTop: 'var(--md-sys-spacing-2)',
                      }}
                    >{a}</button>
                  ))}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => setShowWizard(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--md-sys-color-primary)',
              fontSize: 18,
              cursor: 'pointer',
              marginTop: 'var(--md-sys-spacing-4)',
            }}
          >Chiudi wizard</button>
        </div>
      )}
      {/* Modalità gioco */}
      {showGame && (
        <GameMode nodes={nodes} />
      )}
      <button
        onClick={() => setShowGame((g: boolean) => !g)}
        style={{
          background: 'var(--md-sys-color-secondary)',
          color: 'var(--md-sys-color-on-secondary)',
          border: 'none',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
          padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-4)',
          font: 'inherit',
          cursor: 'pointer',
          marginTop: 'var(--md-sys-spacing-4)',
        }}
      >{showGame ? 'Nascondi' : 'Mostra'} Modalità Gioco</button>
      </div>
    </>
  );
};

export default NKABottomSheet;


