# deploy.ps1
# Script untuk mengunggah update ke server via SCP

param (
    [string]$Username = "deamok",
    [string]$ServerIP = "192.168.1.12",
    [string]$RemotePath = "/home/deamok/e-lapak" # Gunakan folder home pengguna
)

Write-Host "Mulai mengunggah file ke $ServerIP..." -ForegroundColor Cyan

Write-Host "1. Membuat folder tujuan di server..." -ForegroundColor Yellow
ssh "${Username}@${ServerIP}" "mkdir -p ${RemotePath}"

Write-Host "2. Mengunggah file (Secure Copy)..." -ForegroundColor Yellow
# Menggunakan ./* agar isi folder yang dicopy
scp -r ./* "${Username}@${ServerIP}:${RemotePath}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "2. Menjalankan Docker Compose di server..." -ForegroundColor Yellow
    ssh -t "${Username}@${ServerIP}" "cd ${RemotePath} && docker compose up -d --build --force-recreate"
    Write-Host "Deploy via Docker berhasil!" -ForegroundColor Green
} else {
    Write-Host "Terjadi kesalahan saat upload file." -ForegroundColor Red
}
