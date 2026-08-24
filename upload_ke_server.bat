@echo off
echo ========================================================
echo MENGUNGGAH PEMBARUAN KE SERVER (IP: 192.168.1.12)
echo ========================================================
echo.
echo Pastikan koneksi ZeroTier Anda aktif dan berjalan lancar.
echo Proses unggah akan memakan waktu beberapa saat...
echo.
python deploy.py
echo.
echo ========================================================
echo Proses selesai! Tekan tombol apa saja untuk keluar.
echo ========================================================
pause
