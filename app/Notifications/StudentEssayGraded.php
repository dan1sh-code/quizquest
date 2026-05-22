<?php

namespace App\Notifications;

use App\Models\{Quiz, QuizAttempt, User};
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class StudentEssayGraded extends Notification
{
    use Queueable;

    public function __construct(
        private Quiz $quiz,
        private QuizAttempt $attempt,
        private User $teacher,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'kind' => 'essay_graded',
            'title' => 'Essay kamu sudah dinilai',
            'message' => "{$this->teacher->name} sudah menilai essay di quiz {$this->quiz->title}. Skor akhir kamu {$this->attempt->percentage}%.",
            'quiz_id' => $this->quiz->id,
            'quiz_title' => $this->quiz->title,
            'attempt_id' => $this->attempt->id,
            'score' => $this->attempt->percentage,
            'teacher_id' => $this->teacher->id,
            'teacher_name' => $this->teacher->name,
            'url' => "/student/attempt/{$this->attempt->id}/result",
        ];
    }
}
