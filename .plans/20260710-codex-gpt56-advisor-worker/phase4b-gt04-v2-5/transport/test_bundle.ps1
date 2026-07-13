$ErrorActionPreference = 'Stop'

$bundleRoot = 'C:/Users/beck/AppData/Local/OpenAI/Codex/bin/a7c12ebff69fb123'
$expectedFiles = @(
    @{ Name = 'codex.exe'; Bytes = 341269296; Hash = 'B88F944EF63556527CAAE2AD43F80B88B8BE174DC09B09D9B037FC94240A0E91' },
    @{ Name = 'codex-code-mode-host.exe'; Bytes = 53593904; Hash = '47D4F085833502BDA816607121FA3B9B2D3381F8511A43757F0D77F4760DDEB3' },
    @{ Name = 'codex-command-runner.exe'; Bytes = 1271600; Hash = '01A582479BF7D31E3EF3F2CBA5BB22DBA5A1D5542CE850B44BBE0217BB4A327E' },
    @{ Name = 'codex-windows-sandbox-setup.exe'; Bytes = 8821040; Hash = '5FBFC00734EBB13DC6E0D0323ABE130AD75A979F59A3B84299BDD48A67844FB2' }
)

function Assert-Condition {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

foreach ($expected in $expectedFiles) {
    $path = Join-Path $bundleRoot $expected.Name
    Assert-Condition (Test-Path -LiteralPath $path -PathType Leaf) "Missing bundle file: $expected.Name"
    $item = Get-Item -LiteralPath $path
    Assert-Condition ($item.Length -eq $expected.Bytes) "Unexpected byte count: $expected.Name"
    $hash = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash
    Assert-Condition ($hash -eq $expected.Hash) "Unexpected SHA256: $expected.Name"
}

$version = & (Join-Path $bundleRoot 'codex.exe') --version
Assert-Condition ($LASTEXITCODE -eq 0) 'codex.exe --version failed.'
Assert-Condition (($version | Out-String).Trim() -eq 'codex-cli 0.144.0-alpha.4') 'Unexpected codex version.'
[ordered]@{ status = 'PASS'; files = $expectedFiles.Count; version = ($version | Out-String).Trim() } | ConvertTo-Json -Compress
