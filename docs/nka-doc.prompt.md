```markdown
# PROMPT: Genera componente “Neural Knowledge Aura (NKA)” in stile M3 Expressive per DocenteDoc AI

## Obiettivo
Progetta un **componente modulare** che, se abilitato in Settings, aggiunge un’**aura animata M3 Expressive** nell’header dell’app e rende accessibile la **mappa mentale neurale** stile M3 con **personalizzazioni CSS consentite**.

---

## Vincoli stilistici
- **Material 3 Expressive** per: tonalità, elevation, shape, motion (emphasized)
- **Personalizzazioni CSS** permesse solo per:
  - aura pulsante (gradient M3 + keyline glow)
  - nodi (shape override circolare o pill)
  - archi (curve cubic-bezier custom)
- **Niente override** su: typography, iconography, spacing scale
- **Tema dinamico**: usa tonalità del tema attivo (es. seed #005D57 → T80, T90)

---

## Posizionamento
- **Header**: inserisci **aura button** a destra dell’avatar utente
- **Comportamento**:
  - tap → sheet bottom M3 con mappa NKA
  - long-press → tooltip M3 “Esplora la tua aura di conoscenza”
  - badge se nuovo nodo disponibile (M3 small badge, color Primary30)

---

## Componenti M3 da usare
- **BottomSheet** (modal)
- **FAB mini** (expand map)
- **Card** (info nodo)
- **LinearProgressIndicator** (depth %)
- **Motion**: emphasized enter (150 ms), emphasized exit (100 ms)

---

## Struttura dati nodo (M3 compliant)
```json
{
  "id": "ai_per_educatori",
  "label": "AI per educatori",
  "color": "T80",           // M3 tonalità
  "elevation": 1,           // M3 lv1
  "depth": 0.85,
  "shape": "circle",        // override permesso
  "actions": ["crea_lezione", "simula_classe"]
}
```

---

## UX flow M3
1. User abilita NKA in Settings → switch M3
2. Header mostra **aura button** (gradient M3 + glow)
3. Tap → **bottom sheet** scorrevole con mappa
4. Tap nodo → **card M3** con:
   - headline: nome nodo
   - supporting: “Profondità 85 %”
   - buttons: azioni M3 text-button
5. Swipe orizzontale tra nodi → page-based snap M3

---

## CSS personalizzati ammessi
```css
.aura-glow {
  background: radial-gradient(circle, var(--md-sys-color-primary80) 0%, transparent 70%);
  animation: m3-emphasized-pulse 2s infinite;
}

@keyframes m3-emphasized-pulse {
  0%   { transform: scale(1);  opacity: 0.4; }
  50%  { transform: scale(1.08); opacity: 0.2; }
  100% { transform: scale(1);  opacity: 0.4; }
}
```

---

## Output richiesto
1. **Aura button** (M3 icon button + glow CSS)
2. **Bottom sheet** con mappa NKA (M3 Card lista nodi)
3. **Nodo component** (M3 Card, shape override circle)
4. **Theme-aware tokens** (color, elevation, motion)
5. **Settings toggle** (M3 switch + subtitle)
6. **Accessibility**: contentDescription, focus order, haptic feedback

---

## Improvements

1. **Algoritmo neurale adattivo**  
   - Disposizione nodi dinamica (force-directed, AI-driven) per una mappa sempre “viva”.

2. **Sound design personalizzato**  
   - Ogni area/azione ha una firma sonora unica, coerente con M3.

3. **Wizard AI generativi**  
   - Wizard e percorsi generati runtime, adattati a livello scolastico e contesto.

4. **Modalità “gioco”**  
   - Sblocca neuroni, pattern, badge, progressi visivi e sonori.

5. **Accessibilità avanzata**  
   - Motion ridotto, suoni opzionali, navigazione tastiera, aria-label, focus order.

6. **Modularità**  
   - Il modulo NKA può essere attivato/disattivato in qualsiasi app M3-compliant, senza dipendenze forti.

7. **Persistenza e privacy**  
   - Stato della mappa e preferenze utente salvati localmente, nessun dato sensibile inviato senza consenso.

8. **Estensione livelli scolastici**  
   - Nodi e wizard si adattano a primaria, secondaria, adulti, formazione professionale, ecc.

9. **Offline-first**  
   - Ultima mappa e wizard disponibili anche offline, con fallback su surface container lowest.

---

## Nota tecnica

Il modulo NKA è progettato per essere **indipendente e attivabile/disattivabile**. Può essere integrato in qualsiasi header/app M3, rispetta i vincoli di stile e accessibilità, e si adatta dinamicamente al contesto e all’utente.

---

Inizia subito con codice React + M3 Web Components o React-MD3.
```