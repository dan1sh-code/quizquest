<?php

namespace App\Notifications;

use App\Models\{Achievement, ClassRoom, User};
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TeacherTitleGranted extends Notification
{
    use Queueable;

    public function __construct(
        private Achievement $title,
        private ClassRoom $classroom,
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
            'kind' => 'teacher_title_granted',
            'title' => 'Title baru dari guru!',
            'message' => "{$this->teacher->name} memberi kamu title {$this->title->name} di kelas {$this->classroom->name}.",
            'achievement_id' => $this->title->id,
            'achievement_name' => $this->title->name,
            'classroom_id' => $this->classroom->id,
            'classroom_name' => $this->classroom->name,
            'teacher_id' => $this->teacher->id,
            'teacher_name' => $this->teacher->name,
            'url' => '/student/classes',
        ];
    }
}
