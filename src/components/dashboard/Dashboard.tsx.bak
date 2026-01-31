/**
 * Dashboard Operativa - Main Component
 * Dashboard principale per il monitoraggio delle performance
 */

import React, { useEffect } from 'react';
import {
  useDashboardStore,
  useAutoRefresh,
  useCurrentMetrics,
  useBaselineMetrics,
  useTrendData,
  useAlerts,
  useAIErrors,
  useLazyLoadingEfficiency,
  useIsLoading,
  useError,
  useLastUpdate
} from '../../stores/DashboardStore';
import { FPSCard, MemoryCard, BundleSizeCard, AIMetricsCard } from './MetricCard';
import {
  PerformanceTrendChart,
  MemoryUsageChart,
  AIErrorsChart,
  LazyLoadingChart,
  BundleSizeTrendChart
} from './Charts';

// ============================================================================
// DASHBOARD HEADER
// ============================================================================

const DashboardHeader: React.FC = () => {
  const { refresh, toggleAutoRefresh, autoRefresh } = useDashboardStore();
  const lastUpdate = useLastUpdate();
  const isLoading = useIsLoading();

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'Mai aggiornato';
    return `Aggiornato ${date.toLocaleTimeString()}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--app-spacing-section)'
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 'var(--md-sys-typescale-headline-large-size)',
            fontWeight: 'var(--md-sys-typescale-headline-large-weight)',
            lineHeight: 'var(--app-text-title-line-height)',
            marginBottom: 'var(--app-spacing-component)',
            color: 'var(--app-color-on-surface)'
          }}
        >
          Dashboard Operativa
        </h1>
        <p
          style={{
            fontSize: 'var(--md-sys-typescale-body-large-size)',
            fontWeight: 'var(--md-sys-typescale-body-large-weight)',
            lineHeight: 'var(--app-text-body-line-height)',
            color: 'var(--app-color-on-surface-variant)',
          }}
        >
          Monitoraggio real-time delle performance di DocenteDoc AI
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--app-spacing-container)'
        }}
      >
        {/* Auto Refresh Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--app-spacing-component)'
          }}
        >
          <label
            style={{
              fontSize: 'var(--md-sys-typescale-body-medium-size)',
              fontWeight: 'var(--md-sys-typescale-body-medium-weight)',
              lineHeight: 'var(--app-text-body-line-height)',
              color: 'var(--app-color-on-surface-variant)',
              cursor: 'pointer'
            }}
          >
            Auto refresh
          </label>
          <button
            onClick={toggleAutoRefresh}
            style={{
              position: 'relative',
              display: 'inline-flex',
              height: 'var(--app-spacing-section)',
              width: 'var(--md-sys-spacing-11)',
              alignItems: 'center',
              borderRadius: 'var(--md-sys-radius-3)',
              transition: 'background-color var(--app-motion-quick) var(--app-easing-standard)',
              backgroundColor: autoRefresh ? 'var(--app-color-primary)' : 'var(--md-sys-color-outline-variant)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                height: 'var(--app-spacing-container)',
                width: 'var(--app-spacing-container)',
                borderRadius: 'var(--app-shape-small)',
                backgroundColor: 'var(--app-color-on-primary)',
                transition: 'transform var(--app-motion-quick) var(--app-easing-standard)',
                transform: autoRefresh ? 'translateX(var(--app-spacing-touch))' : 'translateX(var(--md-sys-spacing-1))'
              }}
            />
          </button>
        </div>

        {/* Manual Refresh */}
        <button
          onClick={refresh}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--app-spacing-component)',
            padding: 'var(--app-spacing-component) var(--app-spacing-container)',
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            fontSize: 'var(--md-sys-typescale-label-large-size)',
            fontWeight: 'var(--md-sys-typescale-label-large-weight)',
            lineHeight: 'var(--app-text-label-line-height)',
            transition: 'opacity, transform, background-color, color, border-color, box-shadow var(--app-motion-quick) var(--app-easing-standard)',
            backgroundColor: isLoading ? 'var(--md-sys-color-surface-container-high)' : 'var(--app-color-primary)',
            color: isLoading ? 'var(--app-color-on-surface-variant)' : 'var(--app-color-on-primary)',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? (
            <svg
              style={{
                animation: 'spin var(--app-motion-slow) var(--app-easing-standard) infinite',
                height: 'var(--app-spacing-container)',
                width: 'var(--app-spacing-container)'
              }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle style={{opacity: 0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{opacity: 0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg
              style={{
                height: 'var(--app-spacing-container)',
                width: 'var(--app-spacing-container)'
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {isLoading ? 'Aggiornando...' : 'Aggiorna'}
        </button>

        {/* Last Update */}
        <div
          style={{
            fontSize: 'var(--md-sys-typescale-body-small-size)',
            fontWeight: 'var(--md-sys-typescale-body-small-weight)',
            lineHeight: 'var(--app-text-body-line-height)',
            color: 'var(--app-color-on-surface-variant)',
          }}
        >
          {formatLastUpdate(lastUpdate)}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ALERTS SECTION
// ============================================================================

const AlertsSection: React.FC = () => {
  const alerts = useAlerts();

  if (alerts.length === 0) {
    return (
        <div
          style={{
            borderRadius: 'var(--md-sys-radius-3)',
            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
            backgroundColor: 'var(--md-sys-color-surface-container-low)',
            padding: 'var(--app-spacing-section)',
          }}
        >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--app-spacing-element)',
            marginBottom: 'var(--app-spacing-container)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'var(--md-sys-spacing-8)',
              height: 'var(--md-sys-spacing-8)',
              borderRadius: 'var(--app-shape-small)',
              backgroundColor: 'var(--md-sys-color-tertiary-container)',
            }}
          >
            <svg
              style={{
                width: 'var(--app-spacing-container)',
                height: 'var(--app-spacing-container)',
                color: 'var(--md-sys-color-tertiary)',
              }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3
            style={{
              fontSize: 'var(--app-text-title)',
              fontWeight: 'var(--app-text-title-weight)',
              color: 'var(--app-color-on-surface)',
            }}
          >
            Tutto OK
          </h3>
        </div>
        <p
          style={{
            fontSize: 'var(--app-text-body)',
            color: 'var(--app-color-on-surface-variant)',
          }}
        >
          Nessun alert attivo nelle ultime 24 ore.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: 'var(--md-sys-radius-3)',
        border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
        backgroundColor: 'var(--md-sys-color-surface-container-low)',
        padding: 'var(--app-spacing-section)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--app-spacing-element)',
          marginBottom: 'var(--app-spacing-container)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'var(--md-sys-spacing-8)',
            height: 'var(--md-sys-spacing-8)',
            borderRadius: 'var(--app-shape-small)',
            backgroundColor: 'var(--md-sys-color-error-container)',
          }}
        >
          <svg
            style={{
              width: 'var(--app-spacing-container)',
              height: 'var(--app-spacing-container)',
              color: 'var(--md-sys-color-error)',
            }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3
          style={{
            fontSize: 'var(--app-text-title)',
            fontWeight: 'var(--app-text-title-weight)',
            color: 'var(--app-color-on-surface)',
          }}
        >
          Alert Attivi ({alerts.length})
        </h3>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--app-spacing-element)',
        }}
      >
        {alerts.slice(0, 5).map((alert) => (
          <div
            key={alert.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--app-spacing-element)',
              padding: 'var(--app-spacing-element)',
              borderRadius: 'var(--app-shape-small)',
              border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
              backgroundColor: 'var(--md-sys-color-surface-container-highest)',
            }}
          >
            <div
              style={{
                width: 'var(--app-spacing-component)',
                height: 'var(--app-spacing-component)',
                borderRadius: 'var(--app-layout-half)',
                marginTop: 'var(--app-spacing-component)',
                backgroundColor: alert.type === 'critical' ? 'var(--md-sys-color-error)' :
                               alert.type === 'warning' ? 'var(--app-color-secondary)' :
                               'var(--md-sys-color-tertiary)',
              }}
            />
            <div
              style={{
                flex: '1',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--app-spacing-component)',
                  marginBottom: 'var(--md-sys-spacing-1)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--app-text-body)',
                    fontWeight: 'var(--app-text-label-weight)',
                    color: 'var(--app-color-on-surface)',
                  }}
                >
                  {alert.title}
                </span>
                <span
                  style={{
                    fontSize: 'var(--app-text-body)',
                    padding: 'var(--md-sys-spacing-1) var(--app-spacing-component)',
                    borderRadius: 'var(--md-sys-radius-3)',
                    backgroundColor: alert.type === 'critical' ? 'var(--md-sys-color-error-container)' :
                                   alert.type === 'warning' ? 'var(--app-color-secondary-container)' :
                                   'var(--md-sys-color-tertiary-container)',
                    color: alert.type === 'critical' ? 'var(--md-sys-color-on-error-container)' :
                          alert.type === 'warning' ? 'var(--app-color-on-secondary-container)' :
                          'var(--md-sys-color-on-tertiary-container)',
                  }}
                >
                  {alert.type}
                </span>
              </div>
              <p
                style={{
                  fontSize: 'var(--app-text-body)',
                  color: 'var(--app-color-on-surface-variant)',
                }}
              >
                {alert.message}
              </p>
              <p
                style={{
                  fontSize: 'var(--app-text-body)',
                  marginTop: 'var(--md-sys-spacing-1)',
                  color: 'var(--app-color-on-surface-variant)',
                }}
              >
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

export const Dashboard: React.FC = () => {
  const { fetchMetrics } = useDashboardStore();
  const current = useCurrentMetrics();
  const baseline = useBaselineMetrics();
  const trendData = useTrendData();
  const aiErrors = useAIErrors();
  const lazyLoading = useLazyLoadingEfficiency();
  const isLoading = useIsLoading();
  const error = useError();

  // Initialize auto-refresh
  useAutoRefresh();

  // Initial data fetch
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Add spin animation keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (error) {
    return (
      <div
        style={{
          minHeight: 'var(--md-sys-viewport-height-full)',
          padding: 'var(--app-spacing-section)',
        }}
      >
        <div
          style={{
            maxWidth: 'calc(var(--md-sys-layout-panel-max-width) * 1.6)', // via var(--md-sys-layout-panel-max-width) (MD3 token)
            margin: '0 var(--app-layout-auto)',
            borderRadius: 'var(--md-sys-radius-3)',
            border: 'var(--app-border-thin) solid var(--md-sys-color-error)',
            backgroundColor: 'var(--md-sys-color-error-container)',
            padding: 'var(--app-spacing-section)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--app-spacing-element)',
              marginBottom: 'var(--app-spacing-container)',
            }}
          >
            <svg
              style={{
                width: 'var(--md-sys-layout-fab-size)',
                height: 'var(--md-sys-layout-fab-size)',
                color: 'var(--md-sys-color-error)',
              }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h2
              style={{
                fontSize: 'var(--app-text-title)',
                fontWeight: 'var(--app-text-title-weight)',
                color: 'var(--md-sys-color-on-error-container)',
              }}
            >
              Errore nel caricamento del dashboard
            </h2>
          </div>
          <p
            style={{
              fontSize: 'var(--app-text-body)',
              marginBottom: 'var(--app-spacing-container)',
              color: 'var(--md-sys-color-on-error-container)',
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchMetrics}
            style={{
              padding: 'var(--md-sys-spacing-1) var(--app-spacing-component)',
              backgroundColor: 'var(--md-sys-color-error)',
              color: 'var(--md-sys-color-on-error)',
              borderRadius: 'var(--app-shape-small)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color var(--app-motion-quick) var(--app-easing-standard)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--md-sys-color-error-hover)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--md-sys-color-error)';
            }}
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !current) {
    return (
      <div
        style={{
          minHeight: 'var(--md-sys-viewport-height-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 'var(--md-sys-layout-fab-size)',
              height: 'var(--md-sys-layout-fab-size)',
              borderRadius: 'var(--app-layout-full)',
              border: 'var(--app-border-medium) solid transparent',
              borderTopColor: 'var(--app-color-primary)',
              animation: 'spin var(--app-motion-slow) var(--app-easing-standard) infinite',
              margin: '0 var(--app-layout-auto) var(--app-spacing-container)',
            }}
          />
          <p
              style={{
              color: 'var(--app-color-on-surface-variant)',
            }}
          >
            Caricamento dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div
        style={{
          minHeight: 'var(--md-sys-viewport-height-full)',
          padding: 'var(--app-spacing-section)',
        }}
      >
        <div
          style={{
            maxWidth: 'calc(var(--md-sys-layout-panel-max-width) * 1.6)', // via var(--md-sys-layout-panel-max-width) (MD3 token)
            margin: '0 var(--app-layout-auto)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'var(--app-color-on-surface-variant)'
            }}
          >
            Nessun dato disponibile. Verifica che il sistema di monitoraggio sia attivo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: 'var(--md-sys-viewport-height-full)',
        padding: 'var(--app-spacing-section)',
      }}
    >
      <div
        style={{
          maxWidth: 'calc(var(--md-sys-layout-panel-max-width) * 1.6)', // via var(--md-sys-layout-panel-max-width) (MD3 token)
          margin: '0 var(--app-layout-auto)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--md-sys-spacing-8)',
        }}
      >
        {/* Header */}
        <DashboardHeader />

        {/* Key Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, var(--md-sys-grid-fr-1)))',
            gap: 'var(--app-spacing-section)',
          }}
        >
          <FPSCard current={current} baseline={baseline} />
          <MemoryCard current={current} baseline={baseline} />
          <BundleSizeCard current={current} baseline={baseline} />
          <AIMetricsCard current={current} baseline={baseline} />
        </div>

        {/* Charts Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, var(--md-sys-grid-fr-1)))',
            gap: 'var(--md-sys-spacing-8)',
          }}
        >
          {/* Performance Trend */}
          <div
            style={{
              borderRadius: 'var(--md-sys-radius-3)',
              border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
              backgroundColor: 'var(--md-sys-color-surface-container-low)',
              padding: 'var(--app-spacing-section)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--app-text-title)',
                fontWeight: 'var(--app-text-title-weight)',
                marginBottom: 'var(--app-spacing-container)',
                color: 'var(--app-color-on-surface)',
              }}
            >
              Trend Performance (7 giorni)
            </h3>
            <PerformanceTrendChart data={trendData} />
          </div>

          {/* Memory Usage */}
          <div
            style={{
              borderRadius: 'var(--md-sys-radius-3)',
              border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
              backgroundColor: 'var(--md-sys-color-surface-container-low)',
              padding: 'var(--app-spacing-section)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--app-text-title)',
                fontWeight: 'var(--app-text-title-weight)',
                marginBottom: 'var(--app-spacing-container)',
                color: 'var(--app-color-on-surface)',
              }}
            >
              Utilizzo Memoria
            </h3>
            <MemoryUsageChart data={trendData.slice(-24)} /> {/* Ultime 24 ore */}
          </div>

          {/* AI Errors */}
          <div
            style={{
              borderRadius: 'var(--md-sys-radius-3)',
              border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
              backgroundColor: 'var(--md-sys-color-surface-container-low)',
              padding: 'var(--app-spacing-section)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--app-text-title)',
                fontWeight: 'var(--app-text-title-weight)',
                marginBottom: 'var(--app-spacing-container)',
                color: 'var(--app-color-on-surface)',
              }}
            >
              Errori AI per Categoria
            </h3>
            <AIErrorsChart errorsByCategory={aiErrors} />
          </div>

          {/* Lazy Loading */}
          <div
            style={{
              borderRadius: 'var(--md-sys-radius-3)',
              border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
              backgroundColor: 'var(--md-sys-color-surface-container-low)',
              padding: 'var(--app-spacing-section)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--app-text-title)',
                fontWeight: 'var(--app-text-title-weight)',
                marginBottom: 'var(--app-spacing-container)',
                color: 'var(--app-color-on-surface)',
              }}
            >
              Tempi Lazy Loading
            </h3>
            <LazyLoadingChart loadTimes={current.lazyLoading.loadTimes} />
          </div>
        </div>

        {/* Bundle Size Trend */}
        <div
          style={{
            borderRadius: 'var(--md-sys-radius-3)',
            border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
            backgroundColor: 'var(--md-sys-color-surface-container-low)',
            padding: 'var(--app-spacing-section)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--app-text-title)',
              fontWeight: 'var(--app-text-title-weight)',
              marginBottom: 'var(--app-spacing-container)',
              color: 'var(--app-color-on-surface)',
            }}
          >
            Trend Bundle Size (7 giorni)
          </h3>
          <BundleSizeTrendChart data={trendData} />
        </div>

        {/* Alerts Section */}
        <AlertsSection />

        {/* Lazy Loading Efficiency Summary */}
        {lazyLoading && (
          <div
            style={{
              borderRadius: 'var(--md-sys-radius-3)',
              border: 'var(--app-border-thin) solid var(--md-sys-color-outline-variant)',
              backgroundColor: 'var(--md-sys-color-surface-container-low)',
              padding: 'var(--app-spacing-section)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--app-spacing-container)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--app-text-title)',
                  fontWeight: 'var(--app-text-title-weight)',
                  color: 'var(--app-color-on-surface)',
                }}
              >
                Efficienza Lazy Loading
              </h3>
              <div
                style={{
                  fontSize: 'var(--app-text-title)',
                  fontWeight: 'var(--app-text-title-weight)',
                  color: 'var(--app-color-primary)',
                }}
              >
                {lazyLoading.efficiency}%
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, var(--md-sys-grid-fr-1)))',
                gap: 'var(--app-spacing-container)',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--app-text-body)',
                    fontWeight: 'var(--app-text-body-weight)',
                    marginBottom: 'var(--md-sys-spacing-1)',
                    color: 'var(--app-color-on-surface-variant)',
                  }}
                >
                  Componenti Caricati
                </div>
                <div
                  style={{
                    fontSize: 'var(--app-text-title)',
                    fontWeight: 'var(--app-text-title-weight)',
                    color: 'var(--app-color-on-surface)',
                  }}
                >
                  {lazyLoading.totalComponents}
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--app-text-body)',
                    fontWeight: 'var(--app-text-body-weight)',
                    marginBottom: 'var(--md-sys-spacing-1)',
                    color: 'var(--app-color-on-surface-variant)',
                  }}
                >
                  Tempo Medio
                </div>
                <div
                  style={{
                    fontSize: 'var(--app-text-title)',
                    fontWeight: 'var(--app-text-title-weight)',
                    color: 'var(--app-color-on-surface)',
                  }}
                >
                  {lazyLoading.averageLoadTime}ms
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--app-text-body)',
                    fontWeight: 'var(--app-text-body-weight)',
                    marginBottom: 'var(--md-sys-spacing-1)',
                    color: 'var(--app-color-on-surface-variant)',
                  }}
                >
                  Stato
                </div>
                <div
                  style={{
                    fontSize: 'var(--app-text-body)',
                    fontWeight: 'var(--app-text-body-weight)',
                    padding: 'var(--md-sys-spacing-1) var(--app-spacing-component)',
                    borderRadius: 'var(--md-sys-radius-3)',
                    display: 'inline-block',
                    backgroundColor: lazyLoading.efficiency >= 80 ? 'var(--md-sys-color-tertiary-container)' :
                                   lazyLoading.efficiency >= 60 ? 'var(--app-color-secondary-container)' :
                                   'var(--md-sys-color-error-container)',
                    color: lazyLoading.efficiency >= 80 ? 'var(--md-sys-color-on-tertiary-container)' :
                          lazyLoading.efficiency >= 60 ? 'var(--app-color-on-secondary-container)' :
                          'var(--md-sys-color-on-error-container)',
                  }}
                >
                  {lazyLoading.efficiency >= 80 ? 'Ottimo' :
                   lazyLoading.efficiency >= 60 ? 'Buono' : 'Da migliorare'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
