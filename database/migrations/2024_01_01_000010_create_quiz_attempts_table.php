<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id(); $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status',['in_progress','completed','abandoned','grading'])->default('in_progress');
            $table->integer('score')->default(0); $table->integer('max_score')->default(0);
            $table->decimal('percentage',5,2)->default(0); $table->boolean('passed')->default(false);
            $table->integer('correct_answers')->default(0); $table->integer('wrong_answers')->default(0);
            $table->integer('skipped_answers')->default(0); $table->integer('time_taken')->nullable();
            $table->integer('xp_earned')->default(0); $table->timestamp('started_at')->useCurrent();
            $table->timestamp('completed_at')->nullable(); $table->integer('attempt_number')->default(1); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('quiz_attempts'); }
};
