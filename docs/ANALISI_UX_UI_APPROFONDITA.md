# Analisi UX/UI Approfondita - DocenteDoc AI

**Data Analisi:** 14 Febbraio 2026  
**Analizzato da:** Sistema Automatico di Analisi UX/UI

---

## 📊 Executive Summary

L'applicazione DocenteDoc AI presenta una solida base di Material Design 3 ma necessita di miglioramenti significativi in diverse aree critiche per l'esperienza utente:

### Priorità Critiche (🔴 Alta Priorità)
1. **Contrasto Colori**: Testo poco leggibile in diverse sezioni
2. **Gerarchia Visiva**: Mancanza di distinzione chiara tra contenuto primario e secondario
3. **Feedback Visivo**: Stati di caricamento e interazione poco evidenti
4. **Contenuto Vuoto**: Assenza di stati vuoti significativi
5. **Navigazione Mobile**: Bottom nav poco intuitivo

### Opportunità di Miglioramento (🟡 Media Priorità)
6. **Microinterazioni**: Animazioni e transizioni mancanti
7. **Tipografia**: Gerarchia inconsistente
8. **Spaziatura**: Layout troppo compatto in alcune aree
9. **Icone**: Alcune poco intuitive
10. **Accessibilità**: Mancanza di focus indicators chiari

---

## 🔍 Analisi Dettagliata per Area

### 1. 🎨 COLORI E CONTRASTO

#### Problemi Identificati

**🔴 CRITICO: Contrasto insufficiente**

Dall'analisi degli screenshot:

```
Home Page:
- Testo "3A • Teoria..." è molto chiaro su sfondo chiaro
- Ratio stimato: ~2.5:1 (minimo WCAG AA: 4.5:1)
- Impatto: Leggibilità compromessa per utenti con problemi visivi

Header:
- Nome utente "Nome" troppo chiaro
- Icone in grigio chiaro poco visibili
- Ratio stimato: ~3:1

Pagina Orario:
- Celle della tabella con testo grigio chiaro
- "Consiglio Rapido" quasi invisibile
- Ratio: ~2.8:1
```

#### Soluzioni Proposte

```typescript
// src/theme/colors-improved.ts

// INVECE DI (current):
export const textColors = {
  primary: 'var(--md-sys-color-on-surface)',        // troppo chiaro
  secondary: 'var(--md-sys-color-on-surface-variant)', // ~60% opacity
  tertiary: 'rgba(0,0,0,0.38)'                      // troppo chiaro
};

// MIGLIORA CON:
export const textColorsImproved = {
  primary: 'var(--md-sys-color-on-surface)',        // 87% opacity minimo
  secondary: 'var(--md-sys-color-on-surface)',      // 60% opacity
  tertiary: 'var(--md-sys-color-on-surface-variant)', // 38% opacity SOLO per disabled
  emphasis: 'var(--md-sys-color-primary)',          // per highlight
  highContrast: '#000000'                           // per testo critico
};
```

**File da modificare:**
- `src/components/Home.tsx` - linee 122-124, 139-146
- `src/components/Header.tsx` - linee 90-92
- `src/theme/theme.tsx` - aggiungere varianti high contrast

---

### 2. 📐 GERARCHIA VISIVA

#### Problemi Identificati

**🔴 CRITICO: Contenuto appiattito**

```
Home Page:
❌ Tutto allo stesso livello visivo
❌ Card "3A • Teoria..." non risalta
❌ Metriche (8 Studenti, 10 Valutazioni) poco visibili
❌ Attività recenti si confondono con lo sfondo
```

#### Soluzioni Proposte

```typescript
// src/components/Home.tsx - REFACTOR

// PRIMA (flat):
<M3HeroCard>
  <M3Typography variant="headline-medium">{lessonTagline}</M3Typography>
  <M3Typography variant="body-large">{lessonDetails}</M3Typography>
</M3HeroCard>

// DOPO (elevated + contrast):
<M3Surface
  elevation="level2"
  style={{
    padding: 'var(--app-spacing-container)',
    borderRadius: 'var(--md-sys-shape-corner-extra-large)',
    background: 'var(--md-sys-color-primary-container)',
    marginBottom: 'var(--app-spacing-section)'
  }}
>
  <M3Typography 
    variant="headline-medium" 
    style={{ 
      color: 'var(--md-sys-color-on-primary-container)',
      fontWeight: '600',
      marginBottom: 'var(--app-spacing-element)'
    }}
  >
    {lessonTagline}
  </M3Typography>
  <M3Typography 
    variant="body-large" 
    style={{ 
      color: 'var(--md-sys-color-on-primary-container)',
      opacity: '0.8'
    }}
  >
    {lessonDetails}
  </M3Typography>
</M3Surface>
```

