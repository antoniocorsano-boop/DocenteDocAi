# Security Guidelines

## XSS Prevention

### dangerouslySetInnerHTML Usage

⚠️ **9 occorrenze trovate in produzione** - Richiedono audit continuo

#### File con dangerouslySetInnerHTML:

| File | Stato | Note |
|------|-------|------|
| DocumentViewerModal.tsx | ✅ Sanitizzato | Usa `sanitizeHTML` da securityUtils |
| ImportStudentsModal.tsx | ✅ Sanitizzato | Usa `sanitizeHtml` da htmlSanitizer |
| UseCaseCard.tsx | ✅ Sanitizzato | Usa `sanitizeHtml` da htmlSanitizer |
| WorkflowGuide.tsx | ✅ Sanitizzato | Usa `sanitizeHtml` da htmlSanitizer |
| HelpModal.tsx | ⚠️ Non sanitizzato | 4 occorrenze da rivedere |
| SmartImportModal.tsx | ⚠️ Non sanitizzato | 1 occorrenza da rivedere |

### Best Practices

1. **Evitare dangerouslySetInnerHTML** quando possibile
2. **Sanitizzare sempre** il contenuto HTML prima del render
3. **Usare librerie consolidate** come DOMPurify per casi complessi

```typescript
// ✅ CORRETTO - Con sanitizzazione
import { sanitizeHtml } from '../utils/htmlSanitizer';
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }} />

// ❌ ERRATO - Senza sanitizzazione
<div dangerouslySetInnerHTML={{ __html: rawHtml }} />
```

### Utility Disponibili

#### htmlSanitizer.ts
- `sanitizeHtml()` - Rimuove script e attributi pericolosi
- `escapeHtml()` - Converte testo in HTML entities
- `nl2br()` - Converte newline in `<br>` (con escape)
- `stripHtml()` - Rimuove tutti i tag HTML

## LocalStorage Security

### Problema
Safari in modalità privata lancia eccezioni su localStorage.

### Soluzione
Usare il wrapper `storage.ts`:

```typescript
import { storage } from '../utils/storage';

// ✅ CORRETTO
storage.setItem('key', 'value');
const value = storage.getItem('key');

// ❌ ERRATO
try {
  localStorage.setItem('key', 'value');
} catch (e) {
  // Gestione manuale richiesta
}
```

## Dipendenze di Sicurezza

Considerare l'aggiunta di:
- `dompurify` - Sanitizzazione HTML avanzata
- `@types/dompurify` - TypeScript types

```bash
npm install dompurify @types/dompurify
```

## Audit Checklist

- [ ] Nessun `eval()` o `Function()` dinamico
- [ ] Nessun `innerHTML` diretto (usare React)
- [ ] Tutti gli `dangerouslySetInnerHTML` sanitizzati
- [ ] localStorage/sessionStorage con wrapper
- [ ] Cookie HttpOnly/Secure dove applicabile
- [ ] CSP headers configurati
