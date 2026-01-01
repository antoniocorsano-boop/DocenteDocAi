import React, { useState, useMemo } from 'react';
import { useDataStore } from '../stores/useDataStore';
import { useUIStore } from '../stores/useUIStore';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { M3Dialog } from './M3Dialog';

interface AnalyticsDashboardProps {
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'settings'>('overview');

  const { analyticsMetrics, analyticsEvents, analyticsSettings, actions } = useDataStore(state => ({
    analyticsMetrics: state.analyticsMetrics,
    analyticsEvents: state.analyticsEvents,
    analyticsSettings: state.analyticsSettings,
    actions: state.actions
  }));
  const { showToast } = useUIStore(state => ({ showToast: state.actions.showToast }));

  const modalRef = useKeyboardNavigation(true, onClose);

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
      buttons={
        <button onClick={onClose} className="m3-button-text">
          Chiudi
        </button>
      }
    >
      <div className="space-y-6">
          {/* GDPR Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 mt-0.5">privacy_tip</span>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">📋 Informativa Privacy</h3>
                <p className="m3-body-small text-blue-800">
                  Questi dati sono memorizzati localmente sul tuo dispositivo e non vengono mai trasmessi a server esterni.
                  Puoi disabilitare la raccolta dati in qualsiasi momento dalle impostazioni.
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-outline-variant">
            <div className="flex gap-1">
              {[
                { id: 'overview', label: 'Panoramica', icon: 'dashboard' },
                { id: 'details', label: 'Dettagli', icon: 'analytics' },
                { id: 'settings', label: 'Impostazioni', icon: 'settings' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 m3-label-large font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined mr-2 m3-label-large">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metriche Principali */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface-container rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600">description</span>
                    <div>
                      <p className="m3-headline-small font-bold">{formatNumber(analyticsMetrics.totalDocumentsGenerated)}</p>
                      <p className="m3-body-small text-on-surface-variant">Documenti Generati</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-600">smart_toy</span>
                    <div>
                      <p className="m3-headline-small font-bold">{formatNumber(analyticsMetrics.aiInteractionsCount)}</p>
                      <p className="m3-body-small text-on-surface-variant">Interazioni AI</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-purple-600">file_copy</span>
                    <div>
                      <p className="m3-headline-small font-bold">{formatNumber(analyticsMetrics.templatesCreated)}</p>
                      <p className="m3-body-small text-on-surface-variant">Template Creati</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-orange-600">batch_prediction</span>
                    <div>
                      <p className="m3-headline-small font-bold">{formatNumber(analyticsMetrics.exportBatchesCount)}</p>
                      <p className="m3-body-small text-on-surface-variant">Export Multipli</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attività Recente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container rounded-xl p-4">
                  <h3 className="font-medium mb-4">Attività negli Ultimi 7 Giorni</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="m3-body-small">Eventi Totali</span>
                      <span className="font-medium">{stats.weeklyActivity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="m3-body-small">Documenti Generati</span>
                      <span className="font-medium">
                        {analyticsEvents.filter(e => e.eventType === 'document_generated' &&
                          new Date(e.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container rounded-xl p-4">
                  <h3 className="font-medium mb-4">Funzionalità Più Usate</h3>
                  <div className="space-y-2">
                    {stats.topFeatures.length > 0 ? stats.topFeatures.map(([feature, count]) => (
                      <div key={feature} className="flex justify-between m3-body-small">
                        <span className="truncate mr-2">{feature}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    )) : (
                      <p className="m3-body-small text-on-surface-variant">Nessuna attività registrata</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tipi Documento */}
              {stats.documentTypes.length > 0 && (
                <div className="bg-surface-container rounded-xl p-4">
                  <h3 className="font-medium mb-4">Documenti per Tipo</h3>
                  <div className="space-y-2">
                    {stats.documentTypes.map(([type, count]) => (
                      <div key={type} className="flex justify-between m3-body-small">
                        <span className="capitalize">{type.replace('_', ' ')}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="font-medium">Eventi Recenti</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {analyticsEvents.slice(-20).reverse().map(event => (
                  <div key={event.id} className="bg-surface-container rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium m3-body-small">{event.featureName}</p>
                        <p className="m3-label-small text-on-surface-variant capitalize">
                          {event.eventType.replace('_', ' ')}
                        </p>
                      </div>
                      <span className="m3-label-small text-on-surface-variant">
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                {analyticsEvents.length === 0 && (
                  <p className="text-center text-on-surface-variant py-8">
                    Nessun evento registrato
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-surface-container rounded-xl p-4">
                <h3 className="font-medium mb-4">Raccolta Dati</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Analytics Abilitati</span>
                      <p className="m3-body-small text-on-surface-variant">
                        Consenti raccolta dati anonimi di utilizzo
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={analyticsSettings.enabled}
                      onChange={(e) => handleToggleAnalytics(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </label>

                  {analyticsSettings.enabled && (
                    <>
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Utilizzo Funzionalità</span>
                          <p className="m3-body-small text-on-surface-variant">
                            Traccia quali funzionalità vengono utilizzate
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={analyticsSettings.collectFeatureUsage}
                          onChange={(e) => actions.setAnalyticsSettings({
                            ...analyticsSettings,
                            collectFeatureUsage: e.target.checked
                          })}
                          className="w-4 h-4"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Metriche Documenti</span>
                          <p className="m3-body-small text-on-surface-variant">
                            Traccia generazione e tipi di documenti
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={analyticsSettings.collectDocumentMetrics}
                          onChange={(e) => actions.setAnalyticsSettings({
                            ...analyticsSettings,
                            collectDocumentMetrics: e.target.checked
                          })}
                          className="w-4 h-4"
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-surface-container rounded-xl p-4">
                <h3 className="font-medium mb-4">Gestione Dati</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block m3-body-small font-medium mb-2">
                      Conservazione Dati (giorni)
                    </label>
                    <select
                      value={analyticsSettings.retentionDays}
                      onChange={(e) => actions.setAnalyticsSettings({
                        ...analyticsSettings,
                        retentionDays: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-outline rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option value={30}>30 giorni</option>
                      <option value={90}>90 giorni</option>
                      <option value={180}>180 giorni</option>
                      <option value={365}>1 anno</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                    <div>
                      <p className="font-medium">Ultimo Reset</p>
                      <p className="m3-body-small text-on-surface-variant">
                        {analyticsSettings.lastReset
                          ? formatDate(analyticsSettings.lastReset)
                          : 'Mai'
                        }
                      </p>
                    </div>
                    <button
                      onClick={handleResetAnalytics}
                      className="button button-outlined button-small text-error"
                    >
                      Reset Dati
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </M3Dialog>
  );
};

export default AnalyticsDashboard;