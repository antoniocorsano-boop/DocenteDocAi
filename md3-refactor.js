#!/usr/bin/env node
/**
 * MD3 Refactor Automation Script
 * DocenteDoc AI — Refactor automatico delle viste con Claude Sonnet 4.6
 *
 * Funzionalità:
 * - Prompt caching (risparmio ~90% sul contratto MD3)
 * - Batch API (risparmio ~50% su tutto)
 * - 4 passate sequenziali per vista (layout → tipografia → UX → accessibilità)
 * - Aggiornamento automatico di MD3_AUDIT.md
 */
import 'dotenv/config';
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { glob } from "glob";

// ─── CONFIGURAZIONE ────────────────────────────────────────────────────────────

const CONFIG = {
  // Cartella delle viste da refactorare (relativa alla root del progetto)
  viewsGlob: "src/**/*.tsx",

  // File da escludere
  exclude: ["**/*.test.tsx", "**/*.stories.tsx", "**/node_modules/**"],

  // Cartella dove salvare i file refactored (null = sovrascrive gli originali)
  outputDir: null, // es. "src_refactored"

  // File di audit
  auditFile: "MD3_AUDIT.md",

  // File del contratto MD3 (copilot-instructions.md)
  contractFile: ".github/copilot-instructions.md",

  // Modalità batch: true = manda tutto in una volta (più economico, più lento)
  useBatch: true,

  // Max file per sessione (per sicurezza)
  maxFiles: 50,
};

// ─── SETUP CLIENT ──────────────────────────────────────────────────────────────

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── PROMPT DELLE 4 PASSATE ────────────────────────────────────────────────────

const PASSES = [
  {
    id: "layout",
    name: "1 — Struttura e Layout MD3",
    prompt: (code) => `
Analizza questa vista React rispetto al contratto MD3 in alto.

PASSATA 1 — SOLO STRUTTURA E CONTAINER:
- Sostituisci tutti i <div> usati come container visivi con M3Surface, AppLayout o wrapper MD3 appropriati
- Correggi padding, background ed elevation non gestiti tramite componenti MD3
- NON toccare: logica, stati, tipografia, spacing, accessibilità

Restituisci SOLO il codice TypeScript/TSX aggiornato, senza spiegazioni né markdown.

FILE:
${code}
    `.trim(),
  },
  {
    id: "typography",
    name: "2 — Tipografia e Spacing",
    prompt: (code) => `
Analizza questa vista React rispetto al contratto MD3 in alto.

PASSATA 2 — SOLO TIPOGRAFIA E SPACING:
- Sostituisci ogni testo semantico con M3Typography e il livello MD3 corretto (Display, Headline, Title, Body, Label)
- Rimuovi ogni fontSize, fontWeight, lineHeight inline
- Sostituisci ogni spacing hardcoded (px, rem arbitrari) con token MD3
- NON toccare: struttura, logica, UX, accessibilità

Restituisci SOLO il codice TypeScript/TSX aggiornato, senza spiegazioni né markdown.

FILE:
${code}
    `.trim(),
  },
  {
    id: "ux",
    name: "3 — UX moderna (motion, feedback, stati)",
    prompt: (code) => `
Analizza questa vista React rispetto al contratto MD3 in alto.

PASSATA 3 — SOLO UX E STATI:
- Aggiungi skeleton MD3 per i loading state (non spinner generici)
- Aggiungi feedback visivo su ogni azione utente (ripple, snackbar, tooltip MD3)
- Aggiungi empty state con componente MD3 dedicato se mancante
- Aggiungi error state con componente MD3 dedicato se mancante
- Usa transizioni MD3 tra stati (fade, slide secondo motion spec)
- NON toccare: struttura, tipografia, accessibilità

Restituisci SOLO il codice TypeScript/TSX aggiornato, senza spiegazioni né markdown.

FILE:
${code}
    `.trim(),
  },
  {
    id: "accessibility",
    name: "4 — Accessibilità e Responsive",
    prompt: (code) => `
Analizza questa vista React rispetto al contratto MD3 in alto.

PASSATA 4 — SOLO ACCESSIBILITÀ E RESPONSIVE:
- Aggiungi aria-label esplicito e univoco su ogni elemento interattivo
- Aggiungi aria-hidden sulle icone decorative
- Verifica e correggi il tab order logico
- Sostituisci ogni media query o breakpoint ad hoc con utilità MD3 centralizzate

Restituisci SOLO il codice TypeScript/TSX aggiornato, senza spiegazioni né markdown.

FILE:
${code}
    `.trim(),
  },
];

// ─── LETTURA CONTRATTO MD3 (cached) ───────────────────────────────────────────

function loadContract() {
  const contractPath = CONFIG.contractFile;
  if (!fs.existsSync(contractPath)) {
    console.warn(
      `⚠️  Contratto MD3 non trovato in ${contractPath}. Proseguo senza.`
    );
    return "";
  }
  return fs.readFileSync(contractPath, "utf-8");
}

// ─── CHIAMATA API CON CACHING ──────────────────────────────────────────────────

async function refactorPass(contract, code, pass) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: [
      {
        type: "text",
        text: contract,
        // Prompt caching: il contratto MD3 viene memorizzato → risparmio 90%
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: pass.prompt(code),
      },
    ],
  });

  return response.content[0].text;
}

// ─── REFACTOR SINGOLO FILE (4 passate) ────────────────────────────────────────

async function refactorFile(filePath, contract) {
  console.log(`\n📄 ${filePath}`);
  let code = fs.readFileSync(filePath, "utf-8");
  const results = [];

  for (const pass of PASSES) {
    process.stdout.write(`   ${pass.name}... `);
    try {
      code = await refactorPass(contract, code, pass);
      // Rimuovi eventuali backtick markdown nella risposta
      code = code.replace(/^```[a-z]*\n?/gm, "").replace(/```$/gm, "");
      console.log("✅");
      results.push({ pass: pass.id, status: "ok" });
    } catch (err) {
      console.log(`❌ ${err.message}`);
      results.push({ pass: pass.id, status: "error", error: err.message });
    }
  }

  // Salva il file refactored
  const outPath = CONFIG.outputDir
    ? path.join(CONFIG.outputDir, filePath)
    : filePath;

  if (CONFIG.outputDir) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }

  fs.writeFileSync(outPath, code, "utf-8");
  return { filePath, results };
}

// ─── MODALITÀ BATCH ───────────────────────────────────────────────────────────

async function refactorBatch(files, contract) {
  console.log(`\n🚀 Modalità BATCH — ${files.length} file`);
  console.log("   Invio richieste... (il batch viene processato in background)");

  // Per ogni file, crea 4 richieste batch (una per passata)
  // Nota: in modalità batch le passate non sono sequenziali.
  // Questo è il trade-off: più economico ma meno preciso delle 4 passate in serie.
  // Per massima qualità usa useBatch: false.

  // Mappa custom_id → filePath per recupero risultati
  const idToPath = {};
  const requests = files.map((filePath, index) => {
    const safeId = `file-${index}-${path.basename(filePath).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50)}`;
    idToPath[safeId] = filePath;
    const code = fs.readFileSync(filePath, "utf-8");
    return {
      custom_id: safeId,
      params: {
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: [
          {
            type: "text",
            text: contract,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: `
Sei un esperto MD3. Applica TUTTE e 4 le passate di refactor in una volta sola:
1. Struttura: sostituisci <div> visivi con M3Surface/AppLayout
2. Tipografia: usa M3Typography, rimuovi stili inline
3. UX: aggiungi skeleton, empty/error state, feedback MD3
4. Accessibilità: aria-label, aria-hidden, tab order, responsive MD3

Restituisci SOLO il codice TSX aggiornato, senza markdown né spiegazioni.

FILE: ${filePath}
${code}
            `.trim(),
          },
        ],
      },
    };
  });

  const batch = await client.messages.batches.create({ requests });
  console.log(`\n✅ Batch creato: ${batch.id}`);
  console.log("   Stato: processing (può richiedere da pochi minuti a 1 ora)");
  console.log(`\n💾 Salvo il batch ID per il recupero:`);

  fs.writeFileSync(
    "md3-batch-pending.json",
    JSON.stringify(
      {
        batchId: batch.id,
        files,
        idToPath,
        createdAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log("   → md3-batch-pending.json");
  console.log("\n   Esegui questo comando per recuperare i risultati:");
  console.log("   node md3-refactor.js --retrieve");
}

// ─── RECUPERO RISULTATI BATCH ─────────────────────────────────────────────────

async function retrieveBatch() {
  if (!fs.existsSync("md3-batch-pending.json")) {
    console.error("❌ Nessun batch pendente trovato.");
    process.exit(1);
  }

  const { batchId, idToPath } = JSON.parse(
    fs.readFileSync("md3-batch-pending.json", "utf-8")
  );
  console.log(`\n📦 Recupero batch: ${batchId}`);

  const batch = await client.messages.batches.retrieve(batchId);
  console.log(`   Stato: ${batch.processing_status}`);

  if (batch.processing_status !== "ended") {
    console.log("   ⏳ Batch ancora in elaborazione, riprova più tardi.");
    return;
  }

  // Recupera risultati
  const auditResults = [];
  for await (const result of await client.messages.batches.results(batchId)) {
    if (result.result.type === "succeeded") {
      const originalPath = (idToPath || {})[result.custom_id] || result.custom_id;
      const code = result.result.message.content[0].text
        .replace(/^```[a-z]*\n?/gm, "")
        .replace(/```$/gm, "");

      const outPath = CONFIG.outputDir
        ? path.join(CONFIG.outputDir, originalPath)
        : originalPath;

      if (CONFIG.outputDir) {
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
      }

      fs.writeFileSync(outPath, code, "utf-8");
      auditResults.push({ file: originalPath, status: "✅ OK" });
      console.log(`   ✅ ${originalPath}`);
    } else {
      const originalPath = (idToPath || {})[result.custom_id] || result.custom_id;
      auditResults.push({
        file: originalPath,
        status: `❌ ${result.result.error?.message}`,
      });
      console.log(`   ❌ ${originalPath}`);
    }
  }

  updateAudit(auditResults);
  fs.unlinkSync("md3-batch-pending.json");
  console.log("\n🎉 Batch completato!");
}

// ─── AGGIORNAMENTO AUDIT ──────────────────────────────────────────────────────

function updateAudit(results) {
  if (!fs.existsSync(CONFIG.auditFile)) return;

  const today = new Date().toISOString().split("T")[0];
  const sessionLog = `
### [${today}] — Refactor Automatico
**File processati:**
${results.map((r) => `- ${r.status} \`${r.file}\``).join("\n")}

**Note:** Refactor automatico via md3-refactor.js
---
`;

  let audit = fs.readFileSync(CONFIG.auditFile, "utf-8");
  audit = audit.replace("## 📅 Storico Sessioni", `## 📅 Storico Sessioni\n${sessionLog}`);
  fs.writeFileSync(CONFIG.auditFile, audit, "utf-8");
  console.log(`\n📋 MD3_AUDIT.md aggiornato.`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  // Recupero batch pendente
  if (args.includes("--retrieve")) {
    await retrieveBatch();
    return;
  }

  // Verifica API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ Variabile ANTHROPIC_API_KEY non impostata.");
    console.error("   Esegui: export ANTHROPIC_API_KEY=sk-ant-...");
    process.exit(1);
  }

  // Trova i file da processare
  const allFiles = await glob(CONFIG.viewsGlob, { ignore: CONFIG.exclude });
  const files = allFiles.slice(0, CONFIG.maxFiles);

  if (files.length === 0) {
    console.error(`❌ Nessun file trovato con pattern: ${CONFIG.viewsGlob}`);
    process.exit(1);
  }

  console.log(`\n🎨 MD3 Refactor Automation — DocenteDoc AI`);
  console.log(`   File trovati: ${files.length}`);
  console.log(`   Modalità: ${CONFIG.useBatch ? "BATCH (economica)" : "SEQUENZIALE (precisa)"}`);
  console.log(`   Output: ${CONFIG.outputDir || "sovrascrittura originali"}\n`);

  const contract = loadContract();

  if (CONFIG.useBatch) {
    await refactorBatch(files, contract);
  } else {
    // Modalità sequenziale: 4 passate in serie per ogni file
    const results = [];
    for (const file of files) {
      const result = await refactorFile(file, contract);
      results.push({ file: result.filePath, status: "✅ OK" });
    }
    updateAudit(results);
    console.log(`\n🎉 Completato! ${files.length} file processati.`);
  }
}

main().catch(console.error);
