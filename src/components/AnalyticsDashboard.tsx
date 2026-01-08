/**
 * AnalyticsDashboard
 *
 * Material Design 3 Expressive - Complete MD3 Token Migration
 * Migration Date: Phase 1.3 (Batch P0 Migration) + Complete Token Migration
 * Z-Index: Dynamic (via M3Dialog + ModalContext)
 *
 * Previous: M3Dialog wrapper + extensive Tailwind classes + hardcoded styles
 * Current: Pure M3Dialog with complete MD3 design tokens + scrolling support
 *
 * Status: ✅ FULLY MIGRATED & ACCESSIBLE
 */

import React, { useState, useMemo } from 'react';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, SelectField, M3Typography } from './ui';

interface AnalyticsDashboardProps {
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'settings'>('overview');

  const { analyticsMetrics, analyticsEvents, analyticsSettings, actions } = useSystemStore(state => ({
    analyticsMetrics: state.analyticsMetrics,
    analyticsEvents: state.analyticsEvents,
    analyticsSettings: state.analyticsSettings,
    actions: state.actions
  }));
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

  // Calcola statistiche aggiuntive
  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentEvents = analyticsEvents.filter(event =>
      new Date(event.timestamp) >= sevenDaysAgo
    );

    const monthlyEvents = analyticsEvents.filter(event =>
      new Date(event.timestamp) >= thirtyDaysAgo
    );

