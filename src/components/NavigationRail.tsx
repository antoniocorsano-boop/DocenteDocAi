// MD3 Gold Compliant
// NavigationRail - In-flow vertical navigation for desktop/tablet
// Audit: febbraio 2026

import React from "react";
import { View } from "../types";
import { M3Typography } from "./ui";

export interface NavigationRailItem {
  id: View;
  label: string;
  icon: string;
  activeIcon: string;
  badge?: number;
}

export interface NavigationRailProps {
  items: NavigationRailItem[];
  activeView: View;
  onNavigate: (view: View, context?: unknown) => void;
}

const isItemActive = (
  item: NavigationRailItem,
  currentView: View
): boolean => {
  const parentMap: Partial<Record<View, View[]>> = {
    "progettazione-hub": [
      "knowledge-base",
      "studio",
      "lessons",
      "uda",
      "rubriche",
      "reportistica",
      "didattica-inclusiva",
      "curriculum-manager",
    ],
    aula: [
      "evaluations",
      "register",
      "studenti",
      "improvement-guide",
      "consiglio-di-classe",
      "class-competency-dashboard",
      "analytics",
      "teacher-inbox",
    ],
  };
  return (
    currentView === item.id ||
    (parentMap[item.id]?.includes(currentView) ?? false)
  );
};

const TRANSITION_STYLE =
  "background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-emphasized), color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-emphasized)";
const BADGE_ANIMATION =
  "nav-badge-appear var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-emphasized)";

const NavigationRail: React.FC<NavigationRailProps> = ({
  items,
  activeView,
  onNavigate,
}) => {
  return (
    <>
      <style>{`
        @keyframes nav-badge-appear {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <nav
        aria-label="Navigazione principale"
        role="navigation"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "var(--app-nav-rail-width, var(--md-sys-spacing-20))",
          height: "var(--app-nav-rail-height, auto)",
          paddingTop: "var(--app-spacing-section)",
          paddingBottom: "var(--app-spacing-section)",
          gap: "var(--app-spacing-component)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {items.map((item) => {
          const isActive = isItemActive(item, activeView);
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id, null)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              style={{
                backgroundColor: isActive
                  ? "var(--md-sys-color-primary-container)"
                  : "transparent",
                color: isActive
                  ? "var(--md-sys-color-on-primary-container)"
                  : "var(--md-sys-color-on-surface-variant)",
                border: "none",
                cursor: "pointer",
                outline: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--md-sys-spacing-1)",
                width: "var(--md-sys-spacing-14)",
                minHeight: "var(--md-sys-spacing-14)",
                padding: "var(--app-spacing-component) 0",
                borderRadius:
                  "var(--md-sys-shape-corner-extra-large, var(--md-sys-radius-4))",
                boxShadow: isActive ? "var(--md-sys-elevation-1)" : "none",
                transition: TRANSITION_STYLE,
                WebkitTapHighlightColor: "transparent",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "var(--md-sys-spacing-8)",
                  height: "var(--md-sys-spacing-8)",
                  borderRadius: "var(--md-sys-radius-full)",
                }}
              >
                <span
                  style={{
                    fontFamily: "Material Symbols Outlined",
                    fontSize: "var(--md-sys-spacing-6)",
                    lineHeight: 1,
                    color: "inherit",
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                      : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  }}
                  aria-hidden="true"
                >
                  {isActive ? item.activeIcon : item.icon}
                </span>
                {item.badge != null && item.badge > 0 && (
                  <span
                    aria-label={`${item.badge} notifiche`}
                    style={{
                      position: "absolute",
                      top: "calc(-1 * var(--md-sys-spacing-1))",
                      right: "calc(-1 * var(--md-sys-spacing-1))",
                      minWidth: "var(--md-sys-spacing-4)",
                      height: "var(--md-sys-spacing-4)",
                      padding: "0 var(--md-sys-spacing-1)",
                      backgroundColor: "var(--md-sys-color-error)",
                      color: "var(--md-sys-color-on-error)",
                      borderRadius: "var(--md-sys-radius-full)",
                      fontSize: "var(--md-sys-spacing-3)",
                      fontWeight: "700",
                      lineHeight: "var(--md-sys-spacing-4)",
                      textAlign: "center",
                      zIndex: "var(--md-sys-z-raised)",
                      animation: BADGE_ANIMATION,
                    }}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <M3Typography
                variant="label-medium"
                style={{
                  fontSize: "var(--md-sys-spacing-3)",
                  fontWeight: isActive ? "600" : "500",
                  textAlign: "center",
                  color: "inherit",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "var(--md-sys-spacing-14)",
                }}
              >
                {item.label}
              </M3Typography>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default NavigationRail;
