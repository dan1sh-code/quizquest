<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentQuizController;
use App\Http\Controllers\Teacher\TeacherDashboardController;
use App\Http\Controllers\Teacher\TeacherQuizController;
use App\Http\Controllers\Teacher\TeacherClassController;
use App\Http\Controllers\Teacher\TeacherGradingController;
use App\Http\Controllers\Teacher\TeacherAnalyticsController;
use App\Http\Controllers\Teacher\TeacherQuestionBankController;
use App\Http\Controllers\Teacher\TeacherProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminAnnouncementController;
use App\Http\Controllers\Api\AiApiController;

// ── Public ──────────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/leaderboard', [HomeController::class, 'leaderboard'])->name('leaderboard');
Route::get('/quiz/explore', [HomeController::class, 'explore'])->name('quiz.explore');

// ── Auth ─────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});
Route::middleware('auth')->post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// ── Dashboard redirect ───────────────────────────────────────────────
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth','verified'])->name('dashboard');

// ── Student ──────────────────────────────────────────────────────────
Route::middleware(['auth','verified','role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard',                  [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::post('/join-quiz',                 [StudentDashboardController::class, 'joinQuiz'])->name('join-quiz');
    Route::get('/quiz/{quiz}/start',          [StudentQuizController::class, 'start'])->name('quiz.start');
    Route::post('/quiz/{quiz}/begin',         [StudentQuizController::class, 'begin'])->name('quiz.begin');
    Route::get('/attempt/{attempt}/take',     [StudentQuizController::class, 'take'])->name('quiz.take');
    Route::post('/attempt/{attempt}/submit',  [StudentQuizController::class, 'submit'])->name('quiz.submit');
    Route::get('/attempt/{attempt}/result',   [StudentQuizController::class, 'result'])->name('quiz.result');
    Route::get('/history',    [StudentQuizController::class, 'history'])->name('quiz.history');
    Route::get('/classes',    [StudentDashboardController::class, 'classes'])->name('classes');
    Route::get('/leaderboard', [StudentDashboardController::class, 'leaderboard'])->name('leaderboard');
    Route::get('/achievements', [StudentDashboardController::class, 'achievements'])->name('achievements');
    Route::get('/profile',    fn() => Inertia::render('Student/Profile'))->name('profile');
});

// ── Teacher ──────────────────────────────────────────────────────────
Route::middleware(['auth','verified','role:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
    Route::get('/quizzes',                       [TeacherQuizController::class, 'index'])->name('quizzes.index');
    Route::get('/quizzes/create',                [TeacherQuizController::class, 'create'])->name('quizzes.create');
    Route::post('/quizzes',                      [TeacherQuizController::class, 'store'])->name('quizzes.store');
    Route::get('/quizzes/{quiz}/edit',           [TeacherQuizController::class, 'edit'])->name('quizzes.edit');
    Route::put('/quizzes/{quiz}',                [TeacherQuizController::class, 'update'])->name('quizzes.update');
    Route::delete('/quizzes/{quiz}',             [TeacherQuizController::class, 'destroy'])->name('quizzes.destroy');
    Route::get('/quizzes/{quiz}/results',        [TeacherQuizController::class, 'results'])->name('quizzes.results');
    Route::post('/quizzes/{quiz}/duplicate',     [TeacherQuizController::class, 'duplicate'])->name('quizzes.duplicate');
    Route::get('/classes',                       [TeacherClassController::class, 'index'])->name('classes.index');
    Route::get('/classes/create',                [TeacherClassController::class, 'create'])->name('classes.create');
    Route::post('/classes',                      [TeacherClassController::class, 'store'])->name('classes.store');
    Route::get('/classes/{classroom}/edit',      [TeacherClassController::class, 'edit'])->name('classes.edit');
    Route::put('/classes/{classroom}',           [TeacherClassController::class, 'update'])->name('classes.update');
    Route::delete('/classes/{classroom}',        [TeacherClassController::class, 'destroy'])->name('classes.destroy');
    Route::get('/classes/{classroom}/students',  [TeacherClassController::class, 'students'])->name('classes.students');
    Route::get('/grading',                       [TeacherGradingController::class, 'index'])->name('grading.index');
    Route::post('/grading/{answer}/grade',       [TeacherGradingController::class, 'grade'])->name('grading.grade');
    Route::get('/analytics',                     [TeacherAnalyticsController::class, 'index'])->name('analytics');
    Route::get('/question-bank',                  [TeacherQuestionBankController::class, 'index'])->name('question-bank');
    Route::post('/question-bank',                 [TeacherQuestionBankController::class, 'store'])->name('question-bank.store');
    Route::delete('/question-bank/quizzes/{quiz}', [TeacherQuestionBankController::class, 'destroyQuiz'])->name('question-bank.quizzes.destroy');
    Route::put('/question-bank/{question}',       [TeacherQuestionBankController::class, 'update'])->name('question-bank.update');
    Route::post('/question-bank/{question}/copy', [TeacherQuestionBankController::class, 'duplicate'])->name('question-bank.copy');
    Route::delete('/question-bank/{question}',    [TeacherQuestionBankController::class, 'destroy'])->name('question-bank.destroy');
    Route::get('/profile',                       [TeacherProfileController::class, 'edit'])->name('profile');
    Route::post('/profile',                      [TeacherProfileController::class, 'update'])->name('profile.update');
});

// ── Admin ─────────────────────────────────────────────────────────────
Route::middleware(['auth','verified','role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard',                        [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/users',                            [AdminUserController::class, 'index'])->name('users.index');
    Route::put('/users/{user}',                     [AdminUserController::class, 'update'])->name('users.update');
    Route::post('/users/{user}/toggle-status',      [AdminUserController::class, 'toggleStatus'])->name('users.toggle');
    Route::delete('/users/{user}',                  [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::get('/categories',                       [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories',                      [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}',            [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}',         [AdminCategoryController::class, 'destroy'])->name('categories.destroy');
    Route::get('/announcements',                    [AdminAnnouncementController::class, 'index'])->name('announcements.index');
    Route::post('/announcements',                   [AdminAnnouncementController::class, 'store'])->name('announcements.store');
    Route::put('/announcements/{announcement}',     [AdminAnnouncementController::class, 'update'])->name('announcements.update');
    Route::delete('/announcements/{announcement}',  [AdminAnnouncementController::class, 'destroy'])->name('announcements.destroy');
    Route::get('/settings',  [AdminSettingsController::class, 'index'])->name('settings');
    Route::post('/settings', [AdminSettingsController::class, 'update'])->name('settings.update');
    Route::get('/quizzes', fn() => Inertia::render('Admin/Quizzes'))->name('quizzes.index');
    Route::get('/reports',  fn() => Inertia::render('Admin/Reports'))->name('reports');
    Route::get('/logs',     fn() => Inertia::render('Admin/Logs'))->name('logs');
    Route::get('/profile',  fn() => Inertia::render('Admin/Profile'))->name('profile');
});

// ── Internal API (AI) ─────────────────────────────────────────────────
Route::middleware('auth')->prefix('api/internal')->name('api.')->group(function () {
    Route::post('/ai/discuss',  [AiApiController::class, 'discuss'])->name('ai.discuss');
    Route::post('/ai/continue', [AiApiController::class, 'continueChat'])->name('ai.continue');
});
