# start_local.ps1
# Script untuk menjalankan web server lokal (localhost:3000)

Write-Host "Memulai Local Server di port 3000..." -ForegroundColor Green
Write-Host "Akses aplikasi di: http://localhost:3000" -ForegroundColor Yellow

# Menjalankan Python Simple HTTP Server
python -m http.server 3000
