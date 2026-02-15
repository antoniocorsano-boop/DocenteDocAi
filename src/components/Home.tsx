/*
=============================
DocenteDoc AI – MD3 Home Refactor
=============================

Follow these guidelines strictly to refactor Home.tsx:

1. Layout Structure
- Desktop: NavigationRail on left, main content right (handled by ViewManager/AppLayout)
- Mobile: BottomNav (if available), main content full width (handled by ViewManager/AppLayout)
- Main content: single column, centered, max-width ~800–1200px (handled by ViewManager/AppLayout)
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

import React, { useMemo } from 'react';
import BottomNav from './BottomNav';
import { View, NavigationParams } from '../types';
import { M3HeroCard, M3Card, M3Surface, M3Typography, EmptyState } from './ui';
import M3Fab from './M3Fab';
import { useAcademicStore } from '../stores/useAcademicStore';
import { useStudentStore } from '../stores/useStudentStore';

interface HomeProps {
  onNavigate: (view: View, params?: NavigationParams) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const lessons = useAcademicStore(state => state.lessons);
  const students = useStudentStore(state => state.students);
  const evaluations = useStudentStore(state => state.evaluations) || [];

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
  const activeView: View = 'home';

  return (
    <>
      <M3Surface
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--app-spacing-section)',
          width: 'var(--md-sys-percent-full)'
        }}
    >
        {/* Hero Section: Next Lesson - Enhanced with better contrast and hierarchy */}
        <M3Surface
          style={{
            padding: 'var(--md-sys-spacing-6)',
            borderRadius: 'var(--md-sys-spacing-3)',
            background: 'var(--md-sys-color-primary-container)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: 'var(--md-sys-spacing-4)'
          }}
        >
          <M3Typography 
            variant="headline-medium" 
            style={{ 
              color: 'var(--md-sys-color-on-primary-container)',
              fontWeight: '700',
              marginBottom: 'var(--md-sys-spacing-3)'
            }}
          >
            {lessonTagline}
          </M3Typography>
          <M3Typography 
            variant="body-large" 
            style={{ 
              color: 'var(--md-sys-color-on-primary-container)',
              lineHeight: '1.5'
            }}
          >
            {lessonDetails}
          </M3Typography>
        </M3Surface>
        {/* Metrics Section - Enhanced with larger numbers and better contrast */}
        <M3Surface
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--md-sys-spacing-4)',
            marginTop: 'var(--md-sys-spacing-4)'
          }}
        >
          <M3Card
            onClick={() => onNavigate('aula')}
            style={{
              padding: 'var(--md-sys-spacing-4)',
              border: '1px solid var(--md-sys-color-primary-container)'
            }}
          >
            <M3Surface style={{ textAlign: 'center' }}>
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{
                  fontSize: 'var(--md-sys-spacing-6)',
                  color: 'var(--md-sys-color-primary)',
                  marginBottom: 'var(--md-sys-spacing-2)',
                  display: 'block'
                }}
              >
                group
              </span>
              <M3Typography 
                variant="display-small" 
                style={{ 
                  color: 'var(--md-sys-color-primary)',
                  fontWeight: '700',
                  fontSize: '48px',
                  lineHeight: '56px'
                }}
              >
                {students?.length ?? 0}
              </M3Typography>
              <M3Typography 
                variant="label-large" 
                style={{ 
                  color: 'var(--md-sys-color-on-surface)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600',
                  marginTop: 'var(--md-sys-spacing-2)'
                }}
              >
                Studenti
              </M3Typography>
            </M3Surface>
          </M3Card>
          <M3Card
            onClick={() => onNavigate('evaluations' as View)}
            style={{
              padding: 'var(--md-sys-spacing-4)',
              border: '1px solid var(--md-sys-color-tertiary-container)'
            }}
          >
            <M3Surface style={{ textAlign: 'center' }}>
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{
                  fontSize: 'var(--md-sys-spacing-6)',
                  color: 'var(--md-sys-color-tertiary)',
                  marginBottom: 'var(--md-sys-spacing-2)',
                  display: 'block'
                }}
              >
                grading
              </span>
              <M3Typography 
                variant="display-small" 
                style={{ 
                  color: 'var(--md-sys-color-tertiary)',
                  fontWeight: '700',
                  fontSize: '48px',
                  lineHeight: '56px'
                }}
              >
                {evaluations?.length ?? 0}
              </M3Typography>
              <M3Typography 
                variant="label-large" 
                style={{ 
                  color: 'var(--md-sys-color-on-surface)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600',
                  marginTop: 'var(--md-sys-spacing-2)'
                }}
              >
                Valutazioni
              </M3Typography>
            </M3Surface>
          </M3Card>
        </M3Surface>
        {/* Recent Activities Section - Enhanced contrast */}
        <M3Surface style={{ marginTop: 'var(--md-sys-spacing-6)' }}>
          <M3Typography 
            variant="title-large" 
            style={{ 
              marginBottom: 'var(--md-sys-spacing-4)',
              color: 'var(--md-sys-color-on-surface)',
              fontWeight: '600'
            }}
          >
            Attività recenti
          </M3Typography>
          <M3Surface style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
            {activities.length === 0 ? (
              <EmptyState
                icon="event_busy"
                title="Nessuna attività recente"
                description="Le tue attività appariranno qui. Inizia aggiungendo una lezione o un compito."
                actionLabel="Crea attività"
                onAction={() => onNavigate('aula' as View)}
              />
            ) : (
              activities.map(activity => (
              <M3Card
                key={activity.id}
                style={{
                  padding: 'var(--md-sys-spacing-4)',
                  borderLeft: '4px solid var(--md-sys-color-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <M3Typography 
                  variant="title-medium"
                  style={{
                    color: 'var(--md-sys-color-on-surface)',
                    fontWeight: '600',
                    marginBottom: 'var(--md-sys-spacing-1)'
                  }}
                >
                  {activity.title}
                </M3Typography>
                <M3Typography 
                  variant="body-medium" 
                  style={{ 
                    color: 'var(--md-sys-color-on-surface)',
                    marginBottom: 'var(--md-sys-spacing-1)'
                  }}
                >
                  {activity.meta}
                </M3Typography>
                <M3Typography 
                  variant="label-small" 
                  style={{ 
                    color: 'var(--md-sys-color-on-surface-variant)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {activity.time}
                </M3Typography>
              </M3Card>
            ))}
            )}
          </M3Surface>
        </M3Surface>
        {/* Quick Actions Section */}
        <M3Surface style={{ marginBottom: 'var(--app-spacing-container)' }}>
          <M3Surface style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(var(--md-sys-spacing-24), var(--md-sys-grid-fr-1)))', gap: 'var(--app-spacing-container)' }}>
            <M3Card
              ariaLabel="Vai a Registro"
              onClick={() => onNavigate('register' as View)}
            >
              <M3Surface style={{ textAlign: 'center', padding: 'var(--app-spacing-container)' }}>
                {/* MD3 Exception: fontSize for icon uses px for Material Symbols, see governance contract */}
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-8)' }}>menu_book</span>
                <M3Typography variant="title-medium" style={{ marginTop: 'var(--app-spacing-component)' }}>Registro</M3Typography>
              </M3Surface>
            </M3Card>
            <M3Card
              ariaLabel="Vai a Presenze"
              onClick={() => onNavigate('presenze' as View)}
            >
              <M3Surface style={{ textAlign: 'center', padding: 'var(--app-spacing-container)' }}>
                {/* MD3 Exception: fontSize for icon uses px for Material Symbols, see governance contract */}
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-8)' }}>fact_check</span>
                <M3Typography variant="title-medium" style={{ marginTop: 'var(--app-spacing-component)' }}>Presenze</M3Typography>
              </M3Surface>
            </M3Card>
            <M3Card
              ariaLabel="Vai a Valutazioni"
              onClick={() => onNavigate('evaluations' as View)}
            >
              <M3Surface style={{ textAlign: 'center', padding: 'var(--app-spacing-container)' }}>
                {/* MD3 Exception: fontSize for icon uses px for Material Symbols, see governance contract */}
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 'var(--md-sys-spacing-8)' }}>grading</span>
                <M3Typography variant="title-medium" style={{ marginTop: 'var(--app-spacing-component)' }}>Valutazioni</M3Typography>
              </M3Surface>
            </M3Card>
          </M3Surface>
        </M3Surface>
        {/* AI Suggestions Section (commented out, enable if needed) */}
        {/*
        <M3Surface as="section" elevation={0} style={{ marginTop: 'var(--app-spacing-section)' }}>
          <M3Typography variant="title-large" style={{ marginBottom: 'var(--app-spacing-component)' }}>Suggerimenti AI</M3Typography>
          <M3SuggestionCard>
            <M3SuggestionItem suggestion="Prova la nuova funzione di generazione quiz!" />
          </M3SuggestionCard>
        </M3Surface>
        */}
        {/* Primary FAB: Inizia Giornata (MD3 floating, policy exception documented) */}
        <M3Fab
          icon={<span className="material-symbols-outlined" aria-hidden="true">playlist_add_check</span>}
          label="Inizia Giornata"
          aria-label="Inizia giornata - Appello"
          variant="primary" // MD3 Gold: fallback to allowed type
          onClick={() => onNavigate('aula' as View)}
          style={{
            position: 'fixed',
            bottom: 'var(--app-spacing-section)',
            right: 'var(--app-spacing-section)',
            /* MD3 Exception: fallback for z-index if token missing, see governance contract */
            zIndex: 'var(--app-z-modal)'
          }}
        />
      </M3Surface>
      {/* BottomNav for mobile (MD3) */}
      <BottomNav activeView={activeView} onNavigate={onNavigate} />
    </>
  );
};

export default Home;