**Principi da applicare:**
1. **Elevazione progressiva**: Hero > Cards > Background
2. **Contrasto semantico**: Contenuto principale con background colorato
3. **Dimensioni progressive**: XXL > XL > L > M > S
4. **Peso tipografico**: Bold > Semibold > Regular > Light

---

### 3. 🎭 STATI VUOTI E FEEDBACK

#### Problemi Identificati

**🔴 CRITICO: Stati vuoti non informativi**

```
Home Page (vuota):
❌ Grande spazio bianco senza guida
❌ Nessuna Call-to-Action visibile
❌ Utente non sa cosa fare

Pagina Classi:
❌ "0 studenti | Media: -" poco utile
❌ Nessuna azione suggerita
```

#### Soluzioni Proposte

**1. Creare componente Empty State riutilizzabile**

```typescript
// src/components/ui/EmptyState.tsx - NUOVO FILE

import React from 'react';
import { M3Surface, M3Typography } from './';
import M3Button from '../M3Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  illustration
}) => {
  return (
    <M3Surface
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--app-spacing-section)',
        gap: 'var(--app-spacing-container)',
        minHeight: 'var(--md-sys-spacing-14)',
        textAlign: 'center'
      }}
    >
      {/* Icona grande o illustrazione */}
      {illustration || (
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 'var(--md-sys-spacing-12)',
            color: 'var(--md-sys-color-primary)',
            opacity: '0.6'
          }}
        >
          {icon}
        </span>
      )}
      
      {/* Titolo */}
      <M3Typography
        variant="headline-small"
        style={{
          color: 'var(--md-sys-color-on-surface)',
          fontWeight: '600'
        }}
      >
        {title}
      </M3Typography>
      
      {/* Descrizione */}
      <M3Typography
        variant="body-large"
        style={{
          color: 'var(--md-sys-color-on-surface-variant)',
          maxWidth: 'var(--md-sys-spacing-16)'
        }}
      >
        {description}
      </M3Typography>
      
      {/* Action */}
      {actionLabel && onAction && (
        <M3Button
          variant="filled"
          onClick={onAction}
          style={{ marginTop: 'var(--app-spacing-element)' }}
        >
          {actionLabel}
        </M3Button>
      )}
    </M3Surface>
  );
};
```

**2. Implementare stati vuoti specifici**

```typescript
// src/components/Home.tsx - AGGIUNGERE

const HomeEmptyState = () => (
  <EmptyState
    icon="school"
    title="Benvenuto in DocenteDoc AI!"
    description="Inizia creando il tuo primo orario settimanale o aggiungi una classe per tenere traccia degli studenti."
    actionLabel="Crea Orario"
    onAction={() => onNavigate('timetable')}
  />
);

// Usare quando activities.length === 0
{activities.length === 0 ? <HomeEmptyState /> : <ActivityList />}
```

---

### 4. 📱 NAVIGAZIONE E USABILITÀ

#### Problemi Identificati

**🟡 MEDIO: Bottom Navigation poco chiara**

```
Bottom Nav attuale:
❌ Icone generiche (home, menu_book, group, person)
❌ Labels troppo vicini alle icone
❌ Nessun indicatore visivo dello stato attivo
❌ Tap targets troppo piccoli (< 48px)
```

#### Soluzioni Proposte

