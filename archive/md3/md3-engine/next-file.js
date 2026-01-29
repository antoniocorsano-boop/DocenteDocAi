import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, "src/components");

function scan(dir) {
  let results = [];

  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(scan(fullPath));
    }

    if (stat.isFile() && entry.endsWith(".tsx")) {
      const content = fs.readFileSync(fullPath, "utf8");

      const score =
        (content.match(/className=/g)?.length || 0) +
        (content.match(/layers\./g)?.length || 0) +
        (content.match(/<h[1-6]|<p>/g)?.length || 0);

      if (score > 0) {
        results.push({
          file: path.relative(ROOT, fullPath),
          score,
        });
      }
    }
  }

  return results;
}

const files = scan(TARGET_DIR).sort((a, b) => b.score - a.score);

if (files.length === 0) {
  console.log("🎉 MD3 MIGRATION COMPLETE — no legacy patterns found.");
} else {
  console.log("➡️ NEXT FILE TO MIGRATE:\n");
  console.log(files[0]);
  console.log(`\nRemaining files: ${files.length}`);
}
