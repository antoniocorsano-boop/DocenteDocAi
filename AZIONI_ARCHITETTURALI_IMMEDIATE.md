# 🚀 Azioni Architetturali Immediate - DocenteDoc AI

**Data:** 15 Febbraio 2026
**Focus:** Criticità urgenti identificate nell'analisi architetturale

---

## 🎯 PRIORITÀ 1: Pulizia Codebase (1 ora)

### Rimuovi tutti i file di backup

```bash
# Esegui nella root del progetto:
find src -name "*.backup" -delete
find src -name "*.pre-cleanup" -delete
find src -name "*.final-cleanup" -delete
find src -name "*.temp" -delete
```

### Verifica .gitignore

```bash
# Aggiungi a .gitignore se non presente:
*.backup
*.pre-cleanup
*.final-cleanup
*.temp
```

**Beneficio immediato:**
- Repository size ridotta
- Meno confusione per sviluppatori
- Git operations più veloci

---

## 🎯 PRIORITÀ 2: Aggiungere Hover Effects (4-6 ore)

### Crea utility per hover effects

**File:** `src/components/ui/useHoverEffect.ts` (NUOVO)

```typescript
import { useState } from 'react';

interface UseHoverEffectReturn {
  style: React.CSSProperties;
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
}

export const useHoverEffect = (elevation = 'level2'): UseHoverEffectReturn => {
  const [isHovered, setIsHovered] = useState(false);

  const elevationShadows = {
    level1: '0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
    level2: '0 2px 4px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.1)',
    level3: '0 4px 8px rgba(0,0,0,0.05), 0 8px 16px rgba(0,0,0,0.1)',
  };

  return {
    style: {
      transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: isHovered ? elevationShadows[elevation as keyof typeof elevationShadows] : 'none',
    },
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
};
```

### Applica ai componenti card in Home.tsx

**File:** `src/components/Home.tsx`

```typescript
import { useHoverEffect } from './ui/useHoverEffect';

// Nella Home component:
const hoverEffect = useHoverEffect('level2');

// Aggiorna M3Card per metriche:
<M3Card
  onClick={() => onNavigate('aula')}
  style={{
    padding: 'var(--md-sys-spacing-4)',
    cursor: 'pointer',
    ...hoverEffect.style
  }}
  onMouseEnter={hoverEffect.onMouseEnter}
  onMouseLeave={hoverEffect.onMouseLeave}
>
```

### Altri componenti da aggiornare:
- [ ] `Home.tsx` - Card metriche
- [ ] `Home.tsx` - Card attività recenti
- [ ] `Home.tsx` - Quick actions
- [ ] `ClassSelection.tsx` - Card classi
- [ ] `ViewManager.tsx` - Qualsiasi card cliccabile

---

## 🎯 PRIORITÀ 3: Usare EmptyState Component (2-3 ore)

### Migrare Home.tsx

**File:** `src/components/Home.tsx`

**PRIMA:**
```typescript
{activities.length === 0 && (
  <M3Surface style={{ ... }}>
    <span className="material-symbols-outlined">event_busy</span>
    <M3Typography>Nessuna attività recente</M3Typography>
    <M3Typography>Le tue attività appariranno qui</M3Typography>
  </M3Surface>
)}
```

**DOPO:**
```typescript
import { EmptyState } from './ui';

{activities.length === 0 ? (
  <EmptyState
    icon="event_busy"
    title="Nessuna attività recente"
    description="Le tue attività appariranno qui. Inizia aggiungendo una lezione o un compito."
    actionLabel="Crea attività"
    onAction={() => onNavigate('aula' as View)}
  />
) : (
  activities.map(activity => (
    <M3Card key={activity.id}>{...}</M3Card>
  ))
)}
```

### Altri componenti da migrare:
- [ ] `ClassSelection.tsx` - Quando `classes.length === 0`
- [ ] `TimetableView.tsx` - Quando orario vuoto
- [ ] `StudentWorkspace.tsx` - Quando `students.length === 0`
- [ ] `EvaluationsList.tsx` - Quando `evaluations.length === 0`

---

## 🎯 PRIORITÀ 4: Usare LoadingState (2-3 ore)

### Pattern per stati di caricamento

**File:** Qualsiasi componente con caricamento asincrono

```typescript
import { LoadingState } from './ui';

const MyComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData().then(result => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingState message="Caricamento dati..." size="medium" />;
  }

  return <div>{/* renderizza dati */}</div>;
};
```

### Componenti da aggiornare:
- [ ] Tutti i modali che caricano dati
- [ ] ClassDashboard.tsx
- [ ] AnalyticsDashboard.tsx
- [ ] Qualsiasi componente con `useEffect` che chiama API

---

## 🎯 PRIORITÀ 5: Usare Skeleton Loaders (2-3 ore)

### Pattern per liste asincrone

**File:** Qualsiasi componente con lista asincrona

```typescript
import { SkeletonList } from './ui';

const MyListComponent = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems().then(result => {
      setItems(result);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <SkeletonList count={5} />;
  }

  return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
};
```

### Componenti da aggiornare:
- [ ] `Home.tsx` - Attività recenti
- [ ] `ClassSelection.tsx` - Lista classi
- [ ] `StudentList.tsx` - Lista studenti
- [ ] `LessonsList.tsx` - Lista lezioni

---

## 🎯 PRIORITÀ 6: Correggere Tipografia Hardcoded (2-3 ore)

### Sostituire hardcoded values con token MD3

