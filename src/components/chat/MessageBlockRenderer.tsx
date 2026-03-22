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
}  from '@mui/material';
import ExpandMoreIcon      from '@mui/icons-material/ExpandMore';
import SmartToyIcon        from '@mui/icons-material/SmartToy';
import MemoryIcon          from '@mui/icons-material/Memory';
import CheckCircleIcon     from '@mui/icons-material/CheckCircle';
import ErrorIcon           from '@mui/icons-material/Error';
import InfoIcon            from '@mui/icons-material/Info';
import WarningIcon         from '@mui/icons-material/Warning';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Legend,
} from 'recharts';

import { dispatchAction }  from '@/modules/orchestration/ActionBridge';
import { SandboxBlock }    from './SandboxBlock';
import type { UIBlock, FormField } from '@/types/uiBlocks';

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  block:         UIBlock;
  /** Called when an action button is pressed */
  onAction?:     (agentId: string) => void;
  /** Whether to show the insight panel expanded by default */
  insightExpanded?: boolean;
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

// ── Actions block ─────────────────────────────────────────────────────────────

const ActionsBlock = memo(({ actions, onAction }: {
  actions:  NonNullable<Extract<UIBlock, { type: 'actions' }>['actions']>;
  onAction?: (agentId: string) => void;
}) => (
  <Stack
    direction="row"
    spacing={1}
    flexWrap="wrap"
    useFlexGap
    role="group"
    aria-label="Azioni disponibili"
  >
    {actions.map(action => (
      <Tooltip key={action.agentId} title={action.hint ?? ''} disableHoverListener={!action.hint}>
        <Button
          size="small"
          variant="outlined"
          aria-label={action.hint ? `${action.label}: ${action.hint}` : action.label}
          onClick={() => onAction?.(action.agentId)}
        >
          {action.label}
        </Button>
      </Tooltip>
    ))}
  </Stack>
));
ActionsBlock.displayName = 'ActionsBlock';

// ── Insight block ─────────────────────────────────────────────────────────────

type InsightBlockType = Extract<UIBlock, { type: 'insight' }>;

const InsightBlock = memo(({ data, expanded }: {
  data:     InsightBlockType['data'];
  expanded: boolean;
}) => {
  const confPct = Math.round((data.confidence ?? 0) * 100);

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
            {`Trasparenza · confidenza ${confPct}% · ${data.intentType}`}
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

export const MessageBlockRenderer = memo(({ block, onAction, insightExpanded = false }: Props) => {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.content} />;

    case 'plan':
      return <PlanBlock steps={block.steps} />;

    case 'actions':
      return <ActionsBlock actions={block.actions} onAction={onAction} />;

    case 'insight':
      return <InsightBlock data={block.data} expanded={insightExpanded} />;

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

    default:
      return null;
  }
});
MessageBlockRenderer.displayName = 'MessageBlockRenderer';
