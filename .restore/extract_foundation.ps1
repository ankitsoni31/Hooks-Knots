# Extract ONLY from conversation 5392cb45 (Step 1 Foundation)
# This is the TRUE pre-Phase 2 state

$outputDir = "d:\Hooks x Knots\.restore\files"
Remove-Item -Path $outputDir -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$fileContents = @{}

$transcript = "C:\Users\ankit\.gemini\antigravity-ide\brain\5392cb45-8e44-4910-aecf-2a51d2ced31c\.system_generated\logs\transcript_full.jsonl"
$lines = Get-Content $transcript

Write-Host "=== Extracting from 5392cb45 (Foundation ONLY) - $($lines.Count) lines ==="

# Pass 1: Collect all write_to_file
foreach($line in $lines) {
    $obj = $line | ConvertFrom-Json -ErrorAction SilentlyContinue
    if(-not $obj -or -not $obj.tool_calls) { continue }
    
    foreach($tc in $obj.tool_calls) {
        $tf = $tc.args.TargetFile
        if(-not $tf -or $tf -notmatch "d:\\Hooks") { continue }
        
        if($tc.name -eq "write_to_file" -and $tc.args.CodeContent) {
            $fileContents[$tf] = $tc.args.CodeContent
            Write-Host "  [WRITE] Step $($obj.step_index): $tf"
        }
    }
}

# Pass 2: Apply replace_file_content patches
Write-Host "`n=== Applying patches ==="
$patchCount = 0
$missCount = 0

foreach($line in $lines) {
    $obj = $line | ConvertFrom-Json -ErrorAction SilentlyContinue
    if(-not $obj -or -not $obj.tool_calls) { continue }
    
    foreach($tc in $obj.tool_calls) {
        $tf = $tc.args.TargetFile
        if(-not $tf -or $tf -notmatch "d:\\Hooks") { continue }
        
        $chunks = @()
        if($tc.name -eq "replace_file_content" -and $tc.args.TargetContent) {
            $chunks += @{ Target = $tc.args.TargetContent; Replace = $tc.args.ReplacementContent }
        }
        if($tc.name -eq "multi_replace_file_content" -and $tc.args.ReplacementChunks) {
            foreach($chunk in $tc.args.ReplacementChunks) {
                if($chunk.TargetContent) {
                    $chunks += @{ Target = $chunk.TargetContent; Replace = $chunk.ReplacementContent }
                }
            }
        }
        
        foreach($chunk in $chunks) {
            if($fileContents.ContainsKey($tf)) {
                $content = $fileContents[$tf]
                if($content.Contains($chunk.Target)) {
                    $fileContents[$tf] = $content.Replace($chunk.Target, $chunk.Replace)
                    $patchCount++
                    Write-Host "  [PATCH] Step $($obj.step_index): $tf"
                } else {
                    $missCount++
                    Write-Host "  [MISS] Step $($obj.step_index): $tf"
                }
            }
        }
    }
}

Write-Host "`n  Applied: $patchCount, Missed: $missCount"

# Save all files
Write-Host "`n=== Saving $($fileContents.Count) files ==="
foreach($kv in $fileContents.GetEnumerator()) {
    $relativePath = $kv.Key -replace '^d:\\Hooks x Knots\\', ''
    $relativePath = $relativePath -replace '/', '\'
    $outputPath = Join-Path $outputDir $relativePath
    $dir = Split-Path $outputPath -Parent
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    [System.IO.File]::WriteAllText($outputPath, $kv.Value, [System.Text.Encoding]::UTF8)
    $size = (Get-Item $outputPath).Length
    Write-Host "  $relativePath ($size bytes)"
}

Write-Host "`nTotal files: $($fileContents.Count)"
