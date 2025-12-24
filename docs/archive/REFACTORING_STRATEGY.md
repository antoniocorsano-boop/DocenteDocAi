# Strategia di Refactoring ViewManager

## Obiettivo
Dividere il monolite ViewManager (518 righe) in router modularizzati mantenendo 100% backward compatibility e test coverage.

## Fase 1: Creazione View Router Files ✅ COMPLETATA
- ✅ SchedulingViewsRenderer (timetable, calendar, lessons)
- ✅ EvaluationViewsRenderer (evaluations, register, competency)
- ✅ PlanningViewsRenderer (uda, rubriche, didattica-inclusiva, curriculum)
- ✅ AnalyticsViewsRenderer (analytics, reports, improvement-guide, consiglio-classe)
- ✅ SettingsViewsRenderer (home, settings, knowledge-base, studio, feed-manager)
- ✅ ViewRouters.tsx (dispatcher centrale)

## Fase 2: Integrazione Graduale (IN PROGRESS)
Strategia: Integrare un router alla volta, testare, verificare che 329 test passino.

### Step 2.1: SettingsViewsRenderer Integration
- Target: home, settings, knowledge-base, studio, feed-manager
- Viste che rimangono dirette: aula, studenti, progettazione-hub, reportistica
- Comando test: `npm test` (deve passare 329 test)

### Step 2.2: SchedulingViewsRenderer Integration
- Target: timetable, calendario, lessons
- Rimangono dirette: aula, studenti, ecc...

### Step 2.3: EvaluationViewsRenderer Integration
- Target: evaluations, register, class-competency-dashboard, competency-levels

### Step 2.4: PlanningViewsRenderer Integration
- Target: uda, rubriche, didattica-inclusiva, curriculum

### Step 2.5: AnalyticsViewsRenderer Integration
- Target: analytics, reports, improvement-guide, consiglio-classe

## Fase 3: Estrazione Custom Hooks
- useStudents()
- useEvaluations()
- useCompetencies()
- useLessons()
- useUdas()

## Fase 4: Audit Finale
- Performance review (LCP, CLS, FID)
- Accessibility audit (WCAG 2.1)
- Coverage report

## Rollback Plan
Se un'integrazione causa test failures:
```bash
git checkout src/components/ViewManager.tsx
npm test  # Verifica che torna a 329 test passing
```

## Success Criteria
- ✅ Tutti 329 test passano dopo ogni step
- ✅ Zero build errors
- ✅ Nessun cambio visuale nell'UI
- ✅ Nessun cambio comportamentale nell'app
