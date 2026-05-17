<?php

namespace Database\Seeders;

use App\Models\{User,Level,Category,Achievement,Setting,ClassRoom,Quiz,Question};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles
        foreach (['admin','teacher','student'] as $role) Role::firstOrCreate(['name'=>$role]);

        // Levels
        foreach ([
            [1,'Pemula','🌱','slate',0],[2,'Pelajar','📚','blue',100],[3,'Cendekia','🎓','indigo',300],
            [4,'Ahli','⭐','yellow',600],[5,'Master','💎','cyan',1000],[6,'Grandmaster','👑','orange',1500],
            [7,'Legend','🔥','red',2500],[8,'Mythic','🌟','purple',4000],[9,'Divine','⚡','violet',6000],[10,'Immortal','🏆','amber',10000],
        ] as [$num,$name,$emoji,$color,$xp]) Level::firstOrCreate(['level_number'=>$num],['name'=>$name,'badge_emoji'=>$emoji,'badge_color'=>$color,'xp_required'=>$xp]);

        // Categories
        foreach ([
            ['Matematika','matematika','➕','#3B82F6'],['IPA','ipa','🔬','#10B981'],['IPS','ips','🌍','#F59E0B'],
            ['Bahasa Indonesia','bahasa-indonesia','📝','#EF4444'],['Bahasa Inggris','bahasa-inggris','🇬🇧','#8B5CF6'],
            ['Sejarah','sejarah','🏛️','#D97706'],['Fisika','fisika','⚛️','#DC2626'],['Kimia','kimia','🧪','#7C3AED'],
            ['Biologi','biologi','🧬','#16A34A'],['Komputer','komputer','💻','#0891B2'],
            ['Geografi','geografi','🗺️','#059669'],['Umum','umum','📖','#6B7280'],
        ] as [$name,$slug,$icon,$color]) Category::firstOrCreate(['slug'=>$slug],['name'=>$name,'icon'=>$icon,'color'=>$color,'is_active'=>true]);

        // Achievements
        foreach ([
            ['Quiz Pertama','first-quiz','Menyelesaikan quiz pertama','🎯','quiz_count',1,50,'common'],
            ['Quiz Maniac','quiz-maniac','Menyelesaikan 10 quiz','🎮','quiz_count',10,100,'common'],
            ['Quiz Master','quiz-master','Menyelesaikan 50 quiz','🏆','quiz_count',50,300,'rare'],
            ['Sempurna!','perfect-score','Skor 100%','💯','score',100,200,'rare'],
            ['Streak 7 Hari','streak-7','Belajar 7 hari berturut','🔥','streak',7,150,'rare'],
            ['Streak 30 Hari','streak-30','Belajar 30 hari berturut','❤️','streak',30,500,'epic'],
            ['XP Collector','xp-1000','Kumpulkan 1000 XP','💎','xp',1000,100,'rare'],
            ['XP Legend','xp-10000','Kumpulkan 10.000 XP','👑','xp',10000,500,'legendary'],
            ['Pantang Menyerah','never-give-up','Retry hingga lulus','💪','retry',3,75,'common'],
            ['Speed Runner','speed-runner','Selesaikan quiz <60 detik','⚡','speed',60,100,'epic'],
        ] as [$n,$s,$d,$e,$t,$th,$xp,$r]) Achievement::firstOrCreate(['slug'=>$s],['name'=>$n,'description'=>$d,'badge_emoji'=>$e,'type'=>$t,'threshold'=>$th,'xp_reward'=>$xp,'rarity'=>$r,'is_active'=>true]);

        // Settings
        foreach ([
            ['site_name','QuizQuest','general','string'],['site_tagline','Belajar Seru, Raih Bintang!','general','string'],
            ['groq_api_key','','ai','string'],['groq_model','llama-3.1-70b-versatile','ai','string'],
            ['ai_enabled','1','ai','boolean'],['allow_registration','1','auth','boolean'],
            ['maintenance_mode','0','general','boolean'],['quiz_xp_base','10','xp','integer'],
            ['quiz_xp_perfect','50','xp','integer'],['quiz_xp_streak','5','xp','integer'],
        ] as [$k,$v,$g,$t]) Setting::firstOrCreate(['key'=>$k],['value'=>$v,'group'=>$g,'type'=>$t]);

        // Admin
        $admin = User::firstOrCreate(['email'=>'admin@quizquest.id'],['name'=>'Administrator','username'=>'admin','password'=>Hash::make('password123'),'email_verified_at'=>now(),'xp'=>9999,'level'=>9,'is_active'=>true]);
        $admin->syncRoles(['admin']);

        // Teacher
        $teacher = User::firstOrCreate(['email'=>'guru@quizquest.id'],['name'=>'Budi Santoso','username'=>'pak_budi','password'=>Hash::make('password123'),'email_verified_at'=>now(),'xp'=>2500,'level'=>6,'school'=>'SMAN 1 Jakarta','is_active'=>true]);
        $teacher->syncRoles(['teacher']);

        // Student
        $student = User::firstOrCreate(['email'=>'murid@quizquest.id'],['name'=>'Rina Wijaya','username'=>'rina_w','password'=>Hash::make('password123'),'email_verified_at'=>now(),'xp'=>350,'level'=>3,'school'=>'SMAN 1 Jakarta','grade'=>'XII IPA 1','is_active'=>true]);
        $student->syncRoles(['student']);

        // Class
        $class = ClassRoom::firstOrCreate(['code'=>'DEMO01'],['teacher_id'=>$teacher->id,'name'=>'XII IPA 1 - Demo','description'=>'Kelas demo QuizQuest','subject'=>'Semua Pelajaran','grade_level'=>'XII']);
        $class->students()->syncWithoutDetaching([$student->id]);

        // Sample Quiz
        $quiz = Quiz::firstOrCreate(['join_code'=>'DEMO2024'],[
            'teacher_id'=>$teacher->id,'class_id'=>$class->id,'category_id'=>Category::where('slug','matematika')->value('id'),
            'title'=>'Quiz Matematika Dasar','slug'=>'quiz-matematika-dasar-demo',
            'description'=>'Quiz untuk menguji kemampuan matematika dasar',
            'status'=>'published','difficulty'=>'easy','time_limit'=>30,
            'show_result_immediately'=>true,'show_answer_after'=>true,'is_public'=>true,
            'passing_score'=>70,'xp_reward'=>20,'max_attempts'=>3,
        ]);

        if ($quiz->questions()->count()===0) {
            $q1=$quiz->questions()->create(['question_text'=>'Berapakah hasil dari 15 × 8?','type'=>'multiple_choice','explanation'=>'15 × 8 = (10+5) × 8 = 80 + 40 = 120','points'=>10,'order'=>1,'has_ai_discussion'=>true]);
            $q1->options()->createMany([['option_text'=>'110','is_correct'=>false,'order'=>1],['option_text'=>'120','is_correct'=>true,'order'=>2],['option_text'=>'125','is_correct'=>false,'order'=>3],['option_text'=>'130','is_correct'=>false,'order'=>4]]);

            $q2=$quiz->questions()->create(['question_text'=>'Bilangan prima hanya bisa dibagi oleh 1 dan dirinya sendiri.','type'=>'true_false','explanation'=>'Benar! Bilangan prima punya tepat dua faktor.','points'=>10,'order'=>2,'has_ai_discussion'=>true]);
            $q2->options()->createMany([['option_text'=>'Benar','is_correct'=>true,'order'=>1],['option_text'=>'Salah','is_correct'=>false,'order'=>2]]);

            $q3=$quiz->questions()->create(['question_text'=>'Hasil dari √144 adalah ___','type'=>'fill_blank','explanation'=>'√144 = 12, karena 12 × 12 = 144','points'=>10,'order'=>3,'has_ai_discussion'=>true]);
            $q3->options()->create(['option_text'=>'12','is_correct'=>true,'order'=>1]);

            $quiz->questions()->create(['question_text'=>'Jelaskan apa yang dimaksud bilangan prima dan berikan 3 contohnya!','type'=>'essay','explanation'=>'Bilangan prima: 2, 3, 5, 7, 11, 13...','points'=>20,'order'=>4,'has_ai_discussion'=>true]);
        }

        $this->command->newLine();
        $this->command->info('🎯 ======================== QuizQuest Seeder ========================');
        $this->command->info('✅ Database berhasil di-seed!');
        $this->command->newLine();
        $this->command->info('🔑 Akun Default:');
        $this->command->info('   🛡️  Admin  → admin@quizquest.id  / password123');
        $this->command->info('   👨‍🏫 Guru   → guru@quizquest.id   / password123');
        $this->command->info('   👨‍🎓 Murid  → murid@quizquest.id  / password123');
        $this->command->newLine();
        $this->command->info('📋 Sample Quiz Code: DEMO2024');
        $this->command->info('🏫 Sample Class Code: DEMO01');
        $this->command->info('================================================================');
    }
}
