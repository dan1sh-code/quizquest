<?php

namespace App\Exports;

use App\Models\ClassRoom;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class ClassReportExport implements FromCollection, WithHeadings, WithStyles
{
    private $classId;

    public function __construct($classId = null)
    {
        $this->classId = $classId;
    }

    public function collection()
    {
        $query = ClassRoom::with('students', 'teacher');

        if ($this->classId) {
            $query->where('id', $this->classId);
        }

        return $query->get()->map(function ($class, $index) {
            $students = $class->students;
            $studentCount = $students->count();
            $avgScore = $studentCount > 0 ? round($students->flatMap(fn($s) => $s->quizAttempts)->avg('score'), 2) : 0;
            $avgLevel = $studentCount > 0 ? round($students->avg('level'), 1) : 0;

            return [
                $index + 1,
                $class->name,
                $class->code,
                $class->teacher->name ?? 'N/A',
                $studentCount,
                $avgScore,
                $avgLevel,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Kelas',
            'Kode Kelas',
            'Guru Pembimbing',
            'Jumlah Siswa',
            'Rata-rata Skor',
            'Rata-rata Level',
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
