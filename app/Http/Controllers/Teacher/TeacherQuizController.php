<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\{Category, ClassRoom, Question, Quiz, QuizAttempt};
use App\Notifications\TeacherContentCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\{Inertia, Response};

class TeacherQuizController extends Controller
{
    public function index(Request $r): Response {
        return Inertia::render('Teacher/QuizIndex', [
            'quizzes' => $r->user()->quizzes()->with('category:id,name,icon,color')->withCount(['questions','attempts'])->latest()->paginate(12),
        ]);
    }

    public function create(): Response {
        return Inertia::render('Teacher/QuizBuilder', [
            'categories' => Category::where('is_active',true)->get(),
            'classes'    => ClassRoom::where('teacher_id',auth()->id())->get(),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title'         => 'required|string|min:3|max:255',
            'description'   => 'nullable|string',
            'difficulty'    => 'required|in:easy,medium,hard,mixed',
            'passing_score' => 'required|integer|min:0|max:100',
            'time_limit'    => 'nullable|integer|min:0',
            'max_attempts'  => 'required|integer|min:1',
            'shuffle_questions'       => 'boolean',
            'shuffle_options'         => 'boolean',
            'show_result_immediately' => 'boolean',
            'show_answer_after'       => 'boolean',
            'is_public'     => 'boolean',
            'category_id'   => 'nullable|exists:categories,id',
            'class_id'      => 'nullable|exists:classes,id',
            'xp_reward'     => 'required|integer|min:0',
            'status'        => 'required|in:draft,published',
            'questions'     => 'array',
        ]);
        $quiz = $request->user()->quizzes()->create($validated);
        $this->syncQuestions($quiz, $request->input('questions', []));
        $request->user()->notify(new TeacherContentCreated('quiz_created', $quiz));
        return redirect()->route('teacher.quizzes.results', $quiz->id)
            ->with('success', $validated['status']==='published' ? 'Quiz dipublish! 🚀' : 'Draft tersimpan! 💾');
    }

    public function edit(Quiz $quiz): Response {
        $this->authorize('update', $quiz);
        $quiz->load(['questions.options','questions.matchingPairs']);
        return Inertia::render('Teacher/QuizBuilder', [
            'quiz'       => $quiz,
            'categories' => Category::where('is_active',true)->get(),
            'classes'    => ClassRoom::where('teacher_id',auth()->id())->get(),
        ]);
    }

    public function update(Request $request, Quiz $quiz) {
        $this->authorize('update', $quiz);
        $validated = $request->validate([
            'title'         => 'required|string|min:3|max:255',
            'description'   => 'nullable|string',
            'difficulty'    => 'required|in:easy,medium,hard,mixed',
            'passing_score' => 'required|integer|min:0|max:100',
            'time_limit'    => 'nullable|integer|min:0',
            'max_attempts'  => 'required|integer|min:1',
            'shuffle_questions'       => 'boolean',
            'shuffle_options'         => 'boolean',
            'show_result_immediately' => 'boolean',
            'show_answer_after'       => 'boolean',
            'is_public'     => 'boolean',
            'category_id'   => 'nullable|exists:categories,id',
            'class_id'      => 'nullable|exists:classes,id',
            'xp_reward'     => 'required|integer|min:0',
            'status'        => 'required|in:draft,published',
            'questions'     => 'array',
        ]);
        $quiz->update($validated);
        $this->syncQuestions($quiz, $request->input('questions', []));
        return redirect()->route('teacher.quizzes.results', $quiz->id)->with('success','Quiz berhasil diperbarui! ✅');
    }

    public function results(Quiz $quiz): Response {
        $this->authorize('view', $quiz);
        $quiz->load(['category:id,name,icon,color', 'classroom:id,name,code'])->loadCount('questions');
        $attempts = $quiz->attempts()->with(['user:id,name,avatar,level'])->where('status','completed')
            ->latest('completed_at')->paginate(20)
            ->through(fn($a)=>[...$a->toArray(),'user'=>[...$a->user->toArray(),'avatar_url'=>$a->user->avatar_url]]);

        $completed = $quiz->attempts()->where('status','completed');
        $completedCount = (clone $completed)->count();
        $passedCount = (clone $completed)->where('passed', true)->count();
        $avgScore = round((clone $completed)->avg('percentage') ?? 0, 1);

        return Inertia::render('Teacher/QuizResults', [
            'quiz'     => $quiz,
            'attempts' => $attempts,
            'avgScore' => $avgScore,
            'passRate' => $completedCount > 0 ? round($passedCount / $completedCount * 100) : 0,
            'stats'    => [
                'completed'   => $completedCount,
                'inProgress'  => $quiz->attempts()->where('status', 'in_progress')->count(),
                'passed'      => $passedCount,
                'failed'      => max(0, $completedCount - $passedCount),
                'highestScore'=> round((clone $completed)->max('percentage') ?? 0, 1),
                'lowestScore' => round((clone $completed)->min('percentage') ?? 0, 1),
                'lowestRawScore' => round((clone $completed)->min('score') ?? 0, 1),
                'maxScore'    => round((clone $completed)->max('max_score') ?? 0, 1),
                'totalXp'     => (int) (clone $completed)->sum('xp_earned'),
            ],
            'scoreBuckets' => [
                'excellent' => (clone $completed)->where('percentage', '>=', 85)->count(),
                'good'      => (clone $completed)->whereBetween('percentage', [70, 84.99])->count(),
                'review'    => (clone $completed)->whereBetween('percentage', [50, 69.99])->count(),
                'critical'  => (clone $completed)->where('percentage', '<', 50)->count(),
            ],
        ]);
    }

    public function destroy(Quiz $quiz) {
        $this->authorize('delete', $quiz);
        $quiz->delete();
        return redirect()->route('teacher.quizzes.index')->with('success','Quiz dihapus!');
    }

    public function duplicate(Quiz $quiz) {
        $this->authorize('update', $quiz);
        $newQuiz = $quiz->replicate(['join_code','slug','status']);
        $newQuiz->title = $quiz->title.' (Salinan)';
        $newQuiz->slug  = Str::slug($newQuiz->title).'-'.time();
        $newQuiz->status = 'draft';
        $newQuiz->save();
        foreach ($quiz->questions()->with('options','matchingPairs')->get() as $q) {
            $nQ = $q->replicate(['quiz_id']); $nQ->quiz_id=$newQuiz->id; $nQ->save();
            foreach ($q->options as $opt) { $opt->replicate(['question_id'])->fill(['question_id'=>$nQ->id])->save(); }
            foreach ($q->matchingPairs as $p) { $p->replicate(['question_id'])->fill(['question_id'=>$nQ->id])->save(); }
        }
        return redirect()->route('teacher.quizzes.edit', $newQuiz->id)->with('success','Quiz berhasil diduplikasi!');
    }

    private function syncQuestions(Quiz $quiz, array $questions): void {
        $keepIds = array_filter(array_column($questions,'id'));
        $quiz->questions()->whereNotIn('id', $keepIds)->delete();
        foreach ($questions as $order => $qData) {
            $qSave = ['quiz_id'=>$quiz->id,'question_text'=>$qData['text'],'type'=>$qData['type'],'points'=>$qData['points']??10,'difficulty'=>$qData['difficulty']??'medium','explanation'=>$qData['explanation']??null,'order'=>$order+1,'has_ai_discussion'=>true];
            $question = (!empty($qData['id'])) ? Question::find($qData['id']) : null;
            if ($question) $question->update($qSave); else $question=Question::create($qSave);
            if (!$question) continue;
            if (in_array($qData['type'],['multiple_choice','true_false'])) {
                $question->options()->delete();
                foreach (($qData['options']??[]) as $i=>$opt) {
                    if (!empty($opt['text'])) $question->options()->create(['option_text'=>$opt['text'],'is_correct'=>$opt['is_correct']??false,'order'=>$i+1]);
                }
            } elseif ($qData['type']==='fill_blank'&&!empty($qData['fill_answer'])) {
                $question->options()->delete();
                $question->options()->create(['option_text'=>$qData['fill_answer'],'is_correct'=>true,'order'=>1]);
            } elseif ($qData['type']==='matching') {
                $question->matchingPairs()->delete();
                foreach (($qData['pairs']??[]) as $i=>$pair) {
                    if (!empty($pair['left'])&&!empty($pair['right'])) $question->matchingPairs()->create(['left_item'=>$pair['left'],'right_item'=>$pair['right'],'order'=>$i+1]);
                }
            }
        }
    }
}
