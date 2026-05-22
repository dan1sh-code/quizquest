<?php

namespace App\Notifications;

use App\Models\{ClassRoom, Quiz, QuizAttempt, User};
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TeacherStudentActivity extends Notification
{
    use Queueable;

    public function __construct(
        private string $kind,
        private User $student,
        private ?ClassRoom $classroom = null,
        private ?Quiz $quiz = null,
        private ?QuizAttempt $attempt = null,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return match ($this->kind) {
            'student_joined_class' => [
                'kind' => $this->kind,
                'title' => 'Murid baru bergabung',
                'message' => "{$this->student->name} baru bergabung ke kelas {$this->classroom?->name}.",
                'student_id' => $this->student->id,
                'student_name' => $this->student->name,
                'classroom_id' => $this->classroom?->id,
                'classroom_name' => $this->classroom?->name,
                'url' => $this->classroom ? "/teacher/classes/{$this->classroom->id}/students" : '/teacher/classes',
            ],
            'essay_needs_grading' => [
                'kind' => $this->kind,
                'title' => 'Essay perlu dinilai',
                'message' => "{$this->student->name} mengumpulkan quiz {$this->quiz?->title} dan menunggu penilaian essay.",
                'student_id' => $this->student->id,
                'student_name' => $this->student->name,
                'quiz_id' => $this->quiz?->id,
                'quiz_title' => $this->quiz?->title,
                'attempt_id' => $this->attempt?->id,
                'url' => '/teacher/grading',
            ],
            default => [
                'kind' => 'quiz_completed',
                'title' => 'Murid menyelesaikan quiz',
                'message' => "{$this->student->name} menyelesaikan quiz {$this->quiz?->title} dengan skor {$this->attempt?->percentage}%.",
                'student_id' => $this->student->id,
                'student_name' => $this->student->name,
                'quiz_id' => $this->quiz?->id,
                'quiz_title' => $this->quiz?->title,
                'attempt_id' => $this->attempt?->id,
                'score' => $this->attempt?->percentage,
                'url' => $this->quiz ? "/teacher/quizzes/{$this->quiz->id}/results" : '/teacher/quizzes',
            ],
        };
    }
}
