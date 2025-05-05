# Ensure .nvmrc exists
if (-not (Test-Path ".nvmrc")) {
    Write-Host ".nvmrc not found"
    exit
}

# Read the target Node.js version from .nvmrc
$targetNodeVersion = Get-Content ".nvmrc" | Out-String
$targetNodeVersion = $targetNodeVersion.Trim()

# Get the current Node.js version
try {
    $currentNodeVersion = node -v 2>$null
    $currentNodeVersion = $currentNodeVersion.TrimStart("v")
} catch {
    $currentNodeVersion = $null
}

# Save current global npm packages with versions (handling Windows compatibility)
if ($currentNodeVersion) {
    Write-Host "Saving current global npm packages for Node $currentNodeVersion..."
    $globalPackages = npm list -g --depth=0 --json | ConvertFrom-Json
    $globalPackages.dependencies.GetEnumerator() | ForEach-Object {
        "$($_.Key)@$($_.Value.version)"
    } | Set-Content "globals-$currentNodeVersion.txt"
} else {
    Write-Host "No active Node version detected — skipping save."
}

# Switch to the target Node version
Write-Host "Switching to Node.js $targetNodeVersion..."
nvm use $targetNodeVersion

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to switch Node version."
    exit
}

# Restore global npm packages if saved list exists
$globalsFile = "globals-$targetNodeVersion.txt"
if (Test-Path $globalsFile) {
    Write-Host "Restoring global npm packages for Node $targetNodeVersion..."
    Get-Content $globalsFile | ForEach-Object {
        Write-Host "Installing $_..."
        npm install -g $_
    }
} else {
    Write-Host "No $globalsFile found — skipping global npm install."
}
