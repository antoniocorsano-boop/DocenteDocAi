# Errori di Deploy Risolti

## Problemi Identificati

Durante il deploy su Vercel, sono stati riscontrati i seguenti errori di build:

### 1. Errore M3Button - Export Mismatch
**File affetti:** 7 file
**Errore:** `"default" is not exported by "src/components/M3Button.tsx"`

Il componente `M3Button` è esportato come **named export** (`export const M3Button`), ma veniva importato come **default export** in diversi file.

**File corretti:**
- `src/components/ui/EmptyState.tsx`
- `src/components/ui/M3Button.stories.test.tsx`
- `src/components/ui/M3Button.stories.tsx`
- `src/components/ui/M3ComponentTemplate.tsx`
- `src/components/ui/M3ComponentTemplate.tsx.pre-useTheme-migration`
- `src/components/ui/M3Menu.stories.tsx`
- `src/components/ui/M3Popover.stories.tsx`

**Correzione applicata:**
```typescript
// PRIMA (errato)
import M3Button from '../M3Button';

// DOPO (corretto)
import { M3Button } from '../M3Button';
```

### 2. Errore M3Tooltip - Componente Non Esistente
**File affetto:** `src/components/ui/ThemeToggle.tsx`
**Errore:** `"M3Tooltip" is not exported by "src/components/ui/index.ts"`

Il componente si chiama `Tooltip`, non `M3Tooltip`.

**Correzione applicata:**
```typescript
// PRIMA (errato)
import { M3Tooltip } from './index';
<M3Tooltip text={tooltipText}>...</M3Tooltip>

// DOPO (corretto)
import { Tooltip } from './index';
<Tooltip text={tooltipText}>...</Tooltip>
```

## Risultati

✅ **Build completata con successo**
- Tutti i 1155 moduli trasformati correttamente
- Build completata in 11.52s
- Service Worker generato (25.93 kB)
- PWA con 126 entries precached (5393.83 KiB)

## Deploy

Il fix è stato committato sul branch `cto/fix-deploy-errors` e pushato su GitHub.

Il prossimo deploy su Vercel dovrebbe completarsi senza errori.

## Data
Febbraio 2026

## Note Tecniche

Gli errori erano causati da inconsistenze tra la modalità di export/import dei componenti. La codebase utilizza sia named exports che default exports, ed è importante verificare quale modalità è utilizzata prima di importare un componente.

Suggerimento: Standardizzare su named exports per tutti i componenti per evitare problemi simili in futuro.
