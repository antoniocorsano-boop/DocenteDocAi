/*
=============================
DocenteDoc AI – MD3 Home Refactor
=============================

Follow these guidelines strictly to refactor Home.tsx:

1. Layout Structure
- Desktop: NavigationRail on left, main content right (handled by ViewManager/AppLayout)
- Mobile: BottomNav (if available), main content full width (handled by ViewManager/AppLayout)
- Main content: single column, centered, max-width ~var(--md-sys-layout-content-max-width) (handled by ViewManager/AppLayout)
- All spacing/padding use MD3 tokens (--md-sys-spacing-*)
- Avoid mixing shorthand and non-shorthand padding/margin

2. Section Order
- Hero Section: logo, title, description (MD3 typography tokens)
- Quick Actions: grid of M3Card for main actions
- Metrics Overview: M3Card clickable, secondary navigation
- Next Lesson: M3HeroCard, remove unsupported props title/description
- Recent Activity: M3ExpressiveCard + M3ActivityItem
- AI Suggestions: M3SuggestionCard + M3SuggestionItem
- Primary Action: FAB bottom-right, variant "filled", icon + text, aria-label present

3. Actions Hierarchy
- Primary: FAB (daily main action)
- Secondary: M3Button filled/outlined (section actions)
- Tertiary: M3Button text / IconButton (dismiss, toggle)
- Clickable Cards: M3Card for secondary navigation or metrics

4. Typography & Accessibility
- Use MD3 typography tokens for all text
- Color contrast >= 4.5:1 for important text
- All interactive elements keyboard-focusable
- Icon-only spans: aria-hidden=true
- Buttons/FAB: descriptive aria-label

5. Data & Logic
- Preserve all existing data (students, lessons, evaluations, suggestions)
- Provide fallback for empty arrays
- Remove unused variables and imports

6. Cleanup
- Remove empty lines and placeholders
- Fix invalid props (e.g., M3Button variant)
- Ensure spacing and alignment consistent with MD3
- Ensure FAB does not overlap content

7. Output
- Refactored Home.tsx fully MD3 Gold compliant
- Ready to compile without lint errors
- Layout responsive and accessible

=============================
*/

import React, { useMemo, useRef, useEffect } from 'react';
import { View, NavigationParams } from '../types';
import { M3Surface, M3Typography, M3Chip, M3StateLayer } from './ui';
import M3HeroCard from './ui/M3HeroCard';
import M3Fab from './M3Fab';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useStudentStore } from '../stores/useStudentStore';

interface HomeProps {
  onNavigate: (view: View, params?: NavigationParams) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const lessons = useAcademicStore(state => state.lessons);
  const students = useStudentStore(state => state.students);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const evaluations = useStudentStore(state => state.evaluations) || [];

