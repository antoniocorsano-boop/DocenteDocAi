$dir = "c:\Users\anton\DocenteDocAI\DocenteDocAi\src"
$files = Get-ChildItem -Path $dir -Recurse -Include "*.stories.tsx","*.stories.ts"
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    if (-not $content) { continue }
    $new = $content
    $new = [regex]::Replace($new, "layers\.ref\.spacing\['(\d+)'\]", { param($m) "'var(--md-sys-spacing-$($m.Groups[1].Value))'" })
    $new = [regex]::Replace($new, 'layers\.ref\.spacing\["(\d+)"\]', { param($m) "'var(--md-sys-spacing-$($m.Groups[1].Value))'" })
    $new = [regex]::Replace($new, 'layers\.(ref|sys)\.[a-zA-Z0-9._]+', "'var(--md-sys-spacing-4)'")
    $new = [regex]::Replace($new, 'sys\.colors\.[a-zA-Z0-9_.]+', "'var(--md-sys-color-surface)'")
    if ($new -ne $content) {
        Set-Content $f.FullName $new -NoNewline
        Write-Output "Fixed stories: $($f.Name)"
    }
}
Write-Output "Done"
