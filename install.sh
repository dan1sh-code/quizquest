#!/bin/bash
set -e

echo ""
echo "🎯 ======================================================"
echo "   QuizQuest — Auto Installer"
echo "   Laravel 12 + Inertia.js + React 18 + Tailwind v4"
echo "========================================================"
echo ""

# Check requirements
command -v php   >/dev/null 2>&1 || { echo "❌ PHP tidak ditemukan. Install PHP 8.2+ terlebih dahulu."; exit 1; }
command -v composer >/dev/null 2>&1 || { echo "❌ Composer tidak ditemukan."; exit 1; }
command -v npm   >/dev/null 2>&1 || { echo "❌ Node.js/npm tidak ditemukan."; exit 1; }
command -v mysql >/dev/null 2>&1 || { echo "⚠️  MySQL CLI tidak ditemukan, pastikan MySQL service berjalan."; }

echo "✅ Requirements check OK"
echo ""

# .env setup
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env dibuat dari .env.example"
fi

# App key
php artisan key:generate --ansi
echo "✅ App key generated"

# Prompt DB credentials
echo ""
echo "📦 Konfigurasi Database MySQL:"
read -p "   DB Host [127.0.0.1]: " DB_HOST
DB_HOST=${DB_HOST:-127.0.0.1}
read -p "   DB Port [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}
read -p "   DB Name [quizquest]: " DB_NAME
DB_NAME=${DB_NAME:-quizquest}
read -p "   DB Username [root]: " DB_USER
DB_USER=${DB_USER:-root}
read -s -p "   DB Password: " DB_PASS
echo ""

# Update .env
sed -i "s|DB_HOST=.*|DB_HOST=$DB_HOST|g" .env
sed -i "s|DB_PORT=.*|DB_PORT=$DB_PORT|g" .env
sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_NAME|g" .env
sed -i "s|DB_USERNAME=.*|DB_USERNAME=$DB_USER|g" .env
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=$DB_PASS|g" .env

echo "✅ .env database dikonfigurasi"

# Try create database
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null && echo "✅ Database '$DB_NAME' siap" || echo "⚠️  Pastikan database '$DB_NAME' sudah ada di MySQL"

echo ""
echo "📦 Installing PHP dependencies..."
composer install --optimize-autoloader --no-interaction

echo ""
echo "📦 Publishing vendor files..."
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --quiet || true

echo ""
echo "🗄️  Running migrations..."
php artisan migrate --force

echo ""
echo "🌱 Seeding database..."
php artisan db:seed --force

echo ""
echo "🔗 Creating storage link..."
php artisan storage:link

echo ""
echo "📦 Installing NPM dependencies..."
npm install

echo ""
echo "🏗️  Building assets..."
npm run build

echo ""
echo "⚡ Optimizing..."
php artisan optimize

echo ""
echo "🎉 ======================================================"
echo "   QuizQuest berhasil diinstall!"
echo ""
echo "   Jalankan: php artisan serve"
echo "   Buka: http://localhost:8000"
echo ""
echo "   🔑 Login:"
echo "   Admin  → admin@quizquest.id  / password123"
echo "   Guru   → guru@quizquest.id   / password123"
echo "   Murid  → murid@quizquest.id  / password123"
echo ""
echo "   🤖 AI Tutor: Daftar gratis di https://console.groq.com"
echo "   Lalu isi GROQ_API_KEY di .env atau Admin → Settings"
echo "========================================================"