  // Ref to the nearest scrollable ancestor — passed to M3Fab for auto-collapse on scroll
  const anchorRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    let el: HTMLElement | null = anchorRef.current?.parentElement ?? null;
    while (el) {
      const { overflowY } = getComputedStyle(el);
      if (overflowY === 'auto' || overflowY === 'scroll') {
        scrollContainerRef.current = el;
        break;
      }
      el = el.parentElement;
    }
  }, []);

  interface RecentActivity {
    id: string;
    title: string;
    meta?: string;
    time?: string;
  }
  const activities: RecentActivity[] = useMemo(() => {
    const acts: RecentActivity[] = [];
    const recentLessons = Object.values(lessons || {}).slice(0, 3);
    recentLessons.forEach(lesson => {
      acts.push({
        id: `lesson-${lesson.id}`,
        title: 'Lezione pianificata',
        meta: `${lesson.materia} - ${lesson.classe}`,
        time: 'Oggi'
      });
    });
    const recentEvals = evaluations.slice(0, 2);
    recentEvals.forEach(evaluation => {
      acts.push({
        id: `eval-${evaluation.id}`,
        title: 'Valutazione inserita',
        meta: `${evaluation.materia} - ${evaluation.studenteId}`,
        time: 'Ieri'
      });
    });
    return acts.slice(0, 5);
  }, [lessons, evaluations]);

  const nextLesson = useMemo(() => {
    const list = Object.values(lessons || {});
    return list.length ? list[0] : null;
  }, [lessons]);
  const lessonTagline = nextLesson ? `${nextLesson.classe} • ${nextLesson.tipoLezione ?? 'Lezione in classe'}` : 'Pianifica la prossima lezione';
  const lessonDetails = nextLesson?.obiettivi || nextLesson?.contenuto || 'Utilizza l’integrazione AI per costruire contenuti e obiettivi in pochi tap.';

  // Time-based greeting
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buongiorno';
    if (h < 18) return 'Buon pomeriggio';
    return 'Buona sera';
  }, []);

  // Quick action chips definition
  const quickActions: { label: string; icon: string; view: View }[] = [
    { label: 'Registro',    icon: 'menu_book',    view: 'register' as View },
    { label: 'Presenze',    icon: 'fact_check',   view: 'presenze' as View },
    { label: 'Valutazioni', icon: 'grading',      view: 'evaluations' as View },
    { label: 'Orario',      icon: 'schedule',     view: 'timetable' as View },
    { label: 'Agenda',      icon: 'calendar_month', view: 'calendario' as View },
  ];

  return (
    <>
      {/* Invisible anchor used to find the scrollable parent for FAB collapse */}
      <div ref={anchorRef} style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true" />

      <M3Surface
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-6)',
          padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-4) calc(var(--md-sys-spacing-20) + env(safe-area-inset-bottom, 0px))', // eslint-disable-line design-system/enforce-token-usage -- env(safe-area-inset-bottom) is a native iOS/Android CSS API
          maxWidth: 'var(--md-sys-layout-content-max-width)',
          margin: '0 var(--md-sys-margin-auto)',
          width: 'var(--md-sys-percent-100)',
          boxSizing: 'border-box',
        }}
      >
        {/* ── HERO BANNER ─────────────────────────────────────────── */}
        <M3HeroCard
          headline={greeting}
          supportingText={
            nextLesson
              ? `${lessonTagline} — ${lessonDetails.slice(0, 60)}${lessonDetails.length > 60 ? '…' : ''}`
              : lessonDetails
          }
          decorativeIcon={nextLesson ? 'school' : 'auto_awesome'}
          color="primary"
        />

        {/* ── QUICK ACTION CHIPS (horizontal scroll) ───────────────── */}
        <div
          role="toolbar"
          aria-label="Azioni rapide"
          style={{
            display: 'flex',
            gap: 'var(--md-sys-spacing-2)',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 'var(--md-sys-spacing-1)',
            // Hide scrollbar but keep scroll
            scrollbarWidth: 'none',
          }}
        >
          {quickActions.map(qa => (
            <div key={qa.view} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
              <M3Chip
                label={qa.label}
                variant="outlined"
                onClick={() => onNavigate(qa.view)}
                aria-label={`Vai a ${qa.label}`}
              />
            </div>
          ))}
        </div>

        {/* ── METRIC CARDS (2-col grid) ────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'var(--md-sys-grid-fr-1) var(--md-sys-grid-fr-1)',
            gap: 'var(--md-sys-spacing-3)',
          }}
        >
          {/* Studenti */}
          <M3StateLayer
            as="div"
            role="button"
            tabIndex={0}
            stateColor="var(--md-sys-color-on-surface)"
            onClick={() => onNavigate('aula')}
            onKeyDown={e => e.key === 'Enter' && onNavigate('aula')}
            aria-label={`${students?.length ?? 0} studenti — vai a Classi`}
            style={{
              borderRadius: 'var(--md-sys-shape-corner-large)',
              background: 'var(--md-sys-color-surface-container-low)',
              padding: 'var(--md-sys-spacing-4)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--md-sys-spacing-3)',
            }}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
              style={{
                fontSize: 'var(--md-sys-spacing-6)',
                color: 'var(--md-sys-color-primary)',
                fontVariationSettings: '"FILL" 0',
              }}
            >group</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
              <div style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
                fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
                lineHeight: 'var(--md-sys-typescale-headline-medium-line-height)',
                color: 'var(--md-sys-color-on-surface)',
              }}>
                {students?.length ?? 0}
              </div>
              <div style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--md-sys-typescale-label-medium-font-size)',
                fontWeight: 'var(--md-sys-typescale-label-medium-font-weight)',
                color: 'var(--md-sys-color-on-surface-variant)',
              }}>Studenti</div>
            </div>
          </M3StateLayer>

          {/* Valutazioni */}
          <M3StateLayer
            as="div"
            role="button"
            tabIndex={0}
            stateColor="var(--md-sys-color-on-surface)"
            onClick={() => onNavigate('evaluations' as View)}
            onKeyDown={e => e.key === 'Enter' && onNavigate('evaluations' as View)}
            aria-label={`${evaluations?.length ?? 0} valutazioni`}
            style={{
              borderRadius: 'var(--md-sys-shape-corner-large)',
              background: 'var(--md-sys-color-surface-container-low)',
              padding: 'var(--md-sys-spacing-4)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--md-sys-spacing-3)',
            }}
          >
            <span
              className="material-symbols-outlined"
              aria-hidden="true"
              style={{
                fontSize: 'var(--md-sys-spacing-6)',
                color: 'var(--md-sys-color-tertiary)',
                fontVariationSettings: '"FILL" 0',
              }}
            >grading</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-4)' }}>
              <div style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
                fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
                lineHeight: 'var(--md-sys-typescale-headline-medium-line-height)',
                color: 'var(--md-sys-color-on-surface)',
              }}>
                {evaluations?.length ?? 0}
              </div>
              <div style={{
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--md-sys-typescale-label-medium-font-size)',
                fontWeight: 'var(--md-sys-typescale-label-medium-font-weight)',
                color: 'var(--md-sys-color-on-surface-variant)',
              }}>Valutazioni</div>
            </div>
          </M3StateLayer>
        </div>

        {/* ── RECENT ACTIVITY ──────────────────────────────────────── */}
        <section aria-label="Attività recenti">
          <M3Typography
            variant="title-large"
            style={{ marginBottom: 'var(--md-sys-spacing-3)' }}
          >
            Attività recenti
          </M3Typography>

          {activities.length === 0 ? (
            <M3Surface
              level={2}
              shape="corner-large"
              style={{
                padding: 'var(--md-sys-spacing-6)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--md-sys-spacing-2)',
              }}
            >
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{
                  fontSize: 'var(--md-sys-spacing-10)',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  fontVariationSettings: '"FILL" 0, "wght" 300',
                }}
              >event_busy</span>
              <M3Typography variant="title-medium">Nessuna attività recente</M3Typography>
              <M3Typography variant="body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Le tue attività appariranno qui
              </M3Typography>
            </M3Surface>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-1)' }}>
              {activities.map((activity, index) => (
                <M3StateLayer
                  key={activity.id}
                  as="div"
                  style={{
                    borderRadius: index === 0
                      ? 'var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-small)'
                      : index === activities.length - 1
                      ? 'var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-small) var(--md-sys-shape-corner-large) var(--md-sys-shape-corner-large)'
                      : 'var(--md-sys-shape-corner-small)',
                    background: 'var(--md-sys-color-surface-container)',
                    padding: 'var(--md-sys-spacing-4) var(--md-sys-spacing-5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-4)',
                  }}
                >
                  {/* Left accent indicator */}
                  <span
                    aria-hidden="true"
                    style={{
                      width: 'var(--md-sys-spacing-1)',
                      alignSelf: 'stretch',
                      borderRadius: 'var(--md-sys-shape-corner-full)',
                      background: 'var(--md-sys-color-primary)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <M3Typography variant="title-small" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                      {activity.title}
                    </M3Typography>
                    {activity.meta && (
                      <M3Typography variant="body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--md-sys-spacing-1)' }}>
                        {activity.meta}
                      </M3Typography>
                    )}
                  </div>
                  {activity.time && (
                    <M3Typography variant="label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', flexShrink: 0 }}>
                      {activity.time}
                    </M3Typography>
                  )}
                </M3StateLayer>
              ))}
            </div>
          )}
        </section>
      </M3Surface>

      {/* ── PRIMARY FAB ──────────────────────────────────────────── */}
      <M3Fab
        icon={<span className="material-symbols-outlined" aria-hidden="true">playlist_add_check</span>}
        label="Inizia Giornata"
        aria-label="Inizia giornata - Appello"
        variant="primary"
        scrollContainerRef={scrollContainerRef}
        onClick={() => onNavigate('aula' as View)}
        style={{
          position: 'fixed',
          bottom: 'calc(var(--md-sys-spacing-16) + var(--md-sys-spacing-4) + env(safe-area-inset-bottom, 0px))', // eslint-disable-line design-system/enforce-token-usage -- env(safe-area-inset-bottom) is a native iOS/Android CSS API
          right: 'var(--md-sys-spacing-4)',
          zIndex: 'var(--md-sys-z-modal)',
        }}
      />
    </>
  );
};

export default Home;
