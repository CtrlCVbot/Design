param(
    [Parameter(Mandatory = $true)]
    [string]$OutputRoot
)

$ErrorActionPreference = 'Stop'

$expectedFiles = @(
    '01-decision.md',
    '02-scope.md',
    '03-evidence-matrix.md',
    '04-risk-register.md',
    '05-rollout.md'
)

$requiredByFile = [ordered]@{
    '01-decision.md' = @('DEC-01', 'Option B', './02-scope.md')
    '02-scope.md' = @('PROD-01', 'PROD-02', 'REQ-01', 'REQ-02', 'CON-01', './03-evidence-matrix.md')
    '03-evidence-matrix.md' = @('PROD-01', 'PROD-02', 'REQ-01', 'REQ-02', 'ARCH-01', 'ARCH-02', 'DEC-01', 'CON-01', 'RISK-01', 'RISK-02', 'GATE-01', 'GATE-02', 'GATE-03', './04-risk-register.md')
    '04-risk-register.md' = @('RISK-01', 'RISK-02', 'manifest', 'pre/post hash', './05-rollout.md')
    '05-rollout.md' = @('GATE-01', 'GATE-02', 'GATE-03', 'rollback', './01-decision.md')
}

$errors = [Collections.Generic.List[string]]::new()
if (-not (Test-Path -LiteralPath $OutputRoot -PathType Container)) {
    $errors.Add('Output directory is missing.')
}
else {
    $actualFiles = @(Get-ChildItem -LiteralPath $OutputRoot -File | Select-Object -ExpandProperty Name | Sort-Object)
    $expectedSorted = @($expectedFiles | Sort-Object)
    if (($actualFiles -join '|') -ne ($expectedSorted -join '|')) {
        $errors.Add('Output must contain exactly the five expected Markdown files.')
    }

    foreach ($fileName in $expectedFiles) {
        $path = Join-Path $OutputRoot $fileName
        if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { continue }
        $content = Get-Content -LiteralPath $path -Raw -Encoding UTF8
        foreach ($required in $requiredByFile[$fileName]) {
            if ($content.IndexOf($required, [StringComparison]::OrdinalIgnoreCase) -lt 0) {
                $errors.Add("$fileName is missing $required.")
            }
        }
    }
}

[ordered]@{
    status = if ($errors.Count -eq 0) { 'PASS' } else { 'FAIL' }
    files = if (Test-Path -LiteralPath $OutputRoot -PathType Container) { @(Get-ChildItem -LiteralPath $OutputRoot -File).Count } else { 0 }
    errors = [string[]]$errors
} | ConvertTo-Json -Compress
