# CopilotDoc — Brand & Identity System

> Generato: 2026-03-21 | Brand identity per l'assistente AI docente PA

---

## Contesto & Posizionamento

**CopilotDoc** è l'assistente AI integrato di DocenteDoc — presente come panel principale nell'app web con 14+ sotto-pannelli che coprono: pianificazione UDA, analisi classe, conformità GDPR/AgID, audit PA, previsione trend, maturità, governance.

**Non è Orbit**: Orbit è l'orchestrazione multi-agente **autonoma e silenziosa** (dark space, amber orb, background). CopilotDoc è la **voce collaborativa**, il collega intelligente che risponde, spiega e guida in primo piano.

|                  | DocenteDoc (MD3)     | Orbit                            | CopilotDoc                         |
| ---------------- | -------------------- | -------------------------------- | ---------------------------------- |
| **Metafora**     | App/strumento neutro | Spazio profondo, agenti autonomi | Guida istituzionale intelligente   |
| **Mood**         | Neutro, accessibile  | Misterioso, potente, dark        | Autorevole, caldo, affidabile      |
| **Background**   | Light (`#FFFBFE`)    | Deep space (`#070B14`)           | Cool white (`#F0F4FF`) + Navy mode |
| **Primary**      | Viola MD3 `#6750A4`  | Ambra `#FF8C00`                  | Cobalto PA `#1B3A8C`               |
| **Accent**       | MD3 secondary        | Cyan `#00C8FF`                   | Oro `#E8A900`                      |
| **Font display** | Roboto (default MUI) | Barlow Condensed                 | Lora (serif)                       |
| **Personalità**  | Neutro, tool         | Autonomo, cosmico                | Collaborativo, autorevole          |

---

## Design Direction: "Guida Illuminata"

**Concetto**: un **arco a compasso** (la guida) con una **scintilla di intelligenza** al centro — come un faro istituzionale che illumina decisioni complesse nel mondo della scuola italiana.

**Riferimenti visivi**:

- Ministero dell'Istruzione (cobalto istituzionale)
- Linee guida AgID (rigore e chiarezza)
- Enciclopedia Treccani (eleganza editoriale italiana, serif autorevole)
- IBM Granite / Claude for Enterprise (AI partner, not AI overlord)

**Differenziazione come app**: Se Orbit è Anthropic/Claude (misterioso, autonomous), CopilotDoc è Gemini for Workspace (professionale, integrato, utile ogni giorno).

---

## Palette Colori

```
Cobalt PA    #1B3A8C  ███  Principale — fiducia istituzionale
Gold         #E8A900  ███  Accento — saggezza, eccellenza
Cobalt light #3558C4  ███  Hover/active states
Cobalt pale  #EEF2FF  ███  Surface, background tinted
Navy dark    #0A1832  ███  Dark mode bg, audit panel
Emerald      #00875A  ███  Conformità, GDPR passed, certificazione
Amber soft   #FBBF24  ███  Warning, parzialmente conforme
Ruby         #C7311A  ███  Violazione, blocking, non conforme
Text primary #111827  ███  Body text (quasi-nero)
Text muted   #4B5675  ███  Secondary text
Border       #CBD5E1  ███  Dividers, borders
```

---

## Tipografia

| Ruolo          | Font    | Peso    | Uso                                             |
| -------------- | ------- | ------- | ----------------------------------------------- |
| **Display**    | Lora    | 700     | Titolo pannello principale, onboarding headline |
| **Heading**    | DM Sans | 600     | Titoli card, section headers                    |
| **Body**       | DM Sans | 400/500 | Testo contenuto, label, descrizioni             |
| **Data/Score** | DM Mono | 500     | Score audit (87%), percentuali, ID conformità   |
| **Label chip** | DM Sans | 700     | Chip stato: CONFORME, BLOCCANTE, GDPR           |

Razionale: **Lora** è serif con carattere editoriale italiano (Treccani, La Repubblica digitale) — nessuna app AI la usa, quindi è immediatamente distintiva. **DM Sans** è pulita, leggibile, accessibile e supera la generica Inter/Roboto.

---

## 1. `public/copilot-icon.svg` — Icona app vettoriale