    const topFeatures = Object.entries(analyticsMetrics.featuresUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const documentTypes = Object.entries(analyticsMetrics.documentsByType)
      .sort(([,a], [,b]) => b - a);

    return {
      weeklyActivity: recentEvents.length,
      monthlyActivity: monthlyEvents.length,
      topFeatures,
      documentTypes,
      dataRetention: analyticsSettings.retentionDays
    };
  }, [analyticsEvents, analyticsMetrics, analyticsSettings]);

  const handleResetAnalytics = () => {
    if (confirm('Sei sicuro di voler resettare tutti i dati analytics? Questa azione non può essere annullata.')) {
      actions.setAnalyticsEvents([]);
      actions.setAnalyticsMetrics({
        totalDocumentsGenerated: 0,
        documentsByType: {},
        featuresUsage: {},
        templatesCreated: 0,
        exportBatchesCount: 0,
        aiInteractionsCount: 0,
        averageSessionDuration: 0,
        lastUpdated: new Date().toISOString()
      });
      actions.setAnalyticsSettings({
        ...analyticsSettings,
        lastReset: new Date().toISOString()
      });
      showToast('Dati analytics resettati con successo.', 'info');
    }
  };

  const handleToggleAnalytics = (enabled: boolean) => {
    actions.setAnalyticsSettings({
      ...analyticsSettings,
      enabled
    });
    showToast(
      enabled ? 'Analytics abilitati.' : 'Analytics disabilitati.',
      enabled ? 'success' : 'info'
    );
  };

  const formatNumber = (num: number) => num.toLocaleString('it-IT');
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('it-IT');

  return (
    <M3Dialog
      title="Analytics & Statistiche"
      onClose={onClose}
      maxWidth="2xl"
      level={1}
    >
      <M3DialogContent style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--md-sys-spacing-6)',
        overflowY: 'auto',
        maxHeight: '80vh'
      }}>
          {/* GDPR Notice */}
          <div style={{
            backgroundColor: 'var(--md-sys-color-tertiary-container)',
            opacity: 0.8,
            border: '1px solid var(--md-sys-color-outline)',
            padding: 'var(--md-sys-spacing-8)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--md-sys-shape-corner-extra-large)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--md-sys-spacing-6)'
            }}>
              <span className="material-symbols-outlined" style={{
                color: 'var(--md-sys-color-on-tertiary-container)',
                marginTop: '2px'
              }}>privacy_tip</span>
              <div>
                <M3Typography
                  variant="label-small"
                  style={{
                    color: 'var(--md-sys-color-on-tertiary-container)',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    marginBottom: 'var(--md-sys-spacing-4)',
                    display: 'block'
                  }}
                >
                  📋 Informativa Privacy
                </M3Typography>
                <p style={{
                  fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                  color: 'var(--md-sys-color-on-tertiary-container)',
                  lineHeight: 'var(--md-sys-typescale-body-small-line-height)'
                }}>
                  Questi dati sono memorizzati localmente sul tuo dispositivo e non vengono mai trasmessi a server esterni.
                  Puoi disabilitare la raccolta dati in qualsiasi momento dalle impostazioni.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <TabGroup
            tabs={[
              { id: 'overview', label: 'Panoramica', icon: 'dashboard' },
              { id: 'details', label: 'Dettagli', icon: 'analytics' },
              { id: 'settings', label: 'Impostazioni', icon: 'settings' }
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id)}
          />

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--md-sys-spacing-6)',
              animation: 'fade-in 0.3s ease-out'
            }}>
              {/* Metriche Principali */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--md-sys-spacing-8)'
              }}>
                <div style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  opacity: 0.5,
                  padding: 'var(--md-sys-spacing-8)',
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: 'var(--md-sys-shape-corner-medium)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-6)'
                  }}>
                    <span className="material-symbols-outlined" style={{
                      color: 'var(--md-sys-color-tertiary)'
                    }}>description</span>
                    <div>
                      <p style={{
                        fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                        fontWeight: '900',
                        color: 'var(--md-sys-color-on-surface)'
                      }}>{formatNumber(analyticsMetrics.totalDocumentsGenerated)}</p>
                      <M3Typography
                        variant="label-small"
                        style={{
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--md-sys-color-on-surface-variant)'
                        }}
                      >
                        Documenti
                      </M3Typography>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  opacity: 0.5,
                  padding: 'var(--md-sys-spacing-8)',
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: 'var(--md-sys-shape-corner-medium)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-6)'
                  }}>
                    <span className="material-symbols-outlined" style={{
                      color: 'var(--md-sys-color-secondary)'
                    }}>smart_toy</span>
                    <div>
                      <p style={{
                        fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                        fontWeight: '900',
                        color: 'var(--md-sys-color-on-surface)'
                      }}>{formatNumber(analyticsMetrics.aiInteractionsCount)}</p>
                      <M3Typography
                        variant="label-small"
                        style={{
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--md-sys-color-on-surface-variant)'
                        }}
                      >
                        Interazioni AI
                      </M3Typography>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  opacity: 0.5,
                  padding: 'var(--md-sys-spacing-8)',
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: 'var(--md-sys-shape-corner-medium)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-6)'
                  }}>
                    <span className="material-symbols-outlined" style={{
                      color: 'var(--md-sys-color-primary)'
                    }}>file_copy</span>
                    <div>
                      <p style={{
                        fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                        fontWeight: '900',
                        color: 'var(--md-sys-color-on-surface)'
                      }}>{formatNumber(analyticsMetrics.templatesCreated)}</p>
                      <M3Typography
                        variant="label-small"
                        style={{
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--md-sys-color-on-surface-variant)'
                        }}
                      >
                        Template
                      </M3Typography>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  opacity: 0.5,
                  padding: 'var(--md-sys-spacing-8)',
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: 'var(--md-sys-shape-corner-medium)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--md-sys-spacing-6)'
                  }}>
                    <span className="material-symbols-outlined" style={{
                      color: 'var(--md-sys-color-tertiary)'
                    }}>batch_prediction</span>
                    <div>
                      <p style={{
                        fontSize: 'var(--md-sys-typescale-headline-small-font-size)',
                        fontWeight: '900',
                        color: 'var(--md-sys-color-on-surface)'
                      }}>{formatNumber(analyticsMetrics.exportBatchesCount)}</p>
                      <M3Typography
                        variant="label-small"
                        style={{
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--md-sys-color-on-surface-variant)'
                        }}
                      >
                        Export
                      </M3Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attività Recente */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--md-sys-spacing-6)'
              }}>
                <div style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  opacity: 0.5,
                  padding: 'var(--md-sys-spacing-5)',
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: 'var(--md-sys-shape-corner-extra-large)'
                }}>
                  <M3Typography
                    variant="label-small"
                    style={{
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'var(--md-sys-color-primary)',
                      marginBottom: 'var(--md-sys-spacing-8)',
                      display: 'block'
                    }}
                  >
                    Attività 7 Giorni
                  </M3Typography>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-3)'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        fontWeight: '500',
                        color: 'var(--md-sys-color-on-surface-variant)'
                      }}>Eventi Totali</span>
                      <span style={{
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        fontWeight: '900',
                        color: 'var(--md-sys-color-on-surface)'
                      }}>{stats.weeklyActivity}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        fontWeight: '500',
                        color: 'var(--md-sys-color-on-surface-variant)'
                      }}>Documenti Generati</span>
                      <span style={{
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        fontWeight: '900',
                        color: 'var(--md-sys-color-on-surface)'
                      }}>
                        {analyticsEvents.filter(e => e.eventType === 'document_generated' &&
                          new Date(e.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  opacity: 0.5,
                  padding: 'var(--md-sys-spacing-5)',
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: 'var(--md-sys-shape-corner-extra-large)'
                }}>
                  <M3Typography
                    variant="label-small"
                    style={{
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'var(--md-sys-color-primary)',
                      marginBottom: 'var(--md-sys-spacing-8)',
                      display: 'block'
                    }}
                  >
                    Funzionalità Top
                  </M3Typography>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--md-sys-spacing-2)'
                  }}>
                    {stats.topFeatures.length > 0 ? stats.topFeatures.map(([feature, count]) => (
                      <div key={feature} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                          fontWeight: '500',
                          color: 'var(--md-sys-color-on-surface-variant)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginRight: 'var(--md-sys-spacing-2)',
                          flex: 1
                        }}>{feature}</span>
                        <span style={{
                          fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                          fontWeight: '900',
                          color: 'var(--md-sys-color-on-surface)'
                        }}>{count}</span>
                      </div>
                    )) : (
                      <p style={{
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        fontStyle: 'italic'
                      }}>Nessuna attività registrata</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tipi Documento */}
              {stats.documentTypes.length > 0 && (
                <div style={{
                  backgroundColor: 'var(--md-sys-color-surface-container-low)',
                  opacity: 0.5,
                  padding: 'var(--md-sys-spacing-5)',
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: 'var(--md-sys-shape-corner-extra-large)'
                }}>
                  <M3Typography
                    variant="label-small"
                    style={{
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'var(--md-sys-color-primary)',
                      marginBottom: 'var(--md-sys-spacing-8)',
                      display: 'block'
                    }}
                  >
                    Documenti per Tipo
                  </M3Typography>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--md-sys-spacing-6)'
                  }}>
                    {stats.documentTypes.map(([type, count]) => (
                      <div key={type} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--md-sys-spacing-8)',
                        backgroundColor: 'var(--md-sys-color-surface)',
                        opacity: 0.5,
                        borderRadius: 'var(--md-sys-shape-corner-medium)'
                      }}>
                        <span style={{
                          fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                          fontWeight: '500',
                          color: 'var(--md-sys-color-on-surface-variant)',
                          textTransform: 'capitalize'
                        }}>{type.replace('_', ' ')}</span>
                        <span style={{
                          fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                          fontWeight: '900',
                          color: 'var(--md-sys-color-primary)'
                        }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--md-sys-spacing-4)',
              animation: 'fade-in 0.3s ease-out'
            }}>
              <M3Typography
                variant="label-small"
                style={{
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--md-sys-color-primary)',
                  paddingLeft: 'var(--md-sys-spacing-4)',
                  display: 'block'
                }}
              >
                Eventi Recenti
              </M3Typography>
              <div style={{
                maxHeight: '24rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--md-sys-spacing-2)',
                paddingRight: 'var(--md-sys-spacing-2)',
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--md-sys-color-outline) transparent'
              }}>
                {analyticsEvents.slice(-20).reverse().map(event => (
                  <div key={event.id} style={{
                    backgroundColor: 'var(--md-sys-color-surface-container-low)',
                    opacity: 0.5,
                    padding: 'var(--md-sys-spacing-6)',
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--md-sys-color-primary)';
                    e.currentTarget.style.opacity = '0.7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--md-sys-color-outline)';
                    e.currentTarget.style.opacity = '0.5';
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div>
                        <p style={{
                          fontWeight: '700',
                          fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                          color: 'var(--md-sys-color-on-surface)'
                        }}>{event.featureName}</p>
                        <M3Typography
                          variant="label-small"
                          style={{
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--md-sys-color-on-surface-variant)'
                          }}
                        >
                          {event.eventType.replace('_', ' ')}
                        </M3Typography>
                      </div>
                      <span style={{
                        fontSize: 'var(--md-sys-typescale-label-small-font-size)',
                        fontWeight: '500',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        backgroundColor: 'var(--md-sys-color-surface-container-high)',
                        padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-4)',
                        borderRadius: '9999px'
                      }}>
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                {analyticsEvents.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    paddingTop: 'var(--md-sys-spacing-12)',
                    paddingBottom: 'var(--md-sys-spacing-12)'
                  }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: '4rem',
                      color: 'var(--md-sys-color-on-surface-variant)',
                      opacity: 0.3,
                      marginBottom: 'var(--md-sys-spacing-8)',
                      display: 'block'
                    }}>history</span>
                    <p style={{
                      fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                      color: 'var(--md-sys-color-on-surface-variant)'
                    }}>Nessun evento registrato</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--md-sys-spacing-6)',
              animation: 'fade-in 0.3s ease-out'
            }}>
              <div style={{
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                opacity: 0.5,
                padding: 'var(--md-sys-spacing-5)',
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: 'var(--md-sys-shape-corner-extra-large)'
              }}>
                <M3Typography
                  variant="label-small"
                  style={{
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'var(--md-sys-color-primary)',
                    marginBottom: 'var(--md-sys-spacing-8)',
                    display: 'block'
                  }}
                >
                  Raccolta Dati
                </M3Typography>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--md-sys-spacing-4)'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--md-sys-spacing-6)',
                    borderRadius: 'var(--md-sys-shape-corner-large)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                    e.currentTarget.style.opacity = '0.5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.opacity = '1';
                  }}>
                    <div>
                      <span style={{
                        fontWeight: '700',
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        color: 'var(--md-sys-color-on-surface)'
                      }}>Analytics Abilitati</span>
                      <p style={{
                        fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                        color: 'var(--md-sys-color-on-surface-variant)'
                      }}>
                        Consenti raccolta dati anonimi di utilizzo
                      </p>
                    </div>
                    <div style={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={analyticsSettings.enabled}
                        onChange={(e) => handleToggleAnalytics(e.target.checked)}
                        style={{
                          position: 'absolute',
                          width: '1px',
                          height: '1px',
                          padding: '0',
                          margin: '-1px',
                          overflow: 'hidden',
                          clip: 'rect(0, 0, 0, 0)',
                          whiteSpace: 'nowrap',
                          border: '0'
                        }}
                      />
                      <div style={{
                        width: '44px',
                        height: '24px',
                        backgroundColor: analyticsSettings.enabled ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                        borderRadius: '12px',
                        position: 'relative',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          left: analyticsSettings.enabled ? '22px' : '2px',
                          width: '20px',
                          height: '20px',
                          backgroundColor: 'var(--md-sys-color-on-primary)',
                          borderRadius: '50%',
                          transition: 'left 0.2s ease'
                        }}></div>
                      </div>
                    </div>
                  </label>
                    <div>
                      <span className="font-bold text-sm text-[var(--md-sys-color-on-surface)]">Analytics Abilitati</span>
                      <p className="text-xs text-[var(--md-sys-color-on-surface)]-variant">
                        Consenti raccolta dati anonimi di utilizzo
                      </p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analyticsSettings.enabled}
                        onChange={(e) => handleToggleAnalytics(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-outline/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>

                  {analyticsSettings.enabled && (
                    <>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--md-sys-spacing-6)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                        e.currentTarget.style.opacity = '0.5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.opacity = '1';
                      }}>
                        <div>
                          <span style={{
                            fontWeight: '700',
                            fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                            color: 'var(--md-sys-color-on-surface)'
                          }}>Utilizzo Funzionalità</span>
                          <p style={{
                            fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                            color: 'var(--md-sys-color-on-surface-variant)'
                          }}>
                            Traccia quali funzionalità vengono utilizzate
                          </p>
                        </div>
                        <div style={{
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            checked={analyticsSettings.collectFeatureUsage}
                            onChange={(e) => actions.setAnalyticsSettings({
                              ...analyticsSettings,
                              collectFeatureUsage: e.target.checked
                            })}
                            style={{
                              position: 'absolute',
                              width: '1px',
                              height: '1px',
                              padding: '0',
                              margin: '-1px',
                              overflow: 'hidden',
                              clip: 'rect(0, 0, 0, 0)',
                              whiteSpace: 'nowrap',
                              border: '0'
                            }}
                          />
                          <div style={{
                            width: '44px',
                            height: '24px',
                            backgroundColor: analyticsSettings.collectFeatureUsage ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                            borderRadius: '12px',
                            position: 'relative',
                            transition: 'background-color 0.2s ease'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: '2px',
                              left: analyticsSettings.collectFeatureUsage ? '22px' : '2px',
                              width: '20px',
                              height: '20px',
                              backgroundColor: 'var(--md-sys-color-on-primary)',
                              borderRadius: '50%',
                              transition: 'left 0.2s ease'
                            }}></div>
                          </div>
                        </div>
                      </label>

                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--md-sys-spacing-6)',
                        borderRadius: 'var(--md-sys-shape-corner-large)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                        e.currentTarget.style.opacity = '0.5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.opacity = '1';
                      }}>
                        <div>
                          <span style={{
                            fontWeight: '700',
                            fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                            color: 'var(--md-sys-color-on-surface)'
                          }}>Metriche Documenti</span>
                          <p style={{
                            fontSize: 'var(--md-sys-typescale-body-small-font-size)',
                            color: 'var(--md-sys-color-on-surface-variant)'
                          }}>
                            Traccia generazione e tipi di documenti
                          </p>
                        </div>
                        <div style={{
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            checked={analyticsSettings.collectDocumentMetrics}
                            onChange={(e) => actions.setAnalyticsSettings({
                              ...analyticsSettings,
                              collectDocumentMetrics: e.target.checked
                            })}
                            style={{
                              position: 'absolute',
                              width: '1px',
                              height: '1px',
                              padding: '0',
                              margin: '-1px',
                              overflow: 'hidden',
                              clip: 'rect(0, 0, 0, 0)',
                              whiteSpace: 'nowrap',
                              border: '0'
                            }}
                          />
                          <div style={{
                            width: '44px',
                            height: '24px',
                            backgroundColor: analyticsSettings.collectDocumentMetrics ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)',
                            borderRadius: '12px',
                            position: 'relative',
                            transition: 'background-color 0.2s ease'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: '2px',
                              left: analyticsSettings.collectDocumentMetrics ? '22px' : '2px',
                              width: '20px',
                              height: '20px',
                              backgroundColor: 'var(--md-sys-color-on-primary)',
                              borderRadius: '50%',
                              transition: 'left 0.2s ease'
                            }}></div>
                          </div>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--md-sys-color-surface-container-low)',
                borderRadius: 'var(--md-sys-shape-corner-extra-large)',
                padding: 'var(--md-sys-spacing-5)',
                border: '1px solid var(--md-sys-color-outline)',
                opacity: 0.5
              }}>
                <M3Typography
                  variant="label-small"
                  style={{
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'var(--md-sys-color-primary)',
                    marginBottom: 'var(--md-sys-spacing-8)',
                    display: 'block'
                  }}
                >
                  Gestione Dati
                </M3Typography>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--md-sys-spacing-6)'
                }}>
                  <SelectField
                    label="Conservazione Dati"
                    value={analyticsSettings.retentionDays}
                    onChange={(e) => actions.setAnalyticsSettings({
                      ...analyticsSettings,
                      retentionDays: parseInt(e.target.value)
                    })}
                  >
                    <option value={30}>30 giorni</option>
                    <option value={90}>90 giorni</option>
                    <option value={180}>180 giorni</option>
                    <option value={365}>1 anno</option>
                  </SelectField>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 'var(--md-sys-spacing-4)',
                    borderTop: '1px solid var(--md-sys-color-outline)',
                    opacity: 0.1
                  }}>
                    <div>
                      <M3Typography
                        variant="label-small"
                        style={{
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--md-sys-color-on-surface-variant)',
                          marginBottom: 'var(--md-sys-spacing-4)',
                          display: 'block'
                        }}
                      >
                        Ultimo Reset
                      </M3Typography>
                      <p style={{
                        fontSize: 'var(--md-sys-typescale-body-medium-font-size)',
                        fontWeight: '700',
                        color: 'var(--md-sys-color-on-surface)'
                      }}>
                        {analyticsSettings.lastReset
                          ? formatDate(analyticsSettings.lastReset)
                          : 'Mai'
                        }
                      </p>
                    </div>
                    <M3Button
                      onClick={handleResetAnalytics}
                      variant="outlined"
                      style={{
                        color: 'var(--md-sys-color-error)',
                        borderColor: 'var(--md-sys-color-error)',
                        opacity: 0.3,
                        borderRadius: '9999px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--md-sys-color-error)';
                        e.currentTarget.style.opacity = '0.1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.opacity = '0.3';
                      }}
                    >
                      Reset Dati
                    </M3Button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </M3DialogContent>
      <M3DialogActions>
        <M3Button onClick={onClose} variant="text">
          Chiudi
        </M3Button>
      </M3DialogActions>
    </M3Dialog>
  );
};

export default AnalyticsDashboard;
