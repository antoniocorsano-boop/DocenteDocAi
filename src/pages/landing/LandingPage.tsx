/**
 * LandingPage.tsx
 *
 * Official public landing page for DocenteDocAI.
 *
 * Sections (anchor IDs match NAV_LINKS in LandingNav):
 *   #progetto       — Hero
 *   #valori         — Valori del progetto (4 card)
 *   #funzionalita   — Cosa fa DocenteDocAI (3 feature blocks)
 *   #stakeholder    — Stakeholder view (interactive tabs)
 *   #etica-ai       — AI Responsabile
 *   #partecipa      — Partecipa al progetto + Trasparenza
 *   footer          — Privacy / ToS / Contatti
 *
 * Design:
 *   - MUI v7 + MD3 CSS tokens only (no hardcoded values)
 *   - WCAG 2.1 AA (landmark roles, aria-labels, skip-link friendly)
 *   - Responsive via MUI breakpoints / CSS grid
 */
import React, { memo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LandingNav from './LandingNav';
import StakeholderTabs from './StakeholderTabs';

// ── shared helpers ────────────────────────────────────────────────────────────

/** Full-width section wrapper with consistent vertical rhythm */
const Section: React.FC<{
  id: string;
  ariaLabel: string;
  bg?: 'default' | 'container' | 'primary-container';
  children: React.ReactNode;
}> = ({ id, ariaLabel, bg = 'default', children }) => {
  const bgMap = {
    'default':           'var(--md-sys-color-surface)',
    'container':         'var(--md-sys-color-surface-container-low)',
    'primary-container': 'var(--md-sys-color-primary-container)',
  };

  return (
    <Box
      id={id}
      component="section"
      aria-label={ariaLabel}
      sx={{
        py: { xs: 'var(--md-sys-spacing-10)', md: 'var(--md-sys-spacing-12)' },
        bgcolor: bgMap[bg],
        scrollMarginTop: 64,
      }}
    >
      <Container maxWidth="lg">{children}</Container>
    </Box>
  );
};

/** Section heading */
const SectionHeading: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <Box mb={{ xs: 'var(--md-sys-spacing-6)', md: 'var(--md-sys-spacing-8)' }}>
    <Typography
      variant="headlineMedium"
      component="h2"
      sx={{ color: 'var(--md-sys-color-on-surface)', mb: subtitle ? 'var(--md-sys-spacing-2)' : 0 }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="bodyLarge" sx={{ color: 'var(--md-sys-color-on-surface-variant)', maxWidth: 600 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

// ── HERO ──────────────────────────────────────────────────────────────────────

const Hero: React.FC = memo(() => (
  <Box
    id="progetto"
    component="section"
    aria-label="Presentazione DocenteDocAI"
    sx={{
      pt: { xs: 'var(--md-sys-spacing-10)', md: 'var(--md-sys-spacing-12)' },
      pb: { xs: 'var(--md-sys-spacing-8)', md: 'var(--md-sys-spacing-10)' },
      bgcolor: 'var(--md-sys-color-surface)',
      scrollMarginTop: 64,
    }}
  >
    <Container maxWidth="lg">
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 4, md: 8 }} alignItems="center">
        {/* Text block */}
        <Box sx={{ flex: 1, maxWidth: 640 }}>
          <Chip
            label="Progetto open · Marzo 2026"
            size="small"
            sx={{
              bgcolor: 'var(--md-sys-color-secondary-container)',
              color: 'var(--md-sys-color-on-secondary-container)',
              mb: 'var(--md-sys-spacing-3)',
              fontWeight: 'var(--md-sys-typescale-weight-medium)',
            }}
          />

          <Typography
            variant="displaySmall"
            component="h1"
            sx={{
              color: 'var(--md-sys-color-on-surface)',
              mb: 'var(--md-sys-spacing-4)',
              lineHeight: 1.15,
            }}
          >
            Intelligenza artificiale al servizio della{' '}
            <Box component="span" sx={{ color: 'var(--md-sys-color-primary)' }}>
              didattica.
            </Box>
          </Typography>

          <Typography
            variant="bodyLarge"
            sx={{
              color: 'var(--md-sys-color-on-surface-variant)',
              mb: 'var(--md-sys-spacing-6)',
              maxWidth: 580,
              lineHeight: 1.7,
            }}
          >
            DocenteDocAI aiuta gli insegnanti ad analizzare le lezioni, comprendere i processi
            di apprendimento e migliorare la progettazione didattica nel rispetto della privacy
            e della responsabilità educativa.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              aria-label="Scopri il progetto DocenteDocAI"
              href="#valori"
              component="a"
              sx={{ borderRadius: 'var(--md-sys-shape-corner-full)' }}
            >
              Scopri il progetto
            </Button>
            <Button
              variant="outlined"
              size="large"
              aria-label="Accedi alla demo di DocenteDocAI"
              href="/"
              component="a"
              sx={{ borderRadius: 'var(--md-sys-shape-corner-full)' }}
            >
              Accedi alla demo
            </Button>
            <Button
              variant="text"
              size="large"
              aria-label="Informazioni per scuole pilota"
              href="#partecipa"
              component="a"
              sx={{ color: 'var(--md-sys-color-secondary)' }}
            >
              Scuole pilota
            </Button>
          </Stack>
        </Box>

        {/* Visual block — minimal AI+education illustration using icons */}
        <Box
          aria-hidden="true"
          sx={{
            flexShrink: 0,
            width: { xs: '100%', md: 340 },
            height: { xs: 200, md: 280 },
            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
            bgcolor: 'var(--md-sys-color-primary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle decorative rings */}
          <Box sx={{
            position: 'absolute',
            inset: -40,
            borderRadius: '50%',
            border: '1px solid var(--md-sys-color-primary)',
            opacity: 0.1,
          }} />
          <Box sx={{
            position: 'absolute',
            inset: -10,
            borderRadius: '50%',
            border: '1px solid var(--md-sys-color-primary)',
            opacity: 0.08,
          }} />

          {/* Central icon cluster */}
          <Stack alignItems="center" spacing={1} sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              component="span"
              className="material-symbols-outlined"
              sx={{ fontSize: 64, color: 'var(--md-sys-color-primary)', opacity: 0.9 }}
            >
              psychology
            </Box>
            <Stack direction="row" spacing={2}>
              <Box component="span" className="material-symbols-outlined"
                sx={{ fontSize: 28, color: 'var(--md-sys-color-secondary)', opacity: 0.75 }}>
                auto_stories
              </Box>
              <Box component="span" className="material-symbols-outlined"
                sx={{ fontSize: 28, color: 'var(--md-sys-color-tertiary)', opacity: 0.75 }}>
                analytics
              </Box>
              <Box component="span" className="material-symbols-outlined"
                sx={{ fontSize: 28, color: 'var(--md-sys-color-secondary)', opacity: 0.75 }}>
                verified
              </Box>
            </Stack>
            <Typography variant="labelMedium" sx={{ color: 'var(--md-sys-color-on-primary-container)' }}>
              AI · Pedagogia · Dati
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Container>
  </Box>
));
Hero.displayName = 'Hero';

// ── VALORI ────────────────────────────────────────────────────────────────────

const VALORI = [
  {
    icon: 'school',
    title: 'Educazione prima della tecnologia',
    body: "L'AI è uno strumento. La decisione pedagogica resta always al docente.",
    color: 'var(--md-sys-color-primary)',
  },
  {
    icon: 'visibility',
    title: 'Trasparenza',
    body: 'Ogni suggerimento AI mostra le sue ragioni. Nessuna black-box nella didattica.',
    color: 'var(--md-sys-color-secondary)',
  },
  {
    icon: 'balance',
    title: 'Responsabilità',
    body: 'Il docente è titolare del trattamento dei dati e responsabile delle scelte educative.',
    color: 'var(--md-sys-color-tertiary)',
  },
  {
    icon: 'lock',
    title: 'Rispetto dei dati',
    body: "Privacy by design: i dati degli studenti non escono dal dispositivo senza consenso esplicito.",
    color: 'var(--md-sys-color-error)',
  },
];

const ValoriSection: React.FC = memo(() => (
  <Section id="valori" ariaLabel="Valori del progetto DocenteDocAI">
    <SectionHeading
      title="Valori del progetto"
      subtitle="I principi che guidano ogni scelta tecnica e pedagogica."
    />
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 'var(--md-sys-spacing-4)',
      }}
    >
      {VALORI.map(v => (
        <Card
          key={v.title}
          variant="outlined"
          sx={{
            borderRadius: 'var(--md-sys-shape-corner-large)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            bgcolor: 'var(--md-sys-color-surface-container-low)',
            p: 'var(--md-sys-spacing-2)',
            transition: 'transform 0.15s, border-color 0.15s',
            '&:hover': { transform: 'translateY(-2px)', borderColor: v.color },
          }}
        >
          <CardContent>
            <Box
              component="span"
              className="material-symbols-outlined"
              aria-hidden="true"
              sx={{ fontSize: 32, color: v.color, display: 'block', mb: 'var(--md-sys-spacing-3)' }}
            >
              {v.icon}
            </Box>
            <Typography
              variant="titleSmall"
              component="h3"
              sx={{ color: 'var(--md-sys-color-on-surface)', mb: 'var(--md-sys-spacing-2)' }}
            >
              {v.title}
            </Typography>
            <Typography variant="bodySmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {v.body}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Section>
));
ValoriSection.displayName = 'ValoriSection';

// ── FUNZIONALITÀ ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: 'account_tree',
    title: 'Analisi pedagogica',
    badge: 'Bloom Taxonomy',
    body: 'Ogni lezione e UDA viene analizzata rispetto ai 6 livelli cognitivi della Tassonomia di Bloom (ricordare, comprendere, applicare, analizzare, valutare, creare). Il sistema identifica squilibri e lacune nella progressione didattica.',
    pills: ['Analisi automatica', 'Distribuzione cognitiva', 'Progressione curricolare'],
  },
  {
    icon: 'recommend',
    title: 'Raccomandazioni didattiche',
    badge: 'AI Decision Support',
    body: 'Il sistema genera suggerimenti contestuali basati sulla storia della classe e sulle performance individuali. Ogni raccomandazione include il livello Bloom target, le attività proposte e la motivazione del sistema.',
    pills: ['Personalizzazione per classe', 'Attività generate', 'Motivazione esplicita'],
  },
  {
    icon: 'verified',
    title: 'Indicatori di fiducia',
    badge: 'Trust Score',
    body: 'Un punteggio di affidabilità accompagna ogni output AI: valuta la qualità dei dati, la coerenza pedagogica e il livello di incertezza del modello. Il docente può calibrare il peso da dare a ogni suggerimento.',
    pills: ['Confidence score', 'Explainability', 'Controllo docente'],
  },
];

const FunzionalitaSection: React.FC = memo(() => (
  <Section id="funzionalita" ariaLabel="Funzionalità di DocenteDocAI" bg="container">
    <SectionHeading
      title="Cosa fa DocenteDocAI"
      subtitle="Tre aree di supporto alla professionalità docente."
    />
    <Stack spacing="var(--md-sys-spacing-5)">
      {FEATURES.map((f, i) => (
        <Card
          key={f.title}
          variant="outlined"
          sx={{
            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
            borderColor: 'var(--md-sys-color-outline-variant)',
            bgcolor: 'var(--md-sys-color-surface)',
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: 'var(--md-sys-spacing-5) !important' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 5 }} alignItems={{ md: 'center' }}>
              {/* Number + icon */}
              <Stack alignItems="center" spacing={1} sx={{ flexShrink: 0, minWidth: 80 }}>
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    bgcolor: 'var(--md-sys-color-primary-container)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="span"
                    className="material-symbols-outlined"
                    sx={{ fontSize: 28, color: 'var(--md-sys-color-primary)' }}
                  >
                    {f.icon}
                  </Box>
                </Box>
                <Typography
                  variant="labelSmall"
                  sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  aria-hidden
                >
                  0{i + 1}
                </Typography>
              </Stack>

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb="var(--md-sys-spacing-2)" flexWrap="wrap">
                  <Typography
                    variant="titleMedium"
                    component="h3"
                    sx={{ color: 'var(--md-sys-color-on-surface)' }}
                  >
                    {f.title}
                  </Typography>
                  <Chip
                    label={f.badge}
                    size="small"
                    sx={{
                      bgcolor: 'var(--md-sys-color-secondary-container)',
                      color: 'var(--md-sys-color-on-secondary-container)',
                      fontWeight: 'var(--md-sys-typescale-weight-medium)',
                    }}
                  />
                </Stack>
                <Typography
                  variant="bodyMedium"
                  sx={{ color: 'var(--md-sys-color-on-surface-variant)', mb: 'var(--md-sys-spacing-3)', lineHeight: 1.7 }}
                >
                  {f.body}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {f.pills.map(p => (
                    <Chip
                      key={p}
                      label={p}
                      size="small"
                      icon={<CheckCircleOutlineIcon fontSize="small" aria-hidden />}
                      sx={{
                        bgcolor: 'var(--md-sys-color-surface-container)',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        border: '1px solid var(--md-sys-color-outline-variant)',
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Section>
));
FunzionalitaSection.displayName = 'FunzionalitaSection';

// ── STAKEHOLDER ───────────────────────────────────────────────────────────────

const StakeholderSection: React.FC = memo(() => (
  <Section id="stakeholder" ariaLabel="Valore per diversi stakeholder">
    <SectionHeading
      title="A chi si rivolge"
      subtitle="DocenteDocAI è progettato per rispondere a esigenze diverse nel mondo della scuola."
    />
    <StakeholderTabs />
  </Section>
));
StakeholderSection.displayName = 'StakeholderSection';

// ── ETICA AI ──────────────────────────────────────────────────────────────────

const ETICA_ITEMS = [
  { icon: 'visibility',          title: 'Trasparenza algoritmica', body: "Ogni output dell'AI è accompagnato da spiegazione leggibile. Il docente vede i fattori che hanno determinato il suggerimento e il loro peso relativo." },
  { icon: 'manage_accounts',     title: 'Controllo docente',       body: 'Il sistema fornisce suggerimenti, non decisioni. La valutazione e la scelta pedagogica restano sempre nella responsabilità del professionista.' },
  { icon: 'privacy_tip',         title: 'Protezione dei dati',     body: 'Dati studenti gestiti con architettura privacy-by-design. Conformità ai principi GDPR UE 2016/679 e alle Linee guida MIM sulla digitalizzazione.' },
  { icon: 'quiz',                title: 'Spiegabilità (XAI)',      body: "Il sistema espone il suo ragionamento in linguaggio pedagogico comprensibile al docente, non in termini tecnici opachi." },
];

const EticaAISection: React.FC = memo(() => (
  <Section id="etica-ai" ariaLabel="AI responsabile e principi etici" bg="container">
    <SectionHeading
      title="AI Responsabile"
      subtitle="Il sistema è progettato attorno a principi di AI etica applicata all'educazione."
    />

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        gap: 'var(--md-sys-spacing-4)',
        mb: 'var(--md-sys-spacing-6)',
      }}
    >
      {ETICA_ITEMS.map(item => (
        <Stack
          key={item.title}
          direction="row"
          spacing={2}
          alignItems="flex-start"
          sx={{
            p: 'var(--md-sys-spacing-4)',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            bgcolor: 'var(--md-sys-color-surface)',
            border: '1px solid var(--md-sys-color-outline-variant)',
          }}
        >
          <Box
            component="span"
            className="material-symbols-outlined"
            aria-hidden="true"
            sx={{ color: 'var(--md-sys-color-secondary)', fontSize: 24, flexShrink: 0, mt: 0.25 }}
          >
            {item.icon}
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="labelLarge" component="h3" sx={{ color: 'var(--md-sys-color-on-surface)' }}>
              {item.title}
            </Typography>
            <Typography variant="bodySmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {item.body}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Box>

    {/* Compliance badges */}
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
      {['GDPR UE 2016/679', 'Linee guida AI MIM', 'Privacy by Design', 'Ethical AI Guidelines'].map(label => (
        <Chip
          key={label}
          label={label}
          icon={<CheckCircleOutlineIcon fontSize="small" aria-hidden />}
          sx={{
            bgcolor: 'var(--md-sys-color-primary-container)',
            color: 'var(--md-sys-color-on-primary-container)',
            fontWeight: 'var(--md-sys-typescale-weight-medium)',
          }}
        />
      ))}
    </Stack>
  </Section>
));
EticaAISection.displayName = 'EticaAISection';

// ── PARTECIPA ─────────────────────────────────────────────────────────────────

const PARTECIPA_CARDS = [
  {
    icon: 'school',
    title: 'Scuole pilota',
    body: 'La prima fase pilota è aperta a istituti scolastici interessati a sperimentare DocenteDocAI in contesti reali. Collaboriamo per adottare e validare il sistema.',
    cta: 'Contattaci per il pilota',
    href: 'mailto:info@docentedoc.app?subject=Richiesta%20scuola%20pilota',
  },
  {
    icon: 'person',
    title: 'Docenti interessati',
    body: 'Se sei un docente e vuoi partecipare alla beta, accedere alla demo o contribuire con feedback pedagogico, scrivici.',
    cta: 'Accedi alla demo',
    href: '/',
  },
  {
    icon: 'biotech',
    title: 'Collaborazioni accademiche',
    body: 'Ricercatori e università interessati a partnership per la validazione empirica dei modelli pedagogici sono benvenuti.',
    cta: 'Scrivici',
    href: 'mailto:info@docentedoc.app?subject=Collaborazione%20accademica',
  },
];

const PartecipaSection: React.FC = memo(() => (
  <Section id="partecipa" ariaLabel="Partecipa al progetto DocenteDocAI">
    <SectionHeading
      title="Partecipa al progetto"
      subtitle="Stiamo costruendo qualcosa di utile. Aiutaci a farlo meglio."
    />

    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 'var(--md-sys-spacing-4)',
        mb: 'var(--md-sys-spacing-10)',
      }}
    >
      {PARTECIPA_CARDS.map(card => (
        <Card
          key={card.title}
          sx={{
            borderRadius: 'var(--md-sys-shape-corner-extra-large)',
            bgcolor: 'var(--md-sys-color-surface-container)',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--md-sys-color-outline-variant)',
          }}
        >
          <CardContent sx={{ flex: 1, p: 'var(--md-sys-spacing-5) !important' }}>
            <Box
              component="span"
              className="material-symbols-outlined"
              aria-hidden="true"
              sx={{
                display: 'block',
                fontSize: 36,
                color: 'var(--md-sys-color-primary)',
                mb: 'var(--md-sys-spacing-3)',
              }}
            >
              {card.icon}
            </Box>
            <Typography
              variant="titleMedium"
              component="h3"
              sx={{ color: 'var(--md-sys-color-on-surface)', mb: 'var(--md-sys-spacing-2)' }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="bodySmall"
              sx={{ color: 'var(--md-sys-color-on-surface-variant)', mb: 'var(--md-sys-spacing-4)', lineHeight: 1.6 }}
            >
              {card.body}
            </Typography>
          </CardContent>
          <Box px="var(--md-sys-spacing-5)" pb="var(--md-sys-spacing-4)">
            <Button
              variant="outlined"
              size="small"
              href={card.href}
              component="a"
              endIcon={<ArrowForwardIcon />}
              aria-label={card.cta}
              sx={{ borderRadius: 'var(--md-sys-shape-corner-full)' }}
            >
              {card.cta}
            </Button>
          </Box>
        </Card>
      ))}
    </Box>

    {/* Trasparenza ─────────────────────────────────────────────────────────── */}
    <Box
      sx={{
        p: 'var(--md-sys-spacing-5)',
        borderRadius: 'var(--md-sys-shape-corner-extra-large)',
        border: '1px solid var(--md-sys-color-primary)',
        bgcolor: 'var(--md-sys-color-primary-container)',
      }}
    >
      <Typography
        variant="titleMedium"
        component="h3"
        sx={{ color: 'var(--md-sys-color-on-primary-container)', mb: 'var(--md-sys-spacing-3)' }}
      >
        Trasparenza del progetto
      </Typography>
      <Typography
        variant="bodyMedium"
        sx={{ color: 'var(--md-sys-color-on-primary-container)', mb: 'var(--md-sys-spacing-4)', maxWidth: 560 }}
      >
        Il progetto è sviluppato in modo aperto. Puoi esaminare la documentazione tecnica,
        la roadmap e i principi etici che guidano le scelte di design.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
        {[
          { label: 'Documentazione tecnica', href: '/docs/ARCHITECTURE.md' },
          { label: 'Roadmap di sviluppo',    href: '/docs/ROADMAP.md' },
          { label: 'Principi etici',         href: '/docs/PIANI_SVILUPPO.md' },
          { label: 'Stato di sviluppo',      href: '/docs/CLAUDE.md' },
        ].map(link => (
          <Button
            key={link.label}
            variant="outlined"
            size="small"
            href={link.href}
            component="a"
            aria-label={link.label}
            sx={{
              borderColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-primary)',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              bgcolor: 'var(--md-sys-color-surface)',
              '&:hover': { bgcolor: 'var(--md-sys-color-surface-container)' },
            }}
          >
            {link.label}
          </Button>
        ))}
      </Stack>
    </Box>
  </Section>
));
PartecipaSection.displayName = 'PartecipaSection';

// ── FOOTER ────────────────────────────────────────────────────────────────────

const LandingFooter: React.FC = memo(() => (
  <Box
    component="footer"
    sx={{
      py: 'var(--md-sys-spacing-8)',
      bgcolor: 'var(--md-sys-color-surface-container-high)',
      borderTop: '1px solid var(--md-sys-color-outline-variant)',
    }}
  >
    <Container maxWidth="lg">
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ md: 'center' }}
        spacing={{ xs: 4, md: 2 }}
      >
        {/* Brand */}
        <Stack spacing={1}>
          <Typography
            variant="titleSmall"
            sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 'var(--md-sys-typescale-weight-bold)' }}
          >
            DocenteDocAI
          </Typography>
          <Typography variant="bodySmall" sx={{ color: 'var(--md-sys-color-on-surface-variant)', maxWidth: 280 }}>
            Intelligenza artificiale al servizio della didattica italiana. Progetto in fase pilota — Marzo 2026.
          </Typography>
        </Stack>

        {/* Links */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} flexWrap="wrap" useFlexGap>
          <Link
            href="/"
            color="inherit"
            underline="hover"
            variant="bodySmall"
            aria-label="Privacy policy"
            sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Privacy policy
          </Link>
          <Link
            href="/"
            color="inherit"
            underline="hover"
            variant="bodySmall"
            aria-label="Termini di utilizzo"
            sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Termini di utilizzo
          </Link>
          <Link
            href="mailto:info@docentedoc.app"
            color="inherit"
            underline="hover"
            variant="bodySmall"
            aria-label="Contatti email"
            sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            Contatti
          </Link>
          <Typography
            variant="bodySmall"
            sx={{ color: 'var(--md-sys-color-outline)', cursor: 'default' }}
            title="Dichiarazione di accessibilità in preparazione"
          >
            Dichiarazione di accessibilità (in preparazione)
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 'var(--md-sys-spacing-4)', borderColor: 'var(--md-sys-color-outline-variant)' }} />

      <Typography variant="bodySmall" sx={{ color: 'var(--md-sys-color-outline)', textAlign: 'center' }}>
        © 2026 DocenteDocAI — Strumento pedagogico sperimentale. Tutti i dati rimangono sul dispositivo del docente.
      </Typography>
    </Container>
  </Box>
));
LandingFooter.displayName = 'LandingFooter';

// ── ROOT COMPONENT ────────────────────────────────────────────────────────────

const LandingPage: React.FC = () => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: 'var(--md-sys-color-surface)',
      color: 'var(--md-sys-color-on-surface)',
    }}
  >
    {/* Skip link for keyboard/screen-reader users */}
    <Box
      component="a"
      href="#progetto"
      sx={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: 1,
        height: 1,
        overflow: 'hidden',
        '&:focus': {
          position: 'fixed',
          left: 'var(--md-sys-spacing-3)',
          top: 'var(--md-sys-spacing-3)',
          width: 'auto',
          height: 'auto',
          zIndex: 9999,
          p: 'var(--md-sys-spacing-2)',
          bgcolor: 'var(--md-sys-color-primary)',
          color: 'var(--md-sys-color-on-primary)',
          borderRadius: 'var(--md-sys-shape-corner-medium)',
        },
      }}
    >
      Vai al contenuto principale
    </Box>

    <LandingNav />

    <Box component="main" id="progetto">
      <Hero />
      <ValoriSection />
      <FunzionalitaSection />
      <StakeholderSection />
      <EticaAISection />
      <PartecipaSection />
    </Box>

    <LandingFooter />
  </Box>
);

export default LandingPage;
