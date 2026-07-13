$ErrorActionPreference = 'Stop'

$transportRoot = Split-Path -Parent $PSCommandPath
$phaseRoot = Split-Path -Parent $transportRoot
$fixtureRoot = Join-Path $phaseRoot 'fixture'
$sourceFixtureRoot = Join-Path (Split-Path -Parent $phaseRoot) 'phase4b-gt04-v2-2/fixture'
$briefPath = Join-Path $phaseRoot 'briefs/trial-01.md'
$probePath = Join-Path $transportRoot 'probe-source.mjs'
$runPath = Join-Path $transportRoot 'run-source.mjs'

function Assert-Condition {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw $Message }
}

function Get-Count {
    param([string]$Text, [string]$Value)
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

function Invoke-MockedSource {
    param([string]$SourcePath, [string]$Mode, [string]$Brief, [string]$BriefHash)

    $env:GT04_BRIEF_BASE64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($Brief))
    $env:GT04_BRIEF_HASH = $BriefHash
    $runner = @'
import { pathToFileURL } from 'node:url';
const events = [];
const brief = Buffer.from(process.env.GT04_BRIEF_BASE64, 'base64').toString('utf8');
globalThis.ALL_TOOLS = [
  { name: 'shell_command' },
  { name: 'multi_agent_v1__spawn_agent' },
  { name: 'multi_agent_v1__wait_agent' }
];
globalThis.tools = {
  shell_command: async () => {
    events.push('shell');
    return 'Exit code: 0\nOutput:\n' + JSON.stringify({ text: brief, sha256: process.env.GT04_BRIEF_HASH });
  },
  multi_agent_v1__spawn_agent: async (request) => {
    events.push('spawn');
    if (request.message !== brief || request.agent_type !== 'routine_worker' || request.fork_context !== false) throw new Error('invalid spawn request');
    return { agent_id: 'child-01' };
  },
  multi_agent_v1__wait_agent: async (request) => {
    events.push('wait');
    if (request.targets[0] !== 'child-01' || request.timeout_ms !== 300000) throw new Error('invalid wait request');
    return { status: 'done' };
  }
};
globalThis.notify = (value) => events.push('notify:' + value);
globalThis.text = (value) => events.push('text:' + value);
await import(pathToFileURL(process.argv[1]).href);
const expected = process.argv[2] === 'run' ? ['shell', 'spawn', 'notify', 'wait', 'text'] : ['shell', 'text'];
if (events.length !== expected.length || events.some((value, index) => !value.startsWith(expected[index]))) throw new Error('unexpected lifecycle: ' + JSON.stringify(events));
'@
    & node --input-type=module -e $runner $SourcePath $Mode
    Assert-Condition ($LASTEXITCODE -eq 0) "$Mode mocked source execution failed."
}

$brief = Get-Content -LiteralPath $briefPath -Raw -Encoding UTF8
$briefHash = (Get-FileHash -LiteralPath $briefPath -Algorithm SHA256).Hash
$fixtureBefore = Get-FixtureManifest -Root $fixtureRoot
$sourceFixture = Get-FixtureManifest -Root $sourceFixtureRoot
$probe = if (Test-Path -LiteralPath $probePath -PathType Leaf) { Get-Content -LiteralPath $probePath -Raw -Encoding UTF8 } else { $null }
$run = if (Test-Path -LiteralPath $runPath -PathType Leaf) { Get-Content -LiteralPath $runPath -Raw -Encoding UTF8 } else { $null }

$tests = @(
    @{ Name = 'fixture integrity'; Action = { Assert-Condition (($fixtureBefore -join "`n") -eq ($sourceFixture -join "`n")) 'v2.5 fixture is not byte-identical to v2.2 fixture.' } },
    @{ Name = 'node parse'; Action = {
        Assert-Condition ($null -ne $probe) 'probe-source.mjs is missing.'
        Assert-Condition ($null -ne $run) 'run-source.mjs is missing.'
        & node --check $probePath; Assert-Condition ($LASTEXITCODE -eq 0) 'probe node --check failed.'
        & node --check $runPath; Assert-Condition ($LASTEXITCODE -eq 0) 'run node --check failed.'
    } },
    @{ Name = 'source safety'; Action = {
        foreach ($source in @($probe, $run)) {
            Assert-Condition ($null -ne $source) 'A transport source is missing.'
            Assert-Condition ($source.IndexOf('[WORKER BRIEF]') -lt 0) 'Source embeds the Worker brief.'
            Assert-Condition ($source.IndexOf([char]92) -lt 0) 'Source contains a backslash.'
            Assert-Condition ($source.IndexOf([char]96) -lt 0) 'Source contains a JavaScript backtick.'
            Assert-Condition ($source.IndexOf('$' + '{') -lt 0) 'Source contains interpolation syntax.'
        }
    } },
    @{ Name = 'probe contract'; Action = {
        Assert-Condition ((Get-Count $probe 'tools.shell_command') -eq 1) 'Probe must call shell_command once.'
        Assert-Condition ((Get-Count $probe 'tools.multi_agent_v1__spawn_agent(') -eq 0) 'Probe must not spawn.'
        Assert-Condition ((Get-Count $probe 'tools.multi_agent_v1__wait_agent(') -eq 0) 'Probe must not wait.'
        Assert-Condition ((Get-Count $probe 'ALL_TOOLS') -ge 1) 'Probe must inspect ALL_TOOLS.'
        Assert-Condition ((Get-Count $probe 'typeof tools[name]') -eq 1) 'Probe must inspect required tool types.'
        Assert-Condition ((Get-Count $probe 'payload.sha256 !== expectedHash') -eq 1) 'Probe must validate the decoded hash.'
        Assert-Condition ((Get-Count $probe 'text(JSON.stringify') -eq 1) 'Probe must emit one result.'
    } },
    @{ Name = 'run contract'; Action = {
        Assert-Condition ((Get-Count $run 'tools.shell_command') -eq 1) 'Run must call shell_command once.'
        Assert-Condition ((Get-Count $run 'tools.multi_agent_v1__spawn_agent') -eq 1) 'Run must spawn once.'
        Assert-Condition ((Get-Count $run 'tools.multi_agent_v1__wait_agent') -eq 1) 'Run must wait once.'
        Assert-Condition ((Get-Count $run 'agent_type: "routine_worker"') -eq 1) 'Run role is missing.'
        Assert-Condition ((Get-Count $run 'fork_context: false') -eq 1) 'Run must not fork context.'
        Assert-Condition ((Get-Count $run 'message: payload.text') -eq 1) 'Run must send decoded brief text.'
        Assert-Condition ((Get-Count $run 'payload.sha256 !== expectedHash') -eq 1) 'Run must validate the decoded hash.'
        Assert-Condition ((Get-Count $run 'notify(JSON.stringify(child))') -eq 1) 'Run must notify once.'
        Assert-Condition ((Get-Count $run 'targets: [child.agent_id]') -eq 1) 'Run target is missing.'
        Assert-Condition ((Get-Count $run 'timeout_ms: 300000') -eq 1) 'Run timeout is missing.'
        Assert-Condition ((Get-Count $run 'text(JSON.stringify(waitResult))') -eq 1) 'Run must emit wait result.'
    } },
    @{ Name = 'mocked wrapper decode'; Action = {
        Invoke-MockedSource -SourcePath $probePath -Mode 'probe' -Brief $brief -BriefHash $briefHash
        Invoke-MockedSource -SourcePath $runPath -Mode 'run' -Brief $brief -BriefHash $briefHash
    } }
)

$failures = @()
foreach ($test in $tests) {
    try { & $test.Action } catch { $failures += "$($test.Name): $($_.Exception.Message)" }
}

[ordered]@{ status = if ($failures.Count -eq 0) { 'PASS' } else { 'FAIL' }; tests = $tests.Count; failures = [string[]]$failures } | ConvertTo-Json -Compress
if ($failures.Count -ne 0) { exit 1 }
