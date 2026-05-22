<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('role', 50)->nullable()->index();
            $table->string('action', 50)->index();
            $table->string('description');
            $table->string('method', 10);
            $table->string('path');
            $table->string('route_name')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->unsignedSmallInteger('status_code')->nullable()->index();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['created_at', 'role']);
            $table->index(['created_at', 'action']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
