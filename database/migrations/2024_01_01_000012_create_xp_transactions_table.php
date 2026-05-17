<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('xp_transactions', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('amount'); $table->string('type'); $table->text('description');
            $table->string('source_type')->nullable(); $table->unsignedBigInteger('source_id')->nullable();
            $table->integer('balance_after'); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('xp_transactions'); }
};
