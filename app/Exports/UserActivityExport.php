<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class UserActivityExport implements FromCollection, WithHeadings, WithStyles
{
    private $role;

    public function __construct($role = null)
    {
        $this->role = $role;
    }

    public function collection()
    {
        $query = User::with('quizAttempts');

        if ($this->role) {
            $query->whereHas('roles', function ($q) {
                $q->where('name', $this->role);
            });
        }

        return $query->get()->map(function ($user, $index) {
            return [
                $index + 1,
                $user->name,
                $user->email,
                $user->roles->pluck('name')->first() ?? 'N/A',
                $user->quizAttempts->count(),
                $user->updated_at->format('Y-m-d H:i'),
            ];
        })->sortByDesc(4)->values();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama',
            'Email',
            'Role',
            'Total Attempt',
            'Aktivitas Terakhir',
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
