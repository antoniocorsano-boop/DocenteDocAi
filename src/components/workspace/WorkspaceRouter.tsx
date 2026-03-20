/**
 * WorkspaceRouter.tsx — Componente bridge desktop ↔ mobile.
 *
 * Legge useInteractionMode() e renderizza:
 *   desktop (≥ 1024 px) → DesktopWorkspace (shell premium)
 *   mobile  (< 1024 px) → UserWorkspace (shell mobile)
 *
 * Lazy-loadato tramite viewRegistry.
 * Nessuna logica UI propria — solo routing condizionale.
 */

import React, { Suspense } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { useInteractionMode } from '../../hooks/useInteractionMode';
import UserWorkspace    from './UserWorkspace';
import DesktopWorkspace from './DesktopWorkspace';

export default function WorkspaceRouter(): React.JSX.Element {
  const mode = useInteractionMode();

  if (mode === 'desktop') {
    return (
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress aria-label="Caricamento workspace desktop…" />
          </Box>
        }
      >
        <DesktopWorkspace />
      </Suspense>
    );
  }

  return <UserWorkspace />;
}
