param(
    [Parameter(Mandatory = $true)]
    [string]$ManifestPath
)

$ErrorActionPreference = 'Stop'

$manifestFile = Get-Item -LiteralPath $ManifestPath
$manifestRoot = $manifestFile.DirectoryName
$manifest = Get-Content -LiteralPath $manifestFile.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
$drift = [Collections.Generic.List[object]]::new()

foreach ($entry in @($manifest.files)) {
    $candidate = [string]$entry.path
    $resolved = if ([IO.Path]::IsPathRooted($candidate)) {
        [IO.Path]::GetFullPath($candidate)
    }
    else {
        [IO.Path]::GetFullPath((Join-Path $manifestRoot $candidate))
    }

    if (-not (Test-Path -LiteralPath $resolved -PathType Leaf)) {
        $drift.Add([ordered]@{ path = $candidate; reason = 'missing'; actual = $null; expected = [string]$entry.sha256 })
        continue
    }

    $actual = (Get-FileHash -LiteralPath $resolved -Algorithm SHA256).Hash
    if ($actual -ne [string]$entry.sha256) {
        $drift.Add([ordered]@{ path = $candidate; reason = 'hash'; actual = $actual; expected = [string]$entry.sha256 })
    }
}

[ordered]@{
    status = if ($drift.Count -eq 0) { 'PASS' } else { 'FAIL' }
    checked = @($manifest.files).Count
    drift_count = $drift.Count
    drift = $drift.ToArray()
} | ConvertTo-Json -Compress -Depth 5