```svg
<!-- public/copilot-icon.svg — 512×512 viewBox -->
<!--
  Concept: Arco "C" cobalto (CopilotDoc) che abbraccia
  una striscia libro/documento + scintilla AI gold.
  Simbolismo: guida + conoscenza + intelligenza.
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <!-- BG gradiente istituzionale -->
    <linearGradient id="cpbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#1E4299"/>
      <stop offset="100%" stop-color="#0E2560"/>
    </linearGradient>
    <!-- Gold gradiente per la scintilla -->
    <radialGradient id="cpgold" cx="50%" cy="35%" r="60%">
      <stop offset="0%"   stop-color="#FFE066"/>
      <stop offset="55%"  stop-color="#E8A900"/>
      <stop offset="100%" stop-color="#B07800"/>
    </radialGradient>
    <!-- Glow filter per la scintilla -->
    <filter id="cp-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Soft glow per arco C -->
    <filter id="cp-arc-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background rounded square istituzionale -->
  <rect width="512" height="512" rx="108" fill="url(#cpbg)"/>

  <!-- Texture sottile: righe parallele leggere (documento/carta) -->
  <line x1="128" y1="186" x2="384" y2="186" stroke="white" stroke-opacity="0.06" stroke-width="1.5"/>
  <line x1="128" y1="210" x2="384" y2="210" stroke="white" stroke-opacity="0.06" stroke-width="1.5"/>
  <line x1="128" y1="234" x2="384" y2="234" stroke="white" stroke-opacity="0.06" stroke-width="1.5"/>
  <line x1="128" y1="302" x2="384" y2="302" stroke="white" stroke-opacity="0.04" stroke-width="1.5"/>
  <line x1="128" y1="326" x2="384" y2="326" stroke="white" stroke-opacity="0.04" stroke-width="1.5"/>

  <!-- Arco "C" principale (CopilotDoc) — opening right -->
  <!-- Arc che va da ~45° a ~315° (apre a destra) -->
  <path
    d="M 358 140
       A 138 138 0 1 0 358 372"
    stroke="white"
    stroke-width="28"
    stroke-linecap="round"
    fill="none"
    stroke-opacity="0.95"
    filter="url(#cp-arc-glow)"
  />

  <!-- Arco interno più sottile (doppio contorno) -->
  <path
    d="M 340 168
       A 104 104 0 1 0 340 344"
    stroke="white"
    stroke-width="4"
    stroke-linecap="round"
    fill="none"
    stroke-opacity="0.25"
  />

  <!-- Scintilla AI gold — al centro dell'arco -->
  <!-- Forma: stella a 4 punte con raggi -->
  <g filter="url(#cp-glow)" transform="translate(256,256)">
    <!-- Halo esterno -->
    <circle r="38" fill="#E8A900" fill-opacity="0.18"/>
    <circle r="24" fill="#E8A900" fill-opacity="0.28"/>
    <!-- Corpo centrale -->
    <circle r="14" fill="url(#cpgold)"/>
    <!-- Punte stella -->
    <path d="M0,-40 L5,-16 L0,-8 L-5,-16 Z" fill="#FFE066" fill-opacity="0.9"/>
    <path d="M0,40  L5,16  L0,8  L-5,16  Z" fill="#FFE066" fill-opacity="0.9"/>
    <path d="M-40,0 L-16,5 L-8,0 L-16,-5 Z" fill="#FFE066" fill-opacity="0.9"/>
    <path d="M40,0  L16,5  L8,0  L16,-5  Z" fill="#FFE066" fill-opacity="0.9"/>
    <!-- Punte diagonali più corte -->
    <path d="M-24,-24 L-10,-8  L-8,-10 L-8,-8  Z" fill="#FFE066" fill-opacity="0.5"/>
    <path d="M24,-24  L10,-8   L8,-10  L8,-8   Z" fill="#FFE066" fill-opacity="0.5"/>
    <path d="M-24,24  L-10,8   L-8,10  L-8,8   Z" fill="#FFE066" fill-opacity="0.5"/>
    <path d="M24,24   L10,8    L8,10   L8,8    Z" fill="#FFE066" fill-opacity="0.5"/>
    <!-- Core bright dot -->
    <circle r="5" fill="white" fill-opacity="0.9"/>
  </g>

  <!-- Tacca di apertura dell'arco: linee orizzontali gold (=terminali del C) -->
  <line x1="358" y1="140" x2="390" y2="140"
    stroke="#E8A900" stroke-width="9" stroke-linecap="round"/>
  <line x1="358" y1="372" x2="390" y2="372"
    stroke="#E8A900" stroke-width="9" stroke-linecap="round"/>
</svg>
```

