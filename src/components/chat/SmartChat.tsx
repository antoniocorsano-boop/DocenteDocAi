/**
 * SmartChat.tsx — P37 Unified Interaction Layer
 *
 * Full-page chat interface with ChatGPT + Notion-style layout:
 *   - Collapsible sidebar (240 px) listing all conversation threads
 *   - Main area: header + scrollable message feed + InputBar
 *   - Mobile: sidebar becomes a temporary Drawer
 *
 * MD3 / MUI v7 compliance:
 *   - NO custom styled() with hardcoded colours
 *   - Only Box / Paper / Stack / Typography / Chip / IconButton / Drawer from MUI
 *   - All interactive elements carry aria-label
 *   - Spacing via sx tokens only
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ThumbUpOutlinedIcon   from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import AutoAwesomeIcon       from '@mui/icons-material/AutoAwesome';
import AddCommentIcon         from '@mui/icons-material/AddComment';
import DeleteOutlineIcon      from '@mui/icons-material/DeleteOutline';
import MenuIcon               from '@mui/icons-material/Menu';
import ChevronLeftIcon        from '@mui/icons-material/ChevronLeft';
import SettingsIcon           from '@mui/icons-material/Settings';
import ExpandMoreIcon         from '@mui/icons-material/ExpandMore';

import { ChatSettingsPanel } from './ChatSettingsPanel';
import { SmartLandingView }  from './SmartLandingView';

import { useSmartChat }           from '@/hooks/useSmartChat';
import { useConversationStore }   from '@/stores/useConversationStore';
import { useChatPrefsStore }      from '@/stores/useChatPrefsStore';
import { InputBar }               from './InputBar';
import { MessageBlockRenderer }   from './MessageBlockRenderer';
import type { ChatMessage, AdaptedBlock } from '@/types/uiBlocks';
import type { EmotionalState }            from '@/modules/orchestration/EmotionalEngine';

// ── Constants ─────────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = 240;

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SmartChatProps {
  /** Called when the user clears the conversation (optional) */
  onClear?:     () => void;
  /**
   * 'pro' unlocks deep / manual modes.
   * Defaults to 'free'.
   */
  userPlan?:    'free' | 'pro';
  /** Optional CSS height for the chat container. Defaults to '100%'. */
  height?:      string | number;
  /** Override the starting mode (e.g. auto-set by OrbitChatFAB based on device) */
  initialMode?: import('@/modules/orchestration/ModeEngine').Mode;
}

// ── User message bubble ───────────────────────────────────────────────────────

function UserBubble({ msg }: { msg: ChatMessage }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
      <Paper
        elevation={1}
        sx={{
          maxWidth:        '75%',
          px:              2,
          py:              1.25,
          borderRadius:    '16px 16px 4px 16px',
          backgroundColor: 'primary.main',
          color:           'primary.contrastText',
        }}
        role="article"
        aria-label="Messaggio utente"
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {msg.content}
        </Typography>
      </Paper>
    </Box>
  );
}

// ── Emotional micro-copy map ─────────────────────────────────────────────────

const REVEAL_LABEL: Record<EmotionalState, string> = {
  focused:       'Mostra analisi completa',
  exploring:     'Vedi altre opzioni',
  overloaded:    'Mostra passo successivo',
  blocked:       'Approfondisci',
  goal_oriented: 'Dettagli',
};
// ── Block type labels — mini-navbar for structure=high (Fase 2, Task 3) ─────────

const BLOCK_TYPE_LABELS: Record<string, string> = {
  text:     '📝 Testo',
  plan:     '📋 Piano',
  insight:  '🔍 Trasparenza',
  actions:  '⚡ Azioni',
  status:   '⚠️ Stato',
  table:    '📊 Tabella',
  chart:    '📈 Grafico',
  form:     '📝 Modulo',
  sandbox:  '🧪 Sandbox',
  timeline: '📅 Timeline',
};
// ── Assistant message ─────────────────────────────────────────────────────────

