<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('grade');
            $table->string('subject_expertise')->nullable()->after('phone');
            $table->string('education')->nullable()->after('subject_expertise');
            $table->string('certification')->nullable()->after('education');
            $table->string('website')->nullable()->after('certification');
            $table->string('linkedin')->nullable()->after('website');
            $table->string('portfolio_path')->nullable()->after('linkedin');
            $table->string('portfolio_name')->nullable()->after('portfolio_path');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'subject_expertise',
                'education',
                'certification',
                'website',
                'linkedin',
                'portfolio_path',
                'portfolio_name',
            ]);
        });
    }
};