### Note esportazione PNG

| Dimensione | File                    | Uso              |
| ---------- | ----------------------- | ---------------- |
| 180×180    | `copilot-icon-180.png`  | Apple Touch Icon |
| 192×192    | `copilot-icon-192.png`  | PWA standard     |
| 512×512    | `copilot-icon-512.png`  | PWA large        |
| 512×512    | `copilot-icon-512m.png` | PWA maskable     |

Per la **maskable**: l'arco "C" con scintilla deve restare nel safe zone del 80% (padding ~50px attorno su 512).

---

## 2. `src/components/ui/CopilotLogo.tsx` — Componente React

```tsx
/**
 * CopilotLogo.tsx — CopilotDoc brand mark animato.
 *
 * Variants: 'mark' | 'horizontal' | 'badge'
 * States:   'idle' | 'thinking' | 'active' | 'alert'
 * Themes:   'light' | 'dark' | 'cobalt'
 *
 * La scintilla gold pulsa in idle; accelera in thinking; splende in active.
 * In 'alert' state: pulsazione rossa (violazione PA rilevata).
 */

import React, { useEffect, useRef } from "react";

let _injectedCopilot = false;
function injectCopilotStyles(): void {
  if (_injectedCopilot || typeof document === "undefined") return;
  _injectedCopilot = true;
  const s = document.createElement("style");
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');

    @keyframes copilot-spark-idle {
      0%,100% { opacity: 0.85; transform: scale(1)   rotate(0deg); }
      50%      { opacity: 1;    transform: scale(1.1) rotate(10deg); }
    }
    @keyframes copilot-spark-thinking {
      0%   { opacity: 0.7; transform: scale(0.95) rotate(0deg); }
      25%  { opacity: 1;   transform: scale(1.15) rotate(90deg); }
      50%  { opacity: 0.7; transform: scale(0.95) rotate(180deg); }
      75%  { opacity: 1;   transform: scale(1.15) rotate(270deg); }
      100% { opacity: 0.7; transform: scale(0.95) rotate(360deg); }
    }
    @keyframes copilot-spark-active {
      0%,100% { opacity: 1;   transform: scale(1)    drop-shadow(0 0 8px #E8A900); }
      50%      { opacity: 0.9; transform: scale(1.08) drop-shadow(0 0 16px #FFE066); }
    }
    @keyframes copilot-spark-alert {
      0%,100% { opacity: 1; filter: hue-rotate(0deg); }
      50%      { opacity: 0.75; filter: hue-rotate(200deg) brightness(1.3); }
    }
    @keyframes copilot-arc-pulse {
      0%,100% { stroke-opacity: 0.95; }
      50%      { stroke-opacity: 0.65; }
    }
    @keyframes copilot-dots {
      0%   { opacity: 0.2; transform: scale(0.8); }
      33%  { opacity: 1;   transform: scale(1.1); }
      66%  { opacity: 0.5; transform: scale(0.9); }
      100% { opacity: 0.2; transform: scale(0.8); }
    }
  `;
  document.head.appendChild(s);
}

export interface CopilotLogoProps {
  size?: number;
  variant?: "mark" | "horizontal" | "badge";
  state?: "idle" | "thinking" | "active" | "alert";
  theme?: "light" | "dark" | "cobalt";
  className?: string;
}