**Pattern da cercare:**
```bash
grep -r "fontSize.*px\|lineHeight.*px" src/components/*.tsx
```

**File:** `src/components/Home.tsx`

**PRIMA:**
```typescript
<M3Typography 
  variant="display-small" 
  style={{ 
    color: 'var(--md-sys-color-primary)',
    fontWeight: '700',
    fontSize: '48px',        // ❌ Hardcoded
    lineHeight: '56px'      // ❌ Hardcoded
  }}
>
  {students?.length ?? 0}
</M3Typography>
```

**DOPO:**
```typescript
<M3Typography 
  variant="display-small" 
  style={{ 
    color: 'var(--md-sys-color-primary)',
    fontWeight: '700',
    fontSize: 'var(--md-sys-typescale-display-medium-size)',     // ✅ Token
    lineHeight: 'var(--md-sys-typescale-display-medium-line-height)' // ✅ Token
  }}
>
  {students?.length ?? 0}
</M3Typography>
```

---

## ✅ CHECKLIST COMPLETA

### Pulizia Codebase
- [ ] Rimuovi tutti i file `*.backup`
- [ ] Rimuovi tutti i file `*.pre-cleanup`
- [ ] Verifica .gitignore

### Hover Effects
- [ ] Crea `useHoverEffect.ts` utility
- [ ] Applica a Home.tsx metriche
- [ ] Applica a Home.tsx attività
- [ ] Applica a Home.tsx quick actions
- [ ] Applica a ClassSelection.tsx card
- [ ] Applica a qualsiasi card cliccabile

### Empty State
- [ ] Migrare Home.tsx activities empty state
- [ ] Migrare ClassSelection.tsx empty state
- [ ] Migrare TimetableView.tsx empty state
- [ ] Migrare StudentWorkspace.tsx empty state
- [ ] Aggiungere CTA appropriate a tutti

### Loading State
- [ ] Identificare tutti i componenti con loading
- [ ] Sostituire con LoadingState component
- [ ] Verificare messaggi di caricamento

### Skeleton Loaders
- [ ] Identificare tutte le liste asincrone
- [ ] Sostituire con SkeletonList
- [ ] Verificare count appropriato

### Tipografia
- [ ] Cerca hardcoded fontSize values
- [ ] Cerca hardcoded lineHeight values
- [ ] Sostituisci con MD3 tokens

---

## 📊 STIMA TEMPI TOTALE

| Priorità | Azione | Tempo |
|----------|--------|-------|
| 1 | Pulizia codebase | 1 ora |
| 2 | Hover effects | 4-6 ore |
| 3 | EmptyState migration | 2-3 ore |
| 4 | LoadingState migration | 2-3 ore |
| 5 | Skeleton migration | 2-3 ore |
| 6 | Tipografia fix | 2-3 ore |
| **TOTALE** | | **13-19 ore** (~2-3 giorni)** |

---

## 🧪 COME VERIFICARE I MIGLIORAMENTI

### 1. Hover Effects
```bash
# Apri l'app in browser desktop
# Passa il mouse sopra le card
# Verifica che si alzino leggermente e abbiano ombra
```

### 2. Empty State
```bash
# 1. Svuota le attività (o crea nuovo profilo)
# 2. Vai alla Home
# 3. Verifica che venga mostrato EmptyState con icona, titolo, descrizione e CTA
# 4. Clicca sulla CTA e verifica che ti porti alla vista corretta
```

### 3. Loading State
```bash
# 1. Apri DevTools Network
# 2. Imposta "Slow 3G"
# 3. Carica una vista con dati asincroni
# 4. Verifica che venga mostrato LoadingState con spinner
```

### 4. Skeleton Loaders
```bash
# 1. Apri DevTools Network
# 2. Imposta "Slow 3G"
# 3. Carica una lista
# 4. Verifica che vengano mostrati SkeletonList prima dei dati
```

### 5. Typografia
```bash
# 1. Usa DevTools Elements per ispezionare
# 2. Cerca elementi con fontSize o lineHeight
# 3. Verifica che usino token CSS invece di valori hardcoded
```

---

## 💡 SUGGERIMENTI

### 1. Inizia con la pulizia
È l'azione più veloce e dà beneficio immediato.

### 2. Usa grep per trovare pattern
```bash
# Trova dove usare EmptyState:
grep -r "length === 0\|length < 1" src/components/*.tsx

# Trova hardcoded fontSize:
grep -r "fontSize.*px" src/components/*.tsx

# Trova caricamenti manuali:
grep -r "if (loading\|if (isLoading" src/components/*.tsx
```

### 3. Testa man mano dopo ogni cambiamento
Non aspettare di finire tutto prima di testare.

### 4. Crea branch feature separati
```bash
git checkout -b feature/hover-effects
git checkout -b feature/empty-state-migration
# ...
```

### 5. Chiedi code review
Dopo ogni priorità, chiedi review a un altro sviluppatore.

---

## 🎯 OBBIETTIVO

In **2-3 giorni di lavoro**, puoi:

✅ Pulire il codebase dai file duplicati
✅ Aggiungere hover effects a tutti gli elementi interattivi
✅ Migrare tutti gli stati vuoti a componenti riutilizzabili
✅ Migliorare l'esperienza di caricamento con skeleton loaders
✅ Uniformare la tipografia con token MD3

Questo porterà l'UX/UI a un livello **professionale e coerente**.

---

**Inizia oggi! Un piccolo cambiamento alla volta.**
