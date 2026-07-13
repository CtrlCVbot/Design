$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSCommandPath
$verifier = Join-Path $root 'verify_manifest.ps1'
$tempRoot = Join-Path ([IO.Path]::GetTempPath()) ('planning-worker-manifest-' + [guid]::NewGuid().ToString('N'))

function Assert-Condition {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

try {
    New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
    $sample = Join-Path $tempRoot 'sample.txt'
    $manifest = Join-Path $tempRoot 'manifest.json'
    Set-Content -LiteralPath $sample -Encoding UTF8 -Value 'fixed input'
    $hash = (Get-FileHash -LiteralPath $sample -Algorithm SHA256).Hash
    [ordered]@{ files = @([ordered]@{ path = $sample; sha256 = $hash }) } | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $manifest -Encoding UTF8

    $pass = & $verifier -ManifestPath $manifest | ConvertFrom-Json
    Assert-Condition ($pass.status -eq 'PASS') 'Matching manifest must pass.'

    Set-Content -LiteralPath $sample -Encoding UTF8 -Value 'drifted input'
    $fail = & $verifier -ManifestPath $manifest | ConvertFrom-Json
    Assert-Condition ($fail.status -eq 'FAIL') 'Drifted manifest must fail.'
    Assert-Condition ([int]$fail.drift_count -eq 1) 'Drift count must be one.'

    [ordered]@{ status = 'PASS'; tests = 2 } | ConvertTo-Json -Compress
}
finally {
    if ((Test-Path -LiteralPath $tempRoot) -and $tempRoot.StartsWith([IO.Path]::GetTempPath(), [StringComparison]::OrdinalIgnoreCase)) {
        Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }
}
