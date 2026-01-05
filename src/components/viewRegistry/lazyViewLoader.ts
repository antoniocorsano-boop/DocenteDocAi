/**
 * View Components Configuration - Lazy Loading Setup
 * 
 * This module provides lazy-loaded view components to reduce initial bundle size.
 * Views are code-split into separate chunks and loaded on-demand using React.lazy().
 */

import React from 'react';

// Import types (these are always in main bundle)
import type { ViewProps } from '../types';

// ===== LAZY-LOADED VIEWS =====
// These heavy views are loaded on-demand

// ReportisticaHub - Most expensive (contains PDF libraries: pdfjs-dist, jspdf, pdf-lib)
// Estimated savings: 120+ kB gzip
export const ReportisticaHub = React.lazy(() => 
  import('./views/ReportisticaHub').then(m => ({ default: m.ReportisticaHub }))
);

// Calendar view - Second most expensive
// Estimated savings: 60+ kB gzip
export const Calendar = React.lazy(() => 
  import('./views/Calendar').then(m => ({ default: m.Calendar }))
);

// Studio (content creation) - Complex component
// Estimated savings: 40-50 kB gzip
export const ProgettazioneHub = React.lazy(() => 
  import('./views/ProgettazioneHub').then(m => ({ default: m.ProgettazioneHub }))
);

// Settings view
// Estimated savings: 20-30 kB gzip
export const Settings = React.lazy(() => 
  import('./views/Settings').then(m => ({ default: m.Settings }))
);

// Orientamento view
// Estimated savings: 25-35 kB gzip
export const Orientamento = React.lazy(() => 
  import('./views/Orientamento').then(m => ({ default: m.Orientamento }))
);

// ===== KEEPING IN MAIN BUNDLE =====
// These should stay in main bundle for better UX (small or frequently used)

// Home view - Entry point, always shown
// Estimated size: 20-30 kB (keep in main)
import { Home } from './views/Home';

// FlowMode - Alternative home view
// Estimated size: 15-20 kB (keep in main)
import { FlowMode } from './views/FlowMode';

// ClassSelection, ClassDashboard, ClassroomView - Classroom management
// Estimated size: 40-50 kB total (keep in main - frequently used)
import { ClassSelection, ClassDashboard, ClassroomView } from './views/ClassroomViews';

// StudentClassroomView - Student view in classroom
// Estimated size: 15-20 kB (keep in main)
import { StudentClassroomView } from './views/StudentClassroomView';

// StudentProfile view - Accessed frequently
// Estimated size: 30-40 kB (keep in main)
import { StudentProfile } from './views/StudentProfile';

// Lesson details
// Estimated size: 20-25 kB (keep in main)
import { LessonView } from './views/LessonView';

// Evaluation views
// Estimated size: 35-45 kB (keep in main)
import { EvaluationView } from './views/EvaluationView';

/**
 * View loading status tracker
 * Useful for monitoring code chunk loading performance
 */
export const viewLoadingMetrics = {
  loaded: new Set<string>(),
  timestamps: new Map<string, number>(),
  
  markLoaded(viewName: string) {
    this.loaded.add(viewName);
    this.timestamps.set(viewName, performance.now());
    console.info(`[performance] View loaded: ${viewName}`);
  },
  
  getLoadTime(viewName: string): number | null {
    return this.timestamps.get(viewName) ?? null;
  }
};

/**
 * Preload a view chunk (useful for route prefetching)
 * @param viewName - Name of view to preload
 */
export function preloadView(viewName: string) {
  const viewMap: Record<string, () => Promise<any>> = {
    'reportistica': () => import('./views/ReportisticaHub'),
    'calendario': () => import('./views/Calendar'),
    'progettazione-hub': () => import('./views/ProgettazioneHub'),
    'settings': () => import('./views/Settings'),
    'orientamento': () => import('./views/Orientamento'),
  };
  
  const loader = viewMap[viewName];
  if (loader) {
    loader().then(() => viewLoadingMetrics.markLoaded(viewName));
  }
}

/**
 * Dynamic import map for all views
 * Used by ViewManager for efficient code loading
 */
export const lazyViewMap = {
  reportistica: ReportisticaHub,
  calendario: Calendar,
  'progettazione-hub': ProgettazioneHub,
  settings: Settings,
  orientamento: Orientamento,
  home: Home as any, // Keep in main bundle but export for consistency
  'flow-mode': FlowMode as any,
  aula: ClassDashboard as any,
  'classroom': ClassroomView as any,
  'student-profile': StudentProfile as any,
  'lezione': LessonView as any,
  'valutazione': EvaluationView as any,
} as const;

export type LazyViewKey = keyof typeof lazyViewMap;
