[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$AgentsPath,
    [Parameter(Mandatory = $true)][string]$SkillPath
)

$ErrorActionPreference = 'Stop'

function Assert-Condition {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

function ConvertFrom-Utf8Base64 {
    param([string]$Value)
    return [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Value))
}

function Assert-RouteContract {
    param([string]$Path, [string]$Label)
    Assert-Condition (Test-Path -LiteralPath $Path -PathType Leaf) "$Label is missing."
    $text = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
    $technicalBlock = @'
Advisor/Worker route
- mode: direct | delegated
- advisor: <model>/<effort> | unavailable
- worker: none | <role> (<model>/<effort> | config-derived)
- orchestration skill: invoked | not-invoked
- reason: <matched trigger or exclusion>
'@

    Assert-Condition ($text.Contains($technicalBlock)) "$Label technical block is not exact."
    # Base64 keeps this Windows PowerShell 5.1 test ASCII-only while checking UTF-8 Korean prose.
    $koreanMarkers = @(
        @{ Name = 'simple query'; Value = '6rCE64uo7ZWcIOyniOydmA==' },
        @{ Name = 'omission'; Value = '7IOd6561' },
        @{ Name = 'direct route'; Value = '7KeB7KCRIOqyveuhnA==' },
        @{ Name = 'unavailable value'; Value = '7ZmV7J247ZWgIOyImCDsl4Y=' },
        @{ Name = 'no guessing'; Value = '7LaU7Lih7ZWY7KeAIOyVig==' },
        @{ Name = 'delegated route'; Value = '7JyE7J6EIOqyveuhnA==' },
        @{ Name = 'configured value'; Value = '7ISk7KCV6rCS' },
        @{ Name = 'actual evidence'; Value = '7Iuk7KCcIOymneqxsA==' },
        @{ Name = 'correction'; Value = '7KCV7KCV' },
        @{ Name = 'disclosure itself'; Value = '6rO16rCcIOyekOyytA==' },
        @{ Name = 'delegation scope'; Value = '7JyE7J6EIOuylOychOulvCDrhJPtnojsp4Ag7JWK64qU64uk' }
    )
    foreach ($marker in $koreanMarkers) {
        $decoded = ConvertFrom-Utf8Base64 $marker.Value
        Assert-Condition ($text.Contains($decoded)) "$Label lacks Korean semantic marker: $($marker.Name)"
    }
    foreach ($token in @('docs-only', 'review-only', 'direct', 'none', 'not-invoked', 'unavailable')) {
        Assert-Condition ($text.Contains($token)) "$Label lacks required token: $token"
    }
}

Assert-RouteContract -Path $AgentsPath -Label 'AGENTS candidate'
Assert-RouteContract -Path $SkillPath -Label 'Skill candidate'
[ordered]@{ status = 'PASS'; candidates = 2 } | ConvertTo-Json -Compress
