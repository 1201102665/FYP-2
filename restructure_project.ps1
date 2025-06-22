# AeroTrav Project Restructuring Script
# Agent Executable Commands

Write-Host "🚀 Starting AeroTrav Project Restructuring..." -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Phase 1: Create Directory Structure
Write-Host "`n📁 Phase 1: Creating new directory structure..." -ForegroundColor Green

# Create main directories
$directories = @(
    "apps\client",
    "apps\server", 
    "database\migrations",
    "database\seeds",
    "docs",
    "scripts",
    "legacy\php-backend",
    "legacy\old-configs",
    ".github\workflows"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "✅ Created: $dir" -ForegroundColor Gray
}

# Phase 2: Move Frontend Files
Write-Host "`n📦 Phase 2: Moving frontend files..." -ForegroundColor Green

# Move React/TypeScript files
$frontendMoves = @{
    "src" = "apps\client\src"
    "public" = "apps\client\public" 
    "index.html" = "apps\client\index.html"
    "vite.config.ts" = "apps\client\vite.config.ts"
    "tailwind.config.ts" = "apps\client\tailwind.config.ts"
    "postcss.config.js" = "apps\client\postcss.config.js"
    "eslint.config.js" = "apps\client\eslint.config.js"
    "components.json" = "apps\client\components.json"
}

foreach ($item in $frontendMoves.GetEnumerator()) {
    if (Test-Path $item.Key) {
        Move-Item -Path $item.Key -Destination $item.Value -Force
        Write-Host "✅ Moved: $($item.Key) → $($item.Value)" -ForegroundColor Gray
    }
}

# Move TypeScript config files
$tsConfigs = @("tsconfig.json", "tsconfig.app.json", "tsconfig.node.json")
foreach ($config in $tsConfigs) {
    if (Test-Path $config) {
        Move-Item -Path $config -Destination "apps\client\$config" -Force
        Write-Host "✅ Moved: $config → apps\client\$config" -ForegroundColor Gray
    }
}

# Phase 3: Move Backend Files
Write-Host "`n🔧 Phase 3: Moving backend files..." -ForegroundColor Green

# Move server directory contents
if (Test-Path "server") {
    Get-ChildItem -Path "server\*" | Move-Item -Destination "apps\server\" -Force
    Remove-Item -Path "server" -Force
    Write-Host "✅ Moved: server contents → apps\server" -ForegroundColor Gray
}

# Phase 4: Database Organization
Write-Host "`n🗄️ Phase 4: Organizing database files..." -ForegroundColor Green

# Move main schema file
if (Test-Path "aerotrav_complete_schema.sql") {
    Move-Item -Path "aerotrav_complete_schema.sql" -Destination "database\schema.sql" -Force
    Write-Host "✅ Moved: aerotrav_complete_schema.sql → database\schema.sql" -ForegroundColor Gray
}

# Archive old SQL files
$oldSqlFiles = @("admin_setup.sql", "database_setup.sql", "database_schema.sql")
foreach ($file in $oldSqlFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "legacy\old-configs\$file" -Force
        Write-Host "✅ Archived: $file → legacy\old-configs\" -ForegroundColor Gray
    }
}

# Phase 5: Archive Legacy PHP Files
Write-Host "`n📋 Phase 5: Archiving legacy PHP files..." -ForegroundColor Green

# Move PHP directories
$phpDirs = @("api", "admin", "includes")
foreach ($dir in $phpDirs) {
    if (Test-Path $dir) {
        Move-Item -Path $dir -Destination "legacy\php-backend\$dir" -Force
        Write-Host "✅ Archived: $dir → legacy\php-backend\" -ForegroundColor Gray
    }
}

# Move PHP files
$phpFiles = Get-ChildItem -Path "*.php" -ErrorAction SilentlyContinue
foreach ($file in $phpFiles) {
    Move-Item -Path $file.FullName -Destination "legacy\php-backend\$($file.Name)" -Force
    Write-Host "✅ Archived: $($file.Name) → legacy\php-backend\" -ForegroundColor Gray
}

# Phase 6: Archive Old Scripts and Config Files
Write-Host "`n🔧 Phase 6: Archiving old scripts and configs..." -ForegroundColor Green

# Archive old batch files
$oldScripts = @("start-aerotrav.bat", "start-both-servers.bat", "start-dev.bat", "start-dev.ps1")
foreach ($script in $oldScripts) {
    if (Test-Path $script) {
        Move-Item -Path $script -Destination "legacy\old-configs\$script" -Force
        Write-Host "✅ Archived: $script → legacy\old-configs\" -ForegroundColor Gray
    }
}

# Archive old config files
$oldConfigs = @("db_config.php")
foreach ($config in $oldConfigs) {
    if (Test-Path $config) {
        Move-Item -Path $config -Destination "legacy\old-configs\$config" -Force
        Write-Host "✅ Archived: $config → legacy\old-configs\" -ForegroundColor Gray
    }
}

# Phase 7: Create New Configuration Files
Write-Host "`n⚙️ Phase 7: Creating new configuration files..." -ForegroundColor Green

# Create root package.json
$rootPackageJson = @'
{
  "name": "aerotrav-workspace",
  "private": true,
  "workspaces": [
    "apps/client",
    "apps/server"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "npm run dev --workspace=apps/client",
    "dev:server": "npm run dev --workspace=apps/server",
    "build": "npm run build --workspace=apps/client",
    "build:all": "npm run build --workspaces",
    "clean": "Remove-Item -Recurse -Force apps/*/node_modules, apps/*/dist -ErrorAction SilentlyContinue",
    "setup": "npm install && npm run setup --workspaces --if-present"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
'@

# Backup old package.json and create new one
if (Test-Path "package.json") {
    Move-Item -Path "package.json" -Destination "legacy\old-configs\package.json.old" -Force
}
$rootPackageJson | Out-File -FilePath "package.json" -Encoding UTF8
Write-Host "✅ Created: Root workspace package.json" -ForegroundColor Gray

# Create client package.json
$clientPackageJson = @'
{
  "name": "@aerotrav/client",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 5173",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.10",
    "@radix-ui/react-alert-dialog": "^1.1.13",
    "@radix-ui/react-aspect-ratio": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.9",
    "@radix-ui/react-checkbox": "^1.3.1",
    "@radix-ui/react-collapsible": "^1.1.10",
    "@radix-ui/react-context-menu": "^2.2.14",
    "@radix-ui/react-dialog": "^1.1.13",
    "@radix-ui/react-dropdown-menu": "^2.1.14",
    "@radix-ui/react-hover-card": "^1.1.13",
    "@radix-ui/react-label": "^2.1.6",
    "@radix-ui/react-menubar": "^1.1.14",
    "@radix-ui/react-navigation-menu": "^1.2.12",
    "@radix-ui/react-popover": "^1.1.13",
    "@radix-ui/react-progress": "^1.1.6",
    "@radix-ui/react-radio-group": "^1.3.6",
    "@radix-ui/react-scroll-area": "^1.2.8",
    "@radix-ui/react-select": "^2.2.4",
    "@radix-ui/react-separator": "^1.1.6",
    "@radix-ui/react-slider": "^1.3.4",
    "@radix-ui/react-slot": "^1.2.2",
    "@radix-ui/react-switch": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.11",
    "@radix-ui/react-toast": "^1.2.13",
    "@radix-ui/react-toggle": "^1.1.8",
    "@radix-ui/react-toggle-group": "^1.1.9",
    "@radix-ui/react-tooltip": "^1.2.6",
    "@tanstack/react-query": "^5.56.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.507.0",
    "motion": "^12.9.7",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.56.2",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.26.2",
    "recharts": "^2.15.3",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.2",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@tailwindcss/typography": "^0.5.15",
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.0.1",
    "vite": "^5.4.1"
  }
}
'@
$clientPackageJson | Out-File -FilePath "apps\client\package.json" -Encoding UTF8
Write-Host "✅ Created: Client package.json" -ForegroundColor Gray

# Create server package.json (use existing one if available)
if (Test-Path "apps\server\package.json") {
    Write-Host "✅ Server package.json already exists" -ForegroundColor Gray
} else {
    $serverPackageJson = @'
{
  "name": "@aerotrav/server",
  "version": "1.0.0",
  "description": "AeroTrav Node.js Express Backend API",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js --watch . --ext js,json",
    "build": "echo 'No build step needed for Node.js'",
    "test": "jest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {

    "axios": "^1.7.2",
    "bcryptjs": "^2.4.3",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^4.19.2",
    "express-rate-limit": "^7.3.1",
    "express-validator": "^7.1.0",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.10.2",
    "node-cron": "^3.0.3",
    "node-fetch": "^3.3.2",
    "uuid": "^10.0.0"
  },
  "devDependencies": {
    "eslint": "^9.6.0",
    "jest": "^29.7.0",
    "nodemon": "^3.1.4",
    "supertest": "^7.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
'@
    $serverPackageJson | Out-File -FilePath "apps\server\package.json" -Encoding UTF8
    Write-Host "✅ Created: Server package.json" -ForegroundColor Gray
}

# Phase 8: Create Development Scripts
Write-Host "`n🔧 Phase 8: Creating development scripts..." -ForegroundColor Green

# Create development script
$devScript = @'
#!/usr/bin/env pwsh
Write-Host "🚀 Starting AeroTrav Development Environment..." -ForegroundColor Cyan

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start both client and server concurrently
Write-Host "🌟 Starting development servers..." -ForegroundColor Green
npx concurrently `
  "cd apps/client && npm run dev" `
  "cd apps/server && npm run dev" `
  --names "CLIENT,SERVER" `
  --prefix-colors "cyan,yellow" `
  --kill-others-on-fail
'@
$devScript | Out-File -FilePath "scripts\dev.ps1" -Encoding UTF8
Write-Host "✅ Created: scripts\dev.ps1" -ForegroundColor Gray

# Create build script
$buildScript = @'
#!/usr/bin/env pwsh
Write-Host "🏗️ Building AeroTrav for Production..." -ForegroundColor Cyan

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build client
Write-Host "📦 Building client..." -ForegroundColor Green
Set-Location "apps\client"
npm run build
Set-Location "..\..\"

# Copy client build to server public folder
Write-Host "📁 Copying build files..." -ForegroundColor Green
if (Test-Path "apps\server\public") {
    Remove-Item -Recurse -Force "apps\server\public\*"
} else {
    New-Item -ItemType Directory -Path "apps\server\public" -Force | Out-Null
}
Copy-Item -Recurse -Path "apps\client\dist\*" -Destination "apps\server\public\"

Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host "📁 Client built and copied to server/public/" -ForegroundColor Gray
'@
$buildScript | Out-File -FilePath "scripts\build.ps1" -Encoding UTF8
Write-Host "✅ Created: scripts\build.ps1" -ForegroundColor Gray

# Create setup script
$setupScript = @'
#!/usr/bin/env pwsh
Write-Host "⚙️ Setting up AeroTrav Development Environment..." -ForegroundColor Cyan

# Install workspace dependencies
Write-Host "📦 Installing workspace dependencies..." -ForegroundColor Yellow
npm install

# Create environment files if they don't exist
Write-Host "🔧 Setting up environment files..." -ForegroundColor Green

# Client environment
if (-not (Test-Path "apps\client\.env.local")) {
    $clientEnv = @'
VITE_API_URL=http://localhost:3001/api
# Amadeus API removed - using MySQL database instead
VITE_APP_NAME=AeroTrav
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
'@
    $clientEnv | Out-File -FilePath "apps\client\.env.local" -Encoding UTF8
    Write-Host "✅ Created: apps\client\.env.local" -ForegroundColor Gray
}

# Server environment
if (-not (Test-Path "apps\server\.env")) {
    $serverEnv = @'
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# CORS Settings
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=aerotrav
DB_USERNAME=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# API Keys
# Amadeus API removed - using MySQL database for real flight data

# File Upload
MAX_FILE_SIZE=10mb
UPLOAD_PATH=./uploads

# Logging
LOG_LEVEL=debug
'@
    $serverEnv | Out-File -FilePath "apps\server\.env" -Encoding UTF8
    Write-Host "✅ Created: apps\server\.env" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update environment files with your configuration" -ForegroundColor White
Write-Host "2. Set up your database using: database\schema.sql" -ForegroundColor White
Write-Host "3. Start development: .\scripts\dev.ps1" -ForegroundColor White
Write-Host ""
'@
$setupScript | Out-File -FilePath "scripts\setup.ps1" -Encoding UTF8
Write-Host "✅ Created: scripts\setup.ps1" -ForegroundColor Gray

# Phase 9: Create Documentation
Write-Host "`n📚 Phase 9: Creating documentation..." -ForegroundColor Green

# Create main README
$mainReadme = @'
# AeroTrav - Travel Booking Platform

## Overview
AeroTrav is a modern travel booking platform built with React, TypeScript, Node.js, and Express.

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MySQL  
- **Database**: MySQL with structured schema
- **APIs**: MySQL database for flight data

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm

### Installation
```powershell
# Setup project
.\scripts\setup.ps1

# Setup database (configure your MySQL connection first)
# Import database\schema.sql into your MySQL database

# Start development
.\scripts\dev.ps1
```

## Project Structure
```
apps/
├── client/          # React frontend
└── server/          # Node.js backend
database/            # Database schema and migrations
docs/               # Documentation
scripts/            # Build and deployment scripts
legacy/             # Archived legacy files
```

## Development
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Scripts
- `.\scripts\setup.ps1` - Initial project setup
- `.\scripts\dev.ps1` - Start development servers
- `.\scripts\build.ps1` - Build for production

## Environment Configuration
Update the following files with your settings:
- `apps\client\.env.local` - Frontend environment variables
- `apps\server\.env` - Backend environment variables

## Contributing
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
'@
$mainReadme | Out-File -FilePath "README.md" -Encoding UTF8 -Force
Write-Host "✅ Created: README.md" -ForegroundColor Gray

# Create API documentation
$apiDocs = @'
# AeroTrav API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://yourdomain.com/api`

## Authentication
Most endpoints require JWT authentication:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Flights
- `GET /flights/search` - Search flights
- `GET /flights/browse` - Browse available flights
- `GET /flights/:id` - Get flight details

### Hotels
- `GET /hotels/search` - Search hotels
- `GET /hotels/:id` - Get hotel details

### Cars
- `GET /cars/search` - Search rental cars
- `GET /cars/:id` - Get car details

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - Get user bookings
- `GET /bookings/:id` - Get booking details

### Cart
- `POST /cart/add` - Add item to cart
- `GET /cart` - Get cart contents
- `DELETE /cart/:id` - Remove from cart

## Error Handling
All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```
'@
$apiDocs | Out-File -FilePath "docs\API_DOCUMENTATION.md" -Encoding UTF8
Write-Host "✅ Created: docs\API_DOCUMENTATION.md" -ForegroundColor Gray

# Phase 10: Create Updated .gitignore
Write-Host "`n🔐 Phase 10: Creating updated .gitignore..." -ForegroundColor Green

$gitignore = @'
# Dependencies
**/node_modules/
npm-debug.log*
yarn-error.log*

# Build outputs
**/dist/
**/build/
apps/client/dist/

# Environment files
**/.env
**/.env.local
**/.env.production
!**/.env.example

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
logs/
*.log.*

# Database
*.sqlite
*.db

# Legacy (archived files)
legacy/

# Temporary files
tmp/
temp/
.cache/

# Testing
coverage/
.nyc_output/

# Runtime
*.pid
*.seed
*.pid.lock

# Documentation markdown files (keep only main README)
FINAL_FIX.md
FLIGHT_API_STATUS.md
'@

# Backup old gitignore and create new one
if (Test-Path ".gitignore") {
    Move-Item -Path ".gitignore" -Destination "legacy\old-configs\.gitignore.old" -Force
}
$gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8
Write-Host "✅ Created: Updated .gitignore" -ForegroundColor Gray

# Phase 11: Cleanup
Write-Host "`n🧹 Phase 11: Final cleanup..." -ForegroundColor Green

# Remove documentation files that are now consolidated
$docsToRemove = @("FINAL_FIX.md", "FLIGHT_API_STATUS.md")
foreach ($doc in $docsToRemove) {
    if (Test-Path $doc) {
        Remove-Item -Path $doc -Force
        Write-Host "✅ Removed: $doc (consolidated into docs/)" -ForegroundColor Gray
    }
}

# Remove old node_modules and package-lock if they exist at root
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ Removed: Old node_modules (will be recreated)" -ForegroundColor Gray
}

if (Test-Path "package-lock.json") {
    Move-Item -Path "package-lock.json" -Destination "legacy\old-configs\package-lock.json.old" -Force
    Write-Host "✅ Archived: package-lock.json" -ForegroundColor Gray
}

# Remove dist folder if it exists
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Removed: dist folder (will be recreated during build)" -ForegroundColor Gray
}

Write-Host "`n🎉 Project restructuring complete!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary of changes:" -ForegroundColor Cyan
Write-Host "✅ Created organized directory structure" -ForegroundColor White
Write-Host "✅ Separated frontend (apps/client) and backend (apps/server)" -ForegroundColor White
Write-Host "✅ Archived legacy PHP files in legacy/" -ForegroundColor White
Write-Host "✅ Consolidated database files in database/" -ForegroundColor White
Write-Host "✅ Created development and build scripts" -ForegroundColor White
Write-Host "✅ Updated configuration files" -ForegroundColor White
Write-Host "✅ Created comprehensive documentation" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: .\scripts\setup.ps1" -ForegroundColor White
Write-Host "2. Configure your environment files" -ForegroundColor White
Write-Host "3. Set up your database using database\schema.sql" -ForegroundColor White
Write-Host "4. Start development: .\scripts\dev.ps1" -ForegroundColor White
Write-Host ""
Write-Host "📁 New project structure:" -ForegroundColor Cyan
Write-Host "   apps/client/     - React frontend" -ForegroundColor White
Write-Host "   apps/server/     - Node.js backend" -ForegroundColor White
Write-Host "   database/        - Database files" -ForegroundColor White
Write-Host "   docs/           - Documentation" -ForegroundColor White
Write-Host "   scripts/        - Development scripts" -ForegroundColor White
Write-Host "   legacy/         - Archived files" -ForegroundColor White
Write-Host "" 