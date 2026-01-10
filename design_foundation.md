# Design Foundation — Calma Autorevole

> **Stato:** Attivo e vincolante  
> **Ambito:** UI / UX / Frontend  
> **Design System:** Material 3 (MD3 / M3 Expressive)

---

## 1. Scopo del documento

Questo documento definisce **i fondamenti non negoziabili** del design dell’app.

Serve a:

- mantenere **controllo e coerenza** nel tempo
- prevenire regressioni visive
- allineare design, sviluppo e decisioni future
- ridurre ambiguità (“mi sembra giusto / sbagliato”)

Se qualcosa **viola questo documento**, è da considerarsi **fuori sistema**.

---

## 2. Emozione guida

### 🧘‍♂️ Emozione primaria: **Calma autorevole**

L’utente deve percepire:

- affidabilità
- ordine
- assenza di stress
- competenza silenziosa

L’app **non deve stupire**, ma **rassicurare**.

> Se un’interfaccia “si fa notare”, probabilmente sta urlando.

---

## 3. Principi fondamentali (legge del sistema)

### 3.1 Il colore non guida l’attenzione

- Il colore è **di supporto**, non protagonista
- Vietati gradienti ed effetti decorativi
- Colore forte usato solo per:
  - CTA primaria
  - stati importanti

---

### 3.2 Lo spazio è il vero linguaggio visivo

- Spaziature ampie e coerenti
- Meglio troppo spazio che troppo poco
- Nessun elemento “incollato”

> Se un layout sembra vuoto, probabilmente è corretto.

---

### 3.3 Una sola azione primaria per schermata

- Ogni vista ha **una sola CTA dominante**
- Le altre azioni sono visivamente subordinate

L’utente **non deve scegliere**, deve seguire.

---

### 3.4 Movimento solo se funzionale

- Vietate animazioni decorative
- Vietati pulse, shimmer, hover vistosi

Animare solo per:

- chiarire uno stato
- confermare un’azione
- accompagnare una transizione

---

### 3.5 Gerarchia percettiva fissa

Ordine di importanza:

1. Tipografia
2. Spazio
3. Icone
4. Colore

Se il colore è la prima cosa che si nota → errore.

---

## 4. Regole Material 3 vincolanti

### 4.1 Token e utilities

- Vietati valori hardcoded per:
  - spacing
  - radius
  - colori
- Usare solo token M3:
  - `var(--md-sys-spacing-*)`
  - `var(--md-sys-shape-corner-*)`
  - `var(--md-sys-color-*)`

---

### 4.2 Container / Card / Dialog

- Usare solo componenti o classi M3
- Shape: `corner-large`
- Elevation: max livello 2
- Background: `surface-container`

---

### 4.3 Tipografia

- Usare esclusivamente classi M3:
  - `m3-headline-*`
  - `m3-body-*`
  - `m3-label-*`

- Vietato:
  - uppercase decorativo
  - bold aggressivi

---

### 4.4 Bottoni

- Una sola `filled` per vista
- Secondarie: `tonal` o `outline`
- Niente CTA concorrenti

---

### 4.5 Icone

- Solo Material Symbols
- Preferibilmente `outlined`
- Vietate icone decorative

---

## 5. Stato attuale del progetto

### Ottenuto

- Base completa di token e componenti M3
- Eliminazione di stack UI ridondanti
- Scelta esplicita dell’emozione guida
- Prima schermata target definita: **Home**

### Non ancora garantito

- Applicazione sistematica ai layout
- Autorità visiva uniforme
- Coerenza percettiva su tutte le viste

---

## 6. Strategia operativa

- Si lavora **una schermata alla volta**
- La Home è la reference principale
- Ogni nuova vista deve:
  - rispettare questo documento
  - essere confrontata con la Home

---

## 7. Regola finale

> **Prima di aggiungere qualcosa, chiedersi:**
> “Questo aumenta la calma o la riduce?”

Se la risposta non è chiaramente “la aumenta”, **non va fatto**.

---

**Questo documento è vivo, ma l’emozione guida non cambia senza una decisione esplicita.**