interface AssistantMessageProps {
  msg:            ChatMessage;
  onFeedback:     (id: string, rating: 1 | 5) => void;
  triggerAction:  (agentId: string) => void;
  emotionalState: EmotionalState;
}

function AssistantMessage({ msg, onFeedback, triggerAction, emotionalState }: AssistantMessageProps) {
  // Compute adapted blocks and hidden count before hooks so the useState
  // lazy initializer can use them (exploration=high auto-reveal, Task 2)
  const adapted       = (msg.blocks ?? [{ type: 'text' as const, content: msg.content }]) as AdaptedBlock[];
  const hiddenCount   = adapted.filter(b => b.hidden).length;

  const cognitiveStyle = useChatPrefsStore(s => s.cognitiveStyle);

  // Auto-reveal when exploration=high and few blocks are hidden (Task 2)
  const [showAll, setShowAll] = useState(() =>
    cognitiveStyle.exploration === 'high' && hiddenCount > 0 && hiddenCount <= 2
  );

  const visibleBlocks     = showAll ? adapted : adapted.filter(b => !b.hidden);
  const revealLabel       = REVEAL_LABEL[emotionalState];
  // Unique block types in appearance order — used for mini-navbar (Task 3)
  const uniqueBlockTypes  = Array.from(new Set(visibleBlocks.map(b => b.type)));

  return (
    <Box sx={{ mb: 2 }} role="article" aria-label="Risposta assistente">
      {/* Header: icon + deep badge */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
        <AutoAwesomeIcon fontSize="small" color="primary" aria-hidden="true" />
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Assistente IA
        </Typography>
        {msg.isDeep && (
          <Chip label="Analisi approfondita" size="small" color="secondary" variant="outlined" />
        )}
      </Stack>

      {/* Blocks with progressive reveal */}
      <Stack spacing={1.25}>
        {/* Mini-navbar block index — shown when structure=high and >3 blocks (Task 3) */}
        {cognitiveStyle.structure === 'high' && visibleBlocks.length > 3 && (
          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 0.5 }}
            role="navigation"
            aria-label="Indice blocchi risposta"
          >
            {uniqueBlockTypes.map(type => (
              <Chip
                key={type}
                label={BLOCK_TYPE_LABELS[type] ?? type}
                size="small"
                variant="outlined"
                sx={{ opacity: 0.7 }}
                aria-label={`Sezione: ${BLOCK_TYPE_LABELS[type] ?? type}`}
              />
            ))}
          </Stack>
        )}

        {visibleBlocks.map((block, idx) => (
          <MessageBlockRenderer
            key={idx}
            block={block}
            onAction={triggerAction}
            insightExpanded={msg.isDeep}
            emotionalState={emotionalState}
          />
        ))}
        {!showAll && hiddenCount > 0 && (
          <Button
            size="small"
            variant="text"
            aria-label={`${revealLabel} (${hiddenCount} elementi nascosti)`}
            startIcon={<ExpandMoreIcon />}
            onClick={() => {
              setShowAll(true);
              useChatPrefsStore.getState().recordRevealClick();
            }}
            sx={{ alignSelf: 'flex-start', mt: 0.5, color: 'text.secondary' }}
          >
            {revealLabel}
          </Button>
        )}
      </Stack>

      {/* Feedback row */}
      <Stack direction="row" spacing={0.5} sx={{ mt: 1 }} alignItems="center">
        <Typography variant="caption" color="text.secondary">
          Questa risposta è stata utile?
        </Typography>
        <Tooltip title="Sì, utile" placement="top">
          <IconButton
            size="small"
            aria-label="Valuta risposta positivamente"
            onClick={() => onFeedback(msg.id, 5)}
          >
            <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="No, non utile" placement="top">
          <IconButton
            size="small"
            aria-label="Valuta risposta negativamente"
            onClick={() => onFeedback(msg.id, 1)}
          >
            <ThumbDownOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* CTA autonomia — shown when autonomy=high outside blocked/overloaded state (Task 4) */}
      {cognitiveStyle.autonomy === 'high' &&
       emotionalState !== 'blocked' &&
       emotionalState !== 'overloaded' && (
        <Stack
          direction="row"
          spacing={0.75}
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 0.75 }}
          aria-label="Azioni di autonomia"
        >
          <Chip
            label="Applicalo tu"
            size="small"
            variant="outlined"
            clickable
            aria-label="Applica questo direttamente"
          />
          <Chip
            label="Fammi vedere come"
            size="small"
            variant="outlined"
            clickable
            aria-label="Mostrami come applicarlo passo per passo"
          />
        </Stack>
      )}
    </Box>
  );
}

