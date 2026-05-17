# 🎯 QuizQuest

> Platform Quiz Edukasi Interaktif · Laravel 12 · Inertia.js v2 · React 18 · Tailwind CSS v4 · Groq AI

---

## ⚡ CARA PAKAI (3 Langkah)

### 1. Pastikan sudah install:
- **PHP 8.2+** (`php --version`)
- **Composer 2** (`composer --version`)  
- **Node.js 18+** (`node --version`)
- **MySQL 8.0+** (pastikan service berjalan)

### 2. Jalankan installer otomatis:
```bash
chmod +x install.sh
./install.sh
```
Installer akan tanya database credentials lalu setup otomatis.

### 3. Jalankan server:
```bash
./start.sh
# atau manual:
php artisan serve
```

Buka browser: **http://localhost:8000** 🎉

---

## 🔑 Akun Default

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | admin@quizquest.id | password123 |
| 👨‍🏫 Guru | guru@quizquest.id | password123 |
| 👨‍🎓 Murid | murid@quizquest.id | password123 |

---

## 🤖 Setup AI Tutor (Groq — GRATIS)

1. Buka https://console.groq.com
2. Daftar / Login (gratis)
3. Klik **API Keys** → **Create API Key**
4. Copy key, lalu:
   - Tambahkan ke `.env`: `GROQ_API_KEY=gsk_xxx...`
   - **ATAU** login sebagai Admin → Settings → Groq API Key

---

## 🛠️ Perintah Berguna

```bash
# Reset database
php artisan migrate:fresh --seed

# Clear semua cache
php artisan optimize:clear

# Development mode (hot reload)
npm run dev
# (buka terminal baru, jalankan)
php artisan serve

# Production build
npm run build
```

---

## 🗂️ Struktur Proyek

```
quizquest/
├── app/
│   ├── Http/Controllers/     # 15 controllers
│   ├── Models/               # 16 models
│   └── Services/             # GroqAiService
├── database/
│   ├── migrations/           # 19 migration files
│   └── seeders/              # DatabaseSeeder
├── resources/
│   ├── css/app.css           # Tailwind CSS v4
│   ├── js/
│   │   ├── Components/       # Reusable React components
│   │   ├── Pages/            # Inertia pages
│   │   ├── lib/utils.ts      # Helpers
│   │   └── types/index.ts    # TypeScript types
│   └── views/app.blade.php   # Root HTML template
├── routes/web.php             # Semua routes
├── install.sh                 # 🚀 Auto installer
└── start.sh                   # ⚡ Quick start
```

---

## ✨ Fitur Lengkap

### 👨‍🎓 Murid
- Dashboard dengan XP bar, level badge, streak harian
- Join quiz dengan kode unik
- **5 Tipe Soal**: Pilihan Ganda, Benar/Salah, Essay, Isian Singkat, Menjodohkan
- Timer countdown (per quiz atau per soal)
- Hasil instan dengan review jawaban
- **AI Tutor** (Groq LLaMA 3.1) untuk pembahasan tiap soal
- Leaderboard global & per kelas
- Achievement badges (Common → Legendary)
- Streak harian dengan kalender aktivitas

### 👨‍🏫 Guru
- Quiz Builder interaktif (React, tanpa reload)
- Kelola kelas & undang murid dengan kode
- Jadwalkan quiz (waktu mulai & berakhir)
- Nilai essay secara manual dengan feedback
- Analitik: rata-rata skor, distribusi nilai
- Duplikasi quiz dengan 1 klik

### 🛡️ Admin
- Dashboard statistik platform dengan grafik
- Kelola semua user (CRUD + toggle status)
- Konfigurasi Groq AI (API Key & model)
- Konfigurasi XP & level system
- Kelola kategori & pengumuman
- Mode maintenance

### ⚡ Gamifikasi
- **10 Level**: Pemula 🌱 → Immortal 🏆
- **XP System**: Reward per quiz, bonus skor sempurna, streak
- **10 Achievement**: Common, Rare, Epic, Legendary
- **Streak Harian**: Bonus XP konsistensi belajar
