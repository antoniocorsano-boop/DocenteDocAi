import React, { useEffect, useState } from 'react';
import { errorLogger, ErrorLog } from '../services/errorLogger';

interface ErrorLogsDashboardProps {
  onClose?: () => void;
}

const ErrorLogsDashboard: React.FC<ErrorLogsDashboardProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [filterType, setFilterType] = useState<ErrorLog['type'] | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<ErrorLog['severity'] | 'all'>('all');
  const [stats, setStats] = useState(errorLogger.getErrorStats());

  useEffect(() => {
    const allLogs = errorLogger.getAllLogs();
    setLogs(allLogs.reverse());
    setStats(errorLogger.getErrorStats());
  }, []);

  const filteredLogs = logs.filter((log) => {
    const typeMatch = filterType === 'all' || log.type === filterType;
    const severityMatch = filterSeverity === 'all' || log.severity === filterSeverity;
    return typeMatch && severityMatch;
  });

  const handleExport = () => {
    const json = errorLogger.exportLogsAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (window.confirm('Sei sicuro di voler eliminare tutti i log?')) {
      errorLogger.clearAllLogs();
      setLogs([]);
      setStats(errorLogger.getErrorStats());
    }
  };

  const getSeverityColor = (severity: ErrorLog['severity']) => {
    switch (severity) {
      case 'error':
        return 'text-error bg-error/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'info':
        return 'text-primary bg-primary/10';
    }
  };

  const getTypeIcon = (type: ErrorLog['type']) => {
    const icons: Record<ErrorLog['type'], string> = {
      navigation: 'directions',
      ai: 'psychology',
      analytics: 'analytics',
      sync: 'sync',
      validation: 'verified_user',
      general: 'info',
    };
    return icons[type];
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="m3-headline-medium">Error Logs Dashboard</h1>
        {onClose && (
          <button onClick={onClose} className="material-symbols-outlined m3-headline-small cursor-pointer">
            close
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant">
          <div className="m3-body-small text-on-surface-variant">Total Errors</div>
          <div className="m3-headline-medium font-bold text-primary">{stats.total}</div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant">
          <div className="m3-body-small text-on-surface-variant">Errors</div>
          <div className="m3-headline-medium font-bold text-error">{stats.bySeverity['error'] || 0}</div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant">
          <div className="m3-body-small text-on-surface-variant">Warnings</div>
          <div className="m3-headline-medium font-bold text-warning">{stats.bySeverity['warning'] || 0}</div>
        </div>
        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant">
          <div className="m3-body-small text-on-surface-variant">Infos</div>
          <div className="m3-headline-medium font-bold text-primary">{stats.bySeverity['info'] || 0}</div>
        </div>
      </div>

      {/* Type Breakdown */}
      <div className="mb-6">
        <h2 className="m3-title-medium mb-3">By Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="p-3 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined m3-label-large">{getTypeIcon(type as ErrorLog['type'])}</span>
                <span className="capitalize">{type}</span>
              </div>
              <div className="m3-headline-small font-bold text-primary mt-1">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex gap-2">
          <label className="m3-body-small text-on-surface-variant">Tipo:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType((e.target as HTMLSelectElement).value as ErrorLog['type'] | 'all')}
            className="px-3 py-1 rounded border border-outline-variant bg-surface"
          >
            <option value="all">Tutti</option>
            <option value="navigation">Navigation</option>
            <option value="ai">AI</option>
            <option value="analytics">Analytics</option>
            <option value="sync">Sync</option>
            <option value="validation">Validation</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="flex gap-2">
          <label className="m3-body-small text-on-surface-variant">Severity:</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity((e.target as HTMLSelectElement).value as ErrorLog['severity'] | 'all')}
            className="px-3 py-1 rounded border border-outline-variant bg-surface"
          >
            <option value="all">Tutti</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-1 rounded bg-primary text-on-primary m3-label-large font-medium flex items-center gap-2"
        >
          <span className="material-symbols-outlined m3-label-large">download</span>
          Export JSON
        </button>

        <button
          onClick={handleClearLogs}
          className="px-4 py-1 rounded bg-error text-on-error m3-label-large font-medium flex items-center gap-2"
        >
          <span className="material-symbols-outlined m3-label-large">delete</span>
          Clear All
        </button>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full m3-body-small">
            <thead className="bg-surface-container-high">
              <tr>
                <th className="text-left p-3 font-semibold">Time</th>
                <th className="text-left p-3 font-semibold">Type</th>
                <th className="text-left p-3 font-semibold">Severity</th>
                <th className="text-left p-3 font-semibold">Message</th>
                <th className="text-left p-3 font-semibold">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-3 m3-label-small whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary m3-label-small font-medium">
                        <span className="material-symbols-outlined m3-label-small">
                          {getTypeIcon(log.type)}
                        </span>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded m3-label-small font-medium capitalize ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs overflow-hidden text-ellipsis">
                      <span title={log.message}>{log.message}</span>
                    </td>
                    <td className="p-3">
                      {log.context && (
                        <details className="m3-label-small">
                          <summary className="cursor-pointer text-primary hover:underline">View</summary>
                          <pre className="mt-2 p-2 bg-surface-container-low rounded m3-label-small overflow-auto max-h-24">
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-on-surface-variant">
                    Nessun log trovato
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Most Recent Error */}
      {stats.mostRecent && (
        <div className="mt-6 p-4 rounded-xl bg-error/10 border border-error/20">
          <div className="m3-body-small font-semibold text-error mb-2">Most Recent Error</div>
          <div className="m3-body-small">
            <div>
              <strong>Time:</strong> {new Date(stats.mostRecent.timestamp).toLocaleString()}
            </div>
            <div>
              <strong>Type:</strong> {stats.mostRecent.type}
            </div>
            <div>
              <strong>Message:</strong> {stats.mostRecent.message}
            </div>
            {stats.mostRecent.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-primary hover:underline">Stack Trace</summary>
                <pre className="mt-2 p-2 bg-surface-container-low rounded m3-label-small overflow-auto max-h-32">
                  {stats.mostRecent.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorLogsDashboard;
