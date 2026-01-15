# Get ESLint output - capture only stdout
$eslintOutput = & cmd /c "npx eslint src/components --format json 2>nul"

# Find where JSON starts (look for opening bracket)
$jsonStart = $eslintOutput -join "`n" | Select-String -Pattern "^\[" | Select-Object -First 1 -ExpandProperty Line

if (-not $jsonStart) {
  # Try a different approach - extract JSON from the full output
  $fullText = $eslintOutput -join "`n"
  $bracketIdx = $fullText.IndexOf('[')
  if ($bracketIdx -eq -1) {
    Write-Error "No JSON array found in output"
    exit 1
  }
  
  # Extract from first [ to last ]
  $jsonStr = $fullText.Substring($bracketIdx)
  $lastBracketIdx = $jsonStr.LastIndexOf(']')
  $jsonStr = $jsonStr.Substring(0, $lastBracketIdx + 1)
} else {
  # Join and extract
  $fullText = $eslintOutput -join "`n"
  $bracketIdx = $fullText.IndexOf('[')
  $jsonStr = $fullText.Substring($bracketIdx)
  $lastBracketIdx = $jsonStr.LastIndexOf(']')
  $jsonStr = $jsonStr.Substring(0, $lastBracketIdx + 1)
}

# Parse JSON
try {
  $data = $jsonStr | ConvertFrom-Json -ErrorAction Stop
} catch {
  Write-Error "Failed to parse JSON: $_"
  Write-Host "JSON preview (first 300 chars):"
  Write-Host $jsonStr.Substring(0, [Math]::Min(300, $jsonStr.Length))
  exit 1
}

# Filter and sort
$filesWithErrors = $data | Where-Object { $_.errorCount -gt 0 } | Sort-Object { $_.errorCount }

# Show files with 1-5 errors
$minErrors = $filesWithErrors | Where-Object { $_.errorCount -le 5 }

Write-Host "=== Files with 1-5 errors ==="
Write-Host ""
$minErrors | Select-Object -First 10 | ForEach-Object {
  $shortPath = $_.filePath -replace '.*[\\\/]components[\\\/]', 'src/components/'
  Write-Host "$shortPath`: $($_.errorCount) error(s)"
}

if ($minErrors.Count -gt 0) {
  $best = $minErrors[0]
  $shortPath = $best.filePath -replace '.*[\\\/]components[\\\/]', 'src/components/'
  
  Write-Host ""
  Write-Host "=== BEST TARGET (Fewest Errors) ==="
  Write-Host "File: $shortPath"
  Write-Host "Error Count: $($best.errorCount)"
  Write-Host ""
  Write-Host "Errors:"
  
  $best.messages | ForEach-Object -Begin { $i = 0 } {
    $i++
    Write-Host "  $i. Line $($_.line): [$($_.ruleId)] $($_.message)"
  }
} else {
  Write-Host ""
  Write-Host "No files with 1-5 errors found"
  Write-Host "Total files with errors: $($filesWithErrors.Count)"
  if ($filesWithErrors.Count -gt 0) {
    Write-Host "Files with fewest errors:"
    $filesWithErrors | Select-Object -First 5 | ForEach-Object {
      $shortPath = $_.filePath -replace '.*[\\\/]components[\\\/]', 'src/components/'
      Write-Host "  $shortPath ($($_.errorCount) errors)"
    }
  }
}
