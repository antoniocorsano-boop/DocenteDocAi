param(
    [switch]$DryRun,
    [switch]$Verbose
)

# M3 Token Mappings
$mappings = @{
    # Shape corners (rounded-* classes)
    'rounded-xl' = "borderRadius: 'var(--md-sys-shape-corner-medium)'"      # 12px
    'rounded-2xl' = "borderRadius: 'var(--md-sys-shape-corner-large)'"       # 16px
    'rounded-3xl' = "borderRadius: 'var(--md-sys-shape-corner-extra-large)'" # 24px → extra-large (32px is closest)
    'rounded-4xl' = "borderRadius: 'var(--md-sys-shape-corner-extra-large)'" # 32px

    # Spacing - gaps
    'gap-2' = "gap: 'var(--md-sys-spacing-1)'"   # 8px → spacing-1 (4px) - closest
    'gap-3' = "gap: 'var(--md-sys-spacing-2)'"   # 12px → spacing-2 (8px) - closest
    'gap-4' = "gap: 'var(--md-sys-spacing-3)'"   # 16px → spacing-3 (12px) - closest
    'gap-5' = "gap: 'var(--md-sys-spacing-4)'"   # 20px → spacing-4 (16px) - closest
    'gap-6' = "gap: 'var(--md-sys-spacing-5)'"   # 24px → spacing-5 (20px) - closest
    'gap-8' = "gap: 'var(--md-sys-spacing-6)'"   # 32px → spacing-6 (24px) - closest
    'gap-10' = "gap: 'var(--md-sys-spacing-8)'"  # 40px → spacing-8 (32px) - closest

    # Spacing - padding
    'p-2' = "padding: 'var(--md-sys-spacing-1)'"   # 8px → spacing-1 (4px)
    'p-3' = "padding: 'var(--md-sys-spacing-2)'"   # 12px → spacing-2 (8px)
    'p-4' = "padding: 'var(--md-sys-spacing-3)'"   # 16px → spacing-3 (12px)
    'p-5' = "padding: 'var(--md-sys-spacing-4)'"   # 20px → spacing-4 (16px)
    'p-6' = "padding: 'var(--md-sys-spacing-5)'"   # 24px → spacing-5 (20px)
    'p-8' = "padding: 'var(--md-sys-spacing-6)'"   # 32px → spacing-6 (24px)
    'p-10' = "padding: 'var(--md-sys-spacing-8)'"  # 40px → spacing-8 (32px)

    # Spacing - margin
    'm-2' = "margin: 'var(--md-sys-spacing-1)'"   # 8px → spacing-1 (4px)
    'm-3' = "margin: 'var(--md-sys-spacing-2)'"   # 12px → spacing-2 (8px)
    'm-4' = "margin: 'var(--md-sys-spacing-3)'"   # 16px → spacing-3 (12px)
    'm-5' = "margin: 'var(--md-sys-spacing-4)'"   # 20px → spacing-4 (16px)
    'm-6' = "margin: 'var(--md-sys-spacing-5)'"   # 24px → spacing-5 (20px)
    'm-8' = "margin: 'var(--md-sys-spacing-6)'"   # 32px → spacing-6 (24px)
}

# Get all TypeScript/React files
$files = Get-ChildItem -Path . -Recurse -Include *.tsx,*.ts,*.jsx,*.js | Where-Object { $_.FullName -notlike "*node_modules*" }

$filesChanged = 0
$changes = 0

foreach ($file in $files) {
    if ($Verbose) {
        Write-Host "Processing: $($file.FullName)" -ForegroundColor Gray
    }

    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileChanged = $false

    foreach ($tailwindClass in $mappings.Keys) {
        $m3Style = $mappings[$tailwindClass]
        $escapedClass = [regex]::Escape($tailwindClass)

        # Simple pattern matching for className attributes
        $pattern1 = 'className="' + $escapedClass + '"'
        $pattern2 = "className='" + $escapedClass + "'"

        # Check for patterns
        $hasPattern1 = $content -match $pattern1
        $hasPattern2 = $content -match $pattern2

        if ($hasPattern1 -or $hasPattern2) {
            # Found the class, now build replacement
            $replacement = 'style={{ ' + $m3Style + ' }}'

            # Replace the className attribute
            $content = $content -replace $pattern1, $replacement
            $content = $content -replace $pattern2, $replacement

            $fileChanged = $true

            if ($Verbose) {
                Write-Host "  Migrated $tailwindClass to $m3Style" -ForegroundColor Green
            }
        }
    }

    if ($fileChanged) {
        $filesChanged++
        $changes += ($originalContent -split "`n").Count - ($content -split "`n").Count

        if (-not $DryRun) {
            $content | Set-Content $file.FullName -Encoding UTF8
            Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "Would update: $($file.Name)" -ForegroundColor Cyan
        }
    }
}

Write-Host ""
Write-Host "Migration Summary:" -ForegroundColor Cyan
Write-Host "  Files processed: $($files.Count)" -ForegroundColor White
Write-Host "  Files changed: $filesChanged" -ForegroundColor Green
Write-Host "  Total changes: $changes" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host ""
    Write-Host "This was a dry run. Run without -DryRun to apply changes." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Migration completed! Run npm run build to validate." -ForegroundColor Green
}

Write-Host "Script completed successfully."