<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\{Achievement, Category, ClassRoom, User};
use App\Notifications\TeacherContentCreated;
use App\Notifications\TeacherTitleGranted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\{Inertia, Response};

class TeacherClassController extends Controller
{
    public function index(Request $r): Response
    {
        return Inertia::render('Teacher/Classes', [
            'classes' => $r->user()->taughtClasses()->withCount('students', 'quizzes')->latest()->paginate(12),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Teacher/ClassForm', ['categories' => $this->subjectCategories()]);
    }

    public function store(Request $r)
    {
        $validated = $r->validate([
            'name' => 'required|string|min:2|max:100',
            'description' => 'nullable|string',
            'subject' => 'nullable|string',
            'grade_level' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
            'cover_position_x' => 'nullable|integer|min:0|max:100',
            'cover_position_y' => 'nullable|integer|min:0|max:100',
        ]);

        if ($r->hasFile('cover_image')) {
            $validated['cover_image'] = $r->file('cover_image')->store('classes/thumbnails', 'public');
        }

        $classroom = $r->user()->taughtClasses()->create($validated);
        $r->user()->notify(new TeacherContentCreated('class_created', $classroom));

        return redirect()->route('teacher.classes.index')->with('success', 'Kelas berhasil dibuat!');
    }

    public function edit(ClassRoom $classroom): Response
    {
        return Inertia::render('Teacher/ClassForm', [
            'classroom' => $classroom,
            'categories' => $this->subjectCategories(),
        ]);
    }

    public function update(Request $r, ClassRoom $classroom)
    {
        $validated = $r->validate([
            'name' => 'required|string|min:2|max:100',
            'description' => 'nullable|string',
            'subject' => 'nullable|string',
            'grade_level' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'cover_image' => 'nullable|image|max:2048',
            'cover_position_x' => 'nullable|integer|min:0|max:100',
            'cover_position_y' => 'nullable|integer|min:0|max:100',
        ]);

        if ($r->hasFile('cover_image')) {
            if ($classroom->cover_image) {
                Storage::disk('public')->delete($classroom->cover_image);
            }

            $validated['cover_image'] = $r->file('cover_image')->store('classes/thumbnails', 'public');
        }

        $classroom->update($validated);

        return redirect()->route('teacher.classes.index')->with('success', 'Kelas diperbarui!');
    }

    public function destroy(ClassRoom $classroom)
    {
        if ($classroom->cover_image) {
            Storage::disk('public')->delete($classroom->cover_image);
        }

        $classroom->delete();

        return back()->with('success', 'Kelas dihapus!');
    }

    public function students(ClassRoom $classroom): Response
    {
        $this->ensureOwnsClass($classroom);

        $classroom->load([
            'students' => fn ($query) => $query
                ->select('users.id', 'name', 'email', 'avatar', 'xp', 'level', 'school', 'grade')
                ->with(['achievements' => fn ($achievementQuery) => $achievementQuery
                    ->where('type', 'teacher_title')
                    ->where('is_active', true)
                    ->select('achievements.id', 'name', 'slug', 'description', 'badge_emoji', 'type', 'threshold', 'xp_reward', 'rarity', 'is_active')
                ]),
        ]);
        $classroom->loadCount('quizzes');

        $classroom->students->each(function ($student) {
            $student->avatar_url = $student->avatar_url;
        });

        return Inertia::render('Teacher/ClassStudents', [
            'classroom' => $classroom,
            'teacherTitles' => Achievement::where('type', 'teacher_title')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'description', 'badge_emoji', 'type', 'threshold', 'xp_reward', 'rarity', 'is_active']),
        ]);
    }

    public function removeStudent(ClassRoom $classroom, User $student)
    {
        $this->ensureOwnsClass($classroom);
        $classroom->students()->detach($student->id);

        return back()->with('success', 'Murid berhasil dikeluarkan dari kelas.');
    }

    public function grantTitle(Request $r, ClassRoom $classroom, User $student)
    {
        $this->ensureOwnsClass($classroom);
        $this->ensureStudentInClass($classroom, $student);

        $validated = $r->validate([
            'achievement_id' => [
                'required',
                'integer',
                Rule::exists('achievements', 'id')->where('type', 'teacher_title')->where('is_active', true),
            ],
        ]);

        $achievement = Achievement::findOrFail($validated['achievement_id']);
        $alreadyHasTitle = $student->achievements()->where('achievements.id', $achievement->id)->exists();

        if (!$alreadyHasTitle) {
            $student->achievements()->attach($achievement->id, ['earned_at' => now()]);
            $student->notify(new TeacherTitleGranted($achievement, $classroom, $r->user()));
        }

        return back()->with('success', 'Title berhasil diberikan ke murid.');
    }

    public function revokeTitle(ClassRoom $classroom, User $student, Achievement $achievement)
    {
        $this->ensureOwnsClass($classroom);
        $this->ensureStudentInClass($classroom, $student);

        abort_unless($achievement->type === 'teacher_title', 404);

        $student->achievements()->detach($achievement->id);

        return back()->with('success', 'Title murid berhasil dicabut.');
    }

    private function subjectCategories()
    {
        Category::firstOrCreate(
            ['slug' => 'umum'],
            ['name' => 'Umum', 'icon' => '📖', 'color' => '#6B7280', 'is_active' => true]
        );

        return Category::where('is_active', true)
            ->orderByRaw("CASE WHEN slug = 'umum' THEN 0 ELSE 1 END")
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'icon', 'color']);
    }

    private function ensureOwnsClass(ClassRoom $classroom): void
    {
        abort_unless($classroom->teacher_id === auth()->id(), 403);
    }

    private function ensureStudentInClass(ClassRoom $classroom, User $student): void
    {
        abort_unless($classroom->students()->where('users.id', $student->id)->exists(), 404);
    }
}
