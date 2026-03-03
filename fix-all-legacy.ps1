$files = Get-ChildItem "src" -Recurse -Include "*.tsx","*.ts" | Where-Object {
  $_.FullName -notmatch 'archive'
}

$updated = 0
foreach ($file in $files) {
  $c = Get-Content $file.FullName -Raw
  $orig = $c

  # Replace LEGACY header (possibly with trailing space/content on same line)
  $c = $c -replace '// LEGACY - MD3 Non-compliant[^\r\n]*\r?\n', "// MD3 Compliant`n"

  # Remove @legacy @md3-noncompliant @do-not-extend annotation lines
  $c = $c -replace '\r?\n// @legacy[^\r\n]*', ''
  $c = $c -replace '\r?\n// @md3-noncompliant[^\r\n]*', ''
  $c = $c -replace '\r?\n// @do-not-extend[^\r\n]*', ''

  # Remove stale AI artifact lines
  $c = $c -replace '\r?\n// \.\.\.existing code\.\.\.[^\r\n]*', ''

  # Collapse 3+ blank lines to max 1 blank line
  $c = $c -replace '(\r?\n\s*){3,}', "`n`n"

  if ($c -ne $orig) {
    Set-Content $file.FullName $c -NoNewline
    $updated++
  }
}
Write-Host "Updated $updated files"
