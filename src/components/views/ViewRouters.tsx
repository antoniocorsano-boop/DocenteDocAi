/**
 * ViewRouters.ts
 * Centralizza i router per tutte le categorie di viste
 * Usato da ViewManager per il rendering dinamico
 * 
 * Categorie di viste:
 * - Scheduling (Timetable, Calendar, Lessons)
 * - Evaluation (Evaluations, Register, Competency)
 * - Planning (UDA, Rubric, Inclusion, Curriculum)
 * - Analytics (Analytics, Reports, ConsiglioClasse)
 * - Settings (Home, Settings, KnowledgeBase, Studio, FeedManager)
 */

import React from 'react';
import { SchedulingViewsRenderer } from './SchedulingViews';
import { EvaluationViewsRenderer } from './EvaluationViews';
import { PlanningViewsRenderer } from './PlanningViews';
import { AnalyticsViewsRenderer } from './AnalyticsViews';
import { SettingsViewsRenderer } from './SettingsViews';

// Tipo per mapping automatico view → router
export type ViewCategory = 'scheduling' | 'evaluation' | 'planning' | 'analytics' | 'settings';

export type SchedulingViewType = 'timetable' | 'calendar' | 'lessons';
export type EvaluationViewType = 'evaluations' | 'register' | 'class-competency-dashboard' | 'competency-levels';
export type PlanningViewType = 'udas' | 'rubric' | 'inclusion' | 'curriculum';
export type AnalyticsViewType = 'analytics' | 'reports' | 'improvement-guide' | 'consiglio-classe';
export type SettingsViewType = 'home' | 'settings' | 'knowledge-base' | 'studio' | 'feed-manager';

export type AnyViewType = 
    | SchedulingViewType 
    | EvaluationViewType 
    | PlanningViewType 
    | AnalyticsViewType 
    | SettingsViewType;

/**
 * Mappa una vista al suo router e tipo
 * Usato da ViewManager per renderizzare dinamicamente
 */
export function getViewRouter(viewName: string): {
    category: ViewCategory;
    viewType: AnyViewType;
} | null {
    // Scheduling
    if (viewName === 'timetable') return { category: 'scheduling', viewType: 'timetable' as SchedulingViewType };
    if (viewName === 'calendar') return { category: 'scheduling', viewType: 'calendar' as SchedulingViewType };
    if (viewName === 'lessons') return { category: 'scheduling', viewType: 'lessons' as SchedulingViewType };

    // Evaluation
    if (viewName === 'evaluations') return { category: 'evaluation', viewType: 'evaluations' as EvaluationViewType };
    if (viewName === 'register') return { category: 'evaluation', viewType: 'register' as EvaluationViewType };
    if (viewName === 'class-competency-dashboard') return { category: 'evaluation', viewType: 'class-competency-dashboard' as EvaluationViewType };
    if (viewName === 'competency-levels') return { category: 'evaluation', viewType: 'competency-levels' as EvaluationViewType };

    // Planning
    if (viewName === 'udas') return { category: 'planning', viewType: 'udas' as PlanningViewType };
    if (viewName === 'rubric') return { category: 'planning', viewType: 'rubric' as PlanningViewType };
    if (viewName === 'inclusion') return { category: 'planning', viewType: 'inclusion' as PlanningViewType };
    if (viewName === 'curriculum') return { category: 'planning', viewType: 'curriculum' as PlanningViewType };

    // Analytics
    if (viewName === 'analytics') return { category: 'analytics', viewType: 'analytics' as AnalyticsViewType };
    if (viewName === 'reports') return { category: 'analytics', viewType: 'reports' as AnalyticsViewType };
    if (viewName === 'improvement-guide') return { category: 'analytics', viewType: 'improvement-guide' as AnalyticsViewType };
    if (viewName === 'consiglio-classe') return { category: 'analytics', viewType: 'consiglio-classe' as AnalyticsViewType };

    // Settings
    if (viewName === 'home') return { category: 'settings', viewType: 'home' as SettingsViewType };
    if (viewName === 'settings') return { category: 'settings', viewType: 'settings' as SettingsViewType };
    if (viewName === 'knowledge-base') return { category: 'settings', viewType: 'knowledge-base' as SettingsViewType };
    if (viewName === 'studio') return { category: 'settings', viewType: 'studio' as SettingsViewType };
    if (viewName === 'feed-manager') return { category: 'settings', viewType: 'feed-manager' as SettingsViewType };

    return null;
}

/**
 * Renderer principale che dispatcha al router corretto
 * Usato direttamente dal ViewManager
 */
export const ViewRouter: React.FC<{
    viewName: string;
    props: any; // Props generici da ViewManager
}> = ({ viewName, props }) => {
    const routing = getViewRouter(viewName);
    
    if (!routing) {
        return <div>Vista '{viewName}' non trovata</div>;
    }

    const { category, viewType } = routing;

    switch (category) {
        case 'scheduling':
            return <SchedulingViewsRenderer viewType={viewType as SchedulingViewType} props={props} />;
        case 'evaluation':
            return <EvaluationViewsRenderer viewType={viewType as EvaluationViewType} props={props} />;
        case 'planning':
            return <PlanningViewsRenderer viewType={viewType as PlanningViewType} props={props} />;
        case 'analytics':
            return <AnalyticsViewsRenderer viewType={viewType as AnalyticsViewType} props={props} />;
        case 'settings':
            return <SettingsViewsRenderer viewType={viewType as SettingsViewType} props={props} />;
        default:
            return null;
    }
};
