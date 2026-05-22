<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class StudentPerformanceExport implements FromCollection, WithHeadings, WithStyles
{
    private $classId;
    private $categoryId;

    public function __construct($classId = null, $categoryId = null)
    {
        $this->classId = $classId;
        $this->categoryId = $categoryId;
    }

    public function collection()
    {
        $query = User::whereHas('roles', function ($query) {
            $query->where('name', 'student');
        })->with('quizAttempts');

        if ($this->classId) {
            $query->whereHas('classrooms', function ($q) {
                $q->where('class_id', $this->classId);
            });
        }

        if ($this->categoryId) {
            $query->whereHas('quizAttempts.quiz', function ($q) {
                $q->where('category_id', $this->categoryId);
            });
        }

        return $query->get()->map(function ($student, $index) {
            $attempts = $student->quizAttempts;
            $totalAttempts = $attempts->count();
            $avgScore = $totalAttempts > 0 ? round($attempts->avg('score'), 2) : 0;
            $passCount = $attempts->where('is_passed', true)->count();
            $passRate = $totalAttempts > 0 ? round(($passCount / $totalAttempts) * 100, 2) : 0;

            return [
                $index + 1,
                $student->name,
                $student->email,
                $student->level,
                $student->xp,
                $totalAttempts,
                $avgScore,
                $passCount,
                $passRate . '%',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Siswa',
            'Email',
            'Level',
            'XP',
            'Total Attempt',
            'Rata-rata Skor',
            'Jumlah Lulus',
            'Pass Rate',
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
