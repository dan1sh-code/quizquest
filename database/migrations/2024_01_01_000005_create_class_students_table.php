<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('class_students', function (Blueprint $table) {
            $table->id(); $table->foreignId('class_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status',['active','inactive','banned'])->default('active');
            $table->timestamp('joined_at')->useCurrent(); $table->unique(['class_id','user_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('class_students'); }
};
