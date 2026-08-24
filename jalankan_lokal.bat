@echo off
echo ========================================================
echo Memulai Server Lokal untuk e-Lapak (Port 3000)
echo ========================================================
echo.
echo Pastikan Anda belum menjalankan server lokal lain di port ini.
echo Browser akan segera terbuka otomatis...
echo.
start http://localhost:3000
python -m http.server 3000
pause
