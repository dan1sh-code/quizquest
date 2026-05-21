<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\{Category, ClassRoom, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        $r->user()->taughtClasses()->create($validated);

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
        $classroom->load(['students' => fn ($query) => $query->select('users.id', 'name', 'email', 'avatar', 'xp', 'level', 'school', 'grade')]);
        $classroom->loadCount('quizzes');

        $classroom->students->each(function ($student) {
            $student->avatar_url = $student->avatar_url;
        });

        return Inertia::render('Teacher/ClassStudents', ['classroom' => $classroom]);
    }

    public function removeStudent(ClassRoom $classroom, User $student)
    {
        $classroom->students()->detach($student->id);

        return back()->with('success', 'Murid berhasil dikeluarkan dari kelas.');
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
}
