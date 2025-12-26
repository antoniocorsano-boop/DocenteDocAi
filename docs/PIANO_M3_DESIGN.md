# Piano di Miglioramento Design M3 Expressive

Obiettivo: Portare l'app DocenteDoc AI a piena conformità Material Design 3 (M3 Expressive/Web)

---

## 1. Audit UI Attuale
- Analisi componenti chiave: bottoni, card, modali, header, navigation, input
- Verifica palette colori, tipografia, spaziature, angoli arrotondati
- Confronto con linee guida M3: https://m3.material.io/

## 2. Aggiornamento Design System
- Aggiornare theme.css con token M3 ufficiali
- Introdurre palette M3 (primary, secondary, surface, error, background)
- Aggiornare variabili CSS per tipografia, spaziature, radius
- Validare dark mode e high contrast

## 3. Refactoring Componenti
- Bottoni: ripple effect, shadow, radius, colori M3
- Card: elevazione, ombre, radius, padding
- Modali: overlay, animazioni, radius, colori
- Header/AppBar: height, shadow, colore, icone M3
- Input/TextField: label, helper, error, focus, radius
- Navigation: bottom bar, drawer, iconografia M3

## 4. Animazioni e Feedback
- Ripple effect su bottoni e card
- Hover, focus, active state
- Transizioni modali e overlay

## 5. Responsive & Adaptive
- Mobile-first: layout fluidi, breakpoint M3
- Test su dispositivi reali e simulati

## 6. Accessibilità
- Contrasto colori (WCAG 2.1 AA)
- Focus visibile, aria-label, tab order
- Test con screen reader

## 7. Validazione Finale
- Review con designer
- Test utente
- Checklist M3: https://m3.material.io/components

---

## Priorità Interventi
1. Aggiornamento theme.css e token design
2. Refactoring bottoni e card
3. Modali e overlay
4. Header/AppBar
5. Input/TextField
6. Navigation
7. Animazioni
8. Responsive/adaptive
9. Accessibilità
10. Validazione finale

---

## Note
- Tutti i cambiamenti devono essere testati in locale e in produzione
- Documentare le modifiche in CHANGELOG.md
- Coinvolgere designer per review finale

---

Piano salvato il 26/12/2025