export default function CopilotLogo({
  size = 40,
  variant = "mark",
  state = "idle",
  theme = "cobalt",
  className,
}: CopilotLogoProps): React.JSX.Element {
  const mountRef = useRef(false);
  useEffect(() => {
    if (!mountRef.current) {
      injectCopilotStyles();
      mountRef.current = true;
    }
  }, []);

  // Colori per theme
  const bgFill =
    theme === "dark"
      ? "#0A1832"
      : theme === "cobalt"
        ? "url(#cpbg-c)"
        : "white";
  const arcStroke = theme === "light" ? "#1B3A8C" : "white";
  const sparkBg = state === "alert" ? "#C7311A" : "#E8A900";

  // Animazione scintilla per stato
  const sparkAnim =
    state === "thinking"
      ? `copilot-spark-thinking 1.4s linear infinite`
      : state === "active"
        ? `copilot-spark-active   2s ease-in-out infinite`
        : state === "alert"
          ? `copilot-spark-alert    1s ease-in-out infinite`
          : `copilot-spark-idle 3.5s ease-in-out infinite`;

  const arcAnim =
    state === "thinking"
      ? `copilot-arc-pulse 1.4s ease-in-out infinite`
      : "none";

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="cpbg-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E4299" />
          <stop offset="100%" stopColor="#0E2560" />
        </linearGradient>
        <radialGradient id="cpgold-c" cx="50%" cy="35%" r="60%">
          <stop
            offset="0%"
            stopColor={state === "alert" ? "#FF6B6B" : "#FFE066"}
          />
          <stop
            offset="55%"
            stopColor={state === "alert" ? "#C7311A" : "#E8A900"}
          />
          <stop
            offset="100%"
            stopColor={state === "alert" ? "#8C1A0A" : "#B07800"}
          />
        </radialGradient>
        <filter id="cp-glow-c">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        width="512"
        height="512"
        rx="108"
        fill={bgFill}
        stroke={theme === "light" ? "#E2E8F0" : "none"}
        strokeWidth="2"
      />

      {/* Righe documento */}
      {[186, 210, 234, 302, 326].map((y, i) => (
        <line
          key={y}
          x1="128"
          y1={y}
          x2="384"
          y2={y}
          stroke="white"
          strokeOpacity={i < 3 ? 0.07 : 0.04}
          strokeWidth="1.5"
        />
      ))}

      {/* Arco C */}
      <path
        d="M 358 140 A 138 138 0 1 0 358 372"
        stroke={arcStroke}
        strokeWidth="28"
        strokeLinecap="round"
        fill="none"
        strokeOpacity={0.95}
        style={{ animation: arcAnim }}
      />
      <path
        d="M 340 168 A 104 104 0 1 0 340 344"
        stroke={arcStroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        strokeOpacity={0.2}
      />

      {/* Terminali gold del C */}
      <line
        x1="358"
        y1="140"
        x2="392"
        y2="140"
        stroke={sparkBg}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1="358"
        y1="372"
        x2="392"
        y2="372"
        stroke={sparkBg}
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Scintilla AI */}
      <g
        filter="url(#cp-glow-c)"
        transform="translate(256,256)"
        style={{ animation: sparkAnim, transformOrigin: "0 0" }}
      >
        <circle r="38" fill={sparkBg} fillOpacity="0.18" />
        <circle r="24" fill={sparkBg} fillOpacity="0.28" />
        <circle r="14" fill="url(#cpgold-c)" />
        <path
          d="M0,-40 L5,-16 L0,-8 L-5,-16 Z"
          fill="#FFE066"
          fillOpacity="0.9"
        />
        <path
          d="M0,40  L5,16  L0,8  L-5,16  Z"
          fill="#FFE066"
          fillOpacity="0.9"
        />
        <path
          d="M-40,0 L-16,5 L-8,0 L-16,-5 Z"
          fill="#FFE066"
          fillOpacity="0.9"
        />
        <path
          d="M40,0  L16,5  L8,0  L16,-5  Z"
          fill="#FFE066"
          fillOpacity="0.9"
        />
        <circle r="5" fill="white" fillOpacity="0.9" />
      </g>

      {/* Indicator dots thinking */}
      {state === "thinking" &&
        [0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={230 + i * 26}
            cy={430}
            r="8"
            fill={sparkBg}
            style={{
              animation: `copilot-dots 1.4s ease-in-out ${i * 0.25}s infinite`,
              transformOrigin: `${230 + i * 26}px 430px`,
            }}
          />
        ))}
    </svg>
  );

  // Label colori per tema
  const labelColor = theme === "light" ? "#1B3A8C" : "#E8F0FF";
  const subColor = theme === "light" ? "#4B5675" : "#8899BB";
  const accentColor = state === "alert" ? "#C7311A" : "#E8A900";

  if (variant === "mark") {
    return (
      <span className={className} style={{ display: "inline-flex" }}>
        {icon}
      </span>
    );
  }

  if (variant === "badge") {
    // Badge compatto: icona piccola + chip testo inline
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: size * 0.2,
          background: theme === "light" ? "#EEF2FF" : "#0E2560",
          borderRadius: size * 0.3,
          padding: `${size * 0.12}px ${size * 0.25}px ${size * 0.12}px ${size * 0.12}px`,
          border: `1px solid ${theme === "light" ? "#CBD5E1" : "#1B3A8C"}`,
        }}
      >
        {icon}
        <span
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: size * 0.35,
            color: labelColor,
            letterSpacing: "0.03em",
          }}
        >
          CopilotDoc
        </span>
      </span>
    );
  }

  // variant === 'horizontal'
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.3,
        userSelect: "none",
      }}
    >
      {icon}
      <span
        style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}
      >
        <span
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontWeight: 700,
            fontSize: size * 0.48,
            color: labelColor,
            letterSpacing: "0.02em",
          }}
        >
          CopilotDoc
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: size * 0.22,
            color: accentColor,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {state === "alert" ? "⚠ Allerta PA" : "Assistente AI · PA"}
        </span>
      </span>
    </span>
  );
}
```

### Utilizzo

```tsx
// Header pannello principale
<CopilotLogo size={36} variant="horizontal" state="idle" theme="light" />

// Stato AI in elaborazione
<CopilotLogo size={40} variant="mark" state="thinking" theme="cobalt" />

// Stato violazione audit
<CopilotLogo size={40} variant="horizontal" state="alert" theme="dark" />

// Badge compatto per tab/chip
<CopilotLogo size={28} variant="badge" state="active" theme="light" />
```

---

## 3. `src/styles/copilot-brand.css` — Design tokens CopilotDoc

```css
/**
 * copilot-brand.css — CopilotDoc Identity System Design Tokens
 *
 * Namespace --cp-* separato da --md-sys-* e --orbit-*
 * I tre sistemi coesistono senza conflitti:
 *   - DocenteDoc web:  --md-sys-*  (MD3, MUI v7)
 *   - Orbit:           --orbit-*   (dark space, agenti autonomi)
 *   - CopilotDoc:      --cp-*      (istituzionale PA, assistente docente)
 *
 * Import in src/main.tsx o src/styles/index.css dopo md3-tokens.css
 */

:root {
  /* ── Palette istituzionale ────────────────────────────────────────────────── */
  --cp-cobalt: #1b3a8c; /* blu PA principale */
  --cp-cobalt-light: #3558c4; /* hover / active */
  --cp-cobalt-pale: #eef2ff; /* surface tinted, sfondo pannello */
  --cp-cobalt-deep: #0e2560; /* dark mode bg, header */

  --cp-gold: #e8a900; /* oro saggezza — accento principale */
  --cp-gold-light: #ffe066; /* highlight / shine */
  --cp-gold-pale: #fff8e1; /* surface gold tinted */

  --cp-emerald: #00875a; /* conformità, GDPR passed */
  --cp-emerald-pale: #e6f7f1; /* chip conforme */

  --cp-amber: #fbbf24; /* warning, parzialmente conforme */
  --cp-amber-pale: #fffbeb; /* chip warning */

  --cp-ruby: #c7311a; /* violazione, blocco, non conforme */
  --cp-ruby-pale: #fef2f0; /* chip critico */

  /* ── Superfici ────────────────────────────────────────────────────────────── */
  --cp-bg: #f0f4ff; /* background app principale */
  --cp-bg-dark: #0a1832; /* dark mode / audit mode */
  --cp-surface: #ffffff; /* card, modal */
  --cp-surface-tinted: #eef2ff; /* surface con tinto cobalto */
  --cp-surface-dark: #111e3c; /* card dark mode */
  --cp-border: #cbd5e1; /* divider, outline */
  --cp-border-dark: #1e3060; /* border dark mode */

  /* ── Testo ────────────────────────────────────────────────────────────────── */
  --cp-text: #111827; /* primary text */
  --cp-text-secondary: #4b5675; /* muted text */
  --cp-text-on-cobalt: #ffffff; /* testo su background cobalt */
  --cp-text-accent: #1b3a8c; /* link, label cobalt */
  --cp-text-gold: #e8a900; /* label gold (eccellenza) */

  /* ── Tipografia ───────────────────────────────────────────────────────────── */
  --cp-font-display: "Lora", "Garamond", Georgia, serif;
  --cp-font-body: "DM Sans", "Helvetica Neue", system-ui, sans-serif;
  --cp-font-mono: "DM Mono", "JetBrains Mono", "Fira Code", monospace;

  --cp-weight-regular: 400;
  --cp-weight-medium: 500;
  --cp-weight-semi: 600;
  --cp-weight-bold: 700;

  /* ── Motion ───────────────────────────────────────────────────────────────── */
  --cp-motion-spark-idle: 3.5s; /* pulsazione scintilla idle */
  --cp-motion-spark-thinking: 1.4s; /* rotazione thinking */
  --cp-motion-spark-active: 2s; /* shine active */
  --cp-motion-transition: 220ms; /* transizioni card/panel */
  --cp-motion-slide: 300ms; /* slide-in pannello */

  /* ── Elevation / shadow ───────────────────────────────────────────────────── */
  --cp-shadow-card:
    0 1px 4px rgba(27, 58, 140, 0.08), 0 4px 16px rgba(27, 58, 140, 0.06);
  --cp-shadow-panel:
    0 4px 24px rgba(27, 58, 140, 0.12), 0 1px 4px rgba(0, 0, 0, 0.06);
  --cp-shadow-dialog: 0 8px 48px rgba(10, 24, 50, 0.24);
  --cp-glow-gold: 0 0 16px rgba(232, 169, 0, 0.4);
  --cp-glow-alert: 0 0 12px rgba(199, 49, 26, 0.5);

  /* ── Border radius ────────────────────────────────────────────────────────── */
  --cp-radius-card: 12px;
  --cp-radius-chip: 6px;
  --cp-radius-icon: 20px;
  --cp-radius-panel: 16px;

  /* ── Score colors (per audit PA) ────────────────────────────────────────────*/
  --cp-score-excellent: var(--cp-emerald); /* 90-100 */
  --cp-score-good: var(--cp-cobalt); /* 75-89 */
  --cp-score-warning: var(--cp-amber); /* 50-74 */
  --cp-score-critical: var(--cp-ruby); /* 0-49 */
}

