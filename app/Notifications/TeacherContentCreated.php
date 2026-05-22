<?php

namespace App\Notifications;

use App\Models\{ClassRoom, Quiz};
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TeacherContentCreated extends Notification
{
    use Queueable;

    public function __construct(
        private string $kind,
        private Quiz|ClassRoom $content,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        if ($this->kind === 'class_created') {
            return [
                'kind' => 'class_created',
                'title' => 'Kelas berhasil dibuat',
                'message' => "Kelas {$this->content->name} sudah aktif. Kode kelas: {$this->content->code}.",
                'classroom_id' => $this->content->id,
                'classroom_name' => $this->content->name,
                'url' => "/teacher/classes/{$this->content->id}/students",
            ];
        }

        return [
            'kind' => 'quiz_created',
            'title' => $this->content->status === 'published' ? 'Quiz berhasil dipublish' : 'Draft quiz tersimpan',
            'message' => "Quiz {$this->content->title} sudah dibuat. Kode quiz: {$this->content->join_code}.",
            'quiz_id' => $this->content->id,
            'quiz_title' => $this->content->title,
            'quiz_status' => $this->content->status,
            'url' => "/teacher/quizzes/{$this->content->id}/results",
        ];
    }
}
