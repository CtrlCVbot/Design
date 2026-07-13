$ErrorActionPreference = 'Stop'

$transportRoot = Split-Path -Parent $PSCommandPath
$phaseRoot = Split-Path -Parent $transportRoot
$sourcePath = Join-Path $transportRoot 'run-source.mjs'
$briefPath = Join-Path $phaseRoot 'briefs/trial-01.md'
$fixturePath = Join-Path $phaseRoot 'fixture'
$sourceFixturePath = Join-Path (Split-Path -Parent $phaseRoot) 'phase4b-gt04-v2/fixture'

function Assert-Condition {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Get-Count {
    param(
        [string]$Text,
        [string]$Value
    )

    return ([regex]::Matches($Text, [regex]::Escape($Value))).Count
}

function Get-FixtureManifest {
    param([string]$Root)

    return @(
        Get-ChildItem -LiteralPath $Root -Recurse -File | ForEach-Object {
            $relative = $_.FullName.Substring($Root.Length).TrimStart([char]92).Replace([char]92, '/')
            '{0}|{1}|{2}' -f $relative, $_.Length, (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
        } | Sort-Object
    )
}

$source = if (Test-Path -LiteralPath $sourcePath -PathType Leaf) {
    Get-Content -LiteralPath $sourcePath -Raw -Encoding UTF8
} else {
    $null
}
$brief = Get-Content -LiteralPath $briefPath -Raw -Encoding UTF8
$fixtureBefore = Get-FixtureManifest -Root $fixturePath
$sourceFixture = Get-FixtureManifest -Root $sourceFixturePath
$tests = @(
    @{ Name = 'node parse'; Action = {
        Assert-Condition ($null -ne $source) 'run-source.mjs is missing.'
        & node --check $sourcePath
        Assert-Condition ($LASTEXITCODE -eq 0) 'node --check failed.'
    } },
    @{ Name = 'brief safety'; Action = {
        Assert-Condition ($brief.IndexOf([char]92) -lt 0) 'Routine brief contains a backslash.'
        Assert-Condition ($brief.IndexOf([char]96) -lt 0) 'Routine brief contains a JavaScript backtick.'
        Assert-Condition ($brief.IndexOf('$' + '{') -lt 0) 'Routine brief contains interpolation syntax.'
    } },
    @{ Name = 'structured message'; Action = {
        Assert-Condition ($null -ne $source) 'run-source.mjs is missing.'
        Assert-Condition ((Get-Count -Text $source -Value 'message: read.output') -eq 1) 'Structured message is not defined exactly once.'
        Assert-Condition ((Get-Count -Text $source -Value 'agent_type: "routine_worker"') -eq 1) 'Custom role is not defined exactly once.'
        Assert-Condition ((Get-Count -Text $source -Value 'fork_context: false') -eq 1) 'Custom spawn must not fork context.'
        Assert-Condition ((Get-Count -Text $source -Value 'read.exit_code !== 0') -eq 1) 'Read exit code guard is missing.'
        Assert-Condition ((Get-Count -Text $source -Value 'read.output.includes(expectedHeader)') -eq 1) 'Brief header guard is missing.'
        $spawnIndex = $source.IndexOf('tools.multi_agent_v1__spawn_agent')
        Assert-Condition ($spawnIndex -gt $source.IndexOf('read.exit_code !== 0')) 'Spawn appears before the read exit code guard.'
        Assert-Condition ($spawnIndex -gt $source.IndexOf('read.output.includes(expectedHeader)')) 'Spawn appears before the brief header guard.'
    } },
    @{ Name = 'source safety'; Action = {
        Assert-Condition ($null -ne $source) 'run-source.mjs is missing.'
        Assert-Condition ($source.IndexOf('[WORKER BRIEF]') -lt 0) 'Source embeds the Worker brief.'
        Assert-Condition ($source.IndexOf([char]92) -lt 0) 'Source contains a backslash.'
        Assert-Condition ($source.IndexOf([char]96) -lt 0) 'Source contains a JavaScript backtick.'
        Assert-Condition ($source.IndexOf('$' + '{') -lt 0) 'Source contains interpolation syntax.'
        Assert-Condition ($source -notmatch '(?i)\b(model|reasoning_effort|service_tier)\b') 'Source contains a prohibited override.'
        Assert-Condition ($source.IndexOf('tools.spawn_agent') -lt 0) 'Source contains the old spawn shorthand.'
        Assert-Condition ($source.IndexOf('tools.wait_agent') -lt 0) 'Source contains the old wait shorthand.'
        Assert-Condition ($source.IndexOf('tools.notify') -lt 0) 'Source contains the old notify shorthand.'
        Assert-Condition ($source.IndexOf('child.id') -lt 0) 'Source contains the old child id field.'
        Assert-Condition ($source.IndexOf('wait_agent({ id') -lt 0) 'Source contains the old wait request shape.'
    } },
    @{ Name = 'single transport lifecycle'; Action = {
        Assert-Condition ($null -ne $source) 'run-source.mjs is missing.'
        Assert-Condition ((Get-Count -Text $source -Value 'tools.exec_command') -eq 1) 'Source must define one read.'
        Assert-Condition ((Get-Count -Text $source -Value 'tools.multi_agent_v1__spawn_agent') -eq 1) 'Source must define one full-name spawn.'
        Assert-Condition ((Get-Count -Text $source -Value 'tools.multi_agent_v1__wait_agent') -eq 1) 'Source must define one full-name wait.'
        Assert-Condition ((Get-Count -Text $source -Value 'notify(JSON.stringify(child));') -eq 1) 'Source must notify the spawn result once with the global helper.'
        Assert-Condition ((Get-Count -Text $source -Value 'text(JSON.stringify(waitResult));') -eq 1) 'Source must return the wait result once with the global helper.'
        Assert-Condition ((Get-Count -Text $source -Value 'targets: [child.agent_id]') -eq 1) 'Wait must target child.agent_id.'
        Assert-Condition ((Get-Count -Text $source -Value 'timeout_ms: 300000') -eq 1) 'Wait must use the required timeout.'
    } },
    @{ Name = 'fixture integrity'; Action = {
        $fixtureAfter = Get-FixtureManifest -Root $fixturePath
        Assert-Condition (($fixtureBefore -join "`n") -eq ($sourceFixture -join "`n")) 'v2.1 fixture is not byte-identical to v2 fixture.'
        Assert-Condition (($fixtureBefore -join "`n") -eq ($fixtureAfter -join "`n")) 'Fixture changed during preflight.'
    } }
)

$failures = @()
foreach ($test in $tests) {
    try {
        & $test.Action
    } catch {
        $failures += "$($test.Name): $($_.Exception.Message)"
    }
}

[ordered]@{
    status = if ($failures.Count -eq 0) { 'PASS' } else { 'FAIL' }
    tests = $tests.Count
    failures = [string[]]$failures
} | ConvertTo-Json -Compress

if ($failures.Count -ne 0) {
    exit 1
}