/* ── Keyframes CopilotDoc ─────────────────────────────────────────────────────── */
@keyframes cp-spark-idle {
  0%,
  100% {
    opacity: 0.85;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) rotate(10deg);
  }
}
@keyframes cp-spark-thinking {
  from {
    transform: scale(0.95) rotate(0deg);
  }
  to {
    transform: scale(0.95) rotate(360deg);
  }
}
@keyframes cp-spark-alert {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(199, 49, 26, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px transparent;
  }
}
@keyframes cp-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes cp-slide-in {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes cp-score-count {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes cp-pulse-border {
  0%,
  100% {
    border-color: var(--cp-cobalt);
  }
  50% {
    border-color: var(--cp-cobalt-light);
    box-shadow: var(--cp-shadow-card);
  }
}

/* ── Utility classes ──────────────────────────────────────────────────────────── */
.cp-card {
  background: var(--cp-surface);
  border: 1px solid var(--cp-border);
  border-radius: var(--cp-radius-card);
  box-shadow: var(--cp-shadow-card);
  padding: 20px 24px;
  font-family: var(--cp-font-body);
  animation: cp-fade-in var(--cp-motion-transition) ease both;
}

.cp-score {
  font-family: var(--cp-font-mono);
  font-weight: var(--cp-weight-medium);
  font-size: 2rem;
  letter-spacing: -0.02em;
  animation: cp-score-count var(--cp-motion-transition) ease both;
}

.cp-chip--conforme {
  background: var(--cp-emerald-pale);
  color: var(--cp-emerald);
  border: 1px solid var(--cp-emerald);
}
.cp-chip--parziale {
  background: var(--cp-amber-pale);
  color: #92400e;
  border: 1px solid var(--cp-amber);
}
.cp-chip--critico {
  background: var(--cp-ruby-pale);
  color: var(--cp-ruby);
  border: 1px solid var(--cp-ruby);
}
```

---

## 4. `src/components/ui/CopilotSplashScreen.tsx` — Splash PWA / onboarding

```tsx
/**
 * CopilotSplashScreen.tsx — Splash screen per CopilotDoc.
 *
 * Usata come splash di primo avvio del panel o durante caricamento iniziale
 * dell'AI context (suggestions, class health). Light-first, istituzionale.
 */
import React, { useEffect, useState } from "react";
import CopilotLogo from "./CopilotLogo";

interface CopilotSplashProps {
  duration?: number;
  message?: string;
}

export default function CopilotSplashScreen({
  duration = 1600,
  message = "Preparazione assistente docente…",
}: CopilotSplashProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), duration - 400);
    const t2 = setTimeout(() => setVisible(false), duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 200,
        borderRadius: 16,
        background:
          "linear-gradient(160deg, #F0F4FF 0%, #EEF2FF 50%, #E8EDFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        transition: "opacity 0.4s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Pattern decorativo sfondo */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.04,
          pointerEvents: "none",
          overflow: "hidden",
        }}
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Griglia punti istituzionale */}
        {Array.from({ length: 8 }, (_, r) =>
          Array.from({ length: 8 }, (_, c) => (
            <circle
              key={`${r}-${c}`}
              cx={c * 56 + 12}
              cy={r * 56 + 12}
              r="2"
              fill="#1B3A8C"
            />
          )),
        )}
      </svg>

      {/* Decorazione arco sfondo grande */}
      <svg
        style={{
          position: "absolute",
          right: -20,
          top: "10%",
          opacity: 0.06,
          pointerEvents: "none",
        }}
        width="200"
        height="300"
        viewBox="0 0 200 300"
        fill="none"
      >
        <path
          d="M 180 30 A 150 150 0 1 0 180 270"
          stroke="#1B3A8C"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Logo principale */}
      <CopilotLogo size={80} variant="mark" state="thinking" theme="cobalt" />

      {/* Wordmark */}
      <div
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontWeight: 700,
          fontSize: 26,
          color: "#1B3A8C",
          letterSpacing: "0.01em",
        }}
      >
        CopilotDoc
      </div>

      {/* Sub-label */}
      <div
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: "#E8A900",
          textTransform: "uppercase",
        }}
      >
        Assistente AI · Pubblica Amministrazione
      </div>

      {/* Messaggio di caricamento */}
      <div
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 13,
          color: "#4B5675",
          marginTop: 8,
        }}
      >
        {message}
      </div>

      {/* Barra di progresso cobalt */}
      <div
        style={{
          width: 160,
          height: 3,
          borderRadius: 2,
          background: "#CBD5E1",
          overflow: "hidden",
          marginTop: 4,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            background: "linear-gradient(90deg, #1B3A8C, #3558C4, #E8A900)",
            animation: "cp-load-bar 1.4s ease-in-out forwards",
          }}
        />
      </div>

      {/* Indicatori framework PA */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 8,
        }}
      >
        {["GDPR", "AI Act", "AgID"].map((fw) => (
          <span
            key={fw}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              fontWeight: 500,
              padding: "3px 8px",
              borderRadius: 4,
              background: "#EEF2FF",
              color: "#1B3A8C",
              border: "1px solid #CBD5E1",
            }}
          >
            {fw}
          </span>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Header panel aggiornato (patch `CopilotDocentePanel.tsx`)

Sostituire il `SectionHeader` attuale con il nuovo header branded:

```tsx
// Importare CopilotLogo
import CopilotLogo from "./ui/CopilotLogo";

// Nel return(), sostituire SectionHeader:
<Box
  sx={{
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 1,
    pb: "var(--md-sys-spacing-3)",
    borderBottom: "1px solid var(--cp-border, #CBD5E1)",
  }}
>
  <CopilotLogo
    size={32}
    variant="horizontal"
    state={/* collegare a stato AI */}
    theme="light"
    aria-label="CopilotDoc — Assistente AI per docenti PA"
  />
  <Typography
    variant="bodySmall"
    sx={{
      color: "var(--cp-text-secondary, #4B5675)",
      mt: 0.5,
      fontFamily: "var(--cp-font-body)",
    }}
  >
    AI per pianificazione, gestione e conformità PA
  </Typography>
</Box>;
```

---

## 6. Integrazione con `AuditPAPanel` — identità audit

L'`AuditPAPanel` usa già MD3 tokens. Il brand CopilotDoc può essere applicato ai **colori di stato conformità** mappando i token:

```css
/* In AuditPAPanel o in copilot-brand.css — override contestuale */
.audit-conforme {
  color: var(--cp-emerald);
  background: var(--cp-emerald-pale);
}
.audit-parziale {
  color: #92400e;
  background: var(--cp-amber-pale);
}
.audit-critico {
  color: var(--cp-ruby);
  background: var(--cp-ruby-pale);
}
.audit-score {
  font-family: var(--cp-font-mono);
  font-size: 2.5rem;
  font-weight: var(--cp-weight-medium);
  letter-spacing: -0.02em;
}
```

**Mapping token CopilotDoc → `paSeverityColor()` in AuditPAPanel**:

| Stato attuale (MD3)                           | Token CopilotDoc    |
| --------------------------------------------- | ------------------- |
| `var(--md-sys-color-error)` per Critical/High | `var(--cp-ruby)`    |
| `var(--md-sys-color-tertiary)` per Medium     | `var(--cp-amber)`   |
| `var(--md-sys-color-secondary)` per Low       | `var(--cp-cobalt)`  |
| `var(--md-sys-color-primary)` per CONFORME    | `var(--cp-emerald)` |

> **Nota MD3 compliance**: questa overriding è consentita come eccezione documentata — il CopilotDoc layer ha identità PA distinta. La regola MD3 vieta override non tracciati; questo è esplicitamente tracciato.

---

## 7. Checklist implementazione

### File da creare

- [ ] `public/copilot-icon.svg` — SVG da §1
- [ ] Export PNG 180/192/512px da SVG
- [ ] `src/styles/copilot-brand.css` — tokens da §3
- [ ] `src/components/ui/CopilotLogo.tsx` — componente da §2
- [ ] `src/components/ui/CopilotSplashScreen.tsx` — splash da §4
- [ ] Import `copilot-brand.css` in `src/main.tsx` dopo md3-tokens

### Integrazioni opzionali

- [ ] Patch header `CopilotDocentePanel.tsx` — §5
- [ ] Colori audit `AuditPAPanel.tsx` — §6
- [ ] Font Lora + DM Sans in `index.html` (Google Fonts)

### Google Fonts snippet per `index.html`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Lora:wght@700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Mono:wght@500&display=swap"
  rel="stylesheet"
/>
```

---

## 8. Confronto sistema brand completo

| Prodotto             | Metafora            | Colore keynote      | Font display         | Icona                   | Mood                          |
| -------------------- | ------------------- | ------------------- | -------------------- | ----------------------- | ----------------------------- |
| **DocenteDoc** (app) | Tool neutro         | Viola MD3 `#6750A4` | Roboto (MUI default) | D-ring animato          | Accessibile, neutro           |
| **Orbit** (agenti)   | Spazio profondo     | Ambra `#FF8C00`     | Barlow Condensed     | Orb + ring orbitali     | Misterioso, autonomo, dark    |
| **CopilotDoc** (PA)  | Guida istituzionale | Cobalto `#1B3A8C`   | Lora serif           | Arco C + scintilla gold | Autorevole, caldo, affidabile |

**Architettura coesistenza**:

```
DocenteDoc (--md-sys-*)
├── Orbit        (--orbit-*)  ← agenti, dark mode, autonomi
└── CopilotDoc   (--cp-*)     ← assistente, light first, PA context
```

Nessun conflitto di namespace — i tre sistemi coesistono nello stesso build CSS.

---

## 9. Do / Don't CopilotDoc

| ✅ Do                                                      | ❌ Don't                                  |
| ---------------------------------------------------------- | ----------------------------------------- |
| Logo su sfondo `#F0F4FF` o `#FFFFFF`                       | Logo su sfondo dark (perde l'identità PA) |
| Font Lora per titoli display                               | Barlow Condensed (è di Orbit)             |
| Scintilla gold su arco cobalto                             | Cambiare colore arco (è l'identità)       |
| Chip conformità con palette emerald/amber/ruby             | Chip con colori MD3 viola nel contesto PA |
| "CopilotDoc" come nome proprio (C maiuscola + D maiuscola) | "Copilot Doc", "copilotdoc", "AI Docente" |
| Sub-label "Assistente AI · PA"                             | Generic "AI Assistant" in inglese         |
| Score con DM Mono bold                                     | Score con font sans normale               |
