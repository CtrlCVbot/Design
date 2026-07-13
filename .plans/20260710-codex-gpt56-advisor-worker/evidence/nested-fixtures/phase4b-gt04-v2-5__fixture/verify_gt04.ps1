[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Trial
)

$ErrorActionPreference = 'Stop'

$allowedTrials = @('trial-01', 'trial-02', 'trial-03', 'verifier-pass', 'verifier-fail')
if ($allowedTrials -notcontains $Trial) {
    throw "Trial is not allowed: $Trial"
}

$fixtureRoot = Split-Path -Parent $PSCommandPath
$expectedRoot = Join-Path $fixtureRoot 'expected\\records'
$trialRoot = Join-Path $fixtureRoot "$Trial\\records"

function Get-RecordFiles {
    param([string]$Directory)

    $files = @{}
    if (-not (Test-Path -LiteralPath $Directory -PathType Container)) {
        return $files
    }

    Get-ChildItem -LiteralPath $Directory -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring($Directory.Length).TrimStart('\\')
        $files[$relativePath] = $_.FullName
    }
    return $files
}

function Test-ByteArrayEqual {
    param(
        [byte[]]$Left,
        [byte[]]$Right
    )

    if ($Left.Length -ne $Right.Length) {
        return $false
    }

    for ($index = 0; $index -lt $Left.Length; $index++) {
        if ($Left[$index] -ne $Right[$index]) {
            return $false
        }
    }
    return $true
}

$expectedFiles = Get-RecordFiles -Directory $expectedRoot
$trialFiles = Get-RecordFiles -Directory $trialRoot

$missing = @($expectedFiles.Keys | Where-Object { -not $trialFiles.ContainsKey($_) } | Sort-Object)
$extra = @($trialFiles.Keys | Where-Object { -not $expectedFiles.ContainsKey($_) } | Sort-Object)
$byteMismatches = @()

foreach ($name in @($expectedFiles.Keys | Where-Object { $trialFiles.ContainsKey($_) } | Sort-Object)) {
    # Compare raw bytes so the grader cannot normalize an attempted solution.
    $expectedBytes = [System.IO.File]::ReadAllBytes($expectedFiles[$name])
    $trialBytes = [System.IO.File]::ReadAllBytes($trialFiles[$name])
    if (-not (Test-ByteArrayEqual -Left $expectedBytes -Right $trialBytes)) {
        $byteMismatches += $name
    }
}

$mismatches = $missing.Count + $extra.Count + $byteMismatches.Count
[ordered]@{
    trial = $Trial
    status = if ($mismatches -eq 0) { 'PASS' } else { 'FAIL' }
    mismatches = $mismatches
    missing = [string[]]$missing
    extra = [string[]]$extra
    byte_mismatches = [string[]]$byteMismatches
} | ConvertTo-Json -Compress
