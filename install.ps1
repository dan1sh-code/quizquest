Write-Host ""
Write-Host "========================================================"
Write-Host "   QuizQuest - Auto Installer (PowerShell)"
Write-Host "   Laravel 12 + Inertia.js + React 18 + Tailwind v4"
Write-Host "========================================================"
Write-Host ""

# Check requirements
if (-not (Get-Command "php" -ErrorAction SilentlyContinue)) { Write-Error "PHP tidak ditemukan. Install PHP 8.2+ terlebih dahulu."; exit 1 }
if (-not (Get-Command "composer" -ErrorAction SilentlyContinue)) { Write-Error "Composer tidak ditemukan."; exit 1 }
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) { Write-Error "Node.js/npm tidak ditemukan."; exit 1 }
if (-not (Get-Command "mysql" -ErrorAction SilentlyContinue)) { Write-Host "WARNING: MySQL CLI tidak ditemukan, pastikan MySQL service berjalan." }

Write-Host "Requirements check OK`n"

# .env setup
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host ".env dibuat dari .env.example"
    } else {
        Write-Host "WARNING: .env.example tidak ditemukan!"
    }
}

# Install dependencies first in case artisan is missing
Write-Host "`nInstalling PHP dependencies..."
composer install --optimize-autoloader --no-interaction --ignore-platform-req=ext-gd

# App key
if (Test-Path "artisan") {
    php artisan key:generate --ansi
    Write-Host "App key generated`n"
} else {
    Write-Host "WARNING: File 'artisan' tidak ditemukan. Pastikan project Laravel sudah lengkap."
}

# Prompt DB credentials
Write-Host "Konfigurasi Database MySQL:"
$DB_HOST = Read-Host "   DB Host [127.0.0.1]"
if ([string]::IsNullOrWhiteSpace($DB_HOST)) { $DB_HOST = "127.0.0.1" }

$DB_PORT = Read-Host "   DB Port [3306]"
if ([string]::IsNullOrWhiteSpace($DB_PORT)) { $DB_PORT = "3306" }

$DB_NAME = Read-Host "   DB Name [quizquest]"
if ([string]::IsNullOrWhiteSpace($DB_NAME)) { $DB_NAME = "quizquest" }

$DB_USER = Read-Host "   DB Username [root]"
if ([string]::IsNullOrWhiteSpace($DB_USER)) { $DB_USER = "root" }

$DB_PASS = Read-Host -AsSecureString "   DB Password"
$DB_PASS_PLAIN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASS))
Write-Host ""

# Update .env
if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace "^DB_HOST=.*", "DB_HOST=$DB_HOST"
    $envContent = $envContent -replace "^DB_PORT=.*", "DB_PORT=$DB_PORT"
    $envContent = $envContent -replace "^DB_DATABASE=.*", "DB_DATABASE=$DB_NAME"
    $envContent = $envContent -replace "^DB_USERNAME=.*", "DB_USERNAME=$DB_USER"
    $envContent = $envContent -replace "^DB_PASSWORD=.*", "DB_PASSWORD=$DB_PASS_PLAIN"
    Set-Content -Path ".env" -Value $envContent
    Write-Host ".env database dikonfigurasi`n"
}

# Try create database
try {
    # Only run if mysql is available
    if (Get-Command "mysql" -ErrorAction SilentlyContinue) {
        $mysqlCmd = "CREATE DATABASE IF NOT EXISTS \`"$DB_NAME\`" CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS_PLAIN -e $mysqlCmd 2>$null
        Write-Host "Database '$DB_NAME' siap (atau sudah ada)"
    } else {
        Write-Host "Buat database '$DB_NAME' secara manual di MySQL"
    }
} catch {
    Write-Host "Gagal membuat database '$DB_NAME' secara otomatis, pastikan sudah ada di MySQL"
}

if (Test-Path "artisan") {
    Write-Host "Publishing vendor files..."
    php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --quiet

    Write-Host "`nRunning migrations..."
    php artisan migrate:fresh --force

    Write-Host "`nSeeding database..."
    php artisan db:seed --force

    Write-Host "`nCreating storage link..."
    php artisan storage:link
}

Write-Host "`nInstalling NPM dependencies..."
npm install --legacy-peer-deps

Write-Host "`nBuilding assets..."
npm run build

if (Test-Path "artisan") {
    Write-Host "`nOptimizing..."
    php artisan optimize
}

Write-Host "`n========================================================"
Write-Host "   QuizQuest selesai diinstall!"
Write-Host ""
Write-Host "   Jalankan: php artisan serve"
Write-Host "   Buka: http://localhost:8000"
Write-Host ""
Write-Host "   Login:"
Write-Host "   Admin  -> admin@quizquest.id  / password123"
Write-Host "   Guru   -> guru@quizquest.id   / password123"
Write-Host "   Murid  -> murid@quizquest.id  / password123"
Write-Host "========================================================"
