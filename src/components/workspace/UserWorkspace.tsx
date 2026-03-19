/**
 * UserWorkspace.tsx — Spazio di lavoro del docente.
 *
 * Componente centrale del pilot: connette la pipeline cognitiva all'UI.
 *
 *   [Input Area]      — testo libero o upload file → ingestInput()
 *   [Recent Content]  — lista entrate cognitive cliccabili → openMenu()
 *   [ThumbMenu]       — menu radiale azioni (Portal-rendered)
 *   [OnboardingOverlay] — guida al primo avvio (localStorage-gated)
 *
 * Non richiede props: legge tenantId da tenantRegistry e si iscrive ai
 * cambiamenti tramite tenantRegistry.subscribe + useCognitiveStore.subscribe.
 *
 * MD3 Gold Compliant:
 *   - M3Surface per ogni container visivo
 *   - nessun <div> per layout/shell/card
 *   - token var(--md-sys-color-*) per tutti i colori
 *   - fontWeight via var(--md-sys-typescale-weight-semibold)
 *   - aria-label su ogni elemento interattivo
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box              from '@mui/material/Box';
import Button           from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider          from '@mui/material/Divider';
import IconButton       from '@mui/material/IconButton';
import LinearProgress   from '@mui/material/LinearProgress';
import List             from '@mui/material/List';
import ListItemButton   from '@mui/material/ListItemButton';
import ListItemText     from '@mui/material/ListItemText';
import Stack            from '@mui/material/Stack';
import TextField        from '@mui/material/TextField';
import Tooltip          from '@mui/material/Tooltip';
import Typography       from '@mui/material/Typography';
import AttachFileOutlinedIcon  from '@mui/icons-material/AttachFileOutlined';
import AddOutlinedIcon         from '@mui/icons-material/AddOutlined';
import SendOutlinedIcon        from '@mui/icons-material/SendOutlined';

import M3Surface        from '../ui/M3Surface';
import ThumbMenu        from '../ui/ThumbMenu';
import JarvisIndicator  from '../ui/JarvisIndicator';
import OnboardingOverlay, { hasCompletedOnboarding } from './OnboardingOverlay';

import { ingestInput }        from '../../modules/cognitiveLayer';
import { useCognitiveStore }  from '../../modules/cognitiveLayer/cognitiveStore';
import type { CognitiveEntry } from '../../modules/cognitiveLayer/types';
import { tenantRegistry }     from '../../services/tenant/tenantRegistry';
import { useThumbMenu }       from '../../hooks/useThumbMenu';
import { seedDemoContent }    from '../../utils/seedDemoContent';

// ─── Domain display helpers ───────────────────────────────────────────────────

const DOMAIN_CHIP_COLOR: Record<string, string> = {
  pedagogical:    'var(--md-sys-color-primary)',
  compliance:     'var(--md-sys-color-error)',
  administrative: 'var(--md-sys-color-secondary)',
  technical:      'var(--md-sys-color-tertiary)',
  commercial:     'var(--md-sys-color-tertiary)',
  operational:    'var(--md-sys-color-secondary)',
  unknown:        'var(--md-sys-color-outline)',
};

const DOMAIN_LABEL: Record<string, string> = {
  pedagogical:    'Pedagogico',
  compliance:     'Compliance',
  administrative: 'Amministrativo',
  technical:      'Tecnico',
  commercial:     'Commerciale',
  operational:    'Operativo',
  unknown:        'Altro',
};

function relativeTime(ts: number): string {
  const min = Math.floor((Date.now() - ts) / 60_000);
  if (min < 1)  return 'adesso';
  if (min < 60) return `${min}m fa`;
  const h = Math.floor(min / 60);
  if (h < 24)   return `${h}h fa`;
  return `${Math.floor(h / 24)}g fa`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserWorkspace(): React.JSX.Element {

  // ── Tenant (reactive) ──────────────────────────────────────────────────────
  const [tenantId, setTenantId] = useState(
    () => tenantRegistry.getContext().tenantId,
  );
  useEffect(() => {
    return tenantRegistry.subscribe(ctx => setTenantId(ctx.tenantId));
  }, []);

  // ── Cognitive entries (reactive) ───────────────────────────────────────────
  const [entries, setEntries] = useState<CognitiveEntry[]>(() =>
    useCognitiveStore.getState().listRecent(20, tenantId),
  );
  useEffect(() => {
    const refresh = () =>
      setEntries(useCognitiveStore.getState().listRecent(20, tenantId));
    refresh();
    return useCognitiveStore.subscribe(refresh);
  }, [tenantId]);

  // ── Onboarding ────────────────────────────────────────────────────────────
  const [showOnboarding, setShowOnboarding] = useState(
    () => !hasCompletedOnboarding(),
  );

  // ── Input state ───────────────────────────────────────────────────────────
  const [text,      setText]     = useState('');
  const [ingesting, setIngesting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleIngest = useCallback(async (content: string, label?: string) => {
    if (!content.trim()) return;
    setIngesting(true);
    try {
      await ingestInput({
        tenantId,
        sourceId:  `user-${Date.now()}`,
        inputType: 'text',
        content:   content.trim(),
        label:     label ?? content.trim().slice(0, 60),
      });
      setText('');
    } finally {
      setIngesting(false);
    }
  }, [tenantId]);

  const handleSubmit = useCallback(() => {
    handleIngest(text);
  }, [text, handleIngest]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      if (file.type.startsWith('image/')) {
        reader.onload = () => {
          const ts = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
          handleIngest(reader.result as string, `Screenshot ${ts}`);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = () => {
          handleIngest(reader.result as string, file.name);
        };
        reader.readAsText(file);
      }
      e.target.value = '';
    },
    [handleIngest],
  );

  // ── Clipboard paste — cattura immagini incollate ──────────────────────────
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (!file) continue;
          e.preventDefault();
          const reader = new FileReader();
          reader.onload = () => {
            const ts = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            handleIngest(reader.result as string, `Screenshot ${ts}`);
          };
          reader.readAsDataURL(file);
          return;
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handleIngest]);

  // ── ThumbMenu ─────────────────────────────────────────────────────────────
  const {
    open, anchorEl, context, loading: menuLoading,
    openMenu, handleSelect, handleClose,
  } = useThumbMenu(tenantId);

  const handleEntryClick = useCallback(
    (entry: CognitiveEntry, el: HTMLElement) => {
      openMenu(entry.id, el);
    },
    [openMenu],
  );

  // ── Demo seed — once, if workspace starts empty ───────────────────────────
  useEffect(() => {
    if (entries.length === 0) {
      seedDemoContent(tenantId).catch(() => { /* non-critical */ });
    }
    // Intentionally runs only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <M3Surface
      elevation={0}
      sx={{
        minHeight: '100%',
        display:   'flex',
        flexDirection: 'column',
        gap:       2,
        p:         { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Typography
        variant="titleMedium"
        component="h1"
        sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
      >
        Spazio di lavoro
      </Typography>

      {/* ── Input area ─────────────────────────────────────────────────── */}
      <M3Surface
        elevation={1}
        sx={{ borderRadius: 2, p: 2 }}
        aria-label="Area inserimento contenuto"
      >
        <Stack spacing={2}>
          <TextField
            multiline
            minRows={2}
            maxRows={6}
            fullWidth
            placeholder="Incolla testo, immagine o carica un file..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={ingesting}
            aria-label="Inserisci contenuto da analizzare"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius:    2,
                backgroundColor: 'var(--md-sys-color-surface-container-lowest)',
              },
            }}
          />

          <Stack direction="row" spacing={1} alignItems="center">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileRef}
              accept=".txt,.md,.csv,.json,.png,.jpg,.jpeg,.gif,.webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              aria-hidden
            />
            <Tooltip title="Carica file o immagine (.txt .md .csv .json .png .jpg…)">
              <span>
                <IconButton
                  onClick={() => fileRef.current?.click()}
                  disabled={ingesting}
                  aria-label="Carica file"
                  size="small"
                  sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                >
                  <AttachFileOutlinedIcon
                    sx={{ fontSize: 'var(--md-sys-icon-size-md, 20px)' }}
                  />
                </IconButton>
              </span>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={ingesting || !text.trim()}
              startIcon={
                ingesting
                  ? (
                    <CircularProgress
                      size={16}
                      color="inherit"
                      aria-label="Analisi in corso"
                    />
                  )
                  : (
                    <SendOutlinedIcon
                      sx={{ fontSize: 'var(--md-sys-icon-size-md, 20px)' }}
                    />
                  )
              }
              aria-label={ingesting ? 'Analisi in corso' : 'Analizza contenuto'}
              sx={{ borderRadius: 8 }}
            >
              {ingesting ? 'Analisi...' : 'Analizza'}
            </Button>
          </Stack>
        </Stack>
      </M3Surface>

      {/* ── Recent content list ─────────────────────────────────────────── */}
      <Stack spacing={1}>
        <Typography
          variant="labelSmall"
          component="h2"
          sx={{
            color:         'var(--md-sys-color-on-surface-variant)',
            letterSpacing: '0.08em',
          }}
        >
          CONTENUTI
        </Typography>

        <M3Surface
          elevation={1}
          sx={{ borderRadius: 2, overflow: 'hidden' }}
          aria-label="Lista contenuti recenti — clicca per aprire le azioni"
        >
          {menuLoading && (
            <LinearProgress
              aria-label="Caricamento azioni disponibili"
              sx={{
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'var(--md-sys-color-primary)',
                },
              }}
            />
          )}

          {entries.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ py: 4, px: 3 }}
            >
              <AddOutlinedIcon
                sx={{
                  fontSize: 'var(--md-sys-icon-size-md, 24px)',
                  color:    'var(--md-sys-color-outline)',
                  mb:       0.5,
                }}
                aria-hidden
              />
              <Typography
                variant="body2"
                sx={{
                  color:     'var(--md-sys-color-on-surface-variant)',
                  textAlign: 'center',
                }}
              >
                Nessun contenuto. Aggiungi testo o carica un file.
              </Typography>
            </Stack>
          ) : (
            <List
              disablePadding
              aria-label="Contenuti recenti"
            >
              {entries.map((entry, idx) => (
                <React.Fragment key={entry.id}>
                  {idx > 0 && <Divider component="li" />}
                  <ListItemButton
                    onClick={e => handleEntryClick(entry, e.currentTarget)}
                    aria-label={[
                      entry.label,
                      DOMAIN_LABEL[entry.domain] ?? entry.domain,
                      relativeTime(entry.enteredAt),
                    ].join(' — ')}
                    sx={{
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'var(--md-sys-color-surface-container-low)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <Box
                            sx={{
                              width:        6,
                              height:       6,
                              borderRadius: '50%',
                              flexShrink:   0,
                              bgcolor:      DOMAIN_CHIP_COLOR[entry.domain]
                                ?? 'var(--md-sys-color-outline)',
                            }}
                            aria-hidden
                          />
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: 'var(--md-sys-color-on-surface)', flexGrow: 1 }}
                            noWrap
                          >
                            {entry.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            component="span"
                            sx={{ color: 'var(--md-sys-color-on-surface-variant)', flexShrink: 0 }}
                          >
                            {relativeTime(entry.enteredAt)}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItemButton>
                </React.Fragment>
              ))}
            </List>
          )}
        </M3Surface>
      </Stack>

      {/* ── ThumbMenu (Portal-rendered, radial) ─────────────────────────── */}
      <ThumbMenu
        open={open}
        anchorEl={anchorEl}
        context={context}
        tenantId={tenantId}
        onSelect={handleSelect}
        onClose={handleClose}
      />

      {/* ── Jarvis background indicator — floating dot, visibile solo se entries > 0 */}
      <JarvisIndicator
        count={entries.length}
        latestEntryId={entries[0]?.id ?? null}
        hidden={open}
        onActivate={openMenu}
      />

      {/* ── Onboarding overlay — only on first visit ─────────────────────── */}
      {showOnboarding && (
        <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />
      )}
    </M3Surface>
  );
}
