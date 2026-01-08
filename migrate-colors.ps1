$files = Get-ChildItem -Path "src" -Recurse -Include "*.css","*.scss","*.tsx","*.ts" -Exclude "node_modules"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace '--sys-primary', '--md-sys-color-primary'
    $content = $content -replace '--sys-secondary', '--md-sys-color-secondary'
    $content = $content -replace '--sys-surface', '--md-sys-color-surface'
    $content = $content -replace '--sys-on-surface', '--md-sys-color-on-surface'
    $content = $content -replace '--sys-outline-variant', '--md-sys-color-outline-variant'
    $content = $content -replace '--sys-on-surface-variant', '--md-sys-color-on-surface-variant'
    $content = $content -replace '--sys-primary-container', '--md-sys-color-primary-container'
    $content = $content -replace '--sys-on-primary', '--md-sys-color-on-primary'
    # Add more as needed
    Set-Content $file.FullName $content
}