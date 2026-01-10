# 🚀 DocenteDoc AI - Guida Onboarding per App con Architettura Complessa

## 📋 Problemi Comuni e Soluzioni per l'Onboarding

### **Problema 1: Loop Infiniti nei Servizi (IndexedDbService/BackupService)**

**Sintomi:**

- Log ripetuti: `[IndexedDbService] KB content saved successfully`
- App apparentemente funzionante ma con loop in background
- Performance degradata, batteria che si scarica velocemente

**Causa:**

- Dati corrotti in localStorage/indexedDB da sessioni precedenti
- Servizi che tentano ripetutamente di salvare/caricare dati invalidi
- Mancanza di cleanup all'avvio dell'applicazione

**Soluzione Implementata:**

```typescript
// In main.tsx - Cleanup obbligatorio all'avvio
(() => {
  try {
    const keys = ["app_state", "orariodoc_backup"];
    keys.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data && data.length > 2 * 1024 * 1024) {
        // > 2MB = dati corrotti
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Intentionally ignore legacy storage cleanup errors
  }
})();
```

**Best Practices per Onboarding:**

1. **Sempre implementare storage cleanup** all'avvio
2. **Validare dimensione dati** prima del caricamento
3. **Usare try/catch** per errori di storage
4. **Implementare circuit breaker** per loop infiniti
5. **Loggare ma non bloccare** errori di inizializzazione

---

### **Problema 2: React Non Si Carica in Sviluppo**

**Sintomi:**

- HTML presente ma `React` undefined nella console
- Componenti non interattivi
- Nessun errore JavaScript visibile

**Causa:**

- Polyfills aggressivi che sovrascrivono APIs del browser
- Import di moduli che falliscono silenziosamente
- CSP troppo restrittivo in sviluppo

**Soluzioni per Architetture Complesse:**

#### **A) Polyfills Sicuri (Raccomandato)**

```typescript
// polyfills.ts - Versione sicura, non invasiva
if (typeof window !== "undefined") {
  // Solo aggiungere APIs mancanti, non sovrascrivere esistenti
  if (!window.localStorage) {
    window.localStorage = {
      /* fallback sicuro */
    };
  }
  if (!window.performance) {
    window.performance = { now: () => Date.now() };
  }
}
```

#### **B) Caricamento Progressivo dei Moduli**

```typescript
// main.tsx - Bootstrap sicuro con fallback
async function bootstrapApp() {
  try {
    // 1. Carica stores lazy prima di React
    const lazy = await import('./stores/lazyStores');
    await lazy.preloadAllStores();

    // 2. Poi carica React e componenti
    const { App } = await import('./components/App');
    const { ModalProvider } = await import('./context/ModalContext');

    // 3. Render con error boundary
    root.render(
      <ErrorBoundary>
        <ModalProvider>
          <App />
        </ModalProvider>
      </ErrorBoundary>
    );
  } catch (e) {
    // Fallback sicuro se tutto fallisce
    root.render(
      <div>Errore di inizializzazione. Ricarica la pagina.</div>
    );
  }
}
```

#### **C) CSP Bilanciato per Sviluppo**

```html
<!-- index.html - CSP permissivo per dev, restrittivo per prod -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  connect-src 'self' https://api.example.com;
"
/>
```

---

### **Problema 3: Service Worker e PWA in Sviluppo**

**Sintomi:**

- Errori `registerSW.js` in console
- Service worker che interferisce con hot reload
- Cache stale che causa comportamenti inaspettati

**Soluzione per Onboarding:**

```typescript
// vite.config.ts - PWA solo in produzione
export default defineConfig({
  plugins: [
    // PWA solo per produzione
    ...(process.env.NODE_ENV === "production"
      ? [
          VitePWA({
            strategies: "injectManifest",
            injectRegister: false, // Non registrare automaticamente
            // ... altre config PWA
          }),
        ]
      : []),
  ],
});
```

---

### **Problema 4: Dipendenze Esterne e ESM/CJS Interop**

**Sintomi:**

- Errori `Failed to resolve module specifier`
- `Cannot read properties of undefined (reading 'default')`
- Build riesce ma runtime fallisce

**Soluzioni Documentate:**

#### **A) Non mettere in external moduli che non esistono come ESM**

```typescript
// vite.config.ts - EVITARE questo errore
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["@google/genai"], // ❌ NON FARLO se non è ESM pubblico
    },
  },
});
```

#### **B) Gestire dipendenze problematiche**

```typescript
// Per dipendenze con interop problemi, usare dynamic import
const loadProblematicLib = async () => {
  try {
    const lib = await import("problematic-lib");
    return lib.default || lib;
  } catch (e) {
    console.warn("Fallback per lib problematica");
    return null;
  }
};
```

---

## 🏗️ **Architettura Onboarding per App Complesse**

### **Fasi di Inizializzazione Raccomandate:**

```typescript
// main.tsx - Sequenza di bootstrap sicura
async function initializeApp() {
  // Fase 1: Environment check
  if (typeof window === "undefined") return;

  // Fase 2: Storage cleanup (PRIMA di tutto)
  await cleanupCorruptedStorage();

  // Fase 3: Polyfills sicuri
  await loadSafePolyfills();

  // Fase 4: Stores lazy (senza React)
  await preloadStateStores();

  // Fase 5: React e UI
  await bootstrapReact();

  // Fase 6: Servizi non critici
  await initializeBackgroundServices();
}
```

### **Error Boundaries Stratificati:**

```tsx
// App.tsx - Multiple error boundaries
<ErrorBoundary fallback={<CriticalErrorPage />}>
  <Suspense fallback={<LoadingScreen />}>
    <ErrorBoundary fallback={<SectionError message="Auth failed" />}>
      <AuthProvider>
        <ErrorBoundary fallback={<SectionError message="Navigation failed" />}>
          <Router>
            <AppContent />
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </ErrorBoundary>
  </Suspense>
</ErrorBoundary>
```

### **Monitoring e Debug per Onboarding:**

```typescript
// Hook per tracciare inizializzazione
const useAppInitializationTracker = () => {
  useEffect(() => {
    const trackInit = (phase: string, success: boolean, error?: Error) => {
      console.log(`[INIT] ${phase}: ${success ? "✅" : "❌"}`, error?.message);
      // In produzione: invia a analytics
    };

    // Track ogni fase
    trackInit("storage-cleanup", true);
    trackInit("polyfills", true);
    trackInit("stores", true);
    trackInit("react-render", true);
  }, []);
};
```

---

## 📚 **Checklist Onboarding per Nuovi Sviluppatori**

### **Setup Ambiente:**

- [ ] Node.js 18+ installato
- [ ] npm install completato senza errori
- [ ] Build locale funziona (`npm run build`)
- [ ] Dev server si avvia (`npm run dev`)

### **Debug Iniziale:**

- [ ] Console browser: nessun errore rosso
- [ ] React DevTools: componenti visibili
- [ ] Network: tutte le richieste 200
- [ ] Storage: localStorage accessibile

### **Testing Funzionale:**

- [ ] Navigazione tra route funziona
- [ ] Componenti lazy si caricano
- [ ] Stato persistito correttamente
- [ ] PWA si registra (solo produzione)

### **Troubleshooting Comuni:**

- [ ] Se loop infiniti: clear storage e ricarica
- [ ] Se React non carica: check polyfills.ts
- [ ] Se build fallisce: verifica dipendenze esterne
- [ ] Se PWA problemi: disabilita in sviluppo

---

## 🎯 **Lezioni Apprese da DocenteDoc AI**

1. **Storage cleanup è critico** - Sempre implementare all'avvio
2. **Polyfills sicuri** - Non sovrascrivere APIs esistenti
3. **Lazy loading graduale** - Stores prima di React, poi UI
4. **Error boundaries everywhere** - Protezione a ogni livello
5. **ESM/CJS interop** - Testare sempre in produzione
6. **PWA solo in prod** - Evitare conflitti in sviluppo
7. **Monitoring obbligatorio** - Track ogni fase di inizializzazione

Questa architettura ha dimostrato che con l'onboarding corretto, app complesse con React + Zustand + PWA possono essere stabili e performanti.</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\ONBOARDING_GUIDE_COMPLEX_APPS.md
