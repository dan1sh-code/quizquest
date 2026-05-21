<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (! DB::table('categories')->where('slug', 'umum')->exists()) {
            DB::table('categories')->insert([
                'name' => 'Umum',
                'slug' => 'umum',
                'icon' => '📖',
                'color' => '#6B7280',
                'description' => 'Kategori umum untuk pelajaran yang belum memiliki kategori khusus.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        //
    }
};
