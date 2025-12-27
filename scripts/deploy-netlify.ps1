param()
# Deploys `dist/` to Netlify using Netlify CLI.
# Requires environment variables: $env:NETLIFY_AUTH_TOKEN and $env:NETLIFY_SITE_ID

if (-not $env:NETLIFY_AUTH_TOKEN) {
  Write-Error "NETLIFY_AUTH_TOKEN is not set"
  exit 1
}
if (-not $env:NETLIFY_SITE_ID) {
  Write-Error "NETLIFY_SITE_ID is not set"
  exit 1
}

if (-not (Test-Path -Path "dist" -PathType Container)) {
  Write-Host "Building project first..."
  npm run build
}

$npx = "npx"
$args = @("netlify","deploy","--prod","--dir=dist","--auth", $env:NETLIFY_AUTH_TOKEN, "--site", $env:NETLIFY_SITE_ID)
& $npx @args
