# 🚀 Azioni UX/UI Immediate - DocenteDoc AI

## 🎯 Top 5 Priorità Critiche da Sistemare SUBITO

### 1. 🔴 CONTRASTO TESTO (Impatto: ALTO - Effort: BASSO)

**Problema:** Testo quasi illeggibile in diverse sezioni

**Fix immediato:**
```typescript
// Cercare e sostituire in TUTTI i file .tsx:

// ❌ EVITARE:
color: 'var(--md-sys-color-on-surface-variant)'  // troppo chiaro
opacity: '0.6'                                    // su testo importante

// ✅ USARE:
color: 'var(--md-sys-color-on-surface)'          // per testo principale
color: 'var(--md-sys-color-on-surface)'          // con opacity max 0.74 per secondario
fontWeight: '600'                                 // per enfatizzare invece di schiarire
```

**File da modificare subito:**
- `src/components/Home.tsx` - linee con `on-surface-variant`
- `src/components/Header.tsx` - nome utente
- `src/components/TimetableView.tsx` - celle tabella
- `src/components/ClassSelection.tsx` - card classi

---

### 2. 🔴 STATI VUOTI (Impatto: ALTO - Effort: MEDIO)

**Problema:** Grande spazio bianco quando non ci sono dati

**Fix immediato:**
Creare file `src/components/ui/EmptyState.tsx` (vedi codice nell'analisi completa)

**Implementare in:**
1. Home.tsx quando `activities.length === 0`
2. ClassSelection.tsx quando `classes.length === 0`
3. TimetableView.tsx quando orario vuoto

```typescript
// Esempio d'uso:
{activities.length === 0 ? (
  <EmptyState
    icon="school"
    title="Nessuna attività recente"
    description="Inizia creando il tuo primo orario o aggiungi una classe."
    actionLabel="Crea Orario"
    onAction={() => onNavigate('timetable')}
  />
) : (
  <ActivityList activities={activities} />
)}
```

---

### 3. 🔴 FOCUS INDICATORS (Impatto: ALTO - Effort: BASSO)

**Problema:** Navigazione da tastiera impossibile

**Fix immediato:**
```css
/* Aggiungere a src/design-system/accessibility-focus.css */

*:focus-visible {
  outline: 2px solid var(--md-sys-color-primary) !important;
  outline-offset: 2px !important;
  border-radius: 4px !important;
}

button:focus-visible,
a:focus-visible,
[role="button"]:focus-visible {
  outline: 3px solid var(--md-sys-color-primary) !important;
  outline-offset: 2px !important;
}
```

---

### 4. 🟡 GERARCHIA VISIVA HOME (Impatto: MEDIO - Effort: MEDIO)

**Problema:** Tutto allo stesso livello visivo

**Fix immediato:**
```typescript
// src/components/Home.tsx

// ❌ PRIMA (flat):
<M3HeroCard>
  <M3Typography variant="headline-medium">{lessonTagline}</M3Typography>
</M3HeroCard>

// ✅ DOPO (elevated):
<M3Surface
  elevation="level2"
  style={{
    padding: 'var(--md-sys-spacing-6)',
    borderRadius: 'var(--md-sys-spacing-4)',
    background: 'var(--md-sys-color-primary-container)',
    marginBottom: 'var(--md-sys-spacing-6)'
  }}
>
  <M3Typography 
    variant="headline-medium" 
    style={{ 
      color: 'var(--md-sys-color-on-primary-container)',
      fontWeight: '700',  // più bold
      marginBottom: 'var(--md-sys-spacing-3)'
    }}
  >
    {lessonTagline}
  </M3Typography>
  <M3Typography 
    variant="body-large" 
    style={{ 
      color: 'var(--md-sys-color-on-primary-container)',
      lineHeight: '1.5'  // più respirato
    }}
  >
    {lessonDetails}
  </M3Typography>
</M3Surface>
```

---

### 5. 🟡 BOTTOM NAV MIGLIORATO (Impatto: MEDIO - Effort: MEDIO)

**Problema:** Tap targets piccoli, stato attivo poco chiaro

**Fix immediato:**
```typescript
// src/components/BottomNav.tsx

<button
  style={{
    // Aumentare tap target
    minWidth: 'var(--md-sys-spacing-10)',    // 64px
    minHeight: 'var(--md-sys-spacing-8)',    // 48px
    padding: 'var(--md-sys-spacing-2)',
    
    // Background attivo più evidente
    background: isActive 
      ? 'var(--md-sys-color-primary-container)' 
      : 'transparent',
    borderRadius: 'var(--md-sys-spacing-3)',
    
    // Transizione smooth
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }}
>
  <span
    className="material-symbols-outlined"
    style={{
      // Icona fill quando attivo
      fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0',
      color: isActive
        ? 'var(--md-sys-color-on-primary-container)'
        : 'var(--md-sys-color-on-surface-variant)'
    }}
  >
    {isActive ? item.activeIcon : item.icon}
  </span>
</button>
```

---

## 🎨 Quick Wins Estetici (30 minuti)

### Migliorare Card Metriche Home

```typescript
// src/components/Home.tsx - Sezione Metriche

<M3Card style={{
  padding: 'var(--md-sys-spacing-4)',
  textAlign: 'center',
  border: '1px solid var(--md-sys-color-primary)20',  // border colorato
  transition: 'transform 200ms, box-shadow 200ms',
  cursor: 'pointer'
}}>
  <M3Typography 
    variant="display-small"  // più grande
    style={{ 
      color: 'var(--md-sys-color-primary)',
      fontWeight: '700',
      fontSize: '48px'  // numeri grandi
    }}
  >
    {students?.length ?? 0}
  </M3Typography>
  <M3Typography 
    variant="label-large" 
    style={{ 
      color: 'var(--md-sys-color-on-surface-variant)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginTop: 'var(--md-sys-spacing-2)'
    }}
  >
    Studenti
  </M3Typography>
</M3Card>
```

### Aggiungere Hover Effects

```typescript
// Per tutti i bottoni e card cliccabili:

<button
  style={{
    // ... altri stili
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = 'var(--md-sys-elevation-level2)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
```

---

## 📝 Checklist Rapida

### Oggi (2 ore)
- [ ] Aumentare contrasto testo in Home.tsx
- [ ] Aggiungere focus-visible styles a accessibility-focus.css
- [ ] Aumentare dimensione numeri metriche Home

### Questa Settimana (1 giorno)
- [ ] Creare EmptyState.tsx component
- [ ] Implementare empty states in Home, Classi, Orario
- [ ] Migliorare BottomNav con tap targets più grandi
- [ ] Aggiungere hover effects su tutte le card

### Prossima Settimana (2-3 giorni)
- [ ] Refactor completo Home.tsx con gerarchia visiva
- [ ] Creare MetricCard.tsx per dashboard
- [ ] Implementare LoadingState.tsx e Skeleton.tsx
- [ ] Aggiungere transizioni tra pagine

---

## 🧪 Come Testare i Miglioramenti

### 1. Contrasto
```bash
# Usare estensione browser "WCAG Color Contrast Checker"
# Verificare che tutto il testo abbia ratio >= 4.5:1
```

### 2. Keyboard Navigation
```
Tab → Deve evidenziare con outline blu visibile
Enter/Space → Deve attivare l'elemento
Esc → Deve chiudere modal/dropdown
```

### 3. Mobile Usability
```
# Testare su Chrome DevTools mobile simulator
1. Touch targets >= 48x48px
2. Bottom nav facilmente raggiungibile con pollice
3. Scroll smooth senza lag
```

### 4. Visual Hierarchy
```
# Chiedere a 3 persone: "Qual è l'azione principale in questa pagina?"
# Se rispondono correttamente, gerarchia OK
```

---

## 🎯 Obiettivi Misurabili

### Accessibilità
- **Baseline:** Lighthouse Score 82
- **Target:** >95 entro 1 settimana

### Usabilità
- **Baseline:** Task completion time 45s
- **Target:** <30s entro 2 settimane

### Estetica
- **Baseline:** Contrasto 60% conforme WCAG
- **Target:** 100% conforme entro 3 giorni

---

## 💡 Tips Veloci

1. **Prima contrasto, poi estetica** - Un'app brutta ma leggibile batte una bella ma illeggibile
2. **Test con utente reale** - 5 minuti di osservazione valgono 5 ore di teoria
3. **Iniziare da mobile** - Se funziona su mobile, funzionerà su desktop
4. **Usare lo spacing system** - Non inventare valori custom, usare `--md-sys-spacing-*`
5. **Copiare i pattern** - Se un pattern funziona in Gmail/Drive, funzionerà qui

---

## 📦 Template Files da Creare

### 1. EmptyState.tsx
Vedi: `ANALISI_UX_UI_APPROFONDITA.md` sezione 3

### 2. LoadingState.tsx
Vedi: `ANALISI_UX_UI_APPROFONDITA.md` sezione 5

### 3. MetricCard.tsx
Vedi: `ANALISI_UX_UI_APPROFONDITA.md` sezione 7

### 4. Skeleton.tsx
Vedi: `ANALISI_UX_UI_APPROFONDITA.md` sezione 5

---

**Iniziare da qui. Un miglioramento alla volta. Testare sempre.**

_Ultimo aggiornamento: 14 Febbraio 2026_
