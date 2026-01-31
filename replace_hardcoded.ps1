$componentsDir = "src\components"

Get-ChildItem -Path $componentsDir -Recurse -Filter "*.tsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw

    # Replace hardcoded px
    $content = $content -replace "'4px'", "'var(--md-sys-spacing-1)'"
    $content = $content -replace "'8px'", "'var(--md-sys-spacing-2)'"
    $content = $content -replace "'12px'", "'var(--md-sys-spacing-3)'"
    $content = $content -replace "'16px'", "'var(--md-sys-spacing-4)'"
    $content = $content -replace "'20px'", "'var(--md-sys-spacing-5)'"
    $content = $content -replace "'24px'", "'var(--md-sys-spacing-6)'"
    $content = $content -replace "'32px'", "'var(--md-sys-spacing-8)'"

    # Colors
    $content = $content -replace "'red'", "'var(--md-sys-color-error)'"
    $content = $content -replace "'blue'", "'var(--md-sys-color-primary)'"
    $content = $content -replace "'green'", "'var(--md-sys-color-tertiary)'"
    $content = $content -replace "'black'", "'var(--md-sys-color-on-surface)'"
    $content = $content -replace "'white'", "'var(--md-sys-color-surface)'"

    Set-Content $_.FullName $content
}