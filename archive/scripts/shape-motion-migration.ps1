# Border Radius & Transition Migration Script
# Created: 2026-01-06 (UI Uniformity Audit - P4 & P5)

Write-Host "DocenteDoc AI - Shape & Motion Token Migration" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

# P4: Border Radius Mappings
$radiusMappings = @(
    @{ Old = 'borderRadius:\s*[''"]?4px[''"]?'; New = 'borderRadius: var(--md-sys-shape-corner-small)'; Name = '4px to corner-small' }
    @{ Old = 'borderRadius:\s*[''"]?6px[''"]?'; New = 'borderRadius: var(--md-sys-shape-corner-small)'; Name = '6px to corner-small' }
    @{ Old = 'borderRadius:\s*[''"]?8px[''"]?'; New = 'borderRadius: var(--md-sys-shape-corner-small)'; Name = '8px to corner-small' }
    @{ Old = 'borderRadius:\s*[''"]?12px[''"]?'; New = 'borderRadius: var(--md-sys-shape-corner-medium)'; Name = '12px to corner-medium' }
    @{ Old = 'borderRadius:\s*[''"]?16px[''"]?'; New = 'borderRadius: var(--md-sys-shape-corner-medium)'; Name = '16px to corner-medium' }
    @{ Old = 'borderRadius:\s*[''"]?20px[''"]?'; New = 'borderRadius: var(--md-sys-shape-corner-large)'; Name = '20px to corner-large' }
    @{ Old = 'borderRadius:\s*[''"]?24px[''"]?'; New = 'borderRadius: var(--md-sys-shape-corner-large)'; Name = '24px to corner-large' }
    @{ Old = 'borderRadius:\s*[''"]?28px[''"]?'; New = 'borderRadius: var(--md-sys-shape-corner-extra-large)'; Name = '28px to corner-extra-large' }
    @{ Old = 'borderRadius:\s*[''"]?32px[''"]?'; New = 'borderRadius: var(--md-sys-shape-corner-extra-large)'; Name = '32px to corner-extra-large' }
    @{ Old = 'border-radius:\s*4px'; New = 'border-radius: var(--md-sys-shape-corner-small)'; Name = 'CSS 4px to corner-small' }
    @{ Old = 'border-radius:\s*6px'; New = 'border-radius: var(--md-sys-shape-corner-small)'; Name = 'CSS 6px to corner-small' }
    @{ Old = 'border-radius:\s*8px'; New = 'border-radius: var(--md-sys-shape-corner-small)'; Name = 'CSS 8px to corner-small' }
    @{ Old = 'border-radius:\s*12px'; New = 'border-radius: var(--md-sys-shape-corner-medium)'; Name = 'CSS 12px to corner-medium' }
    @{ Old = 'border-radius:\s*16px'; New = 'border-radius: var(--md-sys-shape-corner-medium)'; Name = 'CSS 16px to corner-medium' }
    @{ Old = 'border-radius:\s*20px'; New = 'border-radius: var(--md-sys-shape-corner-large)'; Name = 'CSS 20px to corner-large' }
    @{ Old = 'border-radius:\s*24px'; New = 'border-radius: var(--md-sys-shape-corner-large)'; Name = 'CSS 24px to corner-large' }
    @{ Old = 'border-radius:\s*28px'; New = 'border-radius: var(--md-sys-shape-corner-extra-large)'; Name = 'CSS 28px to corner-extra-large' }
    @{ Old = 'border-radius:\s*32px'; New = 'border-radius: var(--md-sys-shape-corner-extra-large)'; Name = 'CSS 32px to corner-extra-large' }
)

# P5: Common Transition Patterns (most impactful)
$transitionMappings = @(
    @{ Old = 'transition:\s*all\s+0\.2s\s+var\(--motion-easing-standard\)'; New = '/* Use .m3-transition-standard class instead */'; Name = 'all 0.2s to class' }
    @{ Old = 'transition:\s*all\s+0\.3s\s+var\(--motion-easing-standard\)'; New = '/* Use .m3-transition-medium class instead */'; Name = 'all 0.3s to class' }
)

Write-Host "Phase 1: Border Radius Migration" -ForegroundColor Yellow
Write-Host ""

$totalRadiusReplacements = 0
$radiusFilesModified = 0

# Exclude Storybook files (they're demos, not production code)
$files = Get-ChildItem -Path "src" -Include @("*.tsx", "*.ts", "*.css", "*.jsx", "*.js") -Recurse -File -ErrorAction SilentlyContinue | 
         Where-Object { 
             $_.FullName -notmatch "node_modules|dist|build|coverage" -and
             $_.FullName -notmatch "\.stories\."
         }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    if ($null -eq $content) { continue }
    
    $fileReplacements = 0

    foreach ($mapping in $radiusMappings) {
        $matches = [regex]::Matches($content, $mapping.Old)
        if ($matches.Count -gt 0) {
            $content = $content -replace $mapping.Old, $mapping.New
            $fileReplacements += $matches.Count
        }
    }

    if ($fileReplacements -gt 0) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $totalRadiusReplacements += $fileReplacements
        $radiusFilesModified++
        Write-Host "  $($file.Name): $fileReplacements replacements" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Phase 1 Complete: $radiusFilesModified files, $totalRadiusReplacements replacements" -ForegroundColor Cyan
Write-Host ""

Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Migration Summary" -ForegroundColor Green
Write-Host ""
Write-Host "Border Radius (P4):" -ForegroundColor Yellow
Write-Host "  Files modified: $radiusFilesModified" -ForegroundColor White
Write-Host "  Total replacements: $totalRadiusReplacements" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review changes: git diff" -ForegroundColor White
Write-Host "  2. Test: npm run dev" -ForegroundColor White
Write-Host "  3. Build: npm run build" -ForegroundColor White
Write-Host ""
Write-Host "Note: Transition migrations (P5) should be done manually" -ForegroundColor Cyan
Write-Host "      to preserve specific property transitions (e.g., transform-only)." -ForegroundColor Cyan
Write-Host ""
