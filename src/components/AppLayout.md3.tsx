// MD3 Gold Compliant
// Tutti gli stili usano esclusivamente token MD3 (nessun valore hardcoded)
// Audit: febbraio 2026

import React from "react";
import { Header } from "./Header";
import NavigationRail from "./NavigationRail";
import BottomNav from "./BottomNav";
import {
  View,
  UserProfile,
  TimetableSettings,
  Notifica,
  BeforeInstallPromptEvent,
  NavigationParams,
} from "../types";
import { useBreakpoint } from "./ui/ResponsiveContainer";

interface AppLayoutProps {
  children: React.ReactNode;
  view: View;
  onNavigate: (view: View, context?: NavigationParams) => void;
  user: UserProfile | null;
  settings: TimetableSettings;
  notifiche: Notifica[];
  setNotifiche: (
    input: Notifica[] | ((prev: Notifica[]) => Notifica[]),
  ) => void;
  onBack: () => void;
  onOpenImageAnalysis: () => void;
  onOpenVideoAnalysis: () => void;
  onOpenHelp: () => void;
  onOpenCircularAnalysis: (url: string, title: string) => void;
  isAiProcessing: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  onInstallApp: () => void;
  onOpenOperations: () => void;
  hasSuggestion: boolean;
  onOpenNKA?: () => void;
}

