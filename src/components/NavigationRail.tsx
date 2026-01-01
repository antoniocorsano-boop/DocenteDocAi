import React from 'react';
import { View } from '../types';
import './navigation-rail.css';

/**
 * NavigationRail - M3 Expressive vertical navigation component
 * 
 * Specifications:
 * - Width: 80px (icon + label stacked)
 * - Icons: 24px Material Symbols
 * - Labels: .m3-label-medium
 * - Elevation: flat with surface-variant border
 * - Animation: 0.3s smooth transitions
 * - Responsive: Collapses to bottom nav on mobile (<600px)
 */

export interface NavigationRailItem {
  /** Unique view identifier */
  id: View;
  /** Display label */
  label: string;
  /** Material Symbol icon name (default state) */
  icon: string;
  /** Material Symbol icon name (active state) */
  activeIcon: string;
  /** Optional badge count */
  badge?: number;
}

export interface NavigationRailProps {
  /** Navigation items to display */
  items: NavigationRailItem[];
  /** Currently active view */
  activeView: View;
  /** Navigation callback */
  onNavigate: (view: View, context?: unknown) => void;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Determines if a view is considered active based on the current view and parent mappings
 */
const isItemActive = (item: NavigationRailItem, currentView: View): boolean => {
  // Define parent-child view relationships
  const parentMap: Partial<Record<View, View[]>> = {
    'progettazione-hub': [
      'knowledge-base', 'studio', 'lessons', 'uda', 'rubriche', 
      'reportistica', 'didattica-inclusiva', 'curriculum-manager'
    ],
    'aula': [
      'evaluations', 'register', 'studenti', 'improvement-guide', 
      'consiglio-di-classe', 'class-competency-dashboard', 'analytics', 'teacher-inbox'
    ],
  };
  
  return currentView === item.id || (parentMap[item.id]?.includes(currentView) ?? false);
};

const NavigationRail: React.FC<NavigationRailProps> = ({
  items,
  activeView,
  onNavigate,
  className = '',
}) => {
  return (
    <nav
      className={`m3-navigation-rail ${className}`}
      role="navigation"
      aria-label="Navigazione principale"
    >
      <div className="m3-navigation-rail__container">
        {items.map((item) => {
          const isActive = isItemActive(item, activeView);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id, null)}
              className={`m3-navigation-rail__item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon Container */}
              <div className="m3-navigation-rail__icon-container">
                <span
                  className={`material-symbols-outlined ${isActive ? 'filled-icon' : ''}`}
                  aria-hidden="true"
                >
                  {isActive ? item.activeIcon : item.icon}
                </span>
                
                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <span className="m3-navigation-rail__badge" aria-label={`${item.badge} notifiche`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span className="m3-navigation-rail__label m3-label-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationRail;
