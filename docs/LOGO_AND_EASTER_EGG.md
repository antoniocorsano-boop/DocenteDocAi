# Documentazione Identità Visiva e Easter Egg "Big Bang"

## 1. Visione e Filosofia del Logo
Il logo di **DocenteDoc AI** non è solo un identificativo grafico, ma un elemento interattivo che incarna la missione del progetto: **elevare la didattica attraverso l'intelligenza artificiale**.

### Elementi Costitutivi
- **La "D" Geometrica**: Rappresenta la struttura, il rigore e la solidità della scuola. È composta da un anello esterno (`ring`), un corpo centrale (`body`) e un'asta (`stem`).
- **La Gemma (Sparkle)**: Simboleggia l'intuizione e l'assistenza dell'AI. È un elemento dinamico che "pulsa" durante l'uso normale e si trasforma durante gli eventi speciali.
- **Il Logotipo**: "DocenteDoc" in ultra-bold comunica autorevolezza. La vicinanza delle lettere rappresenta la coesione della comunità educante.

---

## 2. L'Easter Egg: "The Big Bang Sequence"
L'Easter Egg è un'esperienza trasformativa nascosta che riorganizza l'identità visiva dell'app per riflettere una "nuova era" della sessione utente.

### Trigger
- **Interazione**: 5 click rapidi sul logo nell'header.
- **Logica**: Un timer di 500ms distingue i click singoli (navigazione Home) dalla sequenza di attivazione.

### Fasi Tecniche e Filosofiche
1. **Chaos (4.0s)**: 
   - *Tecnica*: L'intera interfaccia (`app-shell`) e ogni singola parte del logo subiscono una distorsione violenta. La gemma originale si trasforma in una **scheggia impazzita** (`chaos-splinter-gem`) con fisica avanzata.
   - *Dinamica degli Urti*: Implementazione di **Squash & Stretch**. La gemma si schiaccia fisicamente contro i bordi dello schermo (`scale` non uniforme) e subisce contraccolpi rotazionali.
   - *Reazione delle Masse*: L'interfaccia reagisce agli impatti con un **effetto rinculo** (`ui-recoil-reaction`), spostandosi nella direzione opposta all'urto della gemma.
   - *Storytelling*: La gemma colpisce Header, Sidebar e Contenuto per "placare" il caos. Ogni urto è accompagnato da un flash sincronizzato e un tremore della UI.
2. **Implosion (0.6s)**: 
   - *Tecnica*: La gemma compie un arco finale e si schianta contro il centro del logo con un impatto plastico estremo (`scale(40, 30)`). Questo genera un flash bianco totale (`implosion-flash`) che ferma istantaneamente ogni movimento.
3. **Peace & Settled (1.0s)**: 
   - *Tecnica*: Transizione fluida verso la configurazione originale. La gemma scivola dal centro dell'impatto verso la sua sede naturale (`38px, 4px`).
   - *Filosofia*: L'ordine viene ripristinato. L'esperienza del caos ha rafforzato la struttura, dimostrando la resilienza del sistema.

---

## 3. Risultato Finale: "Il Ritorno all'Ordine"
Al termine della sequenza, il logo e i suoi componenti tornano esattamente nelle loro posizioni iniziali:
- **La Gemma**: Torna nella sua sede naturale (`translate(38px, 4px)`).
- **AI**: Torna nella sua posizione di badge a destra del nome.
- **Significato**: L'app ha superato la prova del caos, dimostrando stabilità e resilienza. L'utente torna a un ambiente familiare e sicuro.

---

## 4. Implementazione Tecnica
- **Fisica CSS**: Utilizzo di keyframes multi-stadio per simulare inerzia, accelerazione e deformazione elastica.
- **State Management**: Gestito tramite `useUIStore` (Zustand) con la proprietà `chaosStage`.
- **Rendering**: Utilizzo di `React Portals` per l'overlay globale per garantire la copertura totale della UI.
- **Performance**: Animazioni basate su trasformazioni CSS hardware-accelerated per fluidità massima.

---
*Ultimo aggiornamento: 2 Gennaio 2026*
