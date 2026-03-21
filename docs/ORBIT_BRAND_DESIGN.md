# Orbit — Brand & Design System

> Generato: 2026-03-21 | Design identity per PWA, app icon e identità visiva standalone

---

## Design Direction: "Deep Space Intelligence"

**Concetto**: un **orb caldo ambra** (il nucleo cognitivo) con **due anelli orbitali contrapposti** (tracce degli agenti) e **3 satelliti agenti** che ruotano in orbita. Dark-first, spaziale, tecnico ma caldo.

**Palette separata da MD3** — Orbit ha identità propria, distinta da DocenteDoc:

|                 | DocenteDoc (MD3)  | Orbit (brand)            |
| --------------- | ----------------- | ------------------------ |
| Background      | `#FFFBFE` (light) | `#070B14` (deep space)   |
| Primary         | `#6750A4` viola   | `#FF8C00` ambra          |
| Secondary       | `#625B71`         | `#00C8FF` cyan elettrico |
| Tertiary        | `#7D5260`         | `#00FFB0` mint           |
| theme_color PWA | `#6750A4`         | `#FF8C00`                |

---

## 1. `public/orbit-icon.svg` — App icon vettoriale

```svg
<!-- public/orbit-icon.svg — 512×512 viewBox, scalabile da 16px a 1024px -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#141C2E"/>
      <stop offset="100%" stop-color="#070B14"/>
    </radialGradient>
    <radialGradient id="core" cx="38%" cy="32%" r="65%">
      <stop offset="0%"   stop-color="#FFDF80"/>
      <stop offset="32%"  stop-color="#FF9520"/>
      <stop offset="68%"  stop-color="#F03A10"/>
      <stop offset="100%" stop-color="#C01A08"/>
    </radialGradient>
    <radialGradient id="ambient" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#FF8C00" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#FF8C00" stop-opacity="0"/>
    </radialGradient>
    <filter id="f-glow">
      <feGaussianBlur stdDeviation="3.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="f-core">
      <feGaussianBlur stdDeviation="18" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="f-ring">
      <feGaussianBlur stdDeviation="2.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background rounded square -->
  <rect width="512" height="512" rx="110" fill="url(#bg)"/>

  <!-- Ambient core glow -->
  <circle cx="256" cy="256" r="138" fill="url(#ambient)"/>

  <!-- Ring 1 — main, tilted -18°, electric cyan -->
  <ellipse cx="256" cy="256" rx="172" ry="60"
    stroke="#00C8FF" stroke-width="2.5" stroke-opacity="0.88"
    transform="rotate(-18 256 256)" filter="url(#f-ring)"/>

  <!-- Ring 2 — secondary, tilted +52°, violet -->
  <ellipse cx="256" cy="256" rx="108" ry="36"
    stroke="#8B6FFF" stroke-width="2" stroke-opacity="0.65"
    transform="rotate(52 256 256)" filter="url(#f-glow)"/>

  <!-- Core orb (davanti ai ring) -->
  <circle cx="256" cy="256" r="60" fill="url(#core)" filter="url(#f-core)"/>
  <!-- Lens highlight -->
  <ellipse cx="241" cy="237" rx="19" ry="12" fill="white" fill-opacity="0.20"
    transform="rotate(-20 241 237)"/>
  <circle cx="248" cy="243" r="4.5" fill="white" fill-opacity="0.32"/>

  <!-- Satellite 1 — mint, su ring 1 (θ≈30°) -->
  <circle cx="405" cy="286" r="18" fill="#00FFB0" fill-opacity="0.18"/>
  <circle cx="405" cy="286" r="11" fill="#00FFB0" filter="url(#f-glow)"/>

  <!-- Satellite 2 — cyan, su ring 1 (θ≈195°) -->
  <circle cx="90" cy="241" r="13" fill="#00C8FF" fill-opacity="0.18"/>
  <circle cx="90" cy="241" r="8"  fill="#00C8FF" filter="url(#f-glow)"/>

  <!-- Satellite 3 — violet, su ring 2 (θ≈70°) -->
  <circle cx="293" cy="290" r="10" fill="#B09FFF" fill-opacity="0.18"/>
  <circle cx="293" cy="290" r="6"  fill="#B09FFF" filter="url(#f-glow)"/>
</svg>
```

