<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable()->after('name');
            $table->string('avatar')->nullable(); $table->text('bio')->nullable();
            $table->integer('xp')->default(0); $table->integer('level')->default(1);
            $table->integer('streak_days')->default(0); $table->date('last_active')->nullable();
            $table->boolean('is_active')->default(true); $table->string('school')->nullable(); $table->string('grade')->nullable();
        });
    }
    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username','avatar','bio','xp','level','streak_days','last_active','is_active','school','grade']);
        });
    }
};
