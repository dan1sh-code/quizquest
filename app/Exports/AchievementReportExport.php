<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class AchievementReportExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection()
    {
        return User::whereHas('roles', function ($query) {
            $query->where('name', 'student');
        })
            ->withCount('achievements')
            ->orderByDesc('achievements_count')
            ->limit(100)
            ->get()
            ->map(function ($user, $index) {
                return [
                    $index + 1,
                    $user->name,
                    $user->email,
                    $user->level,
                    $user->xp,
                    $user->achievements_count,
                    $user->current_streak ?? 0,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Peringkat',
            'Nama Siswa',
            'Email',
            'Level',
            'XP',
            'Jumlah Achievement',
            'Streak Saat Ini',
        ];
    }

    public function styles($sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '7C3AED'],
                ],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }
}
