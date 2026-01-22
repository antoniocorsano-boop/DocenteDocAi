# PowerShell script: typography-elevation-migration.ps1
# Esegue sostituzioni automatiche di base per fontSize, fontWeight, boxShadow
# Esegui su branch di test!

Get-ChildItem -Recurse -Include *.tsx,*.ts | ForEach-Object {
    $updated = (Get-Content $_.FullName) `
        -replace "fontSize: ?'?(14|16|18|20|24|32|40|48|56|64|72|80|96)px'", "fontSize: 'var(--md-sys-typescale-body-medium-size)'" `
        -replace "fontWeight: ?'?(400|500|700|900)'?", "fontWeight: 'var(--md-sys-typescale-body-medium-weight)'" `
        -replace "boxShadow: ?'[^']*'", "boxShadow: 'var(--md-sys-elevation1)'"

    $updated | Set-Content $_.FullName
}

Write-Host 'Typography/Elevation migration: sostituzioni base completate. Verifica manuale raccomandata.'
