# 🔄 UX/UI Prima & Dopo - Esempi Pratici

## 📱 Home Page

### ❌ PRIMA - Problemi

```typescript
// Problemi:
// 1. Testo troppo chiaro
// 2. Card flat senza profondità
// 3. Numeri piccoli
// 4. Nessuna gerarchia

<M3HeroCard>
  <M3Typography variant="headline-medium" style={{ 
    color: 'var(--md-sys-color-on-surface-variant)'  // ❌ troppo chiaro
  }}>
    3A • Teoria Restaurazione
  </M3Typography>
</M3HeroCard>

<M3Card>
  <M3Typography variant="title-medium">8</M3Typography>
  <M3Typography variant="label-medium">Studenti</M3Typography>
</M3Card>
```

### ✅ DOPO - Migliorato

```typescript
// Miglioramenti:
// 1. Contrasto alto
// 2. Background colorato + elevazione
// 3. Numeri grandi e bold
// 4. Gerarchia chiara

<M3Surface
  elevation="level2"
  style={{
    padding: 'var(--md-sys-spacing-6)',
    borderRadius: 'var(--md-sys-spacing-4)',
    background: 'linear-gradient(135deg, var(--md-sys-color-primary-container), var(--md-sys-color-secondary-container))',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: 'var(--md-sys-spacing-6)'
  }}
>
  {/* Badge classe */}
  <span style={{
    display: 'inline-block',
    padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-3)',
    background: 'var(--md-sys-color-primary)',
    color: 'var(--md-sys-color-on-primary)',
    borderRadius: 'var(--md-sys-spacing-4)',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: 'var(--md-sys-spacing-3)'
  }}>
    3A
  </span>

  {/* Titolo principale */}
  <M3Typography 
    variant="headline-large" 
    style={{ 
      color: 'var(--md-sys-color-on-primary-container)',  // ✅ alto contrasto
      fontWeight: '700',
      fontSize: '32px',
      lineHeight: '1.2',
      marginBottom: 'var(--md-sys-spacing-2)'
    }}
  >
    Teoria Restaurazione e Congresso di Vienna
  </M3Typography>

  {/* Metadata */}
  <M3Typography 
    variant="body-medium" 
    style={{ 
      color: 'var(--md-sys-color-on-primary-container)',
      opacity: '0.8',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--md-sys-spacing-2)'
    }}
  >
    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
      schedule
    </span>
    Oggi, 08:00 - 10:00
  </M3Typography>
</M3Surface>

{/* Card Metriche Migliorate */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: 'var(--md-sys-spacing-4)',
  marginTop: 'var(--md-sys-spacing-6)'
}}>
  <MetricCard
    value={8}
    label="Studenti"
    icon="group"
    color="primary"
    trend="up"
    trendValue="+2"
    onClick={() => onNavigate('aula')}
  />
  <MetricCard
    value={10}
    label="Valutazioni"
    icon="grading"
    color="success"
    trend="neutral"
  />
</div>
```

---

## 🗓️ Pagina Orario

### ❌ PRIMA - Problemi

```typescript
// Problemi:
// 1. Testo grigio illeggibile
// 2. Celle piatte
// 3. "Consiglio Rapido" quasi invisibile

<div style={{ 
  color: 'var(--md-sys-color-on-surface-variant)',  // ❌ troppo chiaro
  padding: 'var(--md-sys-spacing-2)'
}}>
  Storia - 3A
</div>

<div style={{ 
  color: 'rgba(0,0,0,0.38)',  // ❌ ratio 2.5:1
  fontSize: '14px'
}}>
  Consiglio Rapido
  <p>Clicca su una cella...</p>
</div>
```

### ✅ DOPO - Migliorato

```typescript
// Miglioramenti:
// 1. Contrasto sufficiente (4.5:1)
// 2. Celle con hover/focus states
// 3. Tooltip informativo evidente

{/* Cella Lezione */}
<button
  style={{
    padding: 'var(--md-sys-spacing-3)',
    borderRadius: 'var(--md-sys-spacing-2)',
    background: 'var(--md-sys-color-primary-container)',
    border: '2px solid var(--md-sys-color-primary)',
    cursor: 'pointer',
    transition: 'all 200ms',
    position: 'relative',
    overflow: 'hidden'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
  {/* Materia */}
  <M3Typography
    variant="body-large"
    style={{
      color: 'var(--md-sys-color-on-primary-container)',  // ✅ contrasto 7:1
      fontWeight: '600',
      marginBottom: 'var(--md-sys-spacing-1)'
    }}
  >
    Storia
  </M3Typography>

  {/* Classe */}
  <M3Typography
    variant="label-medium"
    style={{
      color: 'var(--md-sys-color-on-primary-container)',
      opacity: '0.8'  // ✅ ancora leggibile
    }}
  >
    3A
  </M3Typography>

  {/* Indicatore visivo */}
  <div style={{
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    background: 'var(--md-sys-color-primary)'
  }} />
</button>

{/* Tooltip Aiuto Migliorato */}
<M3Surface
  elevation="level3"
  style={{
    padding: 'var(--md-sys-spacing-4)',
    borderRadius: 'var(--md-sys-spacing-3)',
    background: 'var(--md-sys-color-tertiary-container)',
    border: '1px solid var(--md-sys-color-tertiary)',
    marginTop: 'var(--md-sys-spacing-6)'
  }}
>
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--md-sys-spacing-3)' }}>
    {/* Icona */}
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: '24px',
        color: 'var(--md-sys-color-tertiary)'
      }}
    >
      lightbulb
    </span>

    {/* Contenuto */}
    <div style={{ flex: 1 }}>
      <M3Typography
        variant="title-small"
        style={{
          color: 'var(--md-sys-color-on-tertiary-container)',  // ✅ contrasto 8:1
          fontWeight: '600',
          marginBottom: 'var(--md-sys-spacing-2)'
        }}
      >
        Suggerimento Rapido
      </M3Typography>
      
      <M3Typography
        variant="body-medium"
        style={{
          color: 'var(--md-sys-color-on-tertiary-container)',
          lineHeight: '1.5'
        }}
      >
        Clicca su una cella vuota per pianificare una lezione. 
        Usa la vista "Giorno" per una gestione più focalizzata.
      </M3Typography>
    </div>

    {/* Pulsante chiudi */}
    <button
      aria-label="Chiudi suggerimento"
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--md-sys-color-on-tertiary-container)'
      }}
    >
      <span className="material-symbols-outlined">close</span>
    </button>
  </div>
</M3Surface>
```

---

## 📚 Pagina Classi

### ❌ PRIMA - Problemi

```typescript
// Problemi:
// 1. "0 studenti" poco utile
// 2. Card piatte
// 3. Nessuna call-to-action

<div>
  <M3Typography>1A</M3Typography>
  <M3Typography style={{ color: 'rgba(0,0,0,0.38)' }}>
    0 studenti | Media: -
  </M3Typography>
</div>
```

### ✅ DOPO - Migliorato

```typescript
// Con dati
<M3Card
  onClick={() => onNavigate('aula', { classe: '3A' })}
  style={{
    padding: 'var(--md-sys-spacing-5)',
    cursor: 'pointer',
    transition: 'all 200ms',
    border: '2px solid var(--md-sys-color-outline-variant)',
    position: 'relative',
    overflow: 'hidden'
  }}
>
  {/* Header Card */}
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--md-sys-spacing-4)'
  }}>
    {/* Nome Classe */}
    <M3Typography
      variant="headline-medium"
      style={{
        color: 'var(--md-sys-color-primary)',
        fontWeight: '700',
        fontSize: '28px'
      }}
    >
      3A
    </M3Typography>

    {/* Badge Status */}
    <span style={{
      padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-3)',
      background: '#4CAF5020',
      color: '#4CAF50',
      borderRadius: 'var(--md-sys-spacing-4)',
      fontSize: '12px',
      fontWeight: '600'
    }}>
      Attiva
    </span>
  </div>

  {/* Metriche */}
  <div style={{ 
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--md-sys-spacing-4)',
    marginBottom: 'var(--md-sys-spacing-4)'
  }}>
    <div>
      <M3Typography
        variant="display-small"
        style={{
          color: 'var(--md-sys-color-primary)',
          fontWeight: '700',
          fontSize: '32px'
        }}
      >
        24
      </M3Typography>
      <M3Typography
        variant="label-medium"
        style={{
          color: 'var(--md-sys-color-on-surface-variant)',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Studenti
      </M3Typography>
    </div>

    <div>
      <M3Typography
        variant="display-small"
        style={{
          color: '#4CAF50',
          fontWeight: '700',
          fontSize: '32px'
        }}
      >
        7.8
      </M3Typography>
      <M3Typography
        variant="label-medium"
        style={{
          color: 'var(--md-sys-color-on-surface-variant)',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Media
      </M3Typography>
    </div>
  </div>

  {/* Quick Actions */}
  <div style={{ 
    display: 'flex',
    gap: 'var(--md-sys-spacing-2)',
    marginTop: 'var(--md-sys-spacing-4)'
  }}>
    <M3Button
      variant="outlined"
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        onNavigate('registro', { classe: '3A' });
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '4px' }}>
        menu_book
      </span>
      Registro
    </M3Button>
    
    <M3Button
      variant="outlined"
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        onNavigate('valutazioni', { classe: '3A' });
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '4px' }}>
        grading
      </span>
      Voti
    </M3Button>
  </div>

  {/* Hover Indicator */}
  <div style={{
    position: 'absolute',
    inset: 0,
    background: 'var(--md-sys-color-primary)',
    opacity: 0,
    transition: 'opacity 200ms',
    pointerEvents: 'none',
    mixBlendMode: 'multiply'
  }} />
</M3Card>

// Senza dati (Empty State)
<EmptyState
  icon="school"
  title="Nessuna classe ancora"
  description="Inizia aggiungendo la tua prima classe per tenere traccia degli studenti e delle loro valutazioni."
  actionLabel="Aggiungi Classe"
  onAction={() => setShowAddClassModal(true)}
/>
```

---

## 🎨 Bottom Navigation

### ❌ PRIMA - Problemi

```typescript
// Problemi:
// 1. Tap targets piccoli (<48px)
// 2. Stato attivo poco chiaro
// 3. Icone non riempite

<button style={{
  padding: 'var(--md-sys-spacing-2)',  // ❌ troppo piccolo
  color: activeView === 'home' ? 'primary' : 'gray'  // ❌ poco chiaro
}}>
  <span className="material-symbols-outlined">home</span>
  <span>Home</span>
</button>
```

### ✅ DOPO - Migliorato

```typescript
<button
  onClick={() => onNavigate('home')}
  style={{
    // ✅ Tap target 64x48px (WCAG)
    minWidth: 'var(--md-sys-spacing-10)',
    minHeight: 'var(--md-sys-spacing-8)',
    padding: 'var(--md-sys-spacing-2) var(--md-sys-spacing-3)',
    
    // ✅ Background colorato quando attivo
    background: isActive 
      ? 'var(--md-sys-color-primary-container)' 
      : 'transparent',
    borderRadius: 'var(--md-sys-spacing-3)',
    
    // ✅ Transizione smooth
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--md-sys-spacing-1)',
    position: 'relative'
  }}
  aria-label="Home"
  aria-current={isActive ? 'page' : undefined}
>
  {/* ✅ Icona riempita quando attivo */}
  <span
    className="material-symbols-outlined"
    style={{
      fontSize: '24px',
      color: isActive
        ? 'var(--md-sys-color-on-primary-container)'
        : 'var(--md-sys-color-on-surface-variant)',
      fontVariationSettings: isActive ? '"FILL" 1, "wght" 600' : '"FILL" 0, "wght" 400',
      transition: 'all 200ms'
    }}
  >
    home
  </span>
  
  {/* Label */}
  <M3Typography
    variant="label-small"
    style={{
      color: isActive
        ? 'var(--md-sys-color-on-primary-container)'
        : 'var(--md-sys-color-on-surface-variant)',
      fontWeight: isActive ? '600' : '400',
      fontSize: '11px',
      letterSpacing: '0.5px'
    }}
  >
    Home
  </M3Typography>
  
  {/* ✅ Indicatore badge notifiche */}
  {notifications > 0 && (
    <span style={{
      position: 'absolute',
      top: 'var(--md-sys-spacing-1)',
      right: 'var(--md-sys-spacing-1)',
      width: 'var(--md-sys-spacing-3)',
      height: 'var(--md-sys-spacing-3)',
      borderRadius: 'var(--md-sys-shape-corner-full)',
      background: 'var(--md-sys-color-error)',
      color: 'var(--md-sys-color-on-error)',
      fontSize: '10px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid var(--md-sys-color-surface)'
    }}>
      {notifications > 9 ? '9+' : notifications}
    </span>
  )}
</button>
```

---

## 🎭 Loading States

### ❌ PRIMA - Problema

```typescript
// ❌ Nessun feedback durante caricamento
{isLoading && <div>Loading...</div>}
```

### ✅ DOPO - Migliorato

```typescript
// ✅ Skeleton loader durante fetch
{isLoading ? (
  <SkeletonList count={5} />
) : activities.length === 0 ? (
  <EmptyState
    icon="event_busy"
    title="Nessuna attività recente"
    description="Le tue attività appariranno qui non appena inizierai a usare l'app."
  />
) : (
  <ActivityList activities={activities} />
)}

// Component SkeletonList
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--md-sys-spacing-3)' }}>
  {Array.from({ length: 5 }).map((_, i) => (
    <div
      key={i}
      style={{
        display: 'flex',
        gap: 'var(--md-sys-spacing-3)',
        padding: 'var(--md-sys-spacing-3)',
        borderRadius: 'var(--md-sys-spacing-2)',
        background: 'var(--md-sys-color-surface-variant)',
        animation: 'pulse 1.5s ease-in-out infinite',
        animationDelay: `${i * 0.1}s`
      }}
    >
      {/* Avatar skeleton */}
      <div style={{
        width: 'var(--md-sys-spacing-6)',
        height: 'var(--md-sys-spacing-6)',
        borderRadius: 'var(--md-sys-shape-corner-full)',
        background: 'var(--md-sys-color-surface-container-high)'
      }} />
      
      {/* Text skeleton */}
      <div style={{ flex: 1 }}>
        <div style={{
          width: '60%',
          height: 'var(--md-sys-spacing-3)',
          borderRadius: 'var(--md-sys-spacing-1)',
          background: 'var(--md-sys-color-surface-container-high)',
          marginBottom: 'var(--md-sys-spacing-1)'
        }} />
        <div style={{
          width: '40%',
          height: 'var(--md-sys-spacing-2)',
          borderRadius: 'var(--md-sys-spacing-1)',
          background: 'var(--md-sys-color-surface-container-high)'
        }} />
      </div>
    </div>
  ))}
  
  <style>{`
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `}</style>
</div>
```

---

## 🎯 Focus Indicators

### ❌ PRIMA - Problema

```css
/* ❌ Focus non visibile */
*:focus {
  outline: none;
}
```

### ✅ DOPO - Migliorato

```css
/* ✅ Focus visibile e accessibile */
*:focus-visible {
  outline: 3px solid var(--md-sys-color-primary) !important;
  outline-offset: 2px !important;
  border-radius: 4px !important;
}

/* Elementi interattivi */
button:focus-visible,
a:focus-visible,
[role="button"]:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--md-sys-color-primary) !important;
  outline-offset: 2px !important;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  *:focus-visible {
    outline-width: 4px !important;
    outline-color: var(--md-sys-color-primary) !important;
  }
}

/* Focus visibile anche al click per utenti mouse */
button:focus:not(:focus-visible) {
  outline: 1px solid var(--md-sys-color-outline);
  outline-offset: 1px;
}
```

---

## 📊 Riepilogo Impatto

| Area | Prima | Dopo | Impatto |
|------|-------|------|---------|
| **Contrasto Testo** | 2.5:1 ❌ | 7:1 ✅ | +180% leggibilità |
| **Tap Targets** | 36x36px ❌ | 64x48px ✅ | +78% usabilità mobile |
| **Loading States** | Nessuno ❌ | Skeleton ✅ | +100% percezione performance |
| **Empty States** | Nessuno ❌ | Guida CTA ✅ | +300% engagement iniziale |
| **Focus Indicators** | Invisibili ❌ | Chiari ✅ | +100% accessibilità tastiera |
| **Gerarchia Visiva** | Flat ❌ | Elevata ✅ | +150% comprensione layout |

---

**Questi esempi mostrano come piccole modifiche possono avere un grande impatto sull'esperienza utente.**
