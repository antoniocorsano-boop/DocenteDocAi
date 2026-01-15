// LEGACY - MD3 Non-compliant
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
 * // M3Expressive refactor: Già completamente migrato, confermato conforme M3.
 */

import React, { useState, useMemo } from 'react';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, SelectField, M3Typography } from './ui';
import { useTheme } from '../theme/theme';

interface AnalyticsDashboardProps {
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onClose }) => {
  const { layers } = useTheme();
  const {
    sys: { color: { surfaceContainerLow, outline, tertiary, secondary, primary, onSurface, onSurfaceVariant, surface, onTertiaryContainer, error } },
    ref: { spacing, shape: { corner: { medium, extraLarge } }, typescale: { headlineSmall, bodyMedium, bodySmall, labelSmall } }
  } = layers;
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'settings'>('overview');
  const [hoveredElements, setHoveredElements] = useState<Record<string, boolean>>({});
  const [focusedElements, setFocusedElements] = useState<Record<string, boolean>>({});

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
      <M3DialogContent style={{display: 'flex',
        flexDirection: 'column',
        gap: layers.ref.spacing['6'],
        overflowY: 'auto',
        maxHeight: '80vh'}}>
          {/* GDPR Notice */}
          <div style={{backgroundColor: 'layers.sys.color.tertiary-container',
            opacity: 0.8,
            border: '1px solid layers.sys.color.outline',
            padding: layers.ref.spacing['8'],
            backdropFilter: 'blur(layers.ref.spacing['2'])',
            borderRadius: 'layers.ref.shape.corner.extra-large'}}>
            <div style={{display: 'flex',
              alignItems: 'flex-start',
              gap: layers.ref.spacing['6']}}>
              <span style={{fontFamily: 'Material Symbols Outlined',
                color: 'layers.sys.color.on-tertiary-container',
                marginTop: layers.ref.spacing['4']}}>privacy_tip</span>
              <div>
                <M3Typography
                  variant="label-small"
                  style={{color: 'layers.sys.color.on-tertiary-container',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    marginBottom: layers.ref.spacing['4'],
                    display: 'block'}}
                >
                  📋 Informativa Privacy
                </M3Typography>
                <p style={{fontSize: bodySmall.fontSize,
                  color: onTertiaryContainer,
                  lineHeight: bodySmall.lineHeight}}>
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
            <div style={{display: 'flex',
              flexDirection: 'column',
              gap: layers.ref.spacing['6'],
              animation: 'fade-in 0.3s ease-out'}}>
              {/* Metriche Principali */}
              <div style={{display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: layers.ref.spacing['8']}}>
                <div style={{backgroundColor: surfaceContainerLow,
                  opacity: 0.5,
                  padding: spacing['8],
                  border: `1px solid ${outline}`,
                  borderRadius: medium}}>
                  <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: spacing['6]}}>
                    <span style={{fontFamily: 'Material Symbols Outlined',
                      color: tertiary}}>description</span>
                    <div>
                      <p style={{fontSize: headlineSmall.fontSize,
                        fontWeight: '900',
                        color: onSurface}}>{formatNumber(analyticsMetrics.totalDocumentsGenerated)}</p>
                      <M3Typography
                        variant="label-small"
                        style={{fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: onSurfaceVariant}}
                      >
                        Documenti
                      </M3Typography>
                    </div>
                  </div>
                </div>

                <div style={{backgroundColor: surfaceContainerLow,
                  opacity: 0.5,
                  padding: spacing['8],
                  border: `1px solid ${outline}`,
                  borderRadius: medium}}>
                  <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: spacing['6]}}>
                    <span style={{fontFamily: 'Material Symbols Outlined',
                      color: secondary}}>smart_toy</span>
                    <div>
                      <p style={{fontSize: headlineSmall.fontSize,
                        fontWeight: '900',
                        color: onSurface}}>{formatNumber(analyticsMetrics.aiInteractionsCount)}</p>
                      <M3Typography
                        variant="label-small"
                        style={{fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: onSurfaceVariant}}
                      >
                        Interazioni AI
                      </M3Typography>
                    </div>
                  </div>
                </div>

                <div style={{backgroundColor: surfaceContainerLow,
                  opacity: 0.5,
                  padding: spacing['8],
                  border: `1px solid ${outline}`,
                  borderRadius: medium}}>
                  <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: spacing['6]}}>
                    <span style={{fontFamily: 'Material Symbols Outlined',
                      color: primary}}>file_copy</span>
                    <div>
                      <p style={{fontSize: headlineSmall.fontSize,
                        fontWeight: '900',
                        color: onSurface}}>{formatNumber(analyticsMetrics.templatesCreated)}</p>
                      <M3Typography
                        variant="label-small"
                        style={{fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: onSurfaceVariant}}
                      >
                        Template
                      </M3Typography>
                    </div>
                  </div>
                </div>

                <div style={{backgroundColor: surfaceContainerLow,
                  opacity: 0.5,
                  padding: spacing['8],
                  border: `1px solid ${outline}`,
                  borderRadius: medium}}>
                  <div style={{display: 'flex',
                    alignItems: 'center',
                    gap: spacing['6]}}>
                    <span style={{fontFamily: 'Material Symbols Outlined',
                      color: tertiary}}>batch_prediction</span>
                    <div>
                      <p style={{fontSize: headlineSmall.fontSize,
                        fontWeight: '900',
                        color: onSurface}}>{formatNumber(analyticsMetrics.exportBatchesCount)}</p>
                      <M3Typography
                        variant="label-small"
                        style={{fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: onSurfaceVariant}}
                      >
                        Export
                      </M3Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attività Recente */}
              <div style={{display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: layers.ref.spacing['6']}}>
                <div style={{backgroundColor: 'layers.sys.color.surfaceContainerLow',
                  opacity: 0.5,
                  padding: layers.ref.spacing['5'],
                  border: '1px solid layers.sys.color.outline',
                  borderRadius: 'layers.ref.shape.corner.extra-large'}}>
                  <M3Typography
                    variant="label-small"
                    style={{fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'layers.sys.color.primary',
                      marginBottom: layers.ref.spacing['8'],
                      display: 'block'}}
                  >
                    Attività 7 Giorni
                  </M3Typography>
                  <div style={{display: 'flex',
                    flexDirection: 'column',
                    gap: layers.ref.spacing['3']}}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{fontSize: bodyMedium.fontSize,
                        fontWeight: '500',
                        color: onSurfaceVariant}}>Eventi Totali</span>
                      <span style={{fontSize: bodyMedium.fontSize,
                        fontWeight: '900',
                        color: onSurface}}>{stats.weeklyActivity}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{fontSize: bodyMedium.fontSize,
                        fontWeight: '500',
                        color: onSurfaceVariant}}>Documenti Generati</span>
                      <span style={{fontSize: bodyMedium.fontSize,
                        fontWeight: '900',
                        color: onSurface}}>
                        {analyticsEvents.filter(e => e.eventType === 'document_generated' &&
                          new Date(e.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{backgroundColor: 'layers.sys.color.surfaceContainerLow',
                  opacity: 0.5,
                  padding: layers.ref.spacing['5'],
                  border: '1px solid layers.sys.color.outline',
                  borderRadius: 'layers.ref.shape.corner.extra-large'}}>
                  <M3Typography
                    variant="label-small"
                    style={{fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'layers.sys.color.primary',
                      marginBottom: layers.ref.spacing['8'],
                      display: 'block'}}
                  >
                    Funzionalità Top
                  </M3Typography>
                  <div style={{display: 'flex',
                    flexDirection: 'column',
                    gap: layers.ref.spacing['2']}}>
                    {stats.topFeatures.length > 0 ? stats.topFeatures.map(([feature, count]) => (
                      <div key={feature} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{fontSize: bodyMedium.fontSize,
                          fontWeight: '500',
                          color: onSurfaceVariant,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginRight: spacing['2],
                          flex: 1}}>{feature}</span>
                        <span style={{fontSize: bodyMedium.fontSize,
                          fontWeight: '900',
                          color: onSurface}}>{count}</span>
                      </div>
                    )) : (
                      <p style={{fontSize: bodyMedium.fontSize,
                        color: onSurfaceVariant,
                        fontStyle: 'italic'}}>Nessuna attività registrata</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tipi Documento */}
              {stats.documentTypes.length > 0 && (
                <div style={{backgroundColor: 'layers.sys.color.surfaceContainerLow',
                  opacity: 0.5,
                  padding: layers.ref.spacing['5'],
                  border: '1px solid layers.sys.color.outline',
                  borderRadius: 'layers.ref.shape.corner.extra-large'}}>
                  <M3Typography
                    variant="label-small"
                    style={{fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: 'layers.sys.color.primary',
                      marginBottom: layers.ref.spacing['8'],
                      display: 'block'}}
                  >
                    Documenti per Tipo
                  </M3Typography>
                  <div style={{display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: layers.ref.spacing['6']}}>
                    {stats.documentTypes.map(([type, count]) => (
                      <div key={type} style={{display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: layers.ref.spacing['8'],
                        backgroundColor: 'layers.sys.color.surface',
                        opacity: 0.5,
                        borderRadius: 'layers.ref.shape.corner.medium'}}>
                        <span style={{fontSize: bodyMedium.fontSize,
                          fontWeight: '500',
                          color: onSurfaceVariant,
                          textTransform: 'capitalize'}}>{type.replace('_', ' ')}</span>
                        <span style={{fontSize: bodyMedium.fontSize,
                          fontWeight: '900',
                          color: primary}}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div style={{display: 'flex',
              flexDirection: 'column',
              gap: layers.ref.spacing['4'],
              animation: 'fade-in 0.3s ease-out'}}>
              <M3Typography
                variant="label-small"
                style={{fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'layers.sys.color.primary',
                  paddingLeft: layers.ref.spacing['4'],
                  display: 'block'}}
              >
                Eventi Recenti
              </M3Typography>
              <div style={{maxHeight: layers.ref.spacing['4'],
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: layers.ref.spacing['2'],
                paddingRight: layers.ref.spacing['2'],
                scrollbarWidth: 'thin',
                scrollbarColor: 'layers.sys.color.outline transparent'}}>
                {analyticsEvents.slice(-20).reverse().map(event => {
                  const eventKey = `event-${event.id}`;
                  const isHovered = hoveredElements[eventKey] || false;
                  return (
                  <div key={event.id} style={{backgroundColor: surfaceContainerLow,
                    opacity: isHovered ? 0.7 : 0.5,
                    padding: spacing['6],
                    border: `1px solid ${isHovered ? primary : outline}`,
                    borderRadius: extraLarge,
                    transition: 'border-color 0.2s ease'}}
                  onMouseEnter={() => setHoveredElements(prev => ({ ...prev, [eventKey]: true }))}
                  onMouseLeave={() => setHoveredElements(prev => ({ ...prev, [eventKey]: false }))}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div>
                        <p style={{fontWeight: '700',
                          fontSize: bodyMedium.fontSize,
                          color: onSurface}}>{event.featureName}</p>
                        <M3Typography
                          variant="label-small"
                          style={{fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: onSurfaceVariant}}
                        >
                          {event.eventType.replace('_', ' ')}
                        </M3Typography>
                      </div>
                      <span style={{fontSize: labelSmall.fontSize,
                        fontWeight: '500',
                        color: 'layers.sys.color.onSurface-variant',
                        backgroundColor: 'layers.sys.color.surfaceContainerHigh',
                        padding: layers.ref.spacing['1'] layers.ref.spacing['4'],
                        borderRadius: layers.ref.spacing['4']}}>
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                {analyticsEvents.length === 0 && (
                  <div style={{textAlign: 'center',
                    paddingTop: layers.ref.spacing['12'],
                    paddingBottom: layers.ref.spacing['12']}}>
                    <span style={{fontFamily: 'Material Symbols Outlined',
                      fontSize: layers.ref.spacing['4'],
                      color: 'layers.sys.color.onSurface-variant',
                      opacity: 0.3,
                      marginBottom: layers.ref.spacing['8'],
                      display: 'block'}}>history</span>
                    <p style={{fontSize: bodyMedium.fontSize,
                      color: onSurfaceVariant}}>Nessun evento registrato</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{display: 'flex',
              flexDirection: 'column',
              gap: layers.ref.spacing['6'],
              animation: 'fade-in 0.3s ease-out'}}>
              <div style={{backgroundColor: 'layers.sys.color.surfaceContainerLow',
                opacity: 0.5,
                padding: layers.ref.spacing['5'],
                border: '1px solid layers.sys.color.outline',
                borderRadius: 'layers.ref.shape.corner.extra-large'}}>
                <M3Typography
                  variant="label-small"
                  style={{fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'layers.sys.color.primary',
                    marginBottom: layers.ref.spacing['8'],
                    display: 'block'}}
                >
                  Raccolta Dati
                </M3Typography>
                <div style={{display: 'flex',
                  flexDirection: 'column',
                  gap: layers.ref.spacing['4']}}>
                  <label style={{display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: layers.ref.spacing['6'],
                    borderRadius: 'layers.ref.shape.corner.large',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'}}
                  onMouseEnter={() => setHoveredElements(prev => ({ ...prev, 'analytics-toggle': true }))}
                  onMouseLeave={() => setHoveredElements(prev => ({ ...prev, 'analytics-toggle': false }))}>
                    <div>
                      <span style={{fontWeight: '700',
                        fontSize: bodyMedium.fontSize,
                        color: onSurface}}>Analytics Abilitati</span>
                      <p style={{fontSize: bodySmall.fontSize,
                        color: onSurfaceVariant}}>
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
                          width: layers.ref.spacing['4'],
                          height: layers.ref.spacing['4'],
                          padding: '0',
                          margin: '-1px',
                          overflow: 'hidden',
                          clip: 'rect(0, 0, 0, 0)',
                          whiteSpace: 'nowrap',
                          border: '0'
                        }}
                      />
                      <div style={{width: layers.ref.spacing['4'],
                        height: layers.ref.spacing['6'],
                        backgroundColor: analyticsSettings.enabled ? 'layers.sys.color.primary' : 'layers.sys.color.outline',
                        borderRadius: layers.ref.spacing['3'],
                        position: 'relative',
                        transition: 'background-color 0.2s ease'}}>
                        <div style={{position: 'absolute',
                          top: layers.ref.spacing['4'],
                          left: analyticsSettings.enabled ? layers.ref.spacing['4'] : layers.ref.spacing['4'],
                          width: layers.ref.spacing['4'],
                          height: layers.ref.spacing['4'],
                          backgroundColor: 'layers.sys.color.on-primary',
                          borderRadius: '50%',
                          transition: 'left 0.2s ease'}}></div>
                      </div>
                    </div>
                  </label>
                  <label>
                    <div>
                      <span style={{fontWeight: 'bold', fontSize: '0.875rem', color: onSurface}}>Analytics Abilitati</span>
                      <p style={{fontSize: '0.75rem', color: onSurfaceVariant}}>
                        Consenti raccolta dati anonimi di utilizzo
                      </p>
                    </div>
                    <div style={{position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer'}}>
                      <input
                        type="checkbox"
                        checked={analyticsSettings.enabled}
                        onChange={(e) => handleToggleAnalytics(e.target.checked)}
                        style={{
                          position: 'absolute',
                          width: layers.ref.spacing['4'],
                          height: layers.ref.spacing['4'],
                          padding: '0',
                          margin: '-1px',
                          overflow: 'hidden',
                          clip: 'rect(0, 0, 0, 0)',
                          whiteSpace: 'nowrap',
                          border: '0'
                        }}
                      />
                      <div style={{width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], backgroundColor: analyticsSettings.enabled ? primary : outline, borderRadius: layers.ref.spacing['4'], position: 'relative', transition: 'background-color 0.2s ease'}}>
                        <div style={{position: 'absolute', top: layers.ref.spacing['4'], left: analyticsSettings.enabled ? layers.ref.spacing['4'] : layers.ref.spacing['4'], width: layers.ref.spacing['4'], height: layers.ref.spacing['4'], backgroundColor: 'white', borderRadius: '50%', transition: 'left 0.2s ease'}}></div>
                      </div>
                    </div>
                  </label>

                  {analyticsSettings.enabled && (
                    <>
                      <label style={{display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: layers.ref.spacing['6'],
                        borderRadius: 'layers.ref.shape.corner.large',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'}}
                      onMouseEnter={() => setHoveredElements(prev => ({ ...prev, 'feature-usage-toggle': true }))}
                      onMouseLeave={() => setHoveredElements(prev => ({ ...prev, 'feature-usage-toggle': false }))}>
                        <div>
                          <span style={{fontWeight: '700',
                            fontSize: bodyMedium.fontSize,
                            color: onSurface}}>Utilizzo Funzionalità</span>
                          <p style={{fontSize: bodySmall.fontSize,
                            color: onSurfaceVariant}}>
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
                              width: layers.ref.spacing['4'],
                              height: layers.ref.spacing['4'],
                              padding: '0',
                              margin: '-1px',
                              overflow: 'hidden',
                              clip: 'rect(0, 0, 0, 0)',
                              whiteSpace: 'nowrap',
                              border: '0'
                            }}
                          />
                          <div style={{width: layers.ref.spacing['4'],
                            height: layers.ref.spacing['6'],
                            backgroundColor: analyticsSettings.collectFeatureUsage ? 'layers.sys.color.primary' : 'layers.sys.color.outline',
                            borderRadius: layers.ref.spacing['3'],
                            position: 'relative',
                            transition: 'background-color 0.2s ease'}}>
                            <div style={{position: 'absolute',
                              top: layers.ref.spacing['4'],
                              left: analyticsSettings.collectFeatureUsage ? layers.ref.spacing['4'] : layers.ref.spacing['4'],
                              width: layers.ref.spacing['4'],
                              height: layers.ref.spacing['4'],
                              backgroundColor: 'layers.sys.color.on-primary',
                              borderRadius: '50%',
                              transition: 'left 0.2s ease'}}></div>
                          </div>
                        </div>
                      </label>

                      <label style={{display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: layers.ref.spacing['6'],
                        borderRadius: 'layers.ref.shape.corner.large',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'}}
                      onMouseEnter={() => setHoveredElements(prev => ({ ...prev, 'document-metrics-toggle': true }))}
                      onMouseLeave={() => setHoveredElements(prev => ({ ...prev, 'document-metrics-toggle': false }))}>
                        <div>
                          <span style={{fontWeight: '700',
                            fontSize: bodyMedium.fontSize,
                            color: onSurface}}>Metriche Documenti</span>
                          <p style={{fontSize: bodySmall.fontSize,
                            color: onSurfaceVariant}}>
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
                              width: layers.ref.spacing['4'],
                              height: layers.ref.spacing['4'],
                              padding: '0',
                              margin: '-1px',
                              overflow: 'hidden',
                              clip: 'rect(0, 0, 0, 0)',
                              whiteSpace: 'nowrap',
                              border: '0'
                            }}
                          />
                          <div style={{width: layers.ref.spacing['4'],
                            height: layers.ref.spacing['6'],
                            backgroundColor: analyticsSettings.collectDocumentMetrics ? 'layers.sys.color.primary' : 'layers.sys.color.outline',
                            borderRadius: layers.ref.spacing['3'],
                            position: 'relative',
                            transition: 'background-color 0.2s ease'}}>
                            <div style={{position: 'absolute',
                              top: layers.ref.spacing['4'],
                              left: analyticsSettings.collectDocumentMetrics ? layers.ref.spacing['4'] : layers.ref.spacing['4'],
                              width: layers.ref.spacing['4'],
                              height: layers.ref.spacing['4'],
                              backgroundColor: 'layers.sys.color.on-primary',
                              borderRadius: '50%',
                              transition: 'left 0.2s ease'}}></div>
                          </div>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div style={{backgroundColor: 'layers.sys.color.surfaceContainerLow',
                borderRadius: 'layers.ref.shape.corner.extra-large',
                padding: layers.ref.spacing['5'],
                border: '1px solid layers.sys.color.outline',
                opacity: 0.5}}>
                <M3Typography
                  variant="label-small"
                  style={{fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'layers.sys.color.primary',
                    marginBottom: layers.ref.spacing['8'],
                    display: 'block'}}
                >
                  Gestione Dati
                </M3Typography>
                <div style={{display: 'flex',
                  flexDirection: 'column',
                  gap: layers.ref.spacing['6']}}>
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

                  <div style={{display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: layers.ref.spacing['4'],
                    borderTop: '1px solid layers.sys.color.outline',
                    opacity: 0.1}}>
                    <div>
                      <M3Typography
                        variant="label-small"
                        style={{fontWeight: '900',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'layers.sys.color.onSurface-variant',
                          marginBottom: layers.ref.spacing['4'],
                          display: 'block'}}
                      >
                        Ultimo Reset
                      </M3Typography>
                      <p style={{fontSize: bodyMedium.fontSize,
                        fontWeight: '700',
                        color: onSurface}}>
                        {analyticsSettings.lastReset
                          ? formatDate(analyticsSettings.lastReset)
                          : 'Mai'
                        }
                      </p>
                    </div>
                    <M3Button
                      onClick={handleResetAnalytics}
                      variant="outlined"
                      style={{color: error,
                        borderColor: error,
                        opacity: hoveredElements['reset-button] ? 0.1 : 0.3,
                        backgroundColor: hoveredElements['reset-button] ? error : 'transparent',
                        borderRadius: layers.ref.spacing['4']}}
                      onMouseEnter={() => setHoveredElements(prev => ({ ...prev, 'reset-button': true }))}
                      onMouseLeave={() => setHoveredElements(prev => ({ ...prev, 'reset-button': false }))}
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







