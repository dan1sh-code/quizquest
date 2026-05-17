<?php

use Illuminate\Support\Facades\Facade;

return [
    'name'            => env('APP_NAME', 'QuizQuest'),
    'env'             => env('APP_ENV', 'production'),
    'debug'           => (bool) env('APP_DEBUG', false),
    'url'             => env('APP_URL', 'http://localhost'),
    'asset_url'       => env('ASSET_URL'),
    'timezone'        => 'Asia/Jakarta',
    'locale'          => env('APP_LOCALE', 'id'),
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),
    'faker_locale'    => env('APP_FAKER_LOCALE', 'id_ID'),
    'cipher'          => 'AES-256-CBC',
    'key'             => env('APP_KEY'),
    'previous_keys'   => [],
    'maintenance'     => ['driver' => 'file'],
    'providers'       => \Illuminate\Support\ServiceProvider::defaultProviders()->merge([
        App\Providers\AppServiceProvider::class,
    ])->toArray(),
    'aliases'  => Facade::defaultAliases()->merge([])->toArray(),
];