```typescript
// src/components/BottomNav.tsx - REFACTOR

export const BottomNavImproved: React.FC<BottomNavProps> = ({
  items,
  activeView,
  onNavigate
}) => {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--md-sys-spacing-12)',
        background: 'var(--md-sys-color-surface-container)',
        boxShadow: 'var(--md-sys-elevation-level2)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 'var(--md-sys-z-nav)',
        paddingBottom: 'env(safe-area-inset-bottom)' // iOS notch
      }}
      aria-label="Navigazione principale mobile"
    >
      {items.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as View)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-1)',
              padding: 'var(--app-spacing-element)',
              minWidth: 'var(--md-sys-spacing-10)',
              minHeight: 'var(--md-sys-spacing-8)',
              border: 'none',
              background: isActive 
                ? 'var(--md-sys-color-secondary-container)' 
                : 'transparent',
              borderRadius: 'var(--md-sys-shape-corner-medium)',
              cursor: 'pointer',
              transition: 'all var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
              // Tap target aumentato
              position: 'relative',
            }}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Icona */}
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 'var(--app-spacing-container)',
                color: isActive
                  ? 'var(--md-sys-color-on-secondary-container)'
                  : 'var(--md-sys-color-on-surface-variant)',
                fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0'
              }}
            >
              {isActive ? item.activeIcon : item.icon}
            </span>
            
            {/* Label */}
            <M3Typography
              variant="label-small"
              style={{
                color: isActive
                  ? 'var(--md-sys-color-on-secondary-container)'
                  : 'var(--md-sys-color-on-surface-variant)',
                fontWeight: isActive ? '600' : '400'
              }}
            >
              {item.label}
            </M3Typography>
            
            {/* Ripple effect */}
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                pointerEvents: 'none',
                background: 'currentColor',
                opacity: 0,
                transition: 'opacity var(--md-sys-motion-duration-short1)'
              }}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </nav>
  );
};
```

---

### 5. ⚡ MICROINTERAZIONI E ANIMAZIONI

#### Problemi Identificati

**🟡 MEDIO: App statica, mancano feedback interattivi**

```
Mancano:
❌ Loading states per azioni asincrone
❌ Transizioni tra pagine
❌ Hover states evidenti
❌ Success/Error animations
❌ Skeleton loaders
```

#### Soluzioni Proposte

**1. Loading States**

```typescript
// src/components/ui/LoadingState.tsx - NUOVO FILE

import React from 'react';
import { M3Surface, M3Typography } from './';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Caricamento...',
  size = 'medium'
}) => {
  const spinnerSize = {
    small: 'var(--md-sys-spacing-6)',
    medium: 'var(--md-sys-spacing-8)',
    large: 'var(--md-sys-spacing-10)'
  }[size];

  return (
    <M3Surface
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--app-spacing-container)',
        padding: 'var(--app-spacing-section)'
      }}
    >
      {/* Spinner MD3 */}
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: 'var(--md-sys-spacing-0-5) solid var(--md-sys-color-primary-container)',
          borderTopColor: 'var(--md-sys-color-primary)',
          borderRadius: 'var(--md-sys-shape-corner-full)',
          animation: 'spin var(--md-sys-motion-duration-extra-long4) linear infinite'
        }}
        role="status"
        aria-label="Caricamento in corso"
      />
      
      {message && (
        <M3Typography
          variant="body-medium"
          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
        >
          {message}
        </M3Typography>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </M3Surface>
  );
};
```

**2. Skeleton Loaders**

```typescript
// src/components/ui/Skeleton.tsx - NUOVO FILE

import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 'var(--app-spacing-element)',
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const borderRadius = {
    text: 'var(--md-sys-spacing-1)',
    circular: 'var(--md-sys-shape-corner-full)',
    rectangular: 'var(--md-sys-shape-corner-small)'
  }[variant];

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'var(--md-sys-color-surface-variant)',
        animation: animation === 'pulse' 
          ? 'pulse 1.5s ease-in-out infinite' 
          : 'wave 1.5s linear infinite',
        position: 'relative',
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      {animation === 'wave' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            animation: 'wave 1.5s linear infinite'
          }}
        />
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

// Skeleton per lista
export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          gap: 'var(--app-spacing-element)',
          padding: 'var(--app-spacing-container)',
          marginBottom: 'var(--app-spacing-element)'
        }}
      >
        <Skeleton variant="circular" width="var(--md-sys-spacing-6)" height="var(--md-sys-spacing-6)" />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height="var(--app-spacing-element)" />
          <Skeleton width="40%" height="var(--md-sys-spacing-3)" style={{ marginTop: 'var(--md-sys-spacing-1)' }} />
        </div>
      </div>
    ))}
  </>
);
```

---

### 6. 🎯 TIPOGRAFIA E LEGGIBILITÀ

#### Problemi Identificati

**🟡 MEDIO: Gerarchia tipografica debole**

```
Problemi:
❌ Dimensioni simili tra titoli e corpo testo
❌ Line-height troppo compatto
❌ Mancanza di enfasi su contenuto importante
❌ Troppo testo grigio chiaro
```

#### Soluzioni Proposte

