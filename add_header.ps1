$componentsDir = "src\components"
$header = "/* GENERATED: MD3 Platinum Recovery - DO NOT EDIT MANUALLY */"

Get-ChildItem -Path $componentsDir -Recurse -Filter "*.tsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if (-not $content.StartsWith($header)) {
        $newContent = $header + "`n`n" + $content
        Set-Content $_.FullName $newContent
    }
}