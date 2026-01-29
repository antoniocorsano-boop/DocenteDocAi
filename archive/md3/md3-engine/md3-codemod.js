import fs from "fs";

export function codemod(file) {
  let code = fs.readFileSync(file, "utf8");

  code = code
    .replace(/layers\.sys\.color\.([a-zA-Z0-9]+)/g, "var(--md-sys-color-$1)")
    .replace(/useTheme\(\)/g, "")
    .replace(/<p>/g, '<M3Typography variant="bodyMedium">')
    .replace(/<\/p>/g, "</M3Typography>")
    .replace(/<h1>/g, '<M3Typography variant="headlineLarge">')
    .replace(/<\/h1>/g, "</M3Typography>");

  fs.writeFileSync(file, code);
}
