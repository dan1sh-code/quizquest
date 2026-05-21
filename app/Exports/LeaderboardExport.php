<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class LeaderboardExport implements FromCollection, WithHeadings, WithStyles
{
    public function collection()
    {
        return User::whereHas('roles', function ($query) {
            $query->where('name', 'student');
        })
            ->orderByDesc('xp')
            ->limit(100)
            ->get()
            ->map(function ($user, $index) {
                return [
                    $index + 1,
                    $user->name,
                    $user->email,
                    $user->level,
                    $user->xp,
                    $user->quizAttempts->count(),
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
            'Total Attempt',
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
