<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('attempt_answers', function (Blueprint $table) {
            $table->id(); $table->foreignId('attempt_id')->constrained('quiz_attempts')->onDelete('cascade');
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->foreignId('selected_option_id')->nullable()->constrained('question_options')->onDelete('set null');
            $table->text('essay_answer')->nullable(); $table->text('fill_answer')->nullable();
            $table->json('matching_answer')->nullable(); $table->boolean('is_correct')->nullable();
            $table->integer('points_earned')->default(0); $table->integer('time_spent')->nullable();
            $table->text('teacher_feedback')->nullable();
            $table->enum('grade_status',['pending','graded','auto_graded'])->default('auto_graded'); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('attempt_answers'); }
};
