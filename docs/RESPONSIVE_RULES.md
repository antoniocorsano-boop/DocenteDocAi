# Regole Responsive DocenteDoc AI

## Breakpoint principali
- **xs**: < 600px (smartphone)
- **sm**: 600–900px (phablet/tablet)
- **md**: 900–1200px (tablet landscape, piccoli laptop)
- **lg**: 1200–1800px (desktop)
- **xl**: > 1800px (large desktop)

## Principi adottati
- **Mobile-first**: layout e font pensati per smartphone, con progressive enhancement per desktop.
- **Grid e Flexbox**: uso esteso di CSS Grid e Flexbox per layout fluidi e adattivi.
- **Container max-width**: contenuti centrati con max-width su desktop (`max-w-7xl`), padding laterale su mobile.
- **Menu e header sticky**: elementi di navigazione sempre accessibili, con touch area ampia.
- **Tipografia fluida**: font-size e spaziatura scalano con viewport (`clamp`, `rem`, `vw`).
- **Card e modali**: padding e border-radius aumentano su schermi grandi, si comprimono su mobile.
- **Visibilità condizionale**: elementi non essenziali nascosti su mobile, visibili su desktop.
- **Tabelle e matrici**: scroll orizzontale su mobile, layout tabellare su desktop.
- **Icone e bottoni**: area cliccabile minima 44x44px, icone Material Symbols.

## Utility CSS
- Uso di utility classi tipo `px-4`, `md:px-6`, `max-w-7xl`, `rounded-xl`, `shadow-2xl`.
- Variabili CSS per colori e spaziature: `var(--sys-primary)`, `var(--sys-surface)`.

## Esempi
- **Timetable**: matrice scrollabile orizzontalmente su mobile, griglia fissa su desktop.
- **Dashboard**: bento grid su desktop, stack verticale su mobile.
- **Modali**: full-screen su mobile, centrati e ridotti su desktop.

## Accessibilità
- Contrasto AA, focus visibile, aria-label su bottoni e icone.

---

Per dettagli vedere anche `theme.css` e i commenti nei componenti principali.