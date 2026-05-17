<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('levels', function (Blueprint $table) {
            $table->id(); $table->integer('level_number')->unique(); $table->string('name');
            $table->string('badge_emoji'); $table->string('badge_color'); $table->integer('xp_required');
            $table->text('perks')->nullable(); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('levels'); }
};
