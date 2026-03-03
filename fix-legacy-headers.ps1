$files = @(
  "src\components\ClassSelection.tsx",
  "src\components\OperationsCenter.tsx",
  "src\components\ClassAnalytics.tsx",
  "src\components\EventModal.tsx",
  "src\components\CircolareAnalysisModal.tsx",
  "src\components\RestoreAssistModal.tsx",
  "src\components\QuickNotePopover.tsx",
  "src\components\EventActionPopover.tsx",
  "src\components\DraggableFab.tsx",
  "src\components\AssistantDevTools.tsx"
)
foreach ($f in $files) {
  if (-not (Test-Path $f)) { Write-Host "MISSING: $f"; continue }
  $c = Get-Content $f -Raw
  # Replace LEGACY header line with compliant one
  $c = $c -replace '// LEGACY - MD3 Non-compliant\r?\n', "// MD3 Compliant`n"
  # Remove stale AI artifact lines
  $c = $c -replace '(\r?\n)// \.\.\.existing code\.\.\.', ''
  # Remove annotation tags
  $c = $c -replace '(\r?\n)// @legacy', ''
  $c = $c -replace '(\r?\n)// @md3-noncompliant', ''
  $c = $c -replace '(\r?\n)// @do-not-extend', ''
  # Collapse 3+ blank lines to max 1 blank line
  $c = $c -replace '(\r?\n\s*){3,}', "`n`n"
  Set-Content $f $c -NoNewline
  Write-Host "OK: $f"
}
Write-Host "All done."