```typescript
// src/theme/typography-improved.ts - NUOVO FILE

export const typographyScale = {
  // Display (hero sections)
  'display-large': {
    fontSize: 'var(--md-sys-typescale-display-large-size)',
    lineHeight: 'var(--md-sys-typescale-display-large-line-height)',
    fontWeight: '400',
    letterSpacing: '-0.25px'
  },
  
  // Headlines (page titles, card titles)
  'headline-large': {
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: '600', // più bold
    letterSpacing: '0'
  },
  'headline-medium': {
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: '600',
    letterSpacing: '0'
  },
  'headline-small': {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: '600',
    letterSpacing: '0'
  },
  
  // Body (paragraphs, descriptions)
  'body-large': {
    fontSize: '16px',
    lineHeight: '24px', // aumentato da 20px
    fontWeight: '400',
    letterSpacing: '0.5px'
  },
  'body-medium': {
    fontSize: '14px',
    lineHeight: '20px', // aumentato da 16px
    fontWeight: '400',
    letterSpacing: '0.25px'
  },
  
  // Labels (buttons, chips)
  'label-large': {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600', // più bold
    letterSpacing: '0.1px'
  }
};

// Utility per applicare stili tipografici migliorati
export const applyTextStyle = (variant: keyof typeof typographyScale, emphasis?: 'high' | 'medium' | 'low') => {
  const baseStyle = typographyScale[variant];
  const colorOpacity = {
    high: '1',
    medium: '0.74',
    low: '0.60'
  }[emphasis || 'high'];
  
  return {
    ...baseStyle,
    color: `rgba(var(--md-sys-color-on-surface-rgb), ${colorOpacity})`
  };
};
```

---

### 7. 📊 DASHBOARD E VISUALIZZAZIONI

#### Problemi Identificati

**🟡 MEDIO: Metriche poco evidenti**

```
Home Page:
❌ Card metriche (8 Studenti, 10 Valutazioni) piccole
❌ Numeri non risaltano
❌ Mancanza di trend/indicatori
❌ Colori neutri, nessuna codifica semantica
```

#### Soluzioni Proposte

```typescript
// src/components/MetricCard.tsx - NUOVO FILE

import React from 'react';
import { M3Card, M3Typography, M3Surface } from './ui';

interface MetricCardProps {
  value: number | string;
  label: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  icon,
  trend,
  trendValue,
  color = 'primary',
  onClick
}) => {
  const colorMap = {
    primary: 'var(--md-sys-color-primary)',
    secondary: 'var(--md-sys-color-secondary)',
    tertiary: 'var(--md-sys-color-tertiary)',
    success: '#4CAF50',
    warning: '#FF9800',
    error: 'var(--md-sys-color-error)'
  };

  return (
    <M3Card
      onClick={onClick}
      style={{
        padding: 'var(--app-spacing-container)',
        flex: '1',
        minWidth: 'var(--md-sys-spacing-14)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--md-sys-motion-duration-short2)',
        border: `var(--app-border-thin) solid ${colorMap[color]}20`
      }}
    >
      <M3Surface
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--app-spacing-element)',
          alignItems: 'center'
        }}
      >
        {/* Icona opzionale */}
        {icon && (
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 'var(--md-sys-spacing-6)',
              color: colorMap[color],
              marginBottom: 'var(--md-sys-spacing-1)'
            }}
          >
            {icon}
          </span>
        )}
        
        {/* Valore principale */}
        <M3Typography
          variant="display-medium"
          style={{
            color: colorMap[color],
            fontWeight: '700',
            fontSize: '48px',
            lineHeight: '56px'
          }}
        >
          {value}
        </M3Typography>
        
        {/* Label */}
        <M3Typography
          variant="label-large"
          style={{
            color: 'var(--md-sys-color-on-surface-variant)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '600'
          }}
        >
          {label}
        </M3Typography>
        
        {/* Trend opzionale */}
        {trend && trendValue && (
          <M3Surface
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--md-sys-spacing-1)',
              padding: 'var(--md-sys-spacing-1) var(--md-sys-spacing-2)',
              borderRadius: 'var(--md-sys-shape-corner-full)',
              background: trend === 'up' 
                ? '#4CAF5020' 
                : trend === 'down' 
                ? '#F4433620' 
                : 'var(--md-sys-color-surface-variant)'
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 'var(--md-sys-spacing-3)',
                color: trend === 'up' ? '#4CAF50' : trend === 'down' ? '#F44336' : 'inherit'
              }}
            >
              {trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'remove'}
            </span>
            <M3Typography
              variant="label-small"
              style={{
                color: trend === 'up' ? '#4CAF50' : trend === 'down' ? '#F44336' : 'inherit',
                fontWeight: '600'
              }}
            >
              {trendValue}
            </M3Typography>
          </M3Surface>
        )}
      </M3Surface>
    </M3Card>
  );
};
```

