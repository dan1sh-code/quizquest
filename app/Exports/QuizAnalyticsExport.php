<?php

namespace App\Exports;

use App\Models\Quiz;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class QuizAnalyticsExport implements FromCollection, WithHeadings, WithStyles
{
    private $categoryId;

    public function __construct($categoryId = null)
    {
        $this->categoryId = $categoryId;
    }

    public function collection()
    {
        $query = Quiz::with('category', 'questions');

        if ($this->categoryId) {
            $query->where('category_id', $this->categoryId);
        }

        return $query->get()->map(function ($quiz, $index) {
            $attempts = $quiz->attempts;
            $totalAttempts = $attempts->count();
            $avgScore = $totalAttempts > 0 ? round($attempts->avg('score'), 2) : 0;
            $passCount = $attempts->where('is_passed', true)->count();
            $passRate = $totalAttempts > 0 ? round(($passCount / $totalAttempts) * 100, 2) : 0;
            $questionsCount = $quiz->questions->count();

            return [
                $index + 1,
                $quiz->title,
                $quiz->category->name ?? 'N/A',
                $questionsCount,
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
            'Judul Quiz',
            'Kategori',
            'Jumlah Soal',
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
