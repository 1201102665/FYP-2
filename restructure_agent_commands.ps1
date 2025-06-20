# AeroTrav Project Restructuring - Agent Commands
# Execute these commands step by step

Write-Host "🚀 Starting AeroTrav Project Restructuring..." -ForegroundColor Cyan

# STEP 1: Create Directory Structure
Write-Host "`n📁 STEP 1: Creating directories..." -ForegroundColor Green
New-Item -ItemType Directory -Path "apps" -Force | Out-Null
New-Item -ItemType Directory -Path "apps\client" -Force | Out-Null
New-Item -ItemType Directory -Path "apps\server" -Force | Out-Null
New-Item -ItemType Directory -Path "database" -Force | Out-Null
New-Item -ItemType Directory -Path "database\migrations" -Force | Out-Null
New-Item -ItemType Directory -Path "database\seeds" -Force | Out-Null
New-Item -ItemType Directory -Path "docs" -Force | Out-Null
New-Item -ItemType Directory -Path "scripts" -Force | Out-Null
New-Item -ItemType Directory -Path "legacy" -Force | Out-Null
New-Item -ItemType Directory -Path "legacy\php-backend" -Force | Out-Null
New-Item -ItemType Directory -Path "legacy\old-configs" -Force | Out-Null

Write-Host "✅ Directories created" -ForegroundColor Gray

# STEP 2: Move Frontend Files
Write-Host "`n📦 STEP 2: Moving frontend files..." -ForegroundColor Green

if (Test-Path "src") { Move-Item "src" "apps\client\src" -Force }
if (Test-Path "public") { Move-Item "public" "apps\client\public" -Force }
if (Test-Path "index.html") { Move-Item "index.html" "apps\client\index.html" -Force }
if (Test-Path "vite.config.ts") { Move-Item "vite.config.ts" "apps\client\vite.config.ts" -Force }
if (Test-Path "tailwind.config.ts") { Move-Item "tailwind.config.ts" "apps\client\tailwind.config.ts" -Force }
if (Test-Path "postcss.config.js") { Move-Item "postcss.config.js" "apps\client\postcss.config.js" -Force }
if (Test-Path "eslint.config.js") { Move-Item "eslint.config.js" "apps\client\eslint.config.js" -Force }
if (Test-Path "components.json") { Move-Item "components.json" "apps\client\components.json" -Force }
if (Test-Path "tsconfig.json") { Move-Item "tsconfig.json" "apps\client\tsconfig.json" -Force }
if (Test-Path "tsconfig.app.json") { Move-Item "tsconfig.app.json" "apps\client\tsconfig.app.json" -Force }
if (Test-Path "tsconfig.node.json") { Move-Item "tsconfig.node.json" "apps\client\tsconfig.node.json" -Force }

Write-Host "✅ Frontend files moved" -ForegroundColor Gray

# STEP 3: Move Backend Files
Write-Host "`n🔧 STEP 3: Moving backend files..." -ForegroundColor Green

if (Test-Path "server") {
    Get-ChildItem "server\*" | ForEach-Object { Move-Item $_.FullName "apps\server\" -Force }
    Remove-Item "server" -Force
}

Write-Host "✅ Backend files moved" -ForegroundColor Gray

# STEP 4: Organize Database Files
Write-Host "`n🗄️ STEP 4: Organizing database files..." -ForegroundColor Green

if (Test-Path "aerotrav_complete_schema.sql") { Move-Item "aerotrav_complete_schema.sql" "database\schema.sql" -Force }
if (Test-Path "admin_setup.sql") { Move-Item "admin_setup.sql" "legacy\old-configs\admin_setup.sql" -Force }
if (Test-Path "database_setup.sql") { Move-Item "database_setup.sql" "legacy\old-configs\database_setup.sql" -Force }
if (Test-Path "database_schema.sql") { Move-Item "database_schema.sql" "legacy\old-configs\database_schema.sql" -Force }

Write-Host "✅ Database files organized" -ForegroundColor Gray

# STEP 5: Archive Legacy PHP Files
Write-Host "`n📋 STEP 5: Archiving PHP files..." -ForegroundColor Green

if (Test-Path "api") { Move-Item "api" "legacy\php-backend\api" -Force }
if (Test-Path "admin") { Move-Item "admin" "legacy\php-backend\admin" -Force }
if (Test-Path "includes") { Move-Item "includes" "legacy\php-backend\includes" -Force }

# Move PHP files
Get-ChildItem "*.php" -ErrorAction SilentlyContinue | ForEach-Object {
    Move-Item $_.FullName "legacy\php-backend\$($_.Name)" -Force
}

Write-Host "✅ PHP files archived" -ForegroundColor Gray

# STEP 6: Archive Old Scripts
Write-Host "`n🔧 STEP 6: Archiving old scripts..." -ForegroundColor Green

if (Test-Path "start-aerotrav.bat") { Move-Item "start-aerotrav.bat" "legacy\old-configs\" -Force }
if (Test-Path "start-both-servers.bat") { Move-Item "start-both-servers.bat" "legacy\old-configs\" -Force }
if (Test-Path "start-dev.bat") { Move-Item "start-dev.bat" "legacy\old-configs\" -Force }
if (Test-Path "start-dev.ps1") { Move-Item "start-dev.ps1" "legacy\old-configs\" -Force }
if (Test-Path "db_config.php") { Move-Item "db_config.php" "legacy\old-configs\" -Force }

Write-Host "✅ Old scripts archived" -ForegroundColor Gray

# STEP 7: Backup and Remove Old Files
Write-Host "`n🧹 STEP 7: Cleaning up..." -ForegroundColor Green

if (Test-Path "package.json") { Move-Item "package.json" "legacy\old-configs\package.json.old" -Force }
if (Test-Path "package-lock.json") { Move-Item "package-lock.json" "legacy\old-configs\package-lock.json.old" -Force }
if (Test-Path "node_modules") { Remove-Item "node_modules" -Recurse -Force }
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }
if (Test-Path "FINAL_FIX.md") { Remove-Item "FINAL_FIX.md" -Force }
if (Test-Path "FLIGHT_API_STATUS.md") { Remove-Item "FLIGHT_API_STATUS.md" -Force }
if (Test-Path ".gitignore") { Move-Item ".gitignore" "legacy\old-configs\.gitignore.old" -Force }

Write-Host "✅ Cleanup completed" -ForegroundColor Gray

Write-Host "`n🎉 Phase 1 Complete!" -ForegroundColor Green
Write-Host "Run the setup script next: .\create_config_files.ps1" -ForegroundColor Cyan 