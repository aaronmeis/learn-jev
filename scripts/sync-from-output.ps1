# Sync Jev + related Almeida materials into learn-jev from vault + C:\output.
# Usage: powershell -ExecutionPolicy Bypass -File scripts\sync-from-output.ps1

$ErrorActionPreference = "Continue"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

$VaultJev = "C:\obsidian\personal_research_2026\Learning\one-day-mastery\jev-system-one"
$VaultAlmeida = "C:\obsidian\personal_research_2026\Learning\one-day-mastery\ai-assistance-vs-automation"
$OutJev = "C:\output\obsidian\notebooklm\odm-jev-system-one"
$OutAlmeida = "C:\output\obsidian\notebooklm\odm-ai-assistance-vs-automation"
$AlmeidaNexus = Join-Path $OutAlmeida "NEXUS _ odm-ai-assistance-vs-automation _ 2026-09-20 _ one-day-mastery"

function Copy-Safe($src, $dest) {
  if (-not (Test-Path $src)) {
    Write-Host "  skip missing: $src" -ForegroundColor DarkYellow
    return $false
  }
  $destDir = Split-Path $dest -Parent
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  Copy-Item -LiteralPath $src -Destination $dest -Force
  Write-Host "  ok $(Split-Path $dest -Leaf)" -ForegroundColor Green
  return $true
}

Write-Host "=== learn-jev sync ===" -ForegroundColor Cyan
Write-Host "Root: $Root"

