// MD3 GOLD COMPLIANT â€” Home: Centro di Comando Docente
// Chat AI inline + azioni contestuali per momento del giorno + documenti burocratici

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { PageWrapper, M3Surface, TextField } from './ui';
import { View, NavigationParams, ChatMessage } from '../types';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useStudentStore } from '../stores/useStudentStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useUIStore } from '../stores/useUIStore';
import { chatWithAi } from '../services/aiService';
import DailyBriefingModal from './DailyBriefingModal';

interface HomeProps {
  onNavigate: (view: View, params?: NavigationParams) => void;
  onOpenRegisterImport?: () => void;
  appState?: unknown;
  onSuggestionAction?: unknown;
  onStartClassroom?: unknown;
  finalizedRegister?: unknown;
  draftRegister?: unknown;
  showGuidanceTips?: unknown;
  suggestions?: unknown;
  dismissSuggestion?: unknown;
  onAiProcessing?: unknown;
  user?: unknown;
  onConnectDrive?: unknown;
  aiSettings?: unknown;
  settings?: unknown;
  handleOpenOperations?: unknown;
}

// â”€â”€ Azioni contestuali per ora del giorno â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getTimedActions(h: number): { label: string; icon: string; view: View; color: string }[] {
  if (h < 9) return [
    { label: 'Registro',   icon: 'menu_book',   view: 'register' as View,   color: 'var(--md-sys-color-primary)' },
    { label: 'Presenze',   icon: 'fact_check',  view: 'presenze' as View,   color: 'var(--md-sys-color-secondary)' },
    { label: 'Orario',     icon: 'schedule',    view: 'timetable' as View,  color: 'var(--md-sys-color-tertiary)' },
  ];
  if (h < 14) return [
    { label: 'Registro',        icon: 'menu_book',     view: 'register' as View,       color: 'var(--md-sys-color-primary)' },
    { label: 'Valutazioni',     icon: 'grading',       view: 'evaluations' as View,    color: 'var(--md-sys-color-secondary)' },
    { label: 'Assistente Live', icon: 'smart_display', view: 'live-assistant' as View, color: 'var(--md-sys-color-tertiary)' },
  ];
  if (h < 18) return [
    { label: 'Progettazione', icon: 'architecture', view: 'progettazione-hub' as View, color: 'var(--md-sys-color-primary)' },
    { label: 'UDA',           icon: 'layers',       view: 'uda' as View,               color: 'var(--md-sys-color-secondary)' },
    { label: 'Reportistica',  icon: 'bar_chart',    view: 'reportistica' as View,      color: 'var(--md-sys-color-tertiary)' },
  ];
  return [
    { label: 'Analisi',       icon: 'analytics',     view: 'analytics' as View,      color: 'var(--md-sys-color-primary)' },
    { label: 'Knowledge',     icon: 'library_books', view: 'knowledge-base' as View, color: 'var(--md-sys-color-secondary)' },
    { label: 'Studio AI',     icon: 'psychology',    view: 'studio' as View,         color: 'var(--md-sys-color-tertiary)' },
  ];
}

function getTimedLabel(h: number): string {
  if (h < 9)  return 'Prima di entrare in classe';
  if (h < 14) return 'In aula adesso';
  if (h < 18) return 'Nel pomeriggio';
  return 'Questa sera';
}

// â”€â”€ Prompt contestuali per ora del giorno â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getContextualPrompts(h: number): string[] {
  if (h < 9)  return ['Cosa devo fare oggi?', 'Traccia di lezione rapida', 'Studenti con pendenze BES', 'AttivitÃ  di avvio classe'];
  if (h < 14) return ['Genera una domanda per l\'interrogazione', 'Suggerisci argomento prossima ora', 'Analizza andamento classe', 'Annota un comportamento'];
  if (h < 18) return ['Genera una UDA completa', 'Scrivi la programmazione annuale', 'Compila un PDP', 'Prepara verbale consiglio'];
  return ['Relazione finale di classe', 'Analisi rendimento quadrimestre', 'Certificazione competenze', 'Cosa programmo per domani?'];
}

// â”€â”€ Documenti burocratici â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DOC_ACTIONS: { label: string; icon: string; view: View; desc: string }[] = [
  { label: 'UDA',           icon: 'layers',            view: 'uda' as View,                        desc: 'UnitÃ  di Apprendimento' },
  { label: 'Rubriche',      icon: 'checklist',          view: 'rubriche' as View,                   desc: 'Rubriche valutazione' },
  { label: 'Programmazione',icon: 'event_note',         view: 'progettazione-hub' as View,          desc: 'Piano annuale' },
  { label: 'PDP / PEI',     icon: 'accessibility',      view: 'didattica-inclusiva' as View,        desc: 'Documenti BES/DSA' },
  { label: 'Scrutinio',     icon: 'grading',            view: 'evaluations' as View,                desc: 'Preparazione scrutinio' },
  { label: 'C.d.C.',        icon: 'groups',             view: 'consiglio-di-classe' as View,        desc: 'Consiglio di Classe' },
  { label: 'Reportistica',  icon: 'summarize',          view: 'reportistica' as View,               desc: 'Relazioni e report' },
  { label: 'Orientamento',  icon: 'explore',            view: 'orientamento' as View,               desc: 'Percorso orientamento' },
  { label: 'Curriculum',    icon: 'account_tree',       view: 'curriculum-manager' as View,         desc: 'Curricolo verticale' },
  { label: 'Certificazioni',icon: 'workspace_premium',  view: 'class-competency-dashboard' as View, desc: 'Certificazioni competenze' },
];

// â”€â”€ Scadenzario normativo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getDeadlineAlerts(now: Date): { icon: string; text: string; urgency: 'error' | 'warning' | 'info' }[] {
  const m = now.getMonth() + 1; // 1â€“12
  const result: { icon: string; text: string; urgency: 'error' | 'warning' | 'info' }[] = [];
  if (m === 1)  result.push({ icon: 'assignment_late',    text: 'Scrutinio 1Â° quadrimestre in vista',            urgency: 'error' });
  if (m === 2)  result.push({ icon: 'description',        text: 'Aggiorna i PDP/PEI per il 2Â° periodo',          urgency: 'warning' });
  if (m === 3)  result.push({ icon: 'fact_check',         text: 'UDA 2Â° bimestre: verifica avanzamento',         urgency: 'warning' });
  if (m === 5)  result.push({ icon: 'workspace_premium',  text: 'Certificazioni competenze: avvia compilazione', urgency: 'error' });
  if (m === 6)  result.push({ icon: 'summarize',          text: 'Relazioni finali di classe da produrre',        urgency: 'error' });
  if (m === 9)  result.push({ icon: 'event_note',         text: 'Setup classi e programmazione annuale',         urgency: 'warning' });
  if (m === 10) result.push({ icon: 'article',            text: 'PTOF: contributo disciplinare da consegnare',   urgency: 'info' });
  return result;
}

const ALL_AREAS: { label: string; icon: string; view: string }[] = [
  { label: 'Classi',       icon: 'school',         view: 'aula' },
  { label: 'Studenti',     icon: 'group',          view: 'studenti' },
  { label: 'Calendario',   icon: 'calendar_month', view: 'calendario' },
  { label: 'Registro',     icon: 'menu_book',      view: 'register' },
  { label: 'Presenze',     icon: 'fact_check',     view: 'presenze' },
  { label: 'Inbox',        icon: 'inbox',          view: 'teacher-inbox' },
  { label: 'C.d.C.',       icon: 'groups',         view: 'consiglio-di-classe' },
  { label: 'Inclusiva',    icon: 'accessibility',  view: 'didattica-inclusiva' },
  { label: 'Live',         icon: 'smart_display',  view: 'live-assistant' },
  { label: 'Impostazioni', icon: 'settings',       view: 'settings' },
];

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const lessons  = useAcademicStore(s => s.lessons);
  const students = useStudentStore(s => s.students);
  const aiSettings   = useSettingsStore(s => s.aiSettings);
  const openAssistant = useUIStore(s => s.modals.setIsLiveAssistantModalOpen);

  const [isDailyBriefingOpen, setIsDailyBriefingOpen] = useState(false);

  // â”€â”€ Chat state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [input, setInput]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', text: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setIsLoading(true);
    try {
      const reply = await chatWithAi(aiSettings, next, {
        studentsCount: students?.length ?? 0,
        lessonsCount: Object.keys(lessons || {}).length,
      });
      setMessages(m => [...m, reply]);
    } catch {
      setMessages(m => [...m, { role: 'model', text: 'Errore di connessione AI. Controlla la configurazione nelle impostazioni.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, aiSettings, students, lessons]);

  // â”€â”€ Derived â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const now  = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buona sera';
  const dateLabel = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

  const timedActions     = useMemo(() => getTimedActions(hour), [hour]);
  const timedLabel       = useMemo(() => getTimedLabel(hour), [hour]);
  const contextualPrompts = useMemo(() => getContextualPrompts(hour), [hour]);
  const deadlineAlerts   = useMemo(() => getDeadlineAlerts(now), [now]);

  const lessonsCount = Object.keys(lessons || {}).length;
  const studentsCount = students?.length ?? 0;

  const fabLabel = hour < 14 ? 'Inizia Giornata' : 'Nuova UDA';
  const fabIcon  = hour < 14 ? 'playlist_add_check' : 'layers';

  return (
    <>
      <PageWrapper
        maxWidth="var(--md-sys-layout-content-max-width)"
        gap="var(--md-sys-spacing-5)"
        sx={{
          px: 'var(--md-sys-spacing-4)',
          pt: 'var(--md-sys-spacing-4)',
          pb: 'calc(88px + env(safe-area-inset-bottom, 0px))',
          boxSizing: 'border-box',
        }}
      >
        {/* â”€â”€ Intestazione â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--md-sys-spacing-3)' }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
              {greeting}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', textTransform: 'capitalize' }}>
              {dateLabel}
            </Typography>
          </Box>
          {(studentsCount > 0 || lessonsCount > 0) && (
            <Box sx={{ display: 'flex', gap: 'var(--md-sys-spacing-2)' }}>
              {studentsCount > 0 && (
                <ButtonBase
                  onClick={() => onNavigate('aula' as View)}
                  aria-label={`${studentsCount} studenti â€” vai a Classi`}
                  focusRipple
                  sx={{
                    textAlign: 'center', px: 'var(--md-sys-spacing-3)', py: 'var(--md-sys-spacing-2)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    bgcolor: 'var(--md-sys-color-surface-container)',
                    '&:hover': { bgcolor: 'var(--md-sys-color-surface-container-high)' },
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'var(--md-sys-color-primary)', lineHeight: 1 }}>{studentsCount}</Typography>
                  <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', display: 'block' }}>studenti</Typography>
                </ButtonBase>
              )}
              {lessonsCount > 0 && (
                <ButtonBase
                  onClick={() => onNavigate('lessons' as View)}
                  aria-label={`${lessonsCount} lezioni`}
                  focusRipple
                  sx={{
                    textAlign: 'center', px: 'var(--md-sys-spacing-3)', py: 'var(--md-sys-spacing-2)',
                    borderRadius: 'var(--md-sys-shape-corner-medium)',
                    bgcolor: 'var(--md-sys-color-surface-container)',
                    '&:hover': { bgcolor: 'var(--md-sys-color-surface-container-high)' },
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'var(--md-sys-color-tertiary)', lineHeight: 1 }}>{lessonsCount}</Typography>
                  <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', display: 'block' }}>lezioni</Typography>
                </ButtonBase>
              )}
            </Box>
          )}
        </Box>

        {/* â”€â”€ Scadenzario normativo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {deadlineAlerts.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
            {deadlineAlerts.map((a, i) => {
              const bg   = a.urgency === 'error' ? 'var(--md-sys-color-error-container)' : a.urgency === 'warning' ? 'var(--md-sys-color-tertiary-container)' : 'var(--md-sys-color-surface-container)';
              const fg   = a.urgency === 'error' ? 'var(--md-sys-color-on-error-container)' : a.urgency === 'warning' ? 'var(--md-sys-color-on-tertiary-container)' : 'var(--md-sys-color-on-surface)';
              return (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-3)', px: 'var(--md-sys-spacing-3)', py: 'var(--md-sys-spacing-2)', borderRadius: 'var(--md-sys-shape-corner-medium)', bgcolor: bg }}>
                  <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 18, color: fg, flexShrink: 0 }}>{a.icon}</Box>
                  <Typography variant="body2" sx={{ color: fg, flex: 1 }}>{a.text}</Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {/* â”€â”€ Chat inline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <M3Surface elevation={1} sx={{ borderRadius: 'var(--md-sys-shape-corner-extra-large)', overflow: 'hidden' }}>
          {/* Header chat */}
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 'var(--md-sys-spacing-4)', py: 'var(--md-sys-spacing-3)',
            borderBottom: messages.length > 0 ? 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)' : 'none',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)' }}>
              <Box component="span" className="material-symbols-outlined" aria-hidden="true"
                sx={{ fontSize: 20, color: 'var(--md-sys-color-secondary)' }}>auto_awesome</Box>
              <Typography variant="subtitle2" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
                Assistente DocenteDoc
              </Typography>
            </Box>
            <ButtonBase
              onClick={() => openAssistant?.(true)}
              aria-label="Apri assistente completo"
              sx={{
                display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-1)',
                px: 'var(--md-sys-spacing-2)', py: 'var(--md-sys-spacing-1)',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                color: 'var(--md-sys-color-primary)',
                '&:hover': { bgcolor: 'var(--md-sys-color-primary-container)' },
              }}
            >
              <Typography variant="caption" sx={{ color: 'var(--md-sys-color-primary)' }}>Espandi</Typography>
              <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 14, color: 'var(--md-sys-color-primary)' }}>open_in_full</Box>
            </ButtonBase>
          </Box>

          {/* Messaggi */}
          {messages.length > 0 && (
            <Box sx={{ maxHeight: '220px', overflowY: 'auto', px: 'var(--md-sys-spacing-4)', py: 'var(--md-sys-spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-2)' }}>
              {messages.slice(-6).map((msg, i) => (
                <Box key={i} sx={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  px: 'var(--md-sys-spacing-3)', py: 'var(--md-sys-spacing-2)',
                  borderRadius: msg.role === 'user'
                    ? 'var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large)'
                    : 'var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large)',
                  bgcolor: msg.role === 'user' ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-high)',
                }}>
                  <Typography variant="body2" sx={{
                    color: msg.role === 'user' ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.text}
                  </Typography>
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', px: 'var(--md-sys-spacing-3)' }}>
                  <CircularProgress size={14} sx={{ color: 'var(--md-sys-color-secondary)' }} />
                  <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>elaboroâ€¦</Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          )}

          {/* Prompt rapidi contestuali */}
          {messages.length === 0 && (
            <Box sx={{ px: 'var(--md-sys-spacing-4)', pt: 'var(--md-sys-spacing-2)', pb: 'var(--md-sys-spacing-2)', display: 'flex', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-2)' }}>
              {contextualPrompts.map(p => (
                <Chip
                  key={p}
                  label={p}
                  size="small"
                  variant="outlined"
                  onClick={() => sendMessage(p)}
                  sx={{
                    cursor: 'pointer',
                    borderColor: 'var(--md-sys-color-outline-variant)',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    '&:hover': { bgcolor: 'var(--md-sys-color-surface-container-high)' },
                  }}
                />
              ))}
            </Box>
          )}

          {/* Input riga */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)', px: 'var(--md-sys-spacing-3)', pb: 'var(--md-sys-spacing-3)', pt: messages.length > 0 ? 'var(--md-sys-spacing-2)' : 0 }}>
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
              }}
              placeholder="Chiedi o dai un comandoâ€¦"
              disabled={isLoading}
              aria-label="Messaggio per l'assistente AI"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 'var(--md-sys-shape-corner-large)', bgcolor: 'var(--md-sys-color-surface)' } }}
            />
            <IconButton
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              aria-label="Invia messaggio"
              sx={{
                color: 'var(--md-sys-color-primary)',
                '&:disabled': { color: 'var(--md-sys-color-outline)' },
              }}
            >
              <Box component="span" className="material-symbols-outlined" aria-hidden="true" sx={{ fontSize: 20 }}>send</Box>
            </IconButton>
          </Box>
        </M3Surface>

        {/* â”€â”€ Azioni Adesso â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Box component="section" aria-label={timedLabel}>
          <Typography variant="overline" sx={{
            color: 'var(--md-sys-color-primary)', letterSpacing: '0.08em',
            mb: 'var(--md-sys-spacing-2)', display: 'block',
          }}>
            {timedLabel}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--md-sys-spacing-3)' }}>
            {timedActions.map(a => (
              <ButtonBase
                key={String(a.view)}
                onClick={() => onNavigate(a.view)}
                aria-label={`Vai a ${a.label}`}
                focusRipple
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 'var(--md-sys-spacing-2)', p: 'var(--md-sys-spacing-4)',
                  borderRadius: 'var(--md-sys-shape-corner-large)',
                  bgcolor: 'var(--md-sys-color-surface-container)',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'var(--md-sys-color-surface-container-high)' },
                  '&:focus-visible': { outline: `2px solid ${a.color}`, outlineOffset: 2 },
                }}
              >
                <Box component="span" className="material-symbols-outlined" aria-hidden="true"
                  sx={{ fontSize: 28, color: a.color, fontVariationSettings: '"FILL" 0' }}>
                  {a.icon}
                </Box>
                <Typography variant="caption" sx={{
                  color: 'var(--md-sys-color-on-surface)',
                  fontWeight: 'var(--md-sys-typescale-weight-medium)',
                  textAlign: 'center',
                }}>
                  {a.label}
                </Typography>
              </ButtonBase>
            ))}
          </Box>
        </Box>

        {/* â”€â”€ Documenti & Burocrazia â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Box component="section" aria-label="Documenti e burocrazia">
          <Typography variant="overline" sx={{
            color: 'var(--md-sys-color-primary)', letterSpacing: '0.08em',
            mb: 'var(--md-sys-spacing-2)', display: 'block',
          }}>
            Documenti & Burocrazia
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--md-sys-spacing-2)' }}>
            {DOC_ACTIONS.map(d => (
              <ButtonBase
                key={String(d.view)}
                onClick={() => onNavigate(d.view)}
                focusRipple
                aria-label={`${d.label} â€” ${d.desc}`}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 'var(--md-sys-spacing-2)',
                  px: 'var(--md-sys-spacing-3)', py: 'var(--md-sys-spacing-2)',
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  border: 'var(--md-sys-border-width-thin) solid var(--md-sys-color-outline-variant)',
                  bgcolor: 'transparent',
                  transition: 'background-color 0.15s',
                  '&:hover': { bgcolor: 'var(--md-sys-color-surface-container)' },
                }}
              >
                <Box component="span" className="material-symbols-outlined" aria-hidden="true"
                  sx={{ fontSize: 16, color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {d.icon}
                </Box>
                <Typography variant="body2" sx={{
                  color: 'var(--md-sys-color-on-surface)',
                  fontWeight: 'var(--md-sys-typescale-weight-medium)',
                  whiteSpace: 'nowrap',
                }}>
                  {d.label}
                </Typography>
              </ButtonBase>
            ))}
          </Box>
        </Box>

        {/* â”€â”€ Tutte le aree â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Box component="section" aria-label="Tutte le aree">
          <Typography variant="overline" sx={{
            color: 'var(--md-sys-color-primary)', letterSpacing: '0.08em',
            mb: 'var(--md-sys-spacing-2)', display: 'block',
          }}>
            Tutte le aree
          </Typography>
          <Box sx={{ display: 'flex', gap: 'var(--md-sys-spacing-2)', flexWrap: 'wrap' }}>
            {ALL_AREAS.map(item => (
              <Chip
                key={item.view}
                label={item.label}
                size="small"
                variant="outlined"
                onClick={() => onNavigate(item.view as View)}
                aria-label={`Vai a ${item.label}`}
                icon={
                  <Box component="span" className="material-symbols-outlined" aria-hidden="true"
                    sx={{ fontSize: '14px !important', ml: '6px !important', color: 'var(--md-sys-color-on-surface-variant) !important' }}>
                    {item.icon}
                  </Box>
                }
                sx={{
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  '&:hover': { bgcolor: 'var(--md-sys-color-surface-container)' },
                }}
              />
            ))}
          </Box>
        </Box>
      </PageWrapper>

      {/* â”€â”€ FAB contestuale â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Fab
        color="primary"
        aria-label={fabLabel}
        onClick={hour < 14 ? () => setIsDailyBriefingOpen(true) : () => onNavigate('uda' as View)}
        sx={{
          position: 'fixed',
          bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          right: 'calc(var(--md-sys-spacing-4, 16px) + 64px)',
          zIndex: 1250,
          bgcolor: 'var(--md-sys-color-primary)',
          color: 'var(--md-sys-color-on-primary)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
        }}
      >
        <Box component="span" className="material-symbols-outlined" aria-hidden="true"
          sx={{ fontSize: 24 }}>
          {fabIcon}
        </Box>
      </Fab>

      {isDailyBriefingOpen && (
        <DailyBriefingModal
          onClose={() => setIsDailyBriefingOpen(false)}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
};

export default Home;
