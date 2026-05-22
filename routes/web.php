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
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminActivityLogController;
use App\Http\Controllers\Admin\AdminProfileController;
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
    Route::get('/categories/create',                [AdminCategoryController::class, 'create'])->name('categories.create');
    Route::get('/categories/{category}/edit',       [AdminCategoryController::class, 'edit'])->name('categories.edit');
    Route::post('/categories',                      [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}',            [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}',         [AdminCategoryController::class, 'destroy'])->name('categories.destroy');
    Route::get('/announcements',                    [AdminAnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/announcements/create',             [AdminAnnouncementController::class, 'create'])->name('announcements.create');
    Route::post('/announcements',                   [AdminAnnouncementController::class, 'store'])->name('announcements.store');
    Route::get('/announcements/{announcement}/edit',[AdminAnnouncementController::class, 'edit'])->name('announcements.edit');
    Route::put('/announcements/{announcement}',     [AdminAnnouncementController::class, 'update'])->name('announcements.update');
    Route::delete('/announcements/{announcement}',  [AdminAnnouncementController::class, 'destroy'])->name('announcements.destroy');
    Route::get('/settings',  [AdminSettingsController::class, 'index'])->name('settings');
    Route::post('/settings', [AdminSettingsController::class, 'update'])->name('settings.update');
    Route::get('/quizzes', [\App\Http\Controllers\Admin\AdminQuizController::class, 'index'])->name('quizzes.index');
    Route::get('/quizzes/{quiz}', [\App\Http\Controllers\Admin\AdminQuizController::class, 'show'])->name('quizzes.show');
    Route::delete('/quizzes/{quiz}/questions/{question}', [\App\Http\Controllers\Admin\AdminQuizController::class, 'destroyQuestion'])->name('quizzes.questions.destroy');
    Route::delete('/quizzes/{quiz}/questions', [\App\Http\Controllers\Admin\AdminQuizController::class, 'clearQuestions'])->name('quizzes.questions.clear');
    Route::delete('/quizzes/{quiz}', [\App\Http\Controllers\Admin\AdminQuizController::class, 'destroy'])->name('quizzes.destroy');
    
    // Reports
    Route::get('/reports', [AdminReportController::class, 'index'])->name('reports');
    Route::get('/reports/filter-options', [AdminReportController::class, 'getFilterOptions'])->name('reports.filter-options');
    
    // Student Performance Report
    Route::get('/reports/student-performance', [AdminReportController::class, 'studentPerformance'])->name('reports.student-performance');
    Route::get('/reports/student-performance/export-excel', [AdminReportController::class, 'exportStudentPerformanceExcel'])->name('reports.student-performance.excel');
    Route::get('/reports/student-performance/export-pdf', [AdminReportController::class, 'exportStudentPerformancePdf'])->name('reports.student-performance.pdf');
    
    // Quiz Analytics Report
    Route::get('/reports/quiz-analytics', [AdminReportController::class, 'quizAnalytics'])->name('reports.quiz-analytics');
    Route::get('/reports/quiz-analytics/export-excel', [AdminReportController::class, 'exportQuizAnalyticsExcel'])->name('reports.quiz-analytics.excel');
    Route::get('/reports/quiz-analytics/export-pdf', [AdminReportController::class, 'exportQuizAnalyticsPdf'])->name('reports.quiz-analytics.pdf');
    
    // Class Report
    Route::get('/reports/class', [AdminReportController::class, 'classReport'])->name('reports.class');
    Route::get('/reports/class/export-excel', [AdminReportController::class, 'exportClassReportExcel'])->name('reports.class.excel');
    
    // Achievement Report
    Route::get('/reports/achievement', [AdminReportController::class, 'achievementReport'])->name('reports.achievement');
    Route::get('/reports/achievement/export-excel', [AdminReportController::class, 'exportAchievementReportExcel'])->name('reports.achievement.excel');
    
    // User Activity Report
    Route::get('/reports/user-activity', [AdminReportController::class, 'userActivity'])->name('reports.user-activity');
    Route::get('/reports/user-activity/export-excel', [AdminReportController::class, 'exportUserActivityExcel'])->name('reports.user-activity.excel');
    Route::get('/reports/user-activity/export-pdf', [AdminReportController::class, 'exportUserActivityPdf'])->name('reports.user-activity.pdf');
    
    // Leaderboard Report
    Route::get('/reports/leaderboard', [AdminReportController::class, 'leaderboard'])->name('reports.leaderboard');
    Route::get('/reports/leaderboard/export-excel', [AdminReportController::class, 'exportLeaderboardExcel'])->name('reports.leaderboard.excel');
    
    Route::get('/logs',     [AdminActivityLogController::class, 'index'])->name('logs');
    Route::get('/profile', [AdminProfileController::class, 'index'])->name('profile');
    Route::post('/profile', [AdminProfileController::class, 'updateProfile'])->name('profile.update');
    Route::put('/profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password');
    Route::post('/profile/logout-other-sessions', [AdminProfileController::class, 'logoutOtherSessions'])->name('profile.logout-other-sessions');
    Route::delete('/profile/deactivate', [AdminProfileController::class, 'deactivate'])->name('profile.deactivate');
    Route::get('/category', [AdminCategoryController::class, 'index']);
    Route::get('/category/create', [AdminCategoryController::class, 'create']);
    Route::post('/category', [AdminCategoryController::class, 'store']);
});

// ── Internal API (AI) ─────────────────────────────────────────────────
Route::middleware('auth')->prefix('api/internal')->name('api.')->group(function () {
    Route::post('/ai/discuss',  [AiApiController::class, 'discuss'])->name('ai.discuss');
    Route::post('/ai/continue', [AiApiController::class, 'continueChat'])->name('ai.continue');
});