# --- Jev reference notes (vault) ---
Write-Host "`n[1] Jev vault notes -> notes/jev + reports/jev"
$jevMap = @{
  "MISSION.md" = "notes\jev\mission.md"
  "GLOSSARY.md" = "notes\jev\glossary.md"
  "RESOURCES.md" = "notes\jev\resources.md"
  "day-plan.md" = "notes\jev\study-day-plan.md"
  "intake\mindmap.md" = "notes\jev\mindmap.md"
  "reference\source-ledger.md" = "notes\jev\source-ledger.md"
  "reference\elicit-light-research.md" = "notes\jev\elicit-light-research.md"
  "reference\cheatsheet.md" = "notes\jev\cheatsheet.md"
  "reference\quiz-bank.md" = "notes\jev\quiz-bank.md"
}
foreach ($k in $jevMap.Keys) {
  Copy-Safe (Join-Path $VaultJev $k) (Join-Path $Root $jevMap[$k]) | Out-Null
}
Get-ChildItem (Join-Path $VaultJev "blocks\*.md") -ErrorAction SilentlyContinue | ForEach-Object {
  Copy-Safe $_.FullName (Join-Path $Root ("notes\jev\blocks\" + $_.Name)) | Out-Null
}

# Staged NBLM sources for Jev
$jevSrc = Join-Path $OutJev "sources"
if (Test-Path $jevSrc) {
  New-Item -ItemType Directory -Force -Path (Join-Path $Root "reports\jev") | Out-Null
  Copy-Item -Path (Join-Path $jevSrc "*") -Destination (Join-Path $Root "reports\jev") -Force -Recurse
  Write-Host "  ok reports/jev from staged sources" -ForegroundColor Green
}

# Jev PPTX + PNG slide export (prefer *-presentation-png, else JPG folder)
Copy-Safe (Join-Path $OutJev "odm-jev-system-one-presentation.pptx") (Join-Path $Root "reports\jev-overview.pptx") | Out-Null
$jevPng = Join-Path $OutJev "odm-jev-system-one-presentation-png"
$jevJpg = Join-Path $OutJev "odm-jev-system-one-presentation"
$jevSlideSrc = if (Test-Path $jevPng) { $jevPng } elseif (Test-Path $jevJpg) { $jevJpg } else { $null }
if ($jevSlideSrc) {
  New-Item -ItemType Directory -Force -Path (Join-Path $Root "decks\jev-overview") | Out-Null
  Copy-Item -Path (Join-Path $jevSlideSrc "Slide*") -Destination (Join-Path $Root "decks\jev-overview") -Force
  Write-Host "  ok decks/jev-overview from $jevSlideSrc" -ForegroundColor Green
}

# Jev NotebookLM shorts (~30s vertical)
$jevShorts = Join-Path $OutJev "shorts"
if (Test-Path $jevShorts) {
  New-Item -ItemType Directory -Force -Path (Join-Path $Root "media\shorts") | Out-Null
  Copy-Item -Path (Join-Path $jevShorts "*.mp4") -Destination (Join-Path $Root "media\shorts") -Force
  Copy-Safe (Join-Path $OutJev "shorts-manifest.json") (Join-Path $Root "media\shorts\shorts-manifest.json") | Out-Null
  Write-Host "  ok media/shorts from NotebookLM downloads" -ForegroundColor Green
}

# Full NEXUS export folder (docs + media mirrors)
$jevNexus = Join-Path $OutJev "NEXUS _ odm-jev-system-one _ 2026-09-20 _ one-day-mastery"
if (Test-Path $jevNexus) {
  New-Item -ItemType Directory -Force -Path (Join-Path $Root "reports\jev\notebooklm") | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $Root "media\shorts-nblm") | Out-Null
  Get-ChildItem -LiteralPath $jevNexus -File | ForEach-Object {
    $ext = $_.Extension.ToLowerInvariant()
    if ($ext -in @(".md", ".csv", ".json", ".pdf")) {
      Copy-Safe $_.FullName (Join-Path $Root ("reports\jev\notebooklm\" + $_.Name)) | Out-Null
      if ($ext -eq ".pdf") {
        Copy-Safe $_.FullName (Join-Path $Root ("reports\jev\" + $_.Name)) | Out-Null
      }
    } elseif ($ext -eq ".mp4") {
      Copy-Safe $_.FullName (Join-Path $Root ("media\shorts-nblm\" + $_.Name)) | Out-Null
    } elseif ($ext -in @(".m4a", ".mp3")) {
      Copy-Safe $_.FullName (Join-Path $Root ("media\" + $_.Name)) | Out-Null
    } elseif ($ext -eq ".png") {
      Copy-Safe $_.FullName (Join-Path $Root ("visuals\" + $_.Name)) | Out-Null
    }
  }
  Write-Host "  ok NEXUS export mirrored" -ForegroundColor Green
}

# --- Almeida related (TypeSafe founder / RLHF -> automation gap) ---
Write-Host "`n[2] Almeida / assistance-vs-automation -> decks + reports + media"
$almeidaSlides = Join-Path $OutAlmeida "odm-ai-assistance-vs-automation-presentation"
if (-not (Test-Path $almeidaSlides)) {
  $almeidaSlides = Join-Path $VaultAlmeida "assets\presentation"
}
if (Test-Path $almeidaSlides) {
  New-Item -ItemType Directory -Force -Path (Join-Path $Root "decks\almeida-rlhf") | Out-Null
  Copy-Item -Path (Join-Path $almeidaSlides "Slide*") -Destination (Join-Path $Root "decks\almeida-rlhf") -Force
  Write-Host "  ok decks/almeida-rlhf" -ForegroundColor Green
}
Copy-Safe (Join-Path $OutAlmeida "odm-ai-assistance-vs-automation-presentation.pptx") (Join-Path $Root "reports\almeida-rlhf.pptx") | Out-Null

if (Test-Path $AlmeidaNexus) {
  Get-ChildItem -LiteralPath $AlmeidaNexus -File | ForEach-Object {
    $name = $_.Name
    if ($name -match '\.(md|pdf|csv|json)$') {
      Copy-Safe $_.FullName (Join-Path $Root ("reports\almeida\" + $name)) | Out-Null
    } elseif ($name -match '\.(m4a|mp3|mp4|webm)$') {
      Copy-Safe $_.FullName (Join-Path $Root ("media\" + $name)) | Out-Null
    }
  }
}

# Vault exports mirror
$vaultExports = Join-Path $VaultAlmeida "notebooklm\exports"
if (Test-Path $vaultExports) {
  Get-ChildItem $vaultExports -File | ForEach-Object {
    Copy-Safe $_.FullName (Join-Path $Root ("notes\almeida\" + $_.Name)) | Out-Null
  }
}

# Note: Almeida "critical-snapshots" are unrelated sci-fi stills from the talk
# video picture track — do NOT copy into visuals/.

Write-Host "`nDone. Re-check content.json paths if you add new decks/media." -ForegroundColor Cyan