const NAV_ITEMS = [
  { id: "home" as View, label: "Home", icon: "home", activeIcon: "home" },
  {
    id: "timetable" as View,
    label: "Orario",
    icon: "schedule",
    activeIcon: "watch_later",
  },
  {
    id: "progettazione-hub" as View,
    label: "Progetta",
    icon: "design_services",
    activeIcon: "edit_document",
  },
  { id: "aula" as View, label: "Classi", icon: "groups", activeIcon: "groups" },
  {
    id: "orientamento" as View,
    label: "Orienta",
    icon: "explore",
    activeIcon: "explore",
  },
  {
    id: "calendario" as View,
    label: "Agenda",
    icon: "calendar_month",
    activeIcon: "event_note",
  },
];

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  view,
  onNavigate,
  user,
  settings,
  notifiche,
  setNotifiche,
  onBack,
  onOpenImageAnalysis,
  onOpenVideoAnalysis,
  onOpenHelp,
  onOpenCircularAnalysis,
  isAiProcessing,
  installPrompt,
  onInstallApp,
  onOpenOperations,
  hasSuggestion,
  onOpenNKA,
}) => {
  const { isMobile } = useBreakpoint();
  const showBottomNav = isMobile;
  const showNavRail = !isMobile;
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleNavigate = (v: View, c?: unknown) => {
    setDrawerOpen(false);
    onNavigate(v, c as NavigationParams);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "var(--md-sys-viewport-height-full)",
        background: "var(--app-color-surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Header
        showBackButton={view !== "home"}
        onBack={onBack}
        onOpenImageAnalysis={onOpenImageAnalysis}
        onOpenVideoAnalysis={onOpenVideoAnalysis}
        onOpenHelp={onOpenHelp}
        user={user}
        settings={settings}
        notifiche={notifiche}
        setNotifiche={setNotifiche}
        onOpenCircularAnalysis={onOpenCircularAnalysis}
        onNavigate={onNavigate}
        isAiProcessing={isAiProcessing}
        installPrompt={installPrompt}
        onInstallApp={onInstallApp}
        onOpenOperations={onOpenOperations}
        hasSuggestion={hasSuggestion}
        onOpenNKA={onOpenNKA}
        showMenuButton={isMobile}
        onMenuOpen={() => setDrawerOpen(true)}
      />

      <div
        style={{
          display: "flex",
          flex: "1 1 auto",
          minHeight: "0",
          position: "relative",
        }}
      >
        {showNavRail && (
          <aside
            aria-label="Navigazione principale"
            style={{
              flexShrink: 0,
              width: "var(--nav-rail-width, var(--md-sys-spacing-20))",
              background: "var(--app-color-surface)",
              borderRight:
                "var(--app-border-thin) solid var(--md-sys-color-outline-variant)",
              display: "flex",
              flexDirection: "column",
              zIndex: "var(--md-sys-z-nav)",
              position: "sticky",
              top: "0",
              height: "100vh",
            }}
          >
            <NavigationRail
              items={NAV_ITEMS}
              activeView={view}
              onNavigate={handleNavigate}
            />
          </aside>
        )}

        {isMobile && drawerOpen && (
          <>
            <div
              role="presentation"
              aria-hidden="true"
              onClick={() => setDrawerOpen(false)}
              style={{
                position: "fixed",
                inset: "0",
                background: "rgba(0,0,0,0.4)",
                zIndex: "var(--md-sys-z-modal)",
                backdropFilter: "blur(2px)",
              }}
            />
            <nav
              aria-label="Menu di navigazione"
              style={{
                position: "fixed",
                top: "0",
                left: "0",
                bottom: "0",
                width: "var(--md-sys-spacing-56)",
                maxWidth: "80vw",
                background: "var(--md-sys-color-surface-container-low)",
                zIndex: "var(--md-sys-z-modal)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--md-sys-elevation-3)",
                borderRadius:
                  "0 var(--md-sys-radius-6) var(--md-sys-radius-6) 0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding:
                    "var(--md-sys-spacing-6) var(--md-sys-spacing-4) var(--md-sys-spacing-4)",
                  borderBottom:
                    "var(--app-border-thin) solid var(--md-sys-color-outline-variant)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "var(--md-sys-typescale-title-large-font-family, var(--font-family))",
                    fontSize:
                      "var(--md-sys-typescale-title-large-font-size, var(--md-sys-spacing-5))",
                    fontWeight: "600",
                    color: "var(--app-color-on-surface)",
                  }}
                >
                  DocenteDoc AI
                </span>
                <button
                  aria-label="Chiudi menu"
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "var(--md-sys-shape-corner-full)",
                    width: "var(--md-sys-spacing-10)",
                    height: "var(--md-sys-spacing-10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--md-sys-color-on-surface-variant)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                    style={{ fontSize: "var(--md-sys-spacing-6)" }}
                  >
                    close
                  </span>
                </button>
              </div>

              <div
                style={{
                  flex: "1 1 auto",
                  overflowY: "auto",
                  padding: "var(--md-sys-spacing-2) var(--md-sys-spacing-3)",
                }}
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = view === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--md-sys-spacing-4)",
                        width: "100%",
                        padding:
                          "var(--md-sys-spacing-3) var(--md-sys-spacing-4)",
                        borderRadius: "var(--md-sys-radius-7)",
                        border: "none",
                        cursor: "pointer",
                        background: isActive
                          ? "var(--md-sys-color-secondary-container)"
                          : "transparent",
                        color: isActive
                          ? "var(--md-sys-color-on-secondary-container)"
                          : "var(--md-sys-color-on-surface-variant)",
                        marginBottom: "var(--md-sys-spacing-1)",
                        transition:
                          "background-color var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-emphasized)",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                        style={{
                          fontSize: "var(--md-sys-spacing-6)",
                          fontVariationSettings: isActive
                            ? "'FILL' 1, 'wght' 500"
                            : "'FILL' 0, 'wght' 400",
                        }}
                      >
                        {isActive ? item.activeIcon : item.icon}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-family)",
                          fontSize:
                            "var(--md-sys-typescale-label-large-font-size, var(--md-sys-spacing-4))",
                          fontWeight: isActive ? "600" : "400",
                          letterSpacing: "0.1px",
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  borderTop:
                    "var(--app-border-thin) solid var(--md-sys-color-outline-variant)",
                  padding: "var(--md-sys-spacing-3)",
                }}
              >
                <button
                  onClick={() => handleNavigate("settings")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--md-sys-spacing-4)",
                    width: "100%",
                    padding: "var(--md-sys-spacing-3) var(--md-sys-spacing-4)",
                    borderRadius: "var(--md-sys-radius-7)",
                    border: "none",
                    cursor: "pointer",
                    background:
                      view === "settings"
                        ? "var(--md-sys-color-secondary-container)"
                        : "transparent",
                    color:
                      view === "settings"
                        ? "var(--md-sys-color-on-secondary-container)"
                        : "var(--md-sys-color-on-surface-variant)",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                    style={{ fontSize: "var(--md-sys-spacing-6)" }}
                  >
                    settings
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-family)",
                      fontSize:
                        "var(--md-sys-typescale-label-large-font-size, var(--md-sys-spacing-4))",
                    }}
                  >
                    Impostazioni
                  </span>
                </button>
              </div>
            </nav>
          </>
        )}

        <main
          id="main-content"
          role="main"
          aria-label="Contenuto principale"
          style={{
            flex: "1 1 auto",
            minWidth: "0",
            display: "flex",
            flexDirection: "column",
            background: "var(--md-sys-color-surface-container)",
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: showBottomNav
              ? "var(--bottom-nav-height, var(--md-sys-spacing-16))"
              : "0",
          }}
        >
          {children}
        </main>
      </div>

      {showBottomNav && (
        <BottomNav activeView={view} onNavigate={(v) => onNavigate(v)} />
      )}
    </div>
  );
};
