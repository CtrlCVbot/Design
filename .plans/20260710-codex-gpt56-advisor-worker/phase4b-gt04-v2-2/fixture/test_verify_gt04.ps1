$ErrorActionPreference = 'Stop'

$fixtureRoot = Split-Path -Parent $PSCommandPath
$graderPath = Join-Path $fixtureRoot 'verify_gt04.ps1'

function Assert-Condition {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Get-FixtureSnapshot {
    param([string]$Root)

    $snapshot = @{}
    Get-ChildItem -LiteralPath $Root -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring($Root.Length).TrimStart('\\')
        $snapshot[$relativePath] = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
    }
    return $snapshot
}

function Assert-Grade {
    param(
        [string]$Trial,
        [string]$Status,
        [int]$Mismatches
    )

    $result = & $graderPath -Trial $Trial | ConvertFrom-Json
    Assert-Condition ($result.trial -eq $Trial) "$Trial returned an unexpected trial value."
    Assert-Condition ($result.status -eq $Status) "$Trial returned an unexpected status."
    Assert-Condition ([int]$result.mismatches -eq $Mismatches) "$Trial returned an unexpected mismatch count."
}

$before = Get-FixtureSnapshot -Root $fixtureRoot

Assert-Grade -Trial 'verifier-pass' -Status 'PASS' -Mismatches 0
Assert-Grade -Trial 'verifier-fail' -Status 'FAIL' -Mismatches 4
Assert-Grade -Trial 'trial-01' -Status 'FAIL' -Mismatches 4

$rejected = $false
try {
    & $graderPath -Trial '..\\expected' | Out-Null
}
catch {
    $rejected = $true
}
Assert-Condition $rejected 'Path traversal trial was not rejected.'

$rejected = $false
try {
    & $graderPath -Trial 'unknown-trial' | Out-Null
}
catch {
    $rejected = $true
}
Assert-Condition $rejected 'Unknown trial was not rejected.'

$after = Get-FixtureSnapshot -Root $fixtureRoot
Assert-Condition ($before.Count -eq $after.Count) 'Fixture file count changed during testing.'
foreach ($path in $before.Keys) {
    Assert-Condition ($after.ContainsKey($path)) "Fixture file disappeared: $path"
    Assert-Condition ($before[$path] -eq $after[$path]) "Fixture file changed: $path"
}

[ordered]@{
    status = 'PASS'
    tests = 5
} | ConvertTo-Json -Compress
