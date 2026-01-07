import React, { useState, useMemo } from 'react';
import { useSystemStore } from '../stores/useSystemStore';
import { useUIStore } from '../stores/useUIStore';
import { M3Dialog, M3DialogContent, M3DialogActions, M3Button, TabGroup, SelectField } from './ui';

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
      <M3DialogContent className="space-y-6">
          {/* GDPR Notice */}
          <div className="bg-blue-50/50 border border-blue-200/30 rounded-xl p-8 backdrop-blur-md">
            <div className="flex items-start gap-6">
              <span className="material-symbols-outlined text-blue-600 mt-0.5">privacy_tip</span>
              <div>
                <h3 className="font-bold text-blue-900 mb-4 text-sm uppercase tracking-wider">📋 Informativa Privacy</h3>
                <p className="text-xs text-blue-800 leading-relaxed">
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Metriche Principali */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-surface-container-low/50 rounded-xl p-8 border border-outline/10">
                  <div className="flex items-center gap-6">
                    <span className="material-symbols-outlined text-green-600">description</span>
                    <div>
                      <p className="text-xl font-black text-on-surface">{formatNumber(analyticsMetrics.totalDocumentsGenerated)}</p>
                      <p className="m3-label-tiny font-bold uppercase tracking-wider text-on-surface-variant">Documenti</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low/50 rounded-xl p-8 border border-outline/10">
                  <div className="flex items-center gap-6">
                    <span className="material-symbols-outlined text-blue-600">smart_toy</span>
                    <div>
                      <p className="text-xl font-black text-on-surface">{formatNumber(analyticsMetrics.aiInteractionsCount)}</p>
                      <p className="m3-label-tiny font-bold uppercase tracking-wider text-on-surface-variant">Interazioni AI</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low/50 rounded-xl p-8 border border-outline/10">
                  <div className="flex items-center gap-6">
                    <span className="material-symbols-outlined text-purple-600">file_copy</span>
                    <div>
                      <p className="text-xl font-black text-on-surface">{formatNumber(analyticsMetrics.templatesCreated)}</p>
                      <p className="m3-label-tiny font-bold uppercase tracking-wider text-on-surface-variant">Template</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low/50 rounded-xl p-8 border border-outline/10">
                  <div className="flex items-center gap-6">
                    <span className="material-symbols-outlined text-orange-600">batch_prediction</span>
                    <div>
                      <p className="text-xl font-black text-on-surface">{formatNumber(analyticsMetrics.exportBatchesCount)}</p>
                      <p className="m3-label-tiny font-bold uppercase tracking-wider text-on-surface-variant">Export</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attività Recente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-low/50 rounded-3xl p-5 border border-outline/10">
                  <h3 className="m3-label-small font-black uppercase tracking-[0.2em] text-primary mb-8">Attività 7 Giorni</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-on-surface-variant">Eventi Totali</span>
                      <span className="text-sm font-black text-on-surface">{stats.weeklyActivity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-on-surface-variant">Documenti Generati</span>
                      <span className="text-sm font-black text-on-surface">
                        {analyticsEvents.filter(e => e.eventType === 'document_generated' &&
                          new Date(e.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-low/50 rounded-3xl p-5 border border-outline/10">
                  <h3 className="m3-label-small font-black uppercase tracking-[0.2em] text-primary mb-8">Funzionalità Top</h3>
                  <div className="space-y-2">
                    {stats.topFeatures.length > 0 ? stats.topFeatures.map(([feature, count]) => (
                      <div key={feature} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-on-surface-variant truncate mr-2">{feature}</span>
                        <span className="text-sm font-black text-on-surface">{count}</span>
                      </div>
                    )) : (
                      <p className="text-sm text-on-surface-variant italic">Nessuna attività registrata</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tipi Documento */}
              {stats.documentTypes.length > 0 && (
                <div className="bg-surface-container-low/50 rounded-3xl p-5 border border-outline/10">
                  <h3 className="m3-label-small font-black uppercase tracking-[0.2em] text-primary mb-8">Documenti per Tipo</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {stats.documentTypes.map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center p-8 rounded-xl bg-surface/50">
                        <span className="text-sm font-medium text-on-surface-variant capitalize">{type.replace('_', ' ')}</span>
                        <span className="text-sm font-black text-primary">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="m3-label-small font-black uppercase tracking-[0.2em] text-primary px-4">Eventi Recenti</h3>
              <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {analyticsEvents.slice(-20).reverse().map(event => (
                  <div key={event.id} className="bg-surface-container-low/50 rounded-2xl p-6 border border-outline/5 hover:border-primary/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-on-surface">{event.featureName}</p>
                        <p className="m3-label-tiny font-bold uppercase tracking-wider text-on-surface-variant">
                          {event.eventType.replace('_', ' ')}
                        </p>
                      </div>
                      <span className="m3-label-tiny font-medium text-on-surface-variant bg-surface-container-high px-4 py-1 rounded-full">
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                {analyticsEvents.length === 0 && (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-8">history</span>
                    <p className="text-sm text-on-surface-variant">Nessun evento registrato</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-surface-container-low/50 rounded-3xl p-5 border border-outline/10">
                <h3 className="m3-label-small font-black uppercase tracking-[0.2em] text-primary mb-8">Raccolta Dati</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-6 rounded-2xl hover:bg-surface-container-high/50 transition-colors cursor-pointer">
                    <div>
                      <span className="font-bold text-sm text-on-surface">Analytics Abilitati</span>
                      <p className="text-xs text-on-surface-variant">
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
                      <label className="flex items-center justify-between p-6 rounded-2xl hover:bg-surface-container-high/50 transition-colors cursor-pointer">
                        <div>
                          <span className="font-bold text-sm text-on-surface">Utilizzo Funzionalità</span>
                          <p className="text-xs text-on-surface-variant">
                            Traccia quali funzionalità vengono utilizzate
                          </p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={analyticsSettings.collectFeatureUsage}
                            onChange={(e) => actions.setAnalyticsSettings({
                              ...analyticsSettings,
                              collectFeatureUsage: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-outline/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-6 rounded-2xl hover:bg-surface-container-high/50 transition-colors cursor-pointer">
                        <div>
                          <span className="font-bold text-sm text-on-surface">Metriche Documenti</span>
                          <p className="text-xs text-on-surface-variant">
                            Traccia generazione e tipi di documenti
                          </p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={analyticsSettings.collectDocumentMetrics}
                            onChange={(e) => actions.setAnalyticsSettings({
                              ...analyticsSettings,
                              collectDocumentMetrics: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-outline/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-surface-container-low/50 rounded-3xl p-5 border border-outline/10">
                <h3 className="m3-label-small font-black uppercase tracking-[0.2em] text-primary mb-8">Gestione Dati</h3>
                <div className="space-y-6">
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

                  <div className="flex items-center justify-between pt-4 border-t border-outline/10">
                    <div>
                      <p className="m3-label-tiny font-black uppercase tracking-wider text-on-surface-variant mb-4">Ultimo Reset</p>
                      <p className="text-sm font-bold text-on-surface">
                        {analyticsSettings.lastReset
                          ? formatDate(analyticsSettings.lastReset)
                          : 'Mai'
                        }
                      </p>
                    </div>
                    <M3Button
                      onClick={handleResetAnalytics}
                      variant="outlined"
                      className="!text-error !border-error/30 hover:!bg-error/5 !rounded-full"
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
