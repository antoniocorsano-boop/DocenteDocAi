# CONTESTO:
Il progetto React è completamente migrato a Material Design 3 (M3):
- tokens centralizzati (/src/theme/tokens.ts)
- ThemeProvider con useTheme() (/src/theme/theme.tsx)
- global.css con variabili CSS light/dark
- Componenti aggiornati tramite updateM3Tokens.ts
- Settings.tsx con sezioni legacy per temi
- Alcuni componenti legacy o CSS modules possono avere hardcoded

# OBIETTIVO:
Generare un piano operativo step-by-step, dove Copilot:
1. Inserisce ThemeSettingsPanel con preview live e controlli per colori, tipografia, spacing, motion, dark mode.
2. Genera hook useThemeOverrides per gestire overrides runtime dei token e persistenza in localStorage.
3. Aggiorna Settings.tsx per integrare il pannello senza rompere design o retrocompatibilità.
4. Riallinea componenti legacy e CSS modules all’uso dei token centralizzati.
5. Sostituisce tutti hardcoded values nei componenti con useTheme() o variabili CSS.
6. Fornisce snippet pronti da applicare direttamente nei file esistenti.
7. Fornisce suggerimenti di testing visivo: dark mode, palette, tipografia, spacing, motion, responsive.

# OUTPUT RICHIESTO:
- Lista step sequenziali (1,2,3…) chiari, operativi e pratici.
- Per ogni step: file interessato, azione da compiere, snippet React/TSX o JS da inserire.
- Evidenziare componenti critici e sezioni legacy da aggiornare.
- Suggerire testing visivo dopo ogni step per verifica immediata.
- Fornire fallback o rollback per sicurezza in caso di conflitti legacy.
- Tutto coerente con MD3 e token centralizzati.

# VINCOLI:
- Gli snippet devono essere pronti da incollare senza rompere build.
- Non creare componenti extra non necessari.
- Evidenziare dove mappare i controlli legacy ai token M3.
