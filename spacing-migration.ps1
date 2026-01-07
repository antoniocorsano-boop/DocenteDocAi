# Spacing Migration Script
# Created: 2026-01-06 (UI Uniformity Audit - P2)

Write-Host "DocenteDoc AI - Spacing Token Migration" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

# Define migration mappings
$migrations = @(
    @{ Old = 'var\(--spacing-0\)'; New = 'var(--md-sys-spacing-0)'; Name = 'spacing-0' }
    @{ Old = 'var\(--spacing-1\)'; New = 'var(--md-sys-spacing-1)'; Name = 'spacing-1' }
    @{ Old = 'var\(--spacing-2\)'; New = 'var(--md-sys-spacing-2)'; Name = 'spacing-2' }
    @{ Old = 'var\(--spacing-3\)'; New = 'var(--md-sys-spacing-3)'; Name = 'spacing-3' }
    @{ Old = 'var\(--spacing-4\)'; New = 'var(--md-sys-spacing-4)'; Name = 'spacing-4' }
    @{ Old = 'var\(--spacing-5\)'; New = 'var(--md-sys-spacing-5)'; Name = 'spacing-5' }
    @{ Old = 'var\(--spacing-6\)'; New = 'var(--md-sys-spacing-6)'; Name = 'spacing-6' }
    @{ Old = 'var\(--spacing-8\)'; New = 'var(--md-sys-spacing-8)'; Name = 'spacing-8' }
    @{ Old = 'var\(--spacing-10\)'; New = 'var(--md-sys-spacing-10)'; Name = 'spacing-10' }
    @{ Old = 'var\(--spacing-12\)'; New = 'var(--md-sys-spacing-12)'; Name = 'spacing-12' }
    @{ Old = 'var\(--spacing-16\)'; New = 'var(--md-sys-spacing-16)'; Name = 'spacing-16' }
)

Write-Host "Searching for files with legacy spacing tokens..." -ForegroundColor Yellow
Write-Host ""

$totalReplacements = 0
$filesModified = 0

# Search in src directory
$files = Get-ChildItem -Path "src" -Include @("*.tsx", "*.ts", "*.css", "*.jsx", "*.js") -Recurse -File -ErrorAction SilentlyContinue | 
         Where-Object { $_.FullName -notmatch "node_modules|dist|build|coverage" }

# Search in root CSS files
$rootFiles = Get-ChildItem -Path "." -Include @("*.css") -File -ErrorAction SilentlyContinue

$allFiles = $files + $rootFiles

foreach ($file in $allFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $fileReplacements = 0

    foreach ($migration in $migrations) {
        $matches = [regex]::Matches($content, $migration.Old)
        if ($matches.Count -gt 0) {
            $content = $content -replace $migration.Old, $migration.New
            $fileReplacements += $matches.Count
            Write-Host "  $($file.Name): $($matches.Count) x $($migration.Name)" -ForegroundColor Green
        }
    }

    if ($fileReplacements -gt 0) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $totalReplacements += $fileReplacements
        $filesModified++
    }
}

Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Migration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Files modified: $filesModified" -ForegroundColor White
Write-Host "  Total replacements: $totalReplacements" -ForegroundColor White
Write-Host ""

if ($totalReplacements -gt 0) {
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Review changes: git diff" -ForegroundColor White
    Write-Host "  2. Test: npm run dev" -ForegroundColor White
    Write-Host "  3. Build: npm run build" -ForegroundColor White
    Write-Host ""
}
