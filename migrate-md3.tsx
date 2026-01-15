#!/usr/bin/env tsx

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

// Configurazione: componenti e directory da processare
const scanDirs = ["src/components", "src/stories"]; // Aggiungi altre cartelle se serve

// Funzione per convertire className in style MD3
function classToStyle(classNames: string) {
  return classNames
    .split(" ")
    .map((c) => {
      if (c.startsWith("p-")) return `padding: ref.spacing[${c.replace(/\D/g, "")}]`;
      if (c.startsWith("m-")) return `margin: ref.spacing[${c.replace(/\D/g, "")}]`;
      if (c.startsWith("bg-")) return `backgroundColor: sys.colors.${c.replace("bg-", "")}`;
      if (c.startsWith("text-")) return `color: sys.colors.${c.replace("text-", "")}`;
      if (c.startsWith("rounded-")) return `borderRadius: ref.shape[${c.replace(/\D/g, "")}]`;
      return null;
    })
    .filter(Boolean)
    .join(", ");
}

// Funzione per migrare un singolo file
function migrateFile(filePath: string) {
  if (!existsSync(filePath)) return;

  let content = readFileSync(filePath, "utf-8");

  // 1️⃣ Inserisce commento LEGACY se non presente
  if (!content.includes("// LEGACY - MD3 Non-compliant")) {
    content = "// LEGACY - MD3 Non-compliant\n" + content;
  }

  // 2️⃣ Trasforma className in style MD3
  content = content.replace(/className\s*=\s*["'`](.*?)["'`]/g, (_, cls) => {
    const style = classToStyle(cls);
    return style ? `style={{ ${style} }}` : "";
  });

  // 3️⃣ Sostituisce valori hardcoded px/rem/hex
  content = content.replace(/(['"])(\d+px|\d+rem|#(?:[0-9a-fA-F]{3,6}))(?:\1)/g, (_, q, value) => {
    if (value.endsWith("px")) {
      const px = parseInt(value.replace("px", ""));
      return `ref.spacing[${px}]`;
    }
    if (value.endsWith("rem")) {
      const rem = parseFloat(value.replace("rem", ""));
      return `ref.spacing[${Math.round(rem * 16)}]`; // 1rem = 16px
    }
    if (value.startsWith("#")) {
      return `sys.colors.${value.replace("#", "")}`;
    }
    return _;
  });

  // 4️⃣ Rimuove runtime mutations su style
  content = content.replace(/\.\s*style\.\w+\s*=\s*.*;/g, "// removed runtime mutation");

  writeFileSync(filePath, content, "utf-8");
  console.log(`✅ Migrated: ${filePath}`);
}

// Funzione ricorsiva per scansionare cartelle
function scanDir(dirPath: string) {
  const items = readdirSync(dirPath);

  items.forEach((item) => {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && !["node_modules", "dist", "__tests__"].includes(item)) {
      scanDir(fullPath);
    } else if (stat.isFile() && [".tsx", ".ts", ".jsx", ".js"].includes(extname(item))) {
      migrateFile(fullPath);
    }
  });
}

// Esecuzione su tutte le cartelle configurate
scanDirs.forEach((dir) => scanDir(join(process.cwd(), dir)));
console.log("🎯 Migrazione completata!");
