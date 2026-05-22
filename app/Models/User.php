<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name','username','email','password','avatar','bio',
        'xp','level','streak_days','last_active','is_active','school','grade',
        'phone','language','subject_expertise','education','certification','website','linkedin',
        'portfolio_path','portfolio_name',
    ];
    protected $hidden = ['password','remember_token'];
    protected function casts(): array {
        return ['email_verified_at'=>'datetime','last_active'=>'date','password'=>'hashed','is_active'=>'boolean'];
    }

    // Relationships
    public function quizAttempts()   { return $this->hasMany(QuizAttempt::class); }
    public function xpTransactions() { return $this->hasMany(XpTransaction::class); }
    public function streaks()        { return $this->hasMany(Streak::class); }
    public function achievements()   {
        return $this->belongsToMany(Achievement::class,'user_achievements')->withPivot('earned_at');
    }
    public function classes() {
        return $this->belongsToMany(ClassRoom::class,'class_students','user_id','class_id')->withPivot('status','joined_at');
    }
    public function taughtClasses() { return $this->hasMany(ClassRoom::class,'teacher_id'); }
    public function quizzes()       { return $this->hasMany(Quiz::class,'teacher_id'); }

    // Accessors
    public function getAvatarUrlAttribute(): string {
        if ($this->avatar) return asset("storage/{$this->avatar}");
        return "https://ui-avatars.com/api/?name=".urlencode($this->name)."&background=7c3aed&color=fff&size=128&bold=true";
    }
    public function getLevelDataAttribute(): ?Level {
        return Level::where('level_number',$this->level)->first();
    }
    public function getNextLevelDataAttribute(): ?Level {
        return Level::where('level_number',$this->level+1)->first();
    }
    public function getXpProgressPercentAttribute(): int {
        $cur  = Level::where('level_number',$this->level)->first();
        $next = Level::where('level_number',$this->level+1)->first();
        if (!$next||!$cur) return 100;
        $inLvl  = $this->xp - $cur->xp_required;
        $needed = $next->xp_required - $cur->xp_required;
        if ($needed <= 0) return 100;
        return min(100,(int)(($inLvl/$needed)*100));
    }

    // Methods
    public function addXp(int $amount, string $type, string $description, $source=null): void {
        if ($this->hasRole('admin')) return;

        $this->increment('xp',$amount);
        $fresh = $this->fresh();
        XpTransaction::create(['user_id'=>$this->id,'amount'=>$amount,'type'=>$type,'description'=>$description,'source_type'=>$source?get_class($source):null,'source_id'=>$source?->id,'balance_after'=>$fresh->xp]);
        $this->checkLevelUp();
        $this->checkAchievements();
    }
    public function checkLevelUp(): void {
        $newLvl = Level::where('xp_required','<=',$this->fresh()->xp)->orderByDesc('level_number')->first();
        if ($newLvl && $newLvl->level_number > $this->level) $this->update(['level'=>$newLvl->level_number]);
    }
    public function checkAchievements(): void {
        $user   = $this->fresh();
        $earned = $user->achievements->pluck('id')->toArray();
        $achvs  = Achievement::whereNotIn('id',$earned)->where('is_active',true)->get();
        foreach ($achvs as $ach) {
            $met = match($ach->type) {
                'quiz_count' => $user->quizAttempts()->where('status','completed')->count() >= $ach->threshold,
                'xp'         => $user->xp >= $ach->threshold,
                'streak'     => $user->streak_days >= $ach->threshold,
                default      => false,
            };
            if ($met) {
                $user->achievements()->syncWithoutDetaching([$ach->id => ['earned_at'=>now()]]);
                if ($ach->xp_reward > 0) $user->addXp($ach->xp_reward,'achievement',"Pencapaian: {$ach->name}",$ach);
            }
        }
    }
    public function isAdmin():   bool { return $this->hasRole('admin'); }
    public function isTeacher(): bool { return $this->hasRole('teacher'); }
    public function isStudent(): bool { return $this->hasRole('student'); }
}
