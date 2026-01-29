import { execSync } from "child_process";
import fs from "fs";

try {
  const out = execSync("npm run lint -- --format json", { encoding: "utf8" });
  const report = JSON.parse(out);

  const priority = report
    .filter(f => f.messages.some(m => m.ruleId?.includes("md3")))
    .sort((a, b) => b.messages.length - a.messages.length)
    .map(f => ({
      file: f.filePath,
      violations: f.messages.length
    }));

  fs.writeFileSync("md3-engine/md3-priority.json", JSON.stringify(priority, null, 2));
  console.log("✅ MD3 priority list created");
} catch {
  console.error("❌ ESLint must run without fatal errors");
}
