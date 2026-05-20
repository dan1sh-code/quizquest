<?php

use App\Models\Announcement;
use App\Models\User;

$admin = User::where('role', 'admin')->first();

if (!$admin) {
    echo "No admin user found.\n";
    exit;
}

$announcements = [
    [
        'title' => 'Pembaruan Fitur: Kuis Interaktif V2.0',
        'content' => "Halo semua,\n\nKami telah meluncurkan pembaruan terbaru untuk sistem kuis interaktif. Sekarang Anda bisa menikmati fitur timer yang lebih akurat, antarmuka yang lebih responsif, dan efek animasi saat menyelesaikan kuis. Selamat belajar!",
        'type' => 'info',
        'target_role' => 'all',
        'is_active' => true,
    ],
    [
        'title' => 'Pemeliharaan Server Terjadwal',
        'content' => 'Sistem akan mengalami pemeliharaan rutin pada hari Sabtu, 23 Mei 2026, dari jam 00:00 hingga 04:00 WIB. Selama waktu tersebut, platform mungkin tidak dapat diakses. Mohon simpan semua pekerjaan Anda.',
        'type' => 'warning',
        'target_role' => 'all',
        'is_active' => true,
    ],
    [
        'title' => 'Selamat Datang di Semester Baru!',
        'content' => 'Selamat datang di semester baru! Kami harap kalian siap untuk menjelajahi berbagai kuis baru yang telah disiapkan oleh para guru. Tetap semangat dan pantau leaderboard untuk melihat peringkat kalian.',
        'type' => 'success',
        'target_role' => 'student',
        'is_active' => true,
    ],
    [
        'title' => 'Peringatan Keamanan Akun',
        'content' => 'Kami mendeteksi adanya aktivitas login yang mencurigakan di beberapa akun. Harap pastikan untuk mengganti kata sandi Anda secara berkala dan jangan membagikan kredensial Anda kepada siapapun.',
        'type' => 'danger',
        'target_role' => 'all',
        'is_active' => true,
    ],
    [
        'title' => 'Fitur Penilaian AI Terbaru',
        'content' => "Kepada Bapak/Ibu Guru,\n\nFitur integrasi AI Tutor untuk penilaian otomatis kini telah stabil dan dapat digunakan di semua kelas. Anda dapat mengaktifkannya pada pengaturan kuis masing-masing. Panduan lengkap dapat dilihat di menu bantuan.",
        'type' => 'info',
        'target_role' => 'teacher',
        'is_active' => true,
    ]
];

foreach ($announcements as $data) {
    $data['user_id'] = $admin->id;
    Announcement::create($data);
}

echo "5 Announcements seeded successfully.\n";
