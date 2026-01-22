# Migration Report Template

**Data:** [YYYY-MM-DD]  
**Tipo:** 🔧 MIGRATION REPORT  
**Componente:** [NomeComponente.tsx]  
**Status:** [✅ COMPLETED / 🔄 IN PROGRESS / ❌ FAILED]

---

## 📋 Informazioni Task

### **Dettagli Migrazione**

- **Componente Target:** [NomeComponente.tsx]
- **Errori Iniziali:** [X] errori ESLint
- **Tipo Task:** [Tipo A/B/C/D/E]
- **Priorità:** [Alta/Media/Bassa]
- **Stima Tempo:** [X] minuti

### **Contesto**

- **Motivazione:** [Perché questo componente è stato scelto]
- **Dipendenze:** [Altri componenti/file coinvolti]
- **Rischi:** [Potenziali problemi o regressioni]

---

## 🔧 Esecuzione Migrazione

### **Step Completati**

- [ ] **Pre-Migration Setup**
  - [ ] Ambiente verificato (build funzionante)
  - [ ] Test baseline passati
  - [ ] Backup git creato

- [ ] **Error Analysis**
  - [ ] Errori del componente identificati
  - [ ] Pattern di errore categorizzati
  - [ ] Strategia di fix pianificata

- [ ] **Migration Execution**
  - [ ] **Step 1:** [Descrizione fix applicato]
    - Pattern: [Tipo errore]
    - Soluzione: [Descrizione tecnica]
    - File modificati: [lista]
  - [ ] **Step 2:** [Descrizione fix applicato]
  - [ ] **Step 3:** [Descrizione fix applicato]

- [ ] **Validation**
  - [ ] Build completato con successo
  - [ ] Test passati
  - [ ] Nessun nuovo errore introdotto
  - [ ] Funzionalità componente verificata

---

## 📊 Risultati

### **Metriche Pre/Post**

- **Errori Iniziali:** [X]
- **Errori Finali:** [X]
- **Riduzione:** [X] errori ([X]%)
- **Tempo Impiegato:** [X] minuti
- **Build Status:** [✅ PASS / ❌ FAIL]
- **Test Status:** [✅ PASS / ❌ FAIL]

### **Modifiche Applicate**

```diff
// Esempio di diff delle modifiche
- <div style={{ color: 'red' }} style={{ backgroundColor: 'blue' }}>
+ <div style={{ color: 'red', backgroundColor: 'blue' }}>
```

### **Pattern Identificati**

- **Pattern Nuovo:** [Se trovato pattern non documentato]
  - Descrizione: [Cosa è stato fatto]
  - Applicabilità: [Quando usare questo approccio]
  - Note: [Considerazioni future]

---

## 🚨 Problemi Incontrati

### **Errori e Soluzioni**

- **Problema 1:** [Descrizione]
  - **Causa:** [Analisi root cause]
  - **Soluzione:** [Come risolto]
  - **Prevenzione:** [Come evitare in futuro]

- **Problema 2:** [Descrizione]
  - **Causa:** [Analisi root cause]
  - **Soluzione:** [Come risolto]
  - **Prevenzione:** [Come evitare in futuro]

### **Regressioni**

- [ ] **Funzionale:** [Nessuna/Sì - descrizione]
- [ ] **Visuale:** [Nessuna/Sì - descrizione]
- [ ] **Performance:** [Nessuna/Sì - descrizione]

---

## 📚 Documentazione

### **File Modificati**

- `src/components/[NomeComponente].tsx` - [Descrizione modifiche]

### **Documentazione Aggiornata**

- [ ] `MD3_MIGRATION_PATTERNS.md` - [Nuovi pattern aggiunti]
- [ ] `reports/CHANGELOG.md` - [Entry changelog aggiunta]
- [ ] `PHASE_3_WEEKLY_REPORTS.md` - [Progresso aggiornato]

### **Referenze**

- **Pattern Guide:** `MD3_MIGRATION_PATTERNS.md`
- **Team Guide:** `MD3_TEAM_GUIDE.md`
- **Quick Reference:** `MD3_QUICK_REFERENCE.md`

---

## 🎯 Lezioni Apprese

### **Cosa Ha Funzionato Bene**

- [Lezione positiva e perché]

### **Cosa Migliorare**

- [Lezione negativa e come migliorare]

### **Raccomandazioni Future**

- [Suggerimenti per migrazioni simili]

---

## ✅ Checklist Completamento

- [ ] **Code Quality**
  - [ ] Build passa
  - [ ] Test passano
  - [ ] ESLint errors ridotti come previsto
  - [ ] Code review completata

- [ ] **Documentation**
  - [ ] Report completato
  - [ ] Changelog aggiornato
  - [ ] Pattern documentati (se nuovi)
  - [ ] README archivio aggiornato

- [ ] **Process**
  - [ ] Tempo rispettato
  - [ ] Nessuna regressione
  - [ ] Workflow seguito correttamente
  - [ ] Feedback raccolto

---

**Report Completato Da:** [Nome]  
**Data Completamento:** [YYYY-MM-DD]  
**Reviewer:** [Nome]  
**Approval Status:** [✅ APPROVED / 🔄 PENDING / ❌ REJECTED]</content>
<parameter name="filePath">c:\Users\anton\DocenteDocAI-Flowise\docentedoc-ai\templates\migration-report.md
