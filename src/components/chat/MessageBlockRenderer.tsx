/**
 * MessageBlockRenderer.tsx — P36.5
 *
 * Renders a single UIBlock as a MUI v7 / MD3-compliant component.
 * Used by SmartChat to iterate over message.blocks.
 *
 * Rules:
 *   - No custom MD3 components — only MUI primitives (Box, Typography, etc.)
 *   - Every interactive element has aria-label
 *   - No inline fontSize / fontWeight strings on semantic text
 */
import React, { memo, useState, useCallback } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  LinearProgress,
}  from '@mui/material';
import ExpandMoreIcon      from '@mui/icons-material/ExpandMore';
import SmartToyIcon        from '@mui/icons-material/SmartToy';
import MemoryIcon          from '@mui/icons-material/Memory';
import CheckCircleIcon     from '@mui/icons-material/CheckCircle';
import ErrorIcon           from '@mui/icons-material/Error';
import InfoIcon            from '@mui/icons-material/Info';
import WarningIcon         from '@mui/icons-material/Warning';
import HelpOutlineIcon     from '@mui/icons-material/HelpOutline';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Legend,
} from 'recharts';

import { dispatchAction }  from '@/modules/orchestration/ActionBridge';
import { observe }         from '@/utils/observability';
import { useChatPrefsStore } from '@/stores/useChatPrefsStore';
import { SandboxBlock }    from './SandboxBlock';
import type { UIBlock, FormField } from '@/types/uiBlocks';
import type { EmotionalState }    from '@/modules/orchestration/EmotionalEngine';

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  block:            UIBlock;
  /** Called when an action button is pressed */
  onAction?:        (agentId: string) => void;
  /** Whether to show the insight panel expanded by default */
  insightExpanded?: boolean;
  /** Emotional state — used for dynamic microcopy in the insight accordion */
  emotionalState?:  EmotionalState;
}

// ── Text block ────────────────────────────────────────────────────────────────

const TextBlock = memo(({ content }: { content: string }) => (
  <Typography
    component="div"
    variant="body1"
    sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7 }}
  >
    {content}
  </Typography>
));
TextBlock.displayName = 'TextBlock';

// ── Plan block ────────────────────────────────────────────────────────────────

const PlanBlock = memo(({ steps }: { steps: string[] }) => (
  <Box
    sx={{
      borderLeft: '3px solid',
      borderColor: 'primary.main',
      pl: 2,
      py: 0.5,
    }}
  >
    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
      Ragionamento multi-step
    </Typography>
    <List dense disablePadding>
      {steps.map((step, idx) => (
        <ListItem key={idx} disablePadding sx={{ py: 0.25 }}>
          <ListItemText
            primary={
              <Typography variant="body2" color="text.secondary">
                {`${idx + 1}. ${step}`}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  </Box>
));
PlanBlock.displayName = 'PlanBlock';

// ── DecisionCard block (P42) — unified primary action + explain + confidence ──

type DecisionCardBlockType = Extract<UIBlock, { type: 'decision_card' }>;

const DecisionCardBlock = memo((
  { primaryAction, secondaryActions, explainItems, confidence, nextAction, onAction }:
  Omit<DecisionCardBlockType, 'type'> & { onAction?: (agentId: string) => void }
) => {
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const [explainOpen,   setExplainOpen]   = useState(false);
  const [factorsOpen,   setFactorsOpen]   = useState(false);
  const [applied,       setApplied]       = useState(false);

  const primaryLabel = nextAction ?? primaryAction.label;
  const isHighConf   = nextAction === 'Usa questa soluzione';
  const isLowConf    = nextAction === 'Migliora la richiesta';

  // P42.5 — button color/variant driven by score for emotional feedback in a glance
  const score = confidence?.score;
  const btnColor: 'success' | 'primary' | 'warning' =
    !score            ? 'primary'
    : score >= 0.80   ? 'success'
    : score >= 0.60   ? 'primary'
    : 'warning';
  const btnVariant: 'contained' | 'outlined' =
    !score || score >= 0.60 ? 'contained' : 'outlined';

  // P42.5 — very high confidence: micro-hint to act without hesitation
  const showAutoHint = score != null && score > 0.90 && !applied;

  const confPct   = confidence ? Math.round(confidence.score * 100) : null;
  const confColor: 'success' | 'warning' | 'error' = !confidence
    ? 'success'
    : confidence.score >= 0.70 ? 'success'
    : confidence.score >= 0.40 ? 'warning'
    : 'error';

  const hasFooter = secondaryActions.length > 0
    || (explainItems && explainItems.length > 0)
    || (confidence && confidence.factors.length > 0);

  return (
    <Paper
      variant="outlined"
      sx={{ borderRadius: 2, overflow: 'hidden' }}
      role="region"
      aria-label="Azione consigliata e trasparenza risposta"
    >
      {/* Primary action row */}
      <Box sx={{ p: 1.5, pb: hasFooter ? 1 : 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button
            variant={btnVariant}
            color={btnColor}
            size="medium"
            onClick={() => {
              setApplied(true);
              onAction?.(primaryAction.agentId);
            }}
            aria-label={
              primaryAction.hint
                ? `${primaryLabel}: ${primaryAction.hint}`
                : primaryLabel
            }
          >
            {isHighConf ? '⚡ ' : isLowConf ? '✏️ ' : ''}{primaryLabel}
          </Button>

          {/* P42.5 — lock-in moment: close the mental loop after action */}
          {applied && (
            <Chip
              size="small"
              label={isLowConf ? '✏️ Puoi ancora modificarla' : '✅ Applicato'}
              color={isLowConf ? 'default' : 'success'}
              variant="outlined"
            />
          )}

          {/* Inline confidence bar */}
          {confidence && (
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flex: 1, minWidth: 100 }}>
              <LinearProgress
                variant="determinate"
                value={confPct!}
                color={confColor}
                sx={{ flex: 1, height: 4, borderRadius: 2 }}
                aria-hidden="true"
              />
              <Typography variant="caption" color={`${confColor}.main`} sx={{ flexShrink: 0, minWidth: 32 }}>
                {confPct}%
              </Typography>
            </Stack>
          )}
        </Stack>

        {primaryAction.reason && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, pl: 0.25 }}>
            💡 {primaryAction.reason}
          </Typography>
        )}

        {/* P42.5 — auto-hint when confidence is exceptional: nudge to act without hesitation */}
        {showAutoHint && (
          <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
            Puoi usarla direttamente — affidabilità ottima
          </Typography>
        )}
      </Box>

      {/* Footer: secondary actions + explain + factors */}
      {hasFooter && (
        <>
          <Divider />
          <Box sx={{ px: 1.5, py: 1 }}>
            <Stack spacing={0.75}>

              {/* Secondary actions */}
              {secondaryActions.length > 0 && (
                <Box>
                  <Button
                    size="small"
                    variant="text"
                    sx={{ p: 0, minWidth: 0 }}
                    onClick={() => setSecondaryOpen(v => !v)}
                    aria-expanded={secondaryOpen}
                    aria-controls="dc-secondary"
                  >
                    <Typography variant="caption" color="text.secondary">
                      {secondaryOpen ? '▾' : '▸'} Altre azioni ({secondaryActions.length})
                    </Typography>
                  </Button>
                  {secondaryOpen && (
                    <Stack
                      id="dc-secondary"
                      direction="row"
                      spacing={0.75}
                      flexWrap="wrap"
                      useFlexGap
                      sx={{ mt: 0.5 }}
                      role="group"
                      aria-label="Azioni secondarie"
                    >
                      {secondaryActions.map(a => (
                        <Button
                          key={a.agentId}
                          size="small"
                          variant="outlined"
                          onClick={() => onAction?.(a.agentId)}
                          aria-label={a.hint ? `${a.label}: ${a.hint}` : a.label}
                        >
                          {a.label}
                        </Button>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}

              {/* Explain section */}
              {explainItems && explainItems.length > 0 && (
                <Box>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <HelpOutlineIcon
                      sx={{ fontSize: 'var(--md-sys-icon-size-xs, 16px)', color: 'info.main' }}
                      aria-hidden="true"
                    />
                    <Button
                      size="small"
                      variant="text"
                      sx={{ p: 0, minWidth: 0 }}
                      onClick={() => {
                        if (!explainOpen) {
                          observe('explain.opened', {});
                          useChatPrefsStore.getState().recordExplainOpened();
                        }
                        setExplainOpen(v => !v);
                      }}
                      aria-expanded={explainOpen}
                      aria-controls="dc-explain"
                    >
                      <Typography variant="caption" color="text.secondary">
                        Perché questa risposta? {explainOpen ? '▾' : '▸'}
                      </Typography>
                    </Button>
                  </Stack>
                  {explainOpen && (
                    <List id="dc-explain" dense disablePadding sx={{ mt: 0.25, pl: 2.5 }}>
                      {explainItems.map((item, idx) => (
                        <ListItem key={idx} disablePadding sx={{ py: 0.15 }}>
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography variant="caption" color="text.secondary">
                                → {item}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              )}

              {/* Confidence factors */}
              {confidence && confidence.factors.length > 0 && (
                <Box>
                  <Button
                    size="small"
                    variant="text"
                    sx={{ p: 0, minWidth: 0 }}
                    onClick={() => setFactorsOpen(v => !v)}
                    aria-expanded={factorsOpen}
                    aria-controls="dc-factors"
                  >
                    <Typography variant="caption" color="text.secondary">
                      {factorsOpen ? '▾' : '▸'} Dettagli affidabilità
                    </Typography>
                  </Button>
                  {factorsOpen && (
                    <List id="dc-factors" dense disablePadding sx={{ mt: 0.25 }}>
                      {confidence.factors.map((f, idx) => (
                        <ListItem key={idx} disablePadding sx={{ py: 0.15 }}>
                          <ListItemText
                            disableTypography
                            primary={
                              <Typography variant="caption" color="text.secondary">
                                • {f}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              )}

            </Stack>
          </Box>
        </>
      )}
    </Paper>
  );
});
DecisionCardBlock.displayName = 'DecisionCardBlock';

// ── Actions block ─────────────────────────────────────────────────────────────

// ── ExplainWhy block (P40) ───────────────────────────────────────────────────

const ExplainBlock = memo(({ items }: { items: string[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <Box
      sx={{
        borderLeft: '2px solid',
        borderColor: 'info.light',
        pl: 1.5,
        py: 0.5,
      }}
      role="region"
      aria-label="Spiegazione risposta AI"
    >
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <HelpOutlineIcon sx={{ fontSize: 'var(--md-sys-icon-size-xs, 16px)', color: 'info.main' }} aria-hidden="true" />
        <Typography variant="caption" color="text.secondary">
          Perché questa risposta?
        </Typography>
        <Button
          size="small"
          variant="text"
          sx={{ p: 0, minWidth: 0, lineHeight: 1 }}
          onClick={() => {
            if (!open) {
              // P40.2: one-shot learning — track engagement with explain blocks
              observe('explain.opened', {});
              useChatPrefsStore.getState().recordExplainOpened();
            }
            setOpen(v => !v);
          }}
          aria-expanded={open}
          aria-controls="explain-block-list"
        >
          <Typography variant="caption" color="primary.main">
            {open ? 'Nascondi' : 'Mostra'}
          </Typography>
        </Button>
      </Stack>
      {open && (
        <List
          id="explain-block-list"
          dense
          disablePadding
          sx={{ mt: 0.5 }}
        >
          {items.map((item, idx) => (
            <ListItem key={idx} disablePadding sx={{ py: 0.2, alignItems: 'flex-start' }}>
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="caption" color="text.secondary">
                    → {item}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
});
ExplainBlock.displayName = 'ExplainBlock';

// ── Confidence block (P41) ───────────────────────────────────────────────────

const ConfidenceBlock = memo(({ score, factors }: { score: number; factors: string[] }) => {
  const [open, setOpen] = useState(false);
  const pct   = Math.round(score * 100);
  const color: 'success' | 'warning' | 'error' =
    score >= 0.70 ? 'success' : score >= 0.40 ? 'warning' : 'error';

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
      role="region"
      aria-label={`Affidabilità risposta: ${pct}%`}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
          Affidabilità
        </Typography>
        <LinearProgress
          variant="determinate"
          value={pct}
          color={color}
          sx={{ flex: 1, height: 4, borderRadius: 2 }}
          aria-hidden="true"
        />
        <Typography variant="caption" color={`${color}.main`} sx={{ flexShrink: 0, minWidth: 32 }}>
          {pct}%
        </Typography>
        {factors.length > 0 && (
          <Button
            size="small"
            variant="text"
            sx={{ p: 0, minWidth: 0, lineHeight: 1 }}
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="confidence-block-factors"
          >
            <Typography variant="caption" color="text.secondary">
              {open ? 'Nascondi' : 'Dettagli'}
            </Typography>
          </Button>
        )}
      </Stack>
      {open && (
        <List
          id="confidence-block-factors"
          dense
          disablePadding
          sx={{ mt: 0.25 }}
        >
          {factors.map((f, idx) => (
            <ListItem key={idx} disablePadding sx={{ py: 0.15, alignItems: 'flex-start' }}>
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="caption" color="text.secondary">
                    • {f}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
});
ConfidenceBlock.displayName = 'ConfidenceBlock';

const ActionsBlock = memo(({ actions, onAction }: {
  actions:  NonNullable<Extract<UIBlock, { type: 'actions' }>['actions']>;
  onAction?: (agentId: string) => void;
}) => {
  const hasReasons = actions.some(a => a.reason);
  return (
    <Stack
      direction={hasReasons ? 'column' : 'row'}
      spacing={hasReasons ? 0.75 : 1}
      flexWrap={hasReasons ? undefined : 'wrap'}
      useFlexGap={!hasReasons}
      role="group"
      aria-label="Azioni disponibili"
    >
      {actions.map(action => (
        <Box key={action.agentId}>
          <Tooltip title={action.hint ?? ''} disableHoverListener={!action.hint}>
            <Button
              size="small"
              variant="outlined"
              aria-label={action.hint ? `${action.label}: ${action.hint}` : action.label}
              onClick={() => onAction?.(action.agentId)}
            >
              {action.label}
            </Button>
          </Tooltip>
          {action.reason && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.25, pl: 0.25 }}
            >
              💡 {action.reason}
            </Typography>
          )}
        </Box>
      ))}
    </Stack>
  );
});
ActionsBlock.displayName = 'ActionsBlock';

// ── Insight block ─────────────────────────────────────────────────────────────

/** Dynamic accordion summary label based on current emotional state */
const INSIGHT_SUMMARY_LABEL: Record<EmotionalState, string> = {
  focused:       'Trasparenza',
  exploring:     'Dettagli tecnici',
  overloaded:    'Cosa è stato elaborato',
  blocked:       'Come posso aiutarti',
  goal_oriented: 'Riepilogo elaborazione',
};

type InsightBlockType = Extract<UIBlock, { type: 'insight' }>;

const InsightBlock = memo(({ data, expanded, emotionalState }: {
  data:            InsightBlockType['data'];
  expanded:        boolean;
  emotionalState?: EmotionalState;
}) => {
  const confPct     = Math.round((data.confidence ?? 0) * 100);
  const summaryLabel = emotionalState
    ? INSIGHT_SUMMARY_LABEL[emotionalState]
    : 'Trasparenza';

  return (
    <Accordion defaultExpanded={expanded} disableGutters square elevation={0}
      sx={{ backgroundColor: 'transparent', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon fontSize="small" />}
        aria-controls="insight-details"
        id="insight-header"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <SmartToyIcon fontSize="small" sx={{ color: 'text.secondary' }} aria-hidden="true" />
          <Typography variant="caption" color="text.secondary">
            {`${summaryLabel} · confidenza ${confPct}% · ${data.intentType}`}
          </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        <Stack spacing={1}>
          {/* Agents used */}
          <Box>
            <Typography variant="caption" color="text.secondary">Agenti invocati</Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.25 }}>
              {data.agentsUsed.map(a => (
                <Chip key={a} label={a} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>

          {/* Memory items */}
          {data.memoryUsed && data.memoryItems.length > 0 && (
            <Box>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <MemoryIcon fontSize="small" sx={{ color: 'text.secondary' }} aria-hidden="true" />
                <Typography variant="caption" color="text.secondary">Contesto memoria</Typography>
              </Stack>
              <List dense disablePadding sx={{ mt: 0.25 }}>
                {data.memoryItems.map((item, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemText
                      disableTypography
                      primary={<Typography variant="caption" color="text.secondary">{item}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Adaptive hints */}
          {data.adaptiveHints.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">Selezione adattiva</Typography>
              {data.adaptiveHints.map((hint, idx) => (
                <Typography key={idx} variant="caption" display="block" color="text.secondary">
                  {`· ${hint}`}
                </Typography>
              ))}
            </Box>
          )}

          <Divider />
          <Typography variant="caption" color="text.secondary">
            {`Modalità: ${data.mode} · Durata: ${data.durationMs.toFixed(0)}ms · Memoria: ${data.memoryUsed ? 'sì' : 'no'}`}
          </Typography>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
});
InsightBlock.displayName = 'InsightBlock';

// ── Status block ──────────────────────────────────────────────────────────────

type StatusBlockType = Extract<UIBlock, { type: 'status' }>;

const StatusBlock = memo(({ data }: { data: StatusBlockType['data'] }) => (
  <Alert
    severity={data.severity}
    sx={{ py: 0.25 }}
    role="status"
    aria-live="polite"
  >
    <Typography variant="caption">
      {data.detail ? `${data.label} — ${data.detail}` : data.label}
    </Typography>
  </Alert>
));
StatusBlock.displayName = 'StatusBlock';

// ── Form block (P37) ─────────────────────────────────────────────────────────

type FormBlockType = Extract<UIBlock, { type: 'form' }>;

const FormBlock = memo(({ schema }: { schema: FormBlockType['schema'] }) => {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      schema.fields.map(f => [f.name, String(f.defaultValue ?? '')]),
    ),
  );
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    await dispatchAction({ type: 'form_submit', id: schema.actionId, data: values });
    setSubmitting(false);
  }, [schema.actionId, values]);

  const renderField = (field: FormField) => {
    const value = values[field.name] ?? '';

    if (field.type === 'select' && field.options) {
      return (
        <FormControl key={field.name} size="small" fullWidth required={field.required}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value}
            label={field.label}
            onChange={e => handleChange(field.name, e.target.value)}
            aria-label={field.label}
          >
            {field.options.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        key={field.name}
        size="small"
        fullWidth
        required={field.required}
        label={field.label}
        type={field.type === 'textarea' ? 'text' : field.type}
        multiline={field.type === 'textarea'}
        minRows={field.type === 'textarea' ? 3 : undefined}
        placeholder={field.placeholder}
        value={value}
        onChange={e => handleChange(field.name, e.target.value)}
        inputProps={{ 'aria-label': field.label }}
      />
    );
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
      {schema.title && (
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>{schema.title}</Typography>
      )}
      <Stack spacing={1.5}>
        {schema.fields.map(renderField)}
        <Button
          variant="contained"
          size="small"
          disabled={submitting}
          onClick={handleSubmit}
          startIcon={submitting ? <CircularProgress size={14} aria-hidden="true" /> : undefined}
          aria-label={schema.submitLabel ?? 'Invia modulo'}
          sx={{ alignSelf: 'flex-start' }}
        >
          {schema.submitLabel ?? 'Invia'}
        </Button>
      </Stack>
    </Paper>
  );
});
FormBlock.displayName = 'FormBlock';

// ── Table block (P37) ─────────────────────────────────────────────────────────

type TableBlockType = Extract<UIBlock, { type: 'table' }>;

const TableBlock = memo(({ config }: { config: TableBlockType['config'] }) => (
  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
    <Table size="small" aria-label={config.caption ?? 'Tabella dati'}>
      <TableHead>
        <TableRow sx={{ '& th': { fontWeight: 600 } }}>
          {config.columns.map(col => (
            <TableCell key={col}>{col}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {config.rows.map((row, i) => (
          <TableRow key={i} hover>
            {config.columns.map(col => (
              <TableCell key={col}>
                <Typography variant="body2">
                  {row[col] != null ? String(row[col]) : '—'}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {config.caption && (
      <Box sx={{ px: 1.5, py: 0.75, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">{config.caption}</Typography>
      </Box>
    )}
  </TableContainer>
));
TableBlock.displayName = 'TableBlock';

// ── Chart block (P37) ─────────────────────────────────────────────────────────

const CHART_COLORS = ['#6750A4', '#625B71', '#7D5260', '#1976d2', '#388e3c', '#f57c00'];

type ChartBlockType = Extract<UIBlock, { type: 'chart' }>;

const ChartBlock = memo(({ config }: { config: ChartBlockType['config'] }) => {
  const colors  = config.colors?.length ? config.colors : CHART_COLORS;
  const xKey    = config.xKey  ?? 'name';
  const yKeys   = config.yKeys ?? ['value'];
  const h       = 240;

  const inner = (() => {
    switch (config.chartType) {
      case 'bar':
        return (
          <BarChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <ReTooltip />
            <Legend />
            {yKeys.map((k, i) => <Bar key={k} dataKey={k} fill={colors[i % colors.length]} />)}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <ReTooltip />
            <Legend />
            {yKeys.map((k, i) => <Line key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} />)}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <ReTooltip />
            <Legend />
            {yKeys.map((k, i) => (
              <Area key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.2} />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={config.data} dataKey={yKeys[0] ?? 'value'} nameKey={xKey} cx="50%" cy="50%" outerRadius={80} label>
              {config.data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
            <ReTooltip />
            <Legend />
          </PieChart>
        );
    }
  })();

  return (
    <Box sx={{ width: '100%' }}>
      {config.title && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          {config.title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={h} aria-label={config.title ?? 'Grafico dati'}>
        {inner}
      </ResponsiveContainer>
    </Box>
  );
});
ChartBlock.displayName = 'ChartBlock';

// ── Timeline block (P37) ──────────────────────────────────────────────────────

type TimelineBlockType = Extract<UIBlock, { type: 'timeline' }>;

const TYPE_ICONS: Record<string, React.ReactElement> = {
  success: <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} aria-hidden="true" />,
  error:   <ErrorIcon        sx={{ fontSize: 16, color: 'error.main'   }} aria-hidden="true" />,
  warning: <WarningIcon      sx={{ fontSize: 16, color: 'warning.main' }} aria-hidden="true" />,
  info:    <InfoIcon         sx={{ fontSize: 16, color: 'info.main'    }} aria-hidden="true" />,
};

const TimelineBlock = memo(({ events }: { events: TimelineBlockType['events'] }) => (
  <Stack spacing={0} aria-label="Timeline eventi">
    {events.map((ev, i) => (
      <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
        {/* Connector */}
        <Stack alignItems="center" sx={{ pt: 0.4 }}>
          <Box sx={{ zIndex: 1 }}>
            {TYPE_ICONS[ev.type ?? 'info']}
          </Box>
          {i < events.length - 1 && (
            <Box sx={{ width: 2, flex: 1, minHeight: 24, backgroundColor: 'divider', mt: 0.25 }} />
          )}
        </Stack>

        {/* Content */}
        <Box sx={{ pb: i < events.length - 1 ? 1.5 : 0 }}>
          <Typography variant="caption" color="text.secondary">{ev.date}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'var(--md-sys-typescale-weight-medium)' }}>{ev.title}</Typography>
          {ev.description && (
            <Typography variant="caption" color="text.secondary" display="block">
              {ev.description}
            </Typography>
          )}
        </Box>
      </Stack>
    ))}
  </Stack>
));
TimelineBlock.displayName = 'TimelineBlock';

// ── Main renderer ─────────────────────────────────────────────────────────────

export const MessageBlockRenderer = memo(({ block, onAction, insightExpanded = false, emotionalState }: Props) => {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.content} />;

    case 'plan':
      return <PlanBlock steps={block.steps} />;

    case 'actions':
      return <ActionsBlock actions={block.actions} onAction={onAction} />;

    case 'insight':
      return <InsightBlock data={block.data} expanded={insightExpanded} emotionalState={emotionalState} />;

    case 'status':
      return <StatusBlock data={block.data} />;

    case 'form':
      return <FormBlock schema={block.schema} />;

    case 'table':
      return <TableBlock config={block.config} />;

    case 'chart':
      return <ChartBlock config={block.config} />;

    case 'sandbox':
      return <SandboxBlock config={block.config} />;

    case 'timeline':
      return <TimelineBlock events={block.events} />;

    case 'explain':
      return <ExplainBlock items={block.items} />;

    case 'confidence':
      return <ConfidenceBlock score={block.score} factors={block.factors} />;

    case 'decision_card':
      return (
        <DecisionCardBlock
          primaryAction={block.primaryAction}
          secondaryActions={block.secondaryActions}
          explainItems={block.explainItems}
          confidence={block.confidence}
          nextAction={block.nextAction}
          onAction={onAction}
        />
      );

    default:
      return null;
  }
});
MessageBlockRenderer.displayName = 'MessageBlockRenderer';
