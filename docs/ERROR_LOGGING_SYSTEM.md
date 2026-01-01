# Sistema di Logging Errori - DocenteDoc AI

## 📋 Panoramica

È stato implementato un **sistema completo di logging degli errori** per tracciare, registrare e analizzare gli errori che si verificano durante la navigazione e le operazioni dell'app.

## 🎯 Problemi Risolti

### 1. **Messaggi di Errore Fugaci**
- ❌ **Prima**: I messaggi di errore scomparivano dopo 3.5 secondi, anche se critici
- ✅ **Ora**: Gli errori rimangono visibili per **5 secondi**, mentre gli altri messaggi per 3.5 secondi

### 2. **Mancanza di Traccia degli Errori**
- ❌ **Prima**: Gli errori venivano stampati solo in console e si perdevano al refresh
- ✅ **Ora**: Tutti gli errori vengono registrati in **localStorage** e persisti per 7 giorni

### 3. **Debugging Difficoltoso**
- ❌ **Prima**: Non c'era modo di visualizzare i log precedenti
- ✅ **Ora**: Dashboard dedicata per visualizzare, filtrare ed esportare i log

---

## 🛠️ Implementazione

### 1. **Servizio di Logging** (`src/services/errorLogger.ts`)

Classe singleton `ErrorLoggerService` che fornisce:

```typescript
// Loggare un errore generico
errorLogger.logError(message, type, severity, context, stack);

// Loggare errore di navigazione
errorLogger.logNavigationError(targetView, error, fromView);

// Loggare errore AI
errorLogger.logAiError(feature, error, context);

// Loggare warning/info
errorLogger.logWarning(message, type, context);
errorLogger.logInfo(message, type, context);

// Recuperare e analizzare i log
const allLogs = errorLogger.getAllLogs();
const errors = errorLogger.getLogsByType('navigation');
const stats = errorLogger.getErrorStats();

// Gestione log
errorLogger.clearAllLogs();
const json = errorLogger.exportLogsAsJson();
```

**Caratteristiche**:
- 📦 Salva fino a 100 errori in localStorage
- ⏰ Retention di 7 giorni
- 📊 Tracking by type, severity, timestamp
- 🔄 Export in JSON per analisi esterna
- 🪟 Disponibile come `window.__errorLogger` per debug console

### 2. **Integrazione in Snackbar** (`src/components/Snackbar.tsx`)

```typescript
// Durata dinamica
const duration = toast.type === 'error' ? 5000 : 3500;
```

- ❌ **Errori**: 5 secondi
- ✅ **Success/Info**: 3.5 secondi

### 3. **Logging nella Navigazione** (`src/hooks/useAppEngine.ts`)

```typescript
const handleNavigate = useCallback((newView: View, context: any = null) => {
    try {
        // ... navigazione normale
        errorLogger.logInfo(
            `Navigated to ${newView}`,
            'navigation',
            { fromView: view, toView: newView, hasContext: !!context }
        );
    } catch (error) {
        errorLogger.logNavigationError(newView, error, view);
        showToast('Errore durante la navigazione', 'error');
    }
}, [view, viewContext]);
```

### 4. **Dashboard di Visualizzazione** (`src/components/ErrorLogsDashboard.tsx`)

Componente React per visualizzare:
- 📊 Statistiche (total, by severity, by type)
- 🔍 Filtri by type e severity
- 📥 Export JSON
- 🗑️ Clear all logs
- 📋 Tabella interattiva con details

---

## 📊 Struttura dei Log

```typescript
interface ErrorLog {
  id: string;                    // Unique ID
  timestamp: string;             // ISO timestamp
  type: 'navigation' | 'ai' | 'analytics' | 'sync' | 'validation' | 'general';
  severity: 'error' | 'warning' | 'info';
  message: string;               // Descrizione dell'errore
  context?: Record<...>;         // Contesto aggiuntivo
  stack?: string;                // Stack trace (se disponibile)
  userAction?: string;           // Azione che ha causato l'errore
  view?: string;                 // View in cui è avvenuto
}
```

---

## 🚀 Come Usare

### Per gli Sviluppatori

**In console del browser**:
```javascript
// Recuperare tutti i log
window.__errorLogger.getAllLogs()

// Ottenere statistiche
window.__errorLogger.getErrorStats()

// Esportare come JSON
const json = window.__errorLogger.exportLogsAsJson()
console.log(json)

// Pulire i log
window.__errorLogger.clearAllLogs()
```

**Nel codice**:
```typescript
import { errorLogger } from '../services/errorLogger';

// Log un errore di navigazione
errorLogger.logNavigationError('dashboard', error, 'home');

// Log un errore AI
errorLogger.logAiError('suggestion-generator', error, { feature: 'UDA' });

// Recuperare i log
const recentErrors = errorLogger.getRecentErrors(20);
```

### Per gli Utenti

Una dashboard (`ErrorLogsDashboard`) può essere integrata nelle impostazioni per permettere agli utenti di:
- 👀 Visualizzare gli errori recenti
- 🔍 Filtrare per tipo o severity
- 📥 Scaricare i log per inviarli al supporto
- 🗑️ Pulire i log

---

## 📈 Analytics Integrazione

I log possono essere integrati con il sistema analytics esistente:

```typescript
// Se necessario, salvare i log in analytics
import { useDataStore } from '../stores/useDataStore';

const { trackAnalyticsEvent } = useDataStore((state) => ({ 
  trackAnalyticsEvent: state.actions.trackAnalyticsEvent 
}));

trackAnalyticsEvent('ai_interaction', 'error_logging', {
  logCount: errorLogger.getAllLogs().length
});
```

---

## 🔒 Privacy e Storage

- ✅ I log sono salvati **localmente** (localStorage)
- ✅ Non vengono inviati al server per default
- ✅ **GDPR compliant** - l'utente ha pieno controllo
- ✅ Retention automatica di 7 giorni
- ✅ Export esplicito per condivisione con supporto

---

## 🎯 Prossimi Passi (Opzionali)

1. **Integrare ErrorLogsDashboard** nei Settings
2. **Aggiungere breadcrumb** per tracciare le azioni prima dell'errore
3. **Error Recovery** - suggerire azioni correttive basate sul tipo di errore
4. **Remote Reporting** - permettere l'invio volontario dei log al team
5. **Error Alerts** - notificare gli admin di errori critici ripetuti

---

## 📝 Note di Implementazione

- **Import path**: Assicurati che l'import in useAppEngine.ts punta al servizio corretto
- **Build**: Il build passa senza errori ✅
- **Zero overhead**: Il servizio è async-safe e non blocca la UI
- **Debug mode**: Usa `window.__errorLogger` per testare il servizio