// ── Conversation sidebar ──────────────────────────────────────────────────────

interface SidebarProps {
  onNewChat:  () => void;
  onClose?:   () => void;
}

function ConversationSidebar({ onNewChat, onClose }: SidebarProps) {
  const {
    conversations,
    activeId,
    switchConversation,
    deleteConversation,
  } = useConversationStore();

  return (
    <Box
      sx={{
        width:          SIDEBAR_WIDTH,
        height:         '100%',
        display:        'flex',
        flexDirection:  'column',
        borderRight:    '1px solid',
        borderColor:    'divider',
        backgroundColor: 'background.paper',
      }}
      aria-label="Sidebar conversazioni"
    >
      {/* Header row */}
      <Stack direction="row" alignItems="center" sx={{ px: 1.5, py: 1.25 }}>
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          Conversazioni
        </Typography>

        {/* New chat */}
        <Tooltip title="Nuova chat" placement="bottom">
          <IconButton size="small" onClick={onNewChat} aria-label="Nuova conversazione">
            <AddCommentIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Close sidebar — shown only when in Drawer (i.e., mobile) */}
        {onClose && (
          <Tooltip title="Chiudi" placement="bottom">
            <IconButton size="small" onClick={onClose} aria-label="Chiudi sidebar" sx={{ ml: 0.5 }}>
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Divider />

      {/* Conversation list */}
      <List dense disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
        {conversations.length === 0 && (
          <ListItem sx={{ py: 2, justifyContent: 'center' }}>
            <Typography variant="caption" color="text.disabled">
              Nessuna conversazione
            </Typography>
          </ListItem>
        )}

        {conversations.map(conv => (
          <ListItem
            key={conv.id}
            disablePadding
            secondaryAction={
              <Tooltip title="Elimina" placement="right">
                <IconButton
                  edge="end"
                  size="small"
                  aria-label={`Elimina conversazione: ${conv.title}`}
                  onClick={e => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  sx={{ opacity: 0, '.MuiListItem-root:hover &': { opacity: 1 } }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemButton
              selected={conv.id === activeId}
              onClick={() => switchConversation(conv.id)}
              aria-label={`Passa a: ${conv.title}`}
              sx={{ borderRadius: 1, mx: 0.5, my: 0.25 }}
            >
              <ListItemText
                primary={conv.title}
                slotProps={{
                  primary: {
                    sx: {
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap',
                    },
                    variant: 'body2',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

// ── SmartChat ─────────────────────────────────────────────────────────────────

export function SmartChat({ onClear, userPlan = 'free', height = '100%', initialMode }: SmartChatProps): React.ReactElement {
  const {
    messages,
    loading,
    error,
    mode,
    setMode,
    sendMessage,
    triggerAction,
    submitFeedback,
    clearMessages,
    emotionalState,
  } = useSmartChat({ initialMode });

  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [settingsOpen,  setSettingsOpen]  = useState(false);
  const [autoSandbox,   setAutoSandbox]   = useState(true);

  const { showLanding } = useChatPrefsStore();
  // Show landing only when the pref is on AND there are no existing messages
  const [landingDismissed, setLandingDismissed] = useState(false);
  const showLandingView = showLanding && !landingDismissed && messages.length === 0;

  const handleLandingStart = useCallback((text?: string) => {
    setLandingDismissed(true);
    if (text) sendMessage(text);
  }, [sendMessage]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, loading]);

  const handleClear = () => {
    clearMessages();
    onClear?.();
    if (isMobile) setDrawerOpen(false);
  };

  // Sidebar content shared between desktop panel and mobile Drawer
  const sidebarNode = (
    <ConversationSidebar
      onNewChat={handleClear}
      onClose={isMobile ? () => setDrawerOpen(false) : undefined}
    />
  );

  return (
    <Box
      sx={{
        display:         'flex',
        height,
        overflow:        'hidden',
        backgroundColor: 'background.default',
      }}
      role="main"
      aria-label="Interfaccia chat AI"
    >
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box sx={{ flexShrink: 0 }}>
          {sidebarNode}
        </Box>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          variant="temporary"
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}
          aria-label="Menu conversazioni"
        >
          {sidebarNode}
        </Drawer>
      )}

      {/* ── Main chat area ──────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}
        >
          {/* Hamburger — mobile only */}
          {isMobile && (
            <IconButton
              size="small"
              aria-label="Apri menu conversazioni"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}

          <AutoAwesomeIcon fontSize="small" color="primary" aria-hidden="true" />
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            Copilot Docente
          </Typography>
          <Tooltip title="Impostazioni chat" placement="left">
            <IconButton
              size="small"
              aria-label="Impostazioni chat"
              onClick={() => setSettingsOpen(true)}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Loading bar */}
        {loading && (
          <LinearProgress
            aria-label="Elaborazione in corso"
            sx={{ flexShrink: 0 }}
          />
        )}

        {/* Error banner */}
        {error && (
          <Box
            sx={{ px: 2, py: 1, backgroundColor: 'error.main', color: 'error.contrastText', flexShrink: 0 }}
            role="alert"
            aria-live="assertive"
          >
            <Typography variant="caption">{error}</Typography>
          </Box>
        )}

        {/* Messages area */}
        <Box
          sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
          role="log"
          aria-label="Storico conversazione"
        >
          {/* Smart landing overlay — shown on first open when no messages */}
          {showLandingView && (
            <SmartLandingView
              onStartChat={handleLandingStart}
              onOpenFullChat={() => setLandingDismissed(true)}
            />
          )}

          {!showLandingView && messages.length === 0 && !loading && (
            <Box
              sx={{
                height:         '100%',
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            1,
                opacity:        0.55,
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 48 }} color="disabled" aria-hidden="true" />
              <Typography variant="body2" color="text.disabled" align="center">
                Inizia una conversazione
              </Typography>
              <Typography variant="caption" color="text.disabled" align="center">
                Scegli una modalità e scrivi il tuo messaggio
              </Typography>
            </Box>
          )}

          {messages.map(msg =>
            msg.role === 'user'
              ? <UserBubble key={msg.id} msg={msg} />
              : (
                <AssistantMessage
                  key={msg.id}
                  msg={msg}
                  onFeedback={(id, rating) => submitFeedback(id, rating)}
                  triggerAction={agentId => triggerAction(agentId, msg.content)}
                  emotionalState={emotionalState}
                />
              )
          )}

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
              <CircularProgress size={16} aria-hidden="true" />
              <Typography variant="caption" color="text.secondary" aria-live="polite">
                Elaborazione in corso…
              </Typography>
            </Stack>
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </Box>

        <Divider />

        {/* Input area */}
        <InputBar
          mode={mode}
          setMode={setMode}
          onSend={sendMessage}
          loading={loading}
          userPlan={userPlan}
          onClear={handleClear}
          emotionalState={emotionalState}
        />
      </Box>

      {/* Settings panel — opens as a right-side Drawer */}
      <ChatSettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mode={mode}
        setMode={setMode}
        autoSandbox={autoSandbox}
        setAutoSandbox={setAutoSandbox}
      />
    </Box>
  );
}

