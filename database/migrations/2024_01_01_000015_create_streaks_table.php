<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('streaks', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date'); $table->integer('quizzes_done')->default(0);
            $table->integer('xp_earned')->default(0); $table->unique(['user_id','date']); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('streaks'); }
};