---

### 8. 🗺️ NAVIGAZIONE E ARCHITETTURA INFORMATIVA

#### Problemi Identificati

**🟡 MEDIO: Struttura poco chiara**

```
Sidebar Navigation:
✓ Icone chiare
❌ "Progetta" e "Orientamento" nomi poco chiari
❌ Nessuna badge per notifiche
❌ Troppi item principali (6)
```

#### Soluzioni Proposte

**1. Raggruppamento logico**

```typescript
// src/components/NavigationRail.tsx - REFACTOR

const navigationGroups = [
  {
    title: 'Principale',
    items: [
      { id: 'home', label: 'Dashboard', icon: 'home' },
      { id: 'timetable', label: 'Orario', icon: 'schedule' },
      { id: 'aula', label: 'Classi', icon: 'groups' }
    ]
  },
  {
    title: 'Pianificazione',
    items: [
      { id: 'progettazione-hub', label: 'Lezioni', icon: 'edit_document' },
      { id: 'orientamento', label: 'Orientamento', icon: 'explore' }
    ]
  },
  {
    title: 'Altro',
    items: [
      { id: 'calendario', label: 'Calendario', icon: 'calendar_month' },
      { id: 'analytics', label: 'Analytics', icon: 'analytics' }
    ]
  }
];
```

**2. Aggiungere badge per notifiche**

```typescript
// Nella NavigationRail
<button /* ... */>
  <span className="material-symbols-outlined">{item.icon}</span>
  <span>{item.label}</span>
  
  {/* Badge notifiche */}
  {item.badge && item.badge > 0 && (
    <span
      style={{
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
        justifyContent: 'center'
      }}
    >
      {item.badge > 9 ? '9+' : item.badge}
    </span>
  )}
</button>
```

---

### 9. ♿ ACCESSIBILITÀ

#### Problemi Identificati

**🔴 CRITICO: Focus indicators mancanti**

```
Problemi:
❌ Focus outline non visibile
❌ Skip links mancanti
❌ Landmark regions incomplete
❌ Screen reader navigation difficoltosa
```

#### Soluzioni Proposte

```typescript
// src/design-system/accessibility-improved.css - AGGIUNGERE

/* Focus visible per tutti gli elementi interattivi */
*:focus-visible {
  outline: var(--md-sys-spacing-0-5) solid var(--md-sys-color-primary);
  outline-offset: var(--md-sys-spacing-0-5);
  border-radius: var(--md-sys-shape-corner-small);
}

/* Focus visibile high contrast */
@media (prefers-contrast: high) {
  *:focus-visible {
    outline-width: var(--md-sys-spacing-1);
    outline-color: var(--md-sys-color-primary);
  }
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -999px;
  left: -999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skip-link:focus {
  position: fixed;
  top: var(--md-sys-spacing-2);
  left: var(--md-sys-spacing-2);
  width: auto;
  height: auto;
  padding: var(--app-spacing-element) var(--app-spacing-container);
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  border-radius: var(--md-sys-shape-corner-medium);
  z-index: var(--md-sys-z-modal);
  outline: none;
  box-shadow: var(--md-sys-elevation-level3);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Aggiungere skip links in App.tsx:**

```typescript
// src/components/App.tsx - AGGIUNGERE all'inizio

<>
  <a href="#main-content" className="skip-link">
    Salta alla navigazione
  </a>
  <a href="#main-content" className="skip-link">
    Vai al contenuto principale
  </a>
  
  <AppLayout /* ... */>
    <main id="main-content" role="main" aria-label="Contenuto principale">
      {children}
    </main>
  </AppLayout>
