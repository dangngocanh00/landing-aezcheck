param([ValidateSet('before','after','pricingfix','guidefix')][string]$Phase = 'after')
$ErrorActionPreference = 'Stop'
$root = '.qa/release/2026-09-29-build/lighthouse'
$pages = if ($Phase -eq 'before') { @('vi/') } elseif ($Phase -eq 'pricingfix') { @('vi/pricing','en/pricing') } elseif ($Phase -eq 'guidefix') { @('vi/guide','en/guide') } else { @('vi/','en/','vi/pricing','en/pricing','vi/guide','en/guide') }
foreach ($route in $pages) {
  foreach ($run in 1..3) {
    $name = $route.TrimEnd('/').Replace('/','-')
    pnpm.cmd dlx lighthouse "http://127.0.0.1:4173/$route" --port=9338 --output=json --output=html "--output-path=$root/$Phase-$name-mobile-$run" --screenEmulation.width=393 --screenEmulation.height=852 --quiet
    if ($LASTEXITCODE -ne 0) { throw "Lighthouse failed: $Phase $route $run" }
    Write-Output "Completed $Phase $route mobile $run"
  }
}
if ($Phase -ne 'before') {
  $desktopRoutes = if ($Phase -eq 'pricingfix') { @('vi/pricing') } elseif ($Phase -eq 'guidefix') { @('vi/guide') } else { @('vi/','vi/pricing','vi/guide') }
  foreach ($route in $desktopRoutes) {
    $name = $route.TrimEnd('/').Replace('/','-')
    pnpm.cmd dlx lighthouse "http://127.0.0.1:4173/$route" --port=9338 --preset=desktop --output=json --output=html "--output-path=$root/$Phase-$name-desktop" --quiet
    if ($LASTEXITCODE -ne 0) { throw "Lighthouse failed: $route desktop" }
    Write-Output "Completed $route desktop"
  }
}
