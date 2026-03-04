$dir = "c:\Users\anton\DocenteDocAI\DocenteDocAi\src"
$files = Get-ChildItem -Path $dir -Recurse -Include "*.tsx","*.ts"
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    if (-not $content) { continue }
    $new = $content
    $new = $new -replace "'(var\(--md-sys-[^)]+\))'/30", "'color-mix(in srgb, `$1 30%, transparent)'"
    $new = $new -replace "'(var\(--md-sys-[^)]+\))'/50", "'color-mix(in srgb, `$1 50%, transparent)'"
    $new = $new -replace "'(var\(--md-sys-[^)]+\))'/80", "'color-mix(in srgb, `$1 80%, transparent)'"
    $new = $new -replace "'(var\(--md-sys-[^)]+\))'/20", "'color-mix(in srgb, `$1 20%, transparent)'"
    $new = $new -replace "'(var\(--md-sys-[^)]+\))'/40", "'color-mix(in srgb, `$1 40%, transparent)'"
    $new = $new -replace "'(var\(--md-sys-[^)]+\))'/60", "'color-mix(in srgb, `$1 60%, transparent)'"
    $new = $new -replace "'(var\(--md-sys-[^)]+\))'/10", "'color-mix(in srgb, `$1 10%, transparent)'"
    $new = $new -replace "'(var\(--md-sys-[^)]+\))'/70", "'color-mix(in srgb, `$1 70%, transparent)'"
    $new = $new -replace "'(var\(--md-sys-[^)]+\))'/90", "'color-mix(in srgb, `$1 90%, transparent)'"
    if ($new -ne $content) {
        Set-Content $f.FullName $new -NoNewline
        Write-Output "Fixed: $($f.Name)"
    }
}
Write-Output "Done"
