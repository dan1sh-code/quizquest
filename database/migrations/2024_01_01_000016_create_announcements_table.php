<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title'); $table->text('content'); $table->string('type')->default('info');
            $table->string('target_role')->default('all'); $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable(); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('announcements'); }
};
