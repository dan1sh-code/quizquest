<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id(); $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('class_id')->nullable()->constrained('classes')->onDelete('set null');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title'); $table->string('slug')->unique(); $table->text('description')->nullable();
            $table->string('cover_image')->nullable(); $table->string('join_code',10)->unique();
            $table->enum('status',['draft','published','scheduled','closed'])->default('draft');
            $table->enum('difficulty',['easy','medium','hard','mixed'])->default('medium');
            $table->integer('time_limit')->nullable(); $table->boolean('time_per_question')->default(false);
            $table->integer('question_time_limit')->nullable(); $table->integer('max_attempts')->default(1);
            $table->boolean('shuffle_questions')->default(false); $table->boolean('shuffle_options')->default(false);
            $table->boolean('show_result_immediately')->default(true); $table->boolean('show_answer_after')->default(true);
            $table->boolean('is_public')->default(false); $table->integer('passing_score')->default(70);
            $table->integer('xp_reward')->default(10); $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable(); $table->json('tags')->nullable(); $table->timestamps(); $table->softDeletes();
        });
    }
    public function down(): void { Schema::dropIfExists('quizzes'); }
};
