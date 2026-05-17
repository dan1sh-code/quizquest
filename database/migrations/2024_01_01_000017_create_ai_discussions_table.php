<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('ai_discussions', function (Blueprint $table) {
            $table->id(); $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->foreignId('attempt_id')->constrained('quiz_attempts')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->json('conversation'); $table->string('model_used')->nullable();
            $table->integer('tokens_used')->nullable(); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('ai_discussions'); }
};
