<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Quiz;
use App\Policies\QuizPolicy;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        Quiz::class => QuizPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Quiz::class, QuizPolicy::class);
    }
}
