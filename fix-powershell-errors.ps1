@'
# Fix PowerShell substitution errors in TSX files
Get-ChildItem -Path "src\components\*.tsx" -Recurse | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw

    # Fix PowerShell substitution fragments
    $content = $content -replace 'param\(\$match\) \$match\.Groups\[1\'''\]\.Value \+ \(Get-Culture\)\.TextInfo\.ToTitleCase\(\$match\.Groups\[2\'''\]\.Value\) -low', 'layers.sys.color.surfaceContainerLow'
    $content = $content -replace 'param\(\$match\) \$match\.Groups\[1\'''\]\.Value \+ \(Get-Culture\)\.TextInfo\.ToTitleCase\(\$match\.Groups\[2\'''\]\.Value\) -high', 'layers.sys.color.surfaceContainerHigh'
    $content = $content -replace 'param\(\$match\) \$match\.Groups\[1\'''\]\.Value \+ \(Get-Culture\)\.TextInfo\.ToTitleCase\(\$match\.Groups\[2\'''\]\.Value\) -variant', 'layers.sys.color.onSurfaceVariant'
    $content = $content -replace 'param\(\$match\) \$match\.Groups\[1\'''\]\.Value \+ \(Get-Culture\)\.TextInfo\.ToTitleCase\(\$match\.Groups\[2\'''\]\.Value\) ', 'layers.sys.color.onPrimary'
    $content = $content -replace 'param\(\$match\) \$match\.Groups\[1\'''\]\.Value \+ \(Get-Culture\)\.TextInfo\.ToTitleCase\(\$match\.Groups\[2\'''\]\.Value\) -lowest', 'layers.sys.color.surfaceContainerLowest'

    # Fix incomplete spacing references
    $content = $content -replace "layers\.ref\.spacing\['\]", "layers.ref.spacing['4']"

    # Fix remaining sys.colors references
    $content = $content -replace 'sys\.colors\.', 'layers.sys.color.'

    # Fix duplicate style attributes by merging them
    $content = $content -replace 'style=\{([^}]+)\} style=\{([^}]+)\}', 'style={{$1, $2}}'

    # Write back the fixed content
    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Fixed: $filePath"
}
'@ | Out-File -FilePath "fix-powershell-errors.ps1" -Encoding UTF8