$files = Get-ChildItem -Path "src" -Recurse -Include "*.css","*.scss","*.tsx","*.ts" -Exclude "node_modules"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace '\b4px\b', 'var(--md-sys-spacing-1)'
    $content = $content -replace '\b8px\b', 'var(--md-sys-spacing-2)'
    $content = $content -replace '\b12px\b', 'var(--md-sys-spacing-3)'
    $content = $content -replace '\b16px\b', 'var(--md-sys-spacing-4)'
    $content = $content -replace '\b24px\b', 'var(--md-sys-spacing-6)'
    $content = $content -replace '\b32px\b', 'var(--md-sys-spacing-8)'
    $content = $content -replace '\b48px\b', 'var(--md-sys-spacing-12)'
    Set-Content $file.FullName $content
}