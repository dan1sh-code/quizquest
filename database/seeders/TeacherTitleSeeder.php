<?php

namespace Database\Seeders;

use App\Models\Achievement;
use Illuminate\Database\Seeder;

class TeacherTitleSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['Problem Solver', 'teacher-title-problem-solver', 'Diberikan guru untuk murid yang jago memecahkan soal sulit.', '🏅', 'rare'],
            ['Teman Diskusi', 'teacher-title-teman-diskusi', 'Diberikan guru untuk murid yang aktif membantu diskusi kelas.', '🏅', 'common'],
            ['Konsisten', 'teacher-title-konsisten', 'Diberikan guru untuk murid yang rajin hadir dan mengerjakan latihan.', '🏅', 'common'],
            ['Pemimpin Kelompok', 'teacher-title-pemimpin-kelompok', 'Diberikan guru untuk murid yang bisa memimpin kerja kelompok dengan baik.', '🏅', 'rare'],
            ['Bintang Kelas', 'teacher-title-bintang-kelas', 'Diberikan guru untuk murid dengan kontribusi kelas yang menonjol.', '🏅', 'epic'],
        ] as [$name, $slug, $description, $badge, $rarity]) {
            Achievement::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => $description,
                    'badge_emoji' => $badge,
                    'type' => 'teacher_title',
                    'threshold' => 0,
                    'xp_reward' => 0,
                    'rarity' => $rarity,
                    'is_active' => true,
                ]
            );
        }
    }
}
