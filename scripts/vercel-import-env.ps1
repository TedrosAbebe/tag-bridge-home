#!/usr/bin/env pwsh
<#
Simple PowerShell script to import variables from .env.local into Vercel
Usage: Set the environment variable VERCEL_TOKEN before running:
  $env:VERCEL_TOKEN = 'your_token'
  ./scripts/vercel-import-env.ps1

This script reads .env.local in the repository root and calls `vercel env add`
for each KEY=VALUE pair into the `production` environment. It skips blank
lines and comments starting with `#`.
#>

if (-not $env:VERCEL_TOKEN) {
  Write-Error "VERCEL_TOKEN environment variable is not set. Aborting."
  exit 1
}

$envFile = Join-Path (Get-Location) '.env.local'
if (-not (Test-Path $envFile)) {
  Write-Error ".env.local not found in the repository root. Aborting."
  exit 1
}

Write-Host "Importing variables from $envFile to Vercel (production)..."

Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if ([string]::IsNullOrWhiteSpace($line)) { return }
  if ($line.StartsWith('#')) { return }

  $splitIndex = $line.IndexOf('=')
  if ($splitIndex -lt 0) { Write-Warning "Skipping malformed line: $line"; return }

  $key = $line.Substring(0, $splitIndex).Trim()
  $value = $line.Substring($splitIndex + 1).Trim()

  # Remove surrounding quotes if present
  if ($value.StartsWith('"') -and $value.EndsWith('"')) {
    $value = $value.Substring(1, $value.Length - 2)
  } elseif ($value.StartsWith("'") -and $value.EndsWith("'")) {
    $value = $value.Substring(1, $value.Length - 2)
  }

  Write-Host "Adding $key to Vercel (production)"
  $cmd = "vercel env add $key $value production --token $env:VERCEL_TOKEN"
  # Execute and surface output
  try {
    iex $cmd
  } catch {
    Write-Warning "Failed to add $key: $_"
  }
}

Write-Host "Done. Verify variables in the Vercel dashboard or with 'vercel env ls'."
# PowerShell script to import .env.local variables into Vercel production environment
# Requires: VERCEL_TOKEN environment variable to be set in the shell.

$envPath = Join-Path (Get-Location) '.env.local'
if (-not (Test-Path $envPath)) {
  Write-Output "No .env.local found at $envPath. Exiting."
  exit 0
}

if (-not $env:VERCEL_TOKEN) {
  Write-Error 'VERCEL_TOKEN environment variable is not set. Set it (do not paste tokens in logs).' ; exit 1
}

Write-Output "Importing environment variables from $envPath to Vercel (production)..."

Get-Content $envPath | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq '' -or $line.StartsWith('#')) { return }
  $i = $line.IndexOf('=')
  if ($i -lt 0) { return }
  $k = $line.Substring(0,$i).Trim()
  $v = $line.Substring($i+1).Trim()
  if ($v.StartsWith('"') -and $v.EndsWith('"')) { $v = $v.Trim('"') }
  if ($k -eq '') { return }
  Write-Output "Adding environment variable: $k"
  vercel env add $k $v production --token $env:VERCEL_TOKEN --confirm
}

Write-Output 'Done importing environment variables.'