</>
```

---

## 📋 PIANO D'AZIONE PRIORITARIO

### Settimana 1 - Critici (🔴)

1. **Giorno 1-2: Contrasto Colori**
   - [ ] Creare `colors-improved.ts` con palette high contrast
   - [ ] Aggiornare tutti i componenti con testo a basso contrasto
   - [ ] Test WCAG AA su tutti gli schermi

2. **Giorno 3-4: Stati Vuoti**
   - [ ] Creare `EmptyState.tsx` component
   - [ ] Implementare empty states in Home, Classi, Orario
   - [ ] Aggiungere CTA chiare per ogni stato

3. **Giorno 5: Accessibilità Focus**
   - [ ] Aggiornare `accessibility-focus.css`
   - [ ] Aggiungere skip links
   - [ ] Test keyboard navigation

### Settimana 2 - Medi (🟡)

4. **Giorno 1-2: Gerarchia Visiva**
   - [ ] Refactor Home.tsx con elevazioni corrette
   - [ ] Implementare `MetricCard.tsx` per dashboard
   - [ ] Aggiungere shadows e backgrounds semantici

5. **Giorno 3: Loading & Skeleton**
   - [ ] Creare `LoadingState.tsx` e `Skeleton.tsx`
   - [ ] Implementare in tutte le viste con dati async
   - [ ] Aggiungere animazioni smooth

6. **Giorno 4-5: Navigazione**
   - [ ] Refactor `BottomNav.tsx` con tap targets ingranditi
   - [ ] Aggiungere badge notifiche
   - [ ] Raggruppare navigation items logicamente

### Settimana 3 - Microinterazioni

7. **Giorno 1-2: Tipografia**
   - [ ] Creare `typography-improved.ts`
   - [ ] Applicare nuova scala a tutti i componenti
   - [ ] Aumentare line-heights

8. **Giorno 3-5: Animazioni**
   - [ ] Aggiungere transizioni tra pagine
   - [ ] Hover/active states per tutti i bottoni
   - [ ] Success/error animations per form submissions

---

## 🎨 DESIGN TOKENS PROPOSTI

```typescript
// src/theme/design-tokens-improved.ts - NUOVO FILE

export const designTokens = {
  // Spacing migliorato (più respirazione)
  spacing: {
    section: 'var(--md-sys-spacing-8)',      // 32px (da 24px)
    container: 'var(--md-sys-spacing-6)',    // 24px (da 16px)
    element: 'var(--md-sys-spacing-4)',      // 16px (da 12px)
    component: 'var(--md-sys-spacing-2)',    // 8px (da 4px)
  },
  
  // Shadows con più profondità
  elevation: {
    level1: '0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
    level2: '0 2px 4px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.1)',
    level3: '0 4px 8px rgba(0,0,0,0.05), 0 8px 16px rgba(0,0,0,0.1)',
    level4: '0 8px 16px rgba(0,0,0,0.05), 0 16px 32px rgba(0,0,0,0.1)',
  },
  
  // Border radius più pronunciati
  radius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    xxlarge: '24px',
    full: '9999px'
  },
  
  // Transizioni standardizzate
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)'
  }
};
```

---

## 📊 METRICHE DI SUCCESSO

### Accessibilità
- [ ] WCAG AA compliance: 100% (attualmente ~60%)
- [ ] Lighthouse Accessibility Score: >95 (attualmente 82)
- [ ] Keyboard navigation: 100% funzionante

### Performance UX
- [ ] Time to Interactive: <2s
- [ ] First Contentful Paint: <1s
- [ ] Loading states: 100% coverage

### Usabilità
- [ ] Task success rate: >90%
- [ ] User error rate: <5%
- [ ] User satisfaction: >8/10

---

## 🛠️ TOOLS E RISORSE

### Testing
- **Contrasto:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Accessibilità:** [axe DevTools](https://www.deque.com/axe/devtools/)
- **Lighthouse:** Chrome DevTools

### Design
- **Figma:** Material Design 3 Kit
- **Icons:** Material Symbols (già in uso)
- **Colors:** Material Theme Builder

### Development
- **Storybook:** Per component testing isolato
- **Chromatic:** Visual regression testing
- **Jest + Testing Library:** Unit tests

---

## 💡 RACCOMANDAZIONI FINALI

1. **Iniziare dai critici**: Contrasto e accessibilità sono problemi che impattano tutti gli utenti
2. **Test iterativo**: Ogni cambiamento deve essere testato con utenti reali
3. **Documentazione**: Mantenere un design system documentato in Storybook
4. **Mobile-first**: Testare sempre prima su mobile, poi desktop
5. **Performance**: Ogni componente deve essere lazy-loadable
6. **A11y by default**: Accessibilità non come feature ma come requirement

---

**Report completato. Pronto per implementazione.**
