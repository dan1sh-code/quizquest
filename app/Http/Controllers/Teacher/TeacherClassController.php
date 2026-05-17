<?php
namespace App\Http\Controllers\Teacher;
use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use Illuminate\Http\Request;
use Inertia\{Inertia,Response};
class TeacherClassController extends Controller {
    public function index(Request $r): Response {
        return Inertia::render('Teacher/Classes',['classes'=>$r->user()->taughtClasses()->withCount('students','quizzes')->latest()->paginate(12)]);
    }
    public function create(): Response { return Inertia::render('Teacher/ClassForm'); }
    public function store(Request $r) {
        $r->validate(['name'=>'required|string|min:2|max:100','description'=>'nullable|string','subject'=>'nullable|string','grade_level'=>'nullable|string']);
        $r->user()->taughtClasses()->create($r->only('name','description','subject','grade_level'));
        return redirect()->route('teacher.classes.index')->with('success','Kelas berhasil dibuat! 🏫');
    }
    public function edit(ClassRoom $classroom): Response { return Inertia::render('Teacher/ClassForm',['classroom'=>$classroom]); }
    public function update(Request $r, ClassRoom $classroom) {
        $r->validate(['name'=>'required|string|min:2|max:100']);
        $classroom->update($r->only('name','description','subject','grade_level','is_active'));
        return redirect()->route('teacher.classes.index')->with('success','Kelas diperbarui!');
    }
    public function destroy(ClassRoom $classroom) { $classroom->delete(); return back()->with('success','Kelas dihapus!'); }
    public function students(ClassRoom $classroom): Response {
        return Inertia::render('Teacher/ClassStudents',['classroom'=>$classroom->load('students')]);
    }
}