### Note esportazione PNG

Aprire `orbit-icon.svg` in Inkscape o Figma ed esportare a:

| Dimensione | File                  | Uso                          |
| ---------- | --------------------- | ---------------------------- |
| 16×16      | `orbit-icon-16.png`   | favicon piccolo              |
| 32×32      | `orbit-icon-32.png`   | favicon standard             |
| 48×48      | `orbit-icon-48.png`   | PWA shortcut                 |
| 96×96      | `orbit-icon-96.png`   | PWA shortcut retina          |
| 180×180    | `orbit-icon-180.png`  | Apple Touch Icon             |
| 192×192    | `orbit-icon-192.png`  | PWA standard                 |
| 512×512    | `orbit-icon-512.png`  | PWA large / Play Store       |
| 512×512    | `orbit-icon-512m.png` | PWA maskable (safe zone 80%) |

Per il **maskable icon** (Android Adaptive Icons): aggiungere padding del 20% attorno al marchio (`rx="110"` diventa `rx="0"` e il contenuto è centrato nel safe zone).

---

## 2. `src/components/ui/OrbitLogo.tsx` — Componente React animato

```tsx
/**
 * OrbitLogo.tsx — Animated Orbit brand mark.
 *
 * Variants: 'mark' (icon only) | 'horizontal' (icon + wordmark) | 'stacked'
 * States:   'idle' | 'thinking' | 'active'
 *
 * Ring 1 ruota in senso orario; Ring 2 in senso antiorario.
 * I satelliti viaggiano con il loro ring (gruppo SVG).
 * Zero dipendenze esterne — keyframes iniettati via <style> una volta sola.
 */

import React, { useEffect, useRef } from "react";

// ─── Keyframe injection ───────────────────────────────────────────────────────

let _injected = false;
function injectStyles(): void {
  if (_injected || typeof document === "undefined") return;
  _injected = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes orbit-ring-1 {
      from { transform: rotate(-18deg); }
      to   { transform: rotate(342deg); }
    }
    @keyframes orbit-ring-2 {
      from { transform: rotate(52deg); }
      to   { transform: rotate(-308deg); }
    }
    @keyframes orbit-breathe {
      0%,100% { opacity: 1;   transform: scale(1); }
      50%      { opacity: 0.85; transform: scale(1.06); }
    }
    @keyframes orbit-load-bar {
      from { width: 0%; }
      to   { width: 100%; }
    }
  `;
  document.head.appendChild(s);
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface OrbitLogoProps {
  size?: number; // icon size px (default 40)
  variant?: "mark" | "horizontal" | "stacked";
  state?: "idle" | "thinking" | "active";
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrbitLogo({
  size = 40,
  variant = "mark",
  state = "idle",
  className,
}: OrbitLogoProps): React.JSX.Element {
  const mountRef = useRef(false);
  useEffect(() => {
    if (!mountRef.current) {
      injectStyles();
      mountRef.current = true;
    }
  }, []);

  // Speed multipliers per stato
  const speed = state === "thinking" ? 0.4 : state === "active" ? 0.65 : 1;
  const ring1Dur = `${20 * speed}s`;
  const ring2Dur = `${15 * speed}s`;
  const breathDur = `${4 * speed}s`;

  const cyanOpacity = state === "active" ? "1" : "0.88";
  const violetOpacity = state === "active" ? "0.85" : "0.65";
  const ambientOpacity = state === "thinking" ? "0.55" : "0.38";

  const cx = 256,
    cy = 256;

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
        <radialGradient id="ol-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#141C2E" />
          <stop offset="100%" stopColor="#070B14" />
        </radialGradient>
        <radialGradient id="ol-core" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFDF80" />
          <stop offset="32%" stopColor="#FF9520" />
          <stop offset="68%" stopColor="#F03A10" />
          <stop offset="100%" stopColor="#C01A08" />
        </radialGradient>
        <radialGradient id="ol-ambient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF8C00" stopOpacity={ambientOpacity} />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
        </radialGradient>
        <filter id="ol-glow">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ol-core-glow">
          <feGaussianBlur stdDeviation="18" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="512" height="512" rx="110" fill="url(#ol-bg)" />
      <circle
        cx={cx}
        cy={cy}
        r="138"
        fill="url(#ol-ambient)"
        style={{
          animation: `orbit-breathe ${breathDur} ease-in-out infinite`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />

      {/* Ring 1 group — ruota in senso orario */}
      <g
        style={{
          animation: `orbit-ring-1 ${ring1Dur} linear infinite`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      >
        <ellipse
          cx={cx}
          cy={cy}
          rx="172"
          ry="60"
          stroke="#00C8FF"
          strokeWidth="2.5"
          strokeOpacity={cyanOpacity}
          style={{ filter: "drop-shadow(0 0 5px #00C8FF88)" }}
        />
        <circle
          cx="405"
          cy="286"
          r="11"
          fill="#00FFB0"
          style={{ filter: "drop-shadow(0 0 6px #00FFB0)" }}
        />
        <circle cx="405" cy="286" r="20" fill="#00FFB0" fillOpacity="0.15" />
        <circle
          cx="90"
          cy="241"
          r="8"
          fill="#00C8FF"
          style={{ filter: "drop-shadow(0 0 5px #00C8FF)" }}
        />
        <circle cx="90" cy="241" r="15" fill="#00C8FF" fillOpacity="0.15" />
      </g>

      {/* Ring 2 group — contro-ruota */}
      <g
        style={{
          animation: `orbit-ring-2 ${ring2Dur} linear infinite`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      >
        <ellipse
          cx={cx}
          cy={cy}
          rx="108"
          ry="36"
          stroke="#8B6FFF"
          strokeWidth="2"
          strokeOpacity={violetOpacity}
          style={{ filter: "drop-shadow(0 0 4px #8B6FFF88)" }}
        />
        <circle
          cx="293"
          cy="290"
          r="6"
          fill="#B09FFF"
          style={{ filter: "drop-shadow(0 0 5px #B09FFF)" }}
        />
        <circle cx="293" cy="290" r="12" fill="#B09FFF" fillOpacity="0.18" />
      </g>

      {/* Core orb — sempre in primo piano */}
      <circle
        cx={cx}
        cy={cy}
        r="60"
        fill="url(#ol-core)"
        filter="url(#ol-core-glow)"
        style={{
          animation: `orbit-breathe ${breathDur} ease-in-out infinite`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
      <ellipse
        cx="241"
        cy="237"
        rx="19"
        ry="12"
        fill="white"
        fillOpacity="0.20"
        transform="rotate(-20 241 237)"
      />
      <circle cx="248" cy="243" r="4.5" fill="white" fillOpacity="0.32" />
    </svg>
  );

  if (variant === "mark") {
    return (
      <span className={className} style={{ display: "inline-flex" }}>
        {icon}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.3,
        fontFamily: "'Barlow Condensed', system-ui, sans-serif",
        userSelect: "none",
      }}
    >
      {icon}
      {variant === "horizontal" && (
        <span
          style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}
        >
          <span
            style={{
              fontSize: size * 0.55,
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: "#E8F0FF",
              textTransform: "uppercase",
            }}
          >
            ORBIT
          </span>
          <span
            style={{
              fontSize: size * 0.22,
              fontWeight: 400,
              letterSpacing: "0.08em",
              color: "#00C8FF",
              textTransform: "uppercase",
            }}
          >
            by DocenteDoc AI
          </span>
        </span>
      )}
      {variant === "stacked" && (
        <span
          style={{
            fontSize: size * 0.45,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "#E8F0FF",
            textTransform: "uppercase",
          }}
        >
          ORBIT
        </span>
      )}
    </span>
  );
}
```

### Utilizzo

```tsx
// Solo icona animata (header, FAB, splash)
<OrbitLogo size={40} variant="mark" state="idle" />

// Con wordmark (onboarding, about)
<OrbitLogo size={48} variant="horizontal" state="active" />

// Stato thinking (durante chiamata AI)
<OrbitLogo size={40} variant="mark" state="thinking" />
```

---

## 3. `src/styles/orbit-brand.css` — Design tokens Orbit

```css
/**
 * orbit-brand.css — Orbit Identity System Design Tokens
 *
 * Import DOPO md3-tokens.css. I token Orbit usano namespace --orbit-*
 * e sono intenzionalmente separati da --md-sys-* per permettere ai due
 * sistemi di coesistere (DocenteDoc web usa MD3; Orbit standalone usa questi).
 */

:root {
  /* ── Core palette ─────────────────────────────────────────────────────────── */
  --orbit-color-core: #ff8c00; /* ambra — l'orb cognitivo */
  --orbit-color-core-bright: #ffdf80; /* inner highlight */
  --orbit-color-core-deep: #c01a08; /* shadow edge */

  --orbit-color-ring-primary: #00c8ff; /* cyan elettrico — ring principale */
  --orbit-color-ring-secondary: #8b6fff; /* violetto — cognitive layer */
  --orbit-color-satellite-mint: #00ffb0; /* mint — agente attivo 1 */
  --orbit-color-satellite-cyan: #00c8ff; /* agente 2 (stesso ring) */
  --orbit-color-satellite-violet: #b09fff; /* agente 3 (ring 2) */

  --orbit-color-bg: #070b14; /* spazio profondo */
  --orbit-color-surface: #0f1628; /* card / modal */
  --orbit-color-surface-2: #162040; /* superficie elevata */
  --orbit-color-border: #1e305a; /* divider sottile */

  --orbit-color-text: #e8f0ff; /* testo primario */
  --orbit-color-text-secondary: #8899bb; /* testo secondario */
  --orbit-color-text-accent: #00c8ff; /* link / label */

  /* ── Tipografia ───────────────────────────────────────────────────────────── */
  --orbit-font-display:
    "Barlow Condensed", "Roboto Condensed", system-ui, sans-serif;
  --orbit-font-body: "Barlow", "Roboto", system-ui, sans-serif;
  --orbit-font-mono: "JetBrains Mono", "Fira Code", "Roboto Mono", monospace;

  --orbit-weight-regular: 400;
  --orbit-weight-medium: 500;
  --orbit-weight-bold: 700;
  --orbit-weight-black: 900;

  /* ── Motion ───────────────────────────────────────────────────────────────── */
  --orbit-motion-ring-1: 20s; /* periodo rotazione ring principale */
  --orbit-motion-ring-2: 15s; /* periodo ring secondario */
  --orbit-motion-breathe: 4s; /* respiro ambient orb */
  --orbit-motion-pulse: 2.6s; /* pulse satellite / indicator */
  --orbit-motion-thinking: 0.4; /* moltiplicatore velocità in stato thinking */

  /* ── Elevation / glow ─────────────────────────────────────────────────────── */
  --orbit-glow-core: 0 0 32px 8px rgba(255, 140, 0, 0.4);
  --orbit-glow-ring: 0 0 8px 2px rgba(0, 200, 255, 0.5);
  --orbit-glow-sat: 0 0 10px 3px rgba(0, 255, 176, 0.6);
  --orbit-glow-surface: 0 4px 32px rgba(7, 11, 20, 0.8);

  /* ── Border radius ────────────────────────────────────────────────────────── */
  --orbit-radius-card: 16px;
  --orbit-radius-chip: 8px;
  --orbit-radius-icon: 24px;
}

/* ── Keyframes globali ────────────────────────────────────────────────────────── */
@keyframes orbit-ring-1 {
  from {
    transform: rotate(-18deg);
  }
  to {
    transform: rotate(342deg);
  }
}
@keyframes orbit-ring-2 {
  from {
    transform: rotate(52deg);
  }
  to {
    transform: rotate(-308deg);
  }
}
@keyframes orbit-breathe {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.06);
  }
}
@keyframes orbit-load-bar {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
@keyframes orbit-pulse {
  0% {
    box-shadow: 0 0 0 0px var(--orbit-color-core);
  }
  70% {
    box-shadow: 0 0 0 8px transparent;
  }
  100% {
    box-shadow: 0 0 0 0px transparent;
  }
}
```

---

## 4. `public/manifest.webmanifest` — PWA aggiornato

```json
{
  "name": "Orbit — Assistente AI per Docenti",
  "short_name": "Orbit",
  "description": "Sistema multi-agente per l'orchestrazione cognitiva del docente. Pianifica, analizza e agisce in modo contestuale.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "display_override": ["window-controls-overlay", "standalone"],
  "background_color": "#070B14",
  "theme_color": "#FF8C00",
  "lang": "it",
  "dir": "ltr",
  "orientation": "portrait-primary",
  "categories": ["education", "productivity", "utilities"],
  "icons": [
    { "src": "icons/orbit-icon-48.png", "sizes": "48x48", "type": "image/png" },
    { "src": "icons/orbit-icon-96.png", "sizes": "96x96", "type": "image/png" },
    {
      "src": "icons/orbit-icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/orbit-icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/orbit-icon-512m.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    { "src": "orbit-icon.svg", "sizes": "any", "type": "image/svg+xml" }
  ],
  "screenshots": [
    {
      "src": "screenshots/orbit-mobile.webp",
      "sizes": "390x844",
      "type": "image/webp",
      "form_factor": "narrow",
      "label": "Orbit in modalità Assistente"
    }
  ],
  "shortcuts": [
    {
      "name": "Apri Registro",
      "short_name": "Registro",
      "description": "Accesso rapido al registro di classe",
      "url": "/?action=open_register",
      "icons": [{ "src": "icons/shortcut-register.png", "sizes": "96x96" }]
    },
    {
      "name": "Nuova UDA",
      "short_name": "UDA",
      "description": "Pianifica una nuova unità didattica",
      "url": "/?action=new_uda",
      "icons": [{ "src": "icons/shortcut-uda.png", "sizes": "96x96" }]
    }
  ],
  "handle_links": "preferred",
  "launch_handler": { "client_mode": "navigate-existing" },
  "edge_side_panel": { "preferred_width": 480 }
}
```

---

## 5. `src/components/ui/OrbitSplashScreen.tsx` — Splash animata PWA

```tsx
/**
 * OrbitSplashScreen.tsx — Animated PWA launch screen.
 *
 * Mostrata mentre l'app si idrata (ServiceWorker install, primo caricamento).
 * Auto-hide dopo `duration` ms con fade-out.
 * Usa `orbit-brand.css` per keyframes e token colore.
 */
import React, { useEffect, useState } from "react";
import OrbitLogo from "./OrbitLogo";

export default function OrbitSplashScreen({
  duration = 1800,
}: {
  duration?: number;
}) {
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
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "radial-gradient(ellipse at center, #141C2E 0%, #070B14 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        transition: "opacity 0.4s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Rings decorativi di sfondo */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.07,
          pointerEvents: "none",
        }}
        viewBox="0 0 512 512"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <ellipse
          cx="256"
          cy="256"
          rx="220"
          ry="80"
          stroke="#00C8FF"
          strokeWidth="1"
          style={{
            animation: "orbit-ring-1 25s linear infinite",
            transformOrigin: "256px 256px",
          }}
        />
        <ellipse
          cx="256"
          cy="256"
          rx="300"
          ry="110"
          stroke="#8B6FFF"
          strokeWidth="1"
          style={{
            animation: "orbit-ring-2 35s linear infinite",
            transformOrigin: "256px 256px",
          }}
        />
      </svg>

      {/* Logo principale */}
      <OrbitLogo size={96} variant="mark" state="active" />

      {/* Wordmark */}
      <div
        style={{
          fontFamily: "'Barlow Condensed', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: "0.22em",
          color: "#E8F0FF",
          textTransform: "uppercase",
        }}
      >
        ORBIT
      </div>

      {/* Sub-label */}
      <div
        style={{
          fontFamily: "'Barlow', system-ui, sans-serif",
          fontSize: 13,
          letterSpacing: "0.10em",
          color: "#8899BB",
          textTransform: "uppercase",
        }}
      >
        by DocenteDoc AI
      </div>

      {/* Barra di caricamento */}
      <div
        style={{
          marginTop: 24,
          width: 120,
          height: 2,
          borderRadius: 1,
          background: "#1E305A",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 1,
            background: "linear-gradient(90deg, #FF8C00, #00C8FF)",
            animation: "orbit-load-bar 1.6s ease-in-out forwards",
          }}
        />
      </div>
    </div>
  );
}
```

### Integrazione in `main.tsx`

```tsx
// main.tsx — dopo gli import esistenti
import OrbitSplashScreen from "./components/ui/OrbitSplashScreen";

// Nel render:
root.render(
  <React.StrictMode>
    <OrbitSplashScreen duration={1800} />
    <App />
  </React.StrictMode>,
);
```

---

## 6. `index.html` — Head updates

```html
<!-- Font Barlow (display + body Orbit) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500&display=swap"
  rel="stylesheet"
/>

<!-- Apple PWA meta -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
<meta name="apple-mobile-web-app-title" content="Orbit" />
<link rel="apple-touch-icon" href="/icons/orbit-icon-180.png" />

<!-- Theme color Orbit (barra browser mobil) -->
<meta name="theme-color" content="#FF8C00" />

<!-- Splash screens iOS (opzionale) -->
<link
  rel="apple-touch-startup-image"
  href="/splash/orbit-splash-390x844.png"
  media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
/>
```

---

## 7. Checklist implementazione PWA

### Assets da produrre (in ordine)

- [ ] `public/orbit-icon.svg` — incollare SVG da §1
- [ ] Export PNG a 48/96/180/192/512px da `orbit-icon.svg`
- [ ] PNG maskable da `orbit-icon.svg` (padding safe zone 20%)
- [ ] `public/manifest.webmanifest` — sostituire con §4
- [ ] `src/styles/orbit-brand.css` — creare con §3
- [ ] Import `orbit-brand.css` in `src/main.tsx` (o `App.tsx`)
- [ ] `src/components/ui/OrbitLogo.tsx` — creare con §2
- [ ] `src/components/ui/OrbitSplashScreen.tsx` — creare con §5
- [ ] `index.html` — aggiungere head tags §6
- [ ] `vite.config.ts` — verificare vite-plugin-pwa punta ai nuovi asset

### Test PWA

```bash
# Build + preview locale
npm run build
npm run serve

# Lighthouse audit PWA score
# Aprire DevTools → Lighthouse → PWA
# Target: score > 90 su tutte le categorie PWA

# Test installabilità
# Chrome: barra address → icona installa
# Edge: ... → Apps → Install this site as an app
# iOS Safari: Share → Add to Home Screen
```

### Criteri installabilità Chrome (da verificare tutti)

- [ ] HTTPS (Vercel: automatico)
- [ ] `manifest.webmanifest` referenziato in `<head>`
- [ ] Service Worker registrato (vite-plugin-pwa: automatico)
- [ ] Icon 192×192 PNG presente
- [ ] Icon 512×512 PNG presente (maskable raccomandato)
- [ ] `start_url` risponde con HTTP 200
- [ ] `display: standalone` o `fullscreen`

---

## Note di branding

### Relazione Orbit ↔ DocenteDoc

Orbit è il **layer cognitivo** di DocenteDoc AI. Non è un'app separata — è la personalità intelligente dell'app che prende vita sul mobile. Quindi:

- Il logo DocenteDoc (lettermark "D" con ring) rimane nell'header web
- Il logo Orbit (orb + anelli rotativi) è l'icona installata sul device
- Il nome sull'app installata è **"Orbit"**, non "DocenteDoc AI"
- I colori divergono: DocenteDoc usa MD3 viola, Orbit usa ambra/cyan

### Tipografia

- **Barlow Condensed 700** — wordmark "ORBIT", titoli, label agenti
- **Barlow 400/500** — testo body, descrizioni
- **JetBrains Mono** — output AI, token counter, dati tecnici

### Do / Don't

| ✅ Do                                 | ❌ Don't                                     |
| ------------------------------------- | -------------------------------------------- |
| Logo su sfondo dark `#070B14`         | Logo su sfondo bianco (perde i glow)         |
| Orb ambra + rings colorati            | Cambiare colore dell'orb centrale            |
| Animazione rings a velocità variabile | Bloccare l'animazione (identità = movimento) |
| "ORBIT" tutto maiuscolo condensed     | Minuscolo o font diverso                     |
| Sub-label "by DocenteDoc AI"          | Omettere il collegamento al brand madre      |
