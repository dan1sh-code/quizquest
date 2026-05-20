<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$category = \App\Models\Category::first();
echo json_encode($category->toArray(), JSON_PRETTY_PRINT);
