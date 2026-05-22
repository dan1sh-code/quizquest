<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\{Question,QuizAttempt,AiDiscussion};
use App\Services\OpenRouterAiService;
use Illuminate\Http\{JsonResponse,Request};
class AiApiController extends Controller {
    public function __construct(private OpenRouterAiService $ai) {}
    public function discuss(Request $r): JsonResponse {
        $r->validate(['question_id'=>'required|integer|exists:questions,id','attempt_id'=>'required|integer|exists:quiz_attempts,id','student_answer'=>'nullable|string|max:2000']);
        $attempt=QuizAttempt::find($r->attempt_id);
        if($attempt->user_id!==$r->user()->id) return response()->json(['success'=>false,'content'=>'Unauthorized'],403);
        return response()->json($this->ai->generateDiscussion(Question::find($r->question_id),$attempt,$r->student_answer));
    }
    public function continueChat(Request $r): JsonResponse {
        $r->validate(['discussion_id'=>'required|integer|exists:ai_discussions,id','message'=>'required|string|max:2000']);
        $d=AiDiscussion::find($r->discussion_id);
        if($d->user_id!==$r->user()->id) return response()->json(['success'=>false,'content'=>'Unauthorized'],403);
        return response()->json($this->ai->continueDiscussion($r->discussion_id,$r->message));
    }
}
