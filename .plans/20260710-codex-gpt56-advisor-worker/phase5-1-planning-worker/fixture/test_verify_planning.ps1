$ErrorActionPreference = 'Stop'

$fixtureRoot = Split-Path -Parent $PSCommandPath
$verifier = Join-Path $fixtureRoot 'verify_planning.ps1'
$tempRoot = Join-Path ([IO.Path]::GetTempPath()) ('planning-worker-grader-' + [guid]::NewGuid().ToString('N'))

function Assert-Condition {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

function Write-PassFixture {
    param([string]$Root)
    New-Item -ItemType Directory -Path $Root -Force | Out-Null
    Set-Content -LiteralPath (Join-Path $Root '01-decision.md') -Encoding UTF8 -Value "# Decision`nDEC-01 selects Option B.`n[Scope](./02-scope.md)`n"
    Set-Content -LiteralPath (Join-Path $Root '02-scope.md') -Encoding UTF8 -Value "# Scope`nPROD-01 PROD-02 REQ-01 REQ-02 CON-01`n[Evidence](./03-evidence-matrix.md)`n"
    Set-Content -LiteralPath (Join-Path $Root '03-evidence-matrix.md') -Encoding UTF8 -Value "# Evidence`nPROD-01 PROD-02 REQ-01 REQ-02 ARCH-01 ARCH-02 DEC-01 CON-01 RISK-01 RISK-02 GATE-01 GATE-02 GATE-03`n[Risks](./04-risk-register.md)`n"
    Set-Content -LiteralPath (Join-Path $Root '04-risk-register.md') -Encoding UTF8 -Value "# Risks`nRISK-01 manifest. RISK-02 pre/post hash.`n[Rollout](./05-rollout.md)`n"
    Set-Content -LiteralPath (Join-Path $Root '05-rollout.md') -Encoding UTF8 -Value "# Rollout`nGATE-01 GATE-02 GATE-03 rollback.`n[Decision](./01-decision.md)`n"
}

try {
    $passRoot = Join-Path $tempRoot 'pass'
    $failRoot = Join-Path $tempRoot 'fail'
    Write-PassFixture -Root $passRoot
    Copy-Item -LiteralPath $passRoot -Destination $failRoot -Recurse
    Set-Content -LiteralPath (Join-Path $failRoot '04-risk-register.md') -Encoding UTF8 -Value "# Risks`nRISK-01 only.`n"

    $passResult = & $verifier -OutputRoot $passRoot | ConvertFrom-Json
    Assert-Condition ($passResult.status -eq 'PASS') 'Valid fixture must pass.'
    Assert-Condition ([int]$passResult.files -eq 5) 'Valid fixture must contain five files.'

    $failResult = & $verifier -OutputRoot $failRoot | ConvertFrom-Json
    Assert-Condition ($failResult.status -eq 'FAIL') 'Invalid fixture must fail.'
    Assert-Condition ($failResult.errors.Count -gt 0) 'Invalid fixture must report errors.'

    [ordered]@{ status = 'PASS'; tests = 2 } | ConvertTo-Json -Compress
}
finally {
    if ((Test-Path -LiteralPath $tempRoot) -and $tempRoot.StartsWith([IO.Path]::GetTempPath(), [StringComparison]::OrdinalIgnoreCase)) {
        Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }
}
