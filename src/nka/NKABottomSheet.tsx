import * as React from 'react';
import './nka-responsive.css';
import { NKANode } from './types';
import NKANodeCard from './NKANodeCard';
import NKAForceMap from './NKAForceMap';
import { playNkaSound } from './sound';
import { generateWizardForNodeLLM } from './wizardAI.llm';
import { NKAWizardStep } from './wizardAI';
import GameMode from './GameMode';
import { M3Surface } from '../components/ui/M3Surface';
import { M3Typography } from '../components/ui/M3Typography';
import M3IconButton from '../components/ui/M3IconButton';
import { M3Button } from '../components/ui/M3Button';
import { M3Skeleton } from '../components/ui/M3Skeleton';
import { M3EmptyState } from '../components/ui/M3EmptyState';
import { M3ErrorState } from '../components/ui/M3ErrorState';

interface NKABottomSheetProps {
  open: boolean;
  nodes: readonly NKANode[];
  onClose: () => void;
  onNodeSelect: (node: NKANode) => void;
}

const NKABottomSheet: React.FC<NKABottomSheetProps> = ({ open, nodes, onClose, onNodeSelect }) => {
  const [selectedNode, setSelectedNode] = React.useState<NKANode | null>(null);
  const [showWizard, setShowWizard] = React.useState<boolean>(false);
  const [wizardSteps, setWizardSteps] = React.useState<NKAWizardStep[]>([]);
  const [wizardLoading, setWizardLoading] = React.useState<boolean>(false);
  const [wizardError, setWizardError] = React.useState<string | null>(null);
  const [showGame, setShowGame] = React.useState<boolean>(false);

  const handleNodeSelect = React.useCallback((node: NKANode) => {
    try {
      playNkaSound('node');
    } catch (err) {
      console.warn('[NKA] Sound play error:', err);
    }
    setSelectedNode(node);
    setShowWizard(true);
    setWizardError(null);
    onNodeSelect(node);
    setWizardLoading(true);

    (async () => {
      try {
        const steps = await generateWizardForNodeLLM(node, {});
        setWizardSteps(steps);
      } catch (err) {
        console.warn('[NKA] Wizard generation error:', err);
        setWizardError('Errore nella generazione del wizard');
      } finally {
        setWizardLoading(false);
      }
    })();
  }, [onNodeSelect]);

  if (!open) return null;

  return (
    <>
      <M3Surface
        variant="scrim"
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 'var(--md-sys-z-modal)',
        }}
      />
      <M3Surface
        variant="container"
        elevation={3}
        role="dialog"
        aria-modal="true"
        aria-label="Mappa neurale della conoscenza"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          width: 'min(100vw, 600px)',
          borderTopLeftRadius: 'var(--md-sys-shape-corner-large)',
          borderTopRightRadius: 'var(--md-sys-shape-corner-large)',
          zIndex: 'calc(var(--md-sys-z-modal) + 1)',
          padding: 'var(--md-sys-spacing-6) var(--md-sys-spacing-4)',
          minHeight: '320px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-4)',
          overflow: 'hidden',
        }}
      >
        <M3Surface
          variant="surface"
          style={{
            width: '100%',
            flex: 1,
            overflow: 'auto',
            marginBottom: 'var(--md-sys-spacing-4)',
          }}
        >
          {nodes.length === 0 ? (
            <M3EmptyState
              title="Nessun nodo disponibile"
              description="Non ci sono nodi nella mappa neurale"
              icon="psychology"
            />
          ) : (
            <>
              <NKAForceMap 
                nodes={nodes} 
                onNodeSelect={handleNodeSelect}
                aria-label="Visualizzazione interattiva della mappa neurale"
              />
              <M3Surface
                variant="surface"
                role="list"
                aria-label="Elenco nodi della mappa neurale"
                style={{ marginTop: 'var(--md-sys-spacing-4)' }}
              >
                {nodes.map((node: NKANode) => (
                  <NKANodeCard 
                    key={node.id} 
                    node={node} 
                    onSelect={() => handleNodeSelect(node)}
                    role="listitem"
                  />
                ))}
              </M3Surface>
            </>
          )}
        </M3Surface>

        <M3IconButton
          icon="close"
          onClick={onClose}
          aria-label="Chiudi mappa neurale"
          variant="standard"
          style={{
            position: 'absolute',
            top: 'var(--md-sys-spacing-3)',
            right: 'var(--md-sys-spacing-4)',
          }}
        />

        <M3Button
          variant={showGame ? 'tonal' : 'filled'}
          onClick={() => setShowGame(prev => !prev)}
          aria-label={showGame ? 'Nascondi modalità gioco' : 'Mostra modalità gioco'}
          aria-expanded={showGame}
        >
          {showGame ? 'Nascondi' : 'Mostra'} Modalità Gioco
        </M3Button>
      </M3Surface>

      {showWizard && selectedNode && (
        <M3Surface
          variant="container-high"
          elevation={2}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wizard-title"
          aria-describedby="wizard-description"
          style={{
            position: 'fixed',
            left: '50%',
            top: '10vh',
            transform: 'translateX(-50%)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            padding: 'var(--md-sys-spacing-6)',
            zIndex: 'calc(var(--md-sys-z-modal) + 2)',
            minWidth: '320px',
            maxWidth: '480px',
            width: '90vw',
          }}
        >
          <M3Typography 
            variant="headline-small" 
            id="wizard-title"
            style={{ marginBottom: 'var(--md-sys-spacing-4)' }}
          >
            Wizard: {selectedNode.label}
          </M3Typography>
          
          {wizardLoading ? (
            <M3Surface variant="surface" style={{ padding: 'var(--md-sys-spacing-4)' }}>
              <M3Skeleton height="24px" style={{ marginBottom: 'var(--md-sys-spacing-3)' }} />
              <M3Skeleton height="16px" style={{ marginBottom: 'var(--md-sys-spacing-2)' }} />
              <M3Skeleton height="16px" width="80%" />
            </M3Surface>
          ) : wizardError ? (
            <M3ErrorState
              title="Errore nel wizard"
              description={wizardError}
              onRetry={() => handleNodeSelect(selectedNode)}
              showRetry
            />
          ) : wizardSteps.length === 0 ? (
            <M3EmptyState
              title="Wizard non disponibile"
              description="Non è stato possibile generare passi per questo nodo"
              icon="auto_fix_high"
            />
          ) : (
            <M3Surface 
              variant="surface"
              role="list"
              aria-label="Passi del wizard"
            >
              {wizardSteps.map((step: NKAWizardStep) => (
                <M3Surface
                  key={step.id}
                  variant="surface-variant"
                  role="listitem"
                  style={{
                    marginBottom: 'var(--md-sys-spacing-4)',
                    padding: 'var(--md-sys-spacing-3)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                  }}
                >
                  <M3Typography 
                    variant="title-medium" 
                    style={{ marginBottom: 'var(--md-sys-spacing-2)' }}
                  >
                    {step.title}
                  </M3Typography>
                  <M3Typography 
                    variant="body-medium" 
                    style={{ 
                      marginBottom: 'var(--md-sys-spacing-3)',
                      color: 'var(--md-sys-color-on-surface-variant)'
                    }}
                  >
                    {step.description}
                  </M3Typography>
                  {step.actions.length > 0 && (
                    <M3Surface 
                      variant="surface"
                      style={{
                        display: 'flex',
                        gap: 'var(--md-sys-spacing-2)',
                        flexWrap: 'wrap',
                      }}
                    >
                      {step.actions.map((action: string, index: number) => (
                        <M3Button
                          key={`${step.id}-action-${index}`}
                          variant="filled"
                          size="small"
                          aria-label={`Esegui azione: ${action}`}
                        >
                          {action}
                        </M3Button>
                      ))}
                    </M3Surface>
                  )}
                </M3Surface>
              ))}
            </M3Surface>
          )}
          
          <M3Button
            variant="text"
            onClick={() => setShowWizard(false)}
            aria-label="Chiudi wizard"
            style={{ marginTop: 'var(--md-sys-spacing-4)' }}
          >
            Chiudi wizard
          </M3Button>
        </M3Surface>
      )}

      {showGame && (
        <M3Surface
          variant="container"
          role="region"
          aria-label="Modalità gioco"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 'calc(var(--md-sys-z-modal) + 1)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <GameMode nodes={nodes} />
        </M3Surface>
      )}
    </>
  );
};

export default NKABottomSheet;
