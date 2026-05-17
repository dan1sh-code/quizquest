<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id(); $table->string('name'); $table->string('slug')->unique(); $table->text('description');
            $table->string('badge_emoji'); $table->string('badge_image')->nullable(); $table->string('type');
            $table->integer('threshold'); $table->integer('xp_reward')->default(0);
            $table->string('rarity')->default('common'); $table->boolean('is_active')->default(true); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('achievements'); }
};
