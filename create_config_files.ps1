# Create Configuration Files for AeroTrav

Write-Host "⚙️ Creating configuration files..." -ForegroundColor Cyan

# STEP 1: Create Root package.json
Write-Host "`n📦 Creating root package.json..." -ForegroundColor Green

@"
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
"@ | Out-File -FilePath "package.json" -Encoding UTF8

Write-Host "✅ Root package.json created" -ForegroundColor Gray

# STEP 2: Create Client package.json
Write-Host "`n📱 Creating client package.json..." -ForegroundColor Green

@"
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
"@ | Out-File -FilePath "apps\client\package.json" -Encoding UTF8

Write-Host "✅ Client package.json created" -ForegroundColor Gray

# STEP 3: Create Client Environment
Write-Host "`n🌐 Creating client environment..." -ForegroundColor Green

@"
VITE_API_URL=http://localhost:3001/api
VITE_AMADEUS_API_URL=https://test.api.amadeus.com
VITE_APP_NAME=AeroTrav
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
"@ | Out-File -FilePath "apps\client\.env.local" -Encoding UTF8

Write-Host "✅ Client environment created" -ForegroundColor Gray

# STEP 4: Create Server Environment (if not exists)
Write-Host "`n🔧 Creating server environment..." -ForegroundColor Green

if (-not (Test-Path "apps\server\.env")) {
@"
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
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret

# File Upload
MAX_FILE_SIZE=10mb
UPLOAD_PATH=./uploads

# Logging
LOG_LEVEL=debug
"@ | Out-File -FilePath "apps\server\.env" -Encoding UTF8

Write-Host "✅ Server environment created" -ForegroundColor Gray
} else {
    Write-Host "✅ Server environment already exists" -ForegroundColor Gray
}

# STEP 5: Create Development Scripts
Write-Host "`n🔧 Creating development scripts..." -ForegroundColor Green

@"
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
"@ | Out-File -FilePath "scripts\dev.ps1" -Encoding UTF8

@"
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
"@ | Out-File -FilePath "scripts\build.ps1" -Encoding UTF8

Write-Host "✅ Development scripts created" -ForegroundColor Gray

# STEP 6: Create Documentation
Write-Host "`n📚 Creating documentation..." -ForegroundColor Green

@"
# AeroTrav - Travel Booking Platform

## Overview
AeroTrav is a modern travel booking platform built with React, TypeScript, Node.js, and Express.

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MySQL  
- **Database**: MySQL with structured schema
- **APIs**: Amadeus API for flight data

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm

### Installation
```powershell
# Setup project
npm install

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
"@ | Out-File -FilePath "README.md" -Encoding UTF8

Write-Host "✅ README.md created" -ForegroundColor Gray

# STEP 7: Create .gitignore
Write-Host "`n🔐 Creating .gitignore..." -ForegroundColor Green

@"
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
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

Write-Host "✅ .gitignore created" -ForegroundColor Gray

Write-Host "`n🎉 Configuration files created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "✅ Project restructured with clean separation" -ForegroundColor White
Write-Host "✅ Frontend: apps/client (React + TypeScript)" -ForegroundColor White
Write-Host "✅ Backend: apps/server (Node.js + Express)" -ForegroundColor White
Write-Host "✅ Database: database/schema.sql" -ForegroundColor White
Write-Host "✅ Legacy files archived in legacy/" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "1. npm install" -ForegroundColor White
Write-Host "2. Configure your database connection in apps\server\.env" -ForegroundColor White
Write-Host "3. Import database\schema.sql to your MySQL database" -ForegroundColor White
Write-Host "4. .\scripts\dev.ps1" -ForegroundColor White
Write-Host "" 