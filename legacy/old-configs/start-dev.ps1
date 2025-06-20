Write-Host "Starting AeroTrav Development Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Installing dependencies (if needed)..." -ForegroundColor Yellow
npm install
Write-Host ""
Write-Host "Starting Vite development server on http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""
npm run dev 