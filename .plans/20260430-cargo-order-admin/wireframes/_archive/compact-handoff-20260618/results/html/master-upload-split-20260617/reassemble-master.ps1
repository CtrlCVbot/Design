$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $dir 'cargo-order-admin-hifi-master.reassembled.html'
$parts = Get-ChildItem -LiteralPath $dir -Filter 'cargo-order-admin-hifi-master.part*.html.txt' | Sort-Object Name
$writer = [System.IO.StreamWriter]::new($out, $false, [System.Text.UTF8Encoding]::new($false))
try {
  foreach ($part in $parts) {
    $writer.Write([System.IO.File]::ReadAllText($part.FullName, [System.Text.UTF8Encoding]::new($false)))
  }
}
finally {
  $writer.Dispose()
}
Write-Host "Reassembled: $out"
