<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ClassRoom;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class AdminQuizController extends Controller
{
    /**
     * Display a listing of the quizzes.
     */
    public function index(Request $request)
    {
        $query = Quiz::with(['category', 'teacher'])->withCount('questions');
        
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $quizzes = $query->latest()->get()->map(function($quiz) {
            $quiz->can_edit = false;
            return $quiz;
        });

        return Inertia::render('Admin/Quizzes', [
            'quizzes' => $quizzes
        ]);
    }



    /**
     * Display the specified quiz preview.
     */
    public function show(Quiz $quiz): Response
    {
        $quiz->load(['category', 'questions.options']);
        
        return Inertia::render('Admin/Quizzes/Show', [
            'quiz' => $quiz
        ]);
    }



    /**
     * Remove the specified quiz from storage.
     */
    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
        return redirect()->route('admin.quizzes.index')->with('success', 'Kuis berhasil dihapus!');
    }

    public function destroyQuestion(Quiz $quiz, Question $question)
    {
        abort_if($question->quiz_id !== $quiz->id, 403, 'Soal tidak termasuk dalam kuis ini.');
        $question->delete();
        return redirect()->back()->with('success', 'Soal berhasil dihapus!');
    }

    public function clearQuestions(Quiz $quiz)
    {
        $quiz->questions()->delete();
        return redirect()->back()->with('success', 'Semua soal berhasil dihapus!');
    }
}
