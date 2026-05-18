<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ClassRoom;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeacherQuizSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::where('email', 'guru@quizquest.id')->first();

        if (! $teacher) {
            $this->command?->warn('Teacher demo belum ada. Jalankan DatabaseSeeder terlebih dahulu.');
            return;
        }

        $class = ClassRoom::firstOrCreate(
            ['code' => 'DEMO01'],
            [
                'teacher_id' => $teacher->id,
                'name' => 'XII IPA 1 - Demo',
                'description' => 'Kelas demo QuizQuest',
                'subject' => 'Semua Pelajaran',
                'grade_level' => 'XII',
            ]
        );

        foreach ($this->quizzes() as $quizData) {
            $quiz = Quiz::firstOrCreate(
                ['join_code' => $quizData['join_code']],
                [
                    'teacher_id' => $teacher->id,
                    'class_id' => $class->id,
                    'category_id' => Category::where('slug', $quizData['category'])->value('id'),
                    'title' => $quizData['title'],
                    'slug' => $quizData['slug'],
                    'description' => $quizData['description'],
                    'status' => $quizData['status'],
                    'difficulty' => $quizData['difficulty'],
                    'time_limit' => $quizData['time_limit'],
                    'max_attempts' => $quizData['max_attempts'],
                    'shuffle_questions' => true,
                    'shuffle_options' => true,
                    'show_result_immediately' => true,
                    'show_answer_after' => true,
                    'is_public' => true,
                    'passing_score' => $quizData['passing_score'],
                    'xp_reward' => $quizData['xp_reward'],
                    'tags' => $quizData['tags'],
                ]
            );

            if ($quiz->questions()->exists()) {
                continue;
            }

            foreach ($quizData['questions'] as $index => $questionData) {
                $question = $quiz->questions()->create([
                    'question_text' => $questionData['text'],
                    'type' => $questionData['type'],
                    'explanation' => $questionData['explanation'] ?? null,
                    'points' => $questionData['points'] ?? 10,
                    'difficulty' => $questionData['difficulty'] ?? $quizData['difficulty'],
                    'order' => $index + 1,
                    'has_ai_discussion' => true,
                ]);

                if (in_array($questionData['type'], ['multiple_choice', 'true_false'], true)) {
                    foreach ($questionData['options'] as $optionIndex => $option) {
                        $question->options()->create([
                            'option_text' => $option['text'],
                            'is_correct' => $option['correct'],
                            'order' => $optionIndex + 1,
                        ]);
                    }
                }

                if ($questionData['type'] === 'fill_blank') {
                    $question->options()->create([
                        'option_text' => $questionData['answer'],
                        'is_correct' => true,
                        'order' => 1,
                    ]);
                }

                if ($questionData['type'] === 'matching') {
                    foreach ($questionData['pairs'] as $pairIndex => $pair) {
                        $question->matchingPairs()->create([
                            'left_item' => $pair[0],
                            'right_item' => $pair[1],
                            'order' => $pairIndex + 1,
                        ]);
                    }
                }
            }
        }
    }

    private function quizzes(): array
    {
        return [
            [
                'join_code' => 'MTKX001',
                'title' => 'Aljabar Linear Kelas X',
                'slug' => 'aljabar-linear-kelas-x',
                'description' => 'Latihan persamaan linear, substitusi, eliminasi, dan pola bilangan.',
                'category' => 'matematika',
                'status' => 'published',
                'difficulty' => 'medium',
                'time_limit' => 35,
                'max_attempts' => 3,
                'passing_score' => 75,
                'xp_reward' => 30,
                'tags' => ['aljabar', 'kelas-x', 'matematika'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Nilai x dari persamaan 3x + 7 = 22 adalah ...',
                        'explanation' => '3x + 7 = 22, maka 3x = 15 dan x = 5.',
                        'options' => [
                            ['text' => '3', 'correct' => false],
                            ['text' => '5', 'correct' => true],
                            ['text' => '7', 'correct' => false],
                            ['text' => '9', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Jika 2a - b = 10 dan b = 4, maka nilai a adalah ...',
                        'explanation' => '2a - 4 = 10, maka 2a = 14 dan a = 7.',
                        'options' => [
                            ['text' => '5', 'correct' => false],
                            ['text' => '6', 'correct' => false],
                            ['text' => '7', 'correct' => true],
                            ['text' => '8', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'Persamaan 4x = 20 memiliki penyelesaian x = 5.',
                        'explanation' => 'Benar, karena 20 dibagi 4 sama dengan 5.',
                        'options' => [
                            ['text' => 'Benar', 'correct' => true],
                            ['text' => 'Salah', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'fill_blank',
                        'text' => 'Hasil dari 8x - 3x adalah ___x.',
                        'answer' => '5',
                        'explanation' => 'Suku sejenis dikurangkan: 8x - 3x = 5x.',
                    ],
                    [
                        'type' => 'essay',
                        'text' => 'Jelaskan perbedaan metode substitusi dan eliminasi dalam menyelesaikan SPLDV.',
                        'points' => 20,
                        'explanation' => 'Substitusi mengganti satu variabel dengan bentuk lain, sedangkan eliminasi menghilangkan salah satu variabel.',
                    ],
                ],
            ],
            [
                'join_code' => 'IPAX002',
                'title' => 'Sistem Organ Manusia',
                'slug' => 'sistem-organ-manusia',
                'description' => 'Quiz IPA tentang pencernaan, pernapasan, peredaran darah, dan ekskresi.',
                'category' => 'ipa',
                'status' => 'published',
                'difficulty' => 'medium',
                'time_limit' => 30,
                'max_attempts' => 2,
                'passing_score' => 70,
                'xp_reward' => 25,
                'tags' => ['ipa', 'biologi', 'organ'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Organ utama yang berfungsi memompa darah ke seluruh tubuh adalah ...',
                        'explanation' => 'Jantung memompa darah melalui pembuluh darah ke seluruh tubuh.',
                        'options' => [
                            ['text' => 'Paru-paru', 'correct' => false],
                            ['text' => 'Jantung', 'correct' => true],
                            ['text' => 'Ginjal', 'correct' => false],
                            ['text' => 'Hati', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'matching',
                        'text' => 'Pasangkan organ dengan fungsi utamanya.',
                        'pairs' => [
                            ['Paru-paru', 'Pertukaran oksigen dan karbon dioksida'],
                            ['Lambung', 'Mencerna makanan secara mekanik dan kimiawi'],
                            ['Ginjal', 'Menyaring darah dan membentuk urine'],
                        ],
                        'explanation' => 'Setiap organ memiliki fungsi khusus dalam sistem tubuh manusia.',
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'Usus halus merupakan tempat utama penyerapan sari-sari makanan.',
                        'explanation' => 'Benar, sebagian besar nutrisi diserap di usus halus.',
                        'options' => [
                            ['text' => 'Benar', 'correct' => true],
                            ['text' => 'Salah', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'fill_blank',
                        'text' => 'Proses menghirup udara disebut ___',
                        'answer' => 'inspirasi',
                        'explanation' => 'Inspirasi adalah proses masuknya udara ke paru-paru.',
                    ],
                ],
            ],
            [
                'join_code' => 'BINX003',
                'title' => 'Teks Eksposisi dan Argumentasi',
                'slug' => 'teks-eksposisi-dan-argumentasi',
                'description' => 'Latihan Bahasa Indonesia tentang struktur teks, gagasan utama, dan kalimat argumentatif.',
                'category' => 'bahasa-indonesia',
                'status' => 'published',
                'difficulty' => 'easy',
                'time_limit' => 25,
                'max_attempts' => 3,
                'passing_score' => 70,
                'xp_reward' => 20,
                'tags' => ['bahasa-indonesia', 'teks', 'argumentasi'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Bagian teks eksposisi yang berisi pengenalan isu disebut ...',
                        'explanation' => 'Tesis berisi pernyataan pendapat atau pengenalan isu.',
                        'options' => [
                            ['text' => 'Tesis', 'correct' => true],
                            ['text' => 'Argumentasi', 'correct' => false],
                            ['text' => 'Penegasan ulang', 'correct' => false],
                            ['text' => 'Orientasi', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'Argumen yang baik sebaiknya didukung oleh data atau fakta.',
                        'explanation' => 'Benar, data membuat argumen lebih kuat dan dapat dipercaya.',
                        'options' => [
                            ['text' => 'Benar', 'correct' => true],
                            ['text' => 'Salah', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'essay',
                        'text' => 'Buat satu paragraf singkat berisi argumen tentang pentingnya membaca buku.',
                        'points' => 20,
                        'explanation' => 'Jawaban ideal memiliki pendapat, alasan, dan contoh pendukung.',
                    ],
                ],
            ],
            [
                'join_code' => 'SEJX004',
                'title' => 'Pergerakan Nasional Indonesia',
                'slug' => 'pergerakan-nasional-indonesia',
                'description' => 'Quiz sejarah tentang organisasi pergerakan nasional dan tokoh-tokohnya.',
                'category' => 'sejarah',
                'status' => 'published',
                'difficulty' => 'medium',
                'time_limit' => 30,
                'max_attempts' => 2,
                'passing_score' => 75,
                'xp_reward' => 30,
                'tags' => ['sejarah', 'nasionalisme', 'indonesia'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Organisasi Budi Utomo didirikan pada tahun ...',
                        'explanation' => 'Budi Utomo didirikan pada 20 Mei 1908.',
                        'options' => [
                            ['text' => '1905', 'correct' => false],
                            ['text' => '1908', 'correct' => true],
                            ['text' => '1912', 'correct' => false],
                            ['text' => '1928', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Sumpah Pemuda dilaksanakan pada tanggal ...',
                        'explanation' => 'Sumpah Pemuda dilaksanakan pada 28 Oktober 1928.',
                        'options' => [
                            ['text' => '20 Mei 1908', 'correct' => false],
                            ['text' => '17 Agustus 1945', 'correct' => false],
                            ['text' => '28 Oktober 1928', 'correct' => true],
                            ['text' => '1 Juni 1945', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'fill_blank',
                        'text' => 'Tokoh pendidikan nasional yang dikenal dengan semboyan Ing Ngarsa Sung Tuladha adalah ___',
                        'answer' => 'Ki Hajar Dewantara',
                        'explanation' => 'Ki Hajar Dewantara adalah tokoh pendidikan nasional Indonesia.',
                    ],
                ],
            ],
            [
                'join_code' => 'KOMX005',
                'title' => 'Dasar Pemrograman',
                'slug' => 'dasar-pemrograman',
                'description' => 'Quiz pengantar algoritma, variabel, percabangan, dan perulangan.',
                'category' => 'komputer',
                'status' => 'draft',
                'difficulty' => 'easy',
                'time_limit' => 25,
                'max_attempts' => 3,
                'passing_score' => 70,
                'xp_reward' => 20,
                'tags' => ['komputer', 'pemrograman', 'algoritma'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Urutan langkah logis untuk menyelesaikan masalah disebut ...',
                        'explanation' => 'Algoritma adalah rangkaian langkah logis dan sistematis.',
                        'options' => [
                            ['text' => 'Algoritma', 'correct' => true],
                            ['text' => 'Database', 'correct' => false],
                            ['text' => 'Compiler', 'correct' => false],
                            ['text' => 'Browser', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'Variabel digunakan untuk menyimpan nilai dalam program.',
                        'explanation' => 'Benar, variabel adalah tempat menyimpan data sementara.',
                        'options' => [
                            ['text' => 'Benar', 'correct' => true],
                            ['text' => 'Salah', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'essay',
                        'text' => 'Jelaskan perbedaan percabangan if dan perulangan for.',
                        'points' => 20,
                        'explanation' => 'If memilih aksi berdasarkan kondisi, for mengulang aksi beberapa kali.',
                    ],
                ],
            ],
            [
                'join_code' => 'GEOX006',
                'title' => 'Dinamika Litosfer dan Bumi',
                'slug' => 'dinamika-litosfer-dan-bumi',
                'description' => 'Quiz Geografi tentang lapisan bumi, tenaga endogen, vulkanisme, dan gempa.',
                'category' => 'geografi',
                'status' => 'published',
                'difficulty' => 'medium',
                'time_limit' => 30,
                'max_attempts' => 2,
                'passing_score' => 75,
                'xp_reward' => 30,
                'tags' => ['geografi', 'litosfer', 'bumi'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Lapisan bumi yang tersusun atas kerak bumi dan bagian atas mantel disebut ...',
                        'explanation' => 'Litosfer terdiri atas kerak bumi dan mantel bagian atas yang bersifat kaku.',
                        'options' => [
                            ['text' => 'Atmosfer', 'correct' => false],
                            ['text' => 'Hidrosfer', 'correct' => false],
                            ['text' => 'Litosfer', 'correct' => true],
                            ['text' => 'Biosfer', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'Gempa tektonik terjadi karena aktivitas pergeseran lempeng bumi.',
                        'explanation' => 'Benar, gempa tektonik dipicu oleh pergerakan atau patahan lempeng.',
                        'options' => [
                            ['text' => 'Benar', 'correct' => true],
                            ['text' => 'Salah', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'matching',
                        'text' => 'Pasangkan istilah geografi dengan penjelasannya.',
                        'pairs' => [
                            ['Epirogenesa', 'Gerak naik turun kulit bumi secara lambat'],
                            ['Orogenesa', 'Pembentukan pegunungan'],
                            ['Vulkanisme', 'Aktivitas magma menuju permukaan bumi'],
                        ],
                        'explanation' => 'Tenaga endogen membentuk relief permukaan bumi melalui beberapa proses.',
                    ],
                ],
            ],
            [
                'join_code' => 'ENGX007',
                'title' => 'English Tenses Practice',
                'slug' => 'english-tenses-practice',
                'description' => 'Latihan Bahasa Inggris tentang simple present, past tense, dan present continuous.',
                'category' => 'bahasa-inggris',
                'status' => 'published',
                'difficulty' => 'easy',
                'time_limit' => 25,
                'max_attempts' => 3,
                'passing_score' => 70,
                'xp_reward' => 20,
                'tags' => ['english', 'grammar', 'tenses'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Choose the correct sentence in simple present tense.',
                        'explanation' => 'For third person singular, the verb needs -s or -es.',
                        'options' => [
                            ['text' => 'She go to school every day.', 'correct' => false],
                            ['text' => 'She goes to school every day.', 'correct' => true],
                            ['text' => 'She going to school every day.', 'correct' => false],
                            ['text' => 'She went to school every day.', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'fill_blank',
                        'text' => 'I ___ studying English right now.',
                        'answer' => 'am',
                        'explanation' => 'Present continuous untuk subjek I memakai am.',
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'The past form of "write" is "wrote".',
                        'explanation' => 'Benar, write adalah irregular verb dengan past form wrote.',
                        'options' => [
                            ['text' => 'True', 'correct' => true],
                            ['text' => 'False', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'essay',
                        'text' => 'Write three sentences about your daily routine using simple present tense.',
                        'points' => 20,
                        'explanation' => 'Jawaban ideal memakai pola simple present seperti I wake up, I study, I help.',
                    ],
                ],
            ],
            [
                'join_code' => 'FISX008',
                'title' => 'Gerak Lurus dan Gaya',
                'slug' => 'gerak-lurus-dan-gaya',
                'description' => 'Quiz Fisika tentang GLB, GLBB, hukum Newton, dan satuan gaya.',
                'category' => 'fisika',
                'status' => 'published',
                'difficulty' => 'medium',
                'time_limit' => 35,
                'max_attempts' => 2,
                'passing_score' => 75,
                'xp_reward' => 30,
                'tags' => ['fisika', 'gerak', 'newton'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Satuan gaya dalam SI adalah ...',
                        'explanation' => 'Satuan gaya adalah Newton, disingkat N.',
                        'options' => [
                            ['text' => 'Joule', 'correct' => false],
                            ['text' => 'Newton', 'correct' => true],
                            ['text' => 'Watt', 'correct' => false],
                            ['text' => 'Pascal', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'fill_blank',
                        'text' => 'Jika benda menempuh jarak 100 m dalam 20 s, kecepatannya adalah ___ m/s.',
                        'answer' => '5',
                        'explanation' => 'Kecepatan = jarak / waktu = 100 / 20 = 5 m/s.',
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'Pada GLB, kecepatan benda bernilai tetap.',
                        'explanation' => 'Benar, gerak lurus beraturan memiliki kecepatan konstan.',
                        'options' => [
                            ['text' => 'Benar', 'correct' => true],
                            ['text' => 'Salah', 'correct' => false],
                        ],
                    ],
                ],
            ],
            [
                'join_code' => 'KIMX009',
                'title' => 'Struktur Atom dan Sistem Periodik',
                'slug' => 'struktur-atom-dan-sistem-periodik',
                'description' => 'Quiz Kimia tentang partikel penyusun atom, nomor atom, massa atom, dan golongan.',
                'category' => 'kimia',
                'status' => 'published',
                'difficulty' => 'medium',
                'time_limit' => 30,
                'max_attempts' => 2,
                'passing_score' => 75,
                'xp_reward' => 30,
                'tags' => ['kimia', 'atom', 'periodik'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Partikel subatom yang bermuatan negatif adalah ...',
                        'explanation' => 'Elektron bermuatan negatif dan bergerak mengelilingi inti atom.',
                        'options' => [
                            ['text' => 'Proton', 'correct' => false],
                            ['text' => 'Neutron', 'correct' => false],
                            ['text' => 'Elektron', 'correct' => true],
                            ['text' => 'Nukleon', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'Nomor atom menunjukkan jumlah proton dalam inti atom.',
                        'explanation' => 'Benar, nomor atom sama dengan jumlah proton.',
                        'options' => [
                            ['text' => 'Benar', 'correct' => true],
                            ['text' => 'Salah', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'fill_blank',
                        'text' => 'Atom netral memiliki jumlah proton dan ___ yang sama.',
                        'answer' => 'elektron',
                        'explanation' => 'Pada atom netral, jumlah muatan positif dan negatif seimbang.',
                    ],
                ],
            ],
            [
                'join_code' => 'BIOX010',
                'title' => 'Ekosistem dan Rantai Makanan',
                'slug' => 'ekosistem-dan-rantai-makanan',
                'description' => 'Quiz Biologi tentang komponen ekosistem, aliran energi, dan hubungan antar makhluk hidup.',
                'category' => 'biologi',
                'status' => 'published',
                'difficulty' => 'easy',
                'time_limit' => 25,
                'max_attempts' => 3,
                'passing_score' => 70,
                'xp_reward' => 20,
                'tags' => ['biologi', 'ekosistem', 'rantai-makanan'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Makhluk hidup yang mampu membuat makanan sendiri disebut ...',
                        'explanation' => 'Produsen seperti tumbuhan dapat membuat makanan sendiri melalui fotosintesis.',
                        'options' => [
                            ['text' => 'Konsumen', 'correct' => false],
                            ['text' => 'Produsen', 'correct' => true],
                            ['text' => 'Pengurai', 'correct' => false],
                            ['text' => 'Predator', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'matching',
                        'text' => 'Pasangkan peran organisme dalam ekosistem.',
                        'pairs' => [
                            ['Rumput', 'Produsen'],
                            ['Belalang', 'Konsumen tingkat I'],
                            ['Jamur', 'Pengurai'],
                        ],
                        'explanation' => 'Setiap organisme memiliki peran berbeda dalam aliran energi.',
                    ],
                    [
                        'type' => 'essay',
                        'text' => 'Jelaskan apa yang terjadi pada ekosistem jika jumlah predator menurun drastis.',
                        'points' => 20,
                        'explanation' => 'Populasi mangsa bisa meningkat dan keseimbangan ekosistem terganggu.',
                    ],
                ],
            ],
            [
                'join_code' => 'IPSX011',
                'title' => 'Kegiatan Ekonomi Masyarakat',
                'slug' => 'kegiatan-ekonomi-masyarakat',
                'description' => 'Quiz IPS tentang produksi, distribusi, konsumsi, dan pelaku ekonomi.',
                'category' => 'ips',
                'status' => 'published',
                'difficulty' => 'easy',
                'time_limit' => 25,
                'max_attempts' => 3,
                'passing_score' => 70,
                'xp_reward' => 20,
                'tags' => ['ips', 'ekonomi', 'masyarakat'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Kegiatan menghasilkan barang atau jasa disebut ...',
                        'explanation' => 'Produksi adalah kegiatan menghasilkan atau menambah nilai guna barang dan jasa.',
                        'options' => [
                            ['text' => 'Produksi', 'correct' => true],
                            ['text' => 'Distribusi', 'correct' => false],
                            ['text' => 'Konsumsi', 'correct' => false],
                            ['text' => 'Inflasi', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'Distribusi adalah kegiatan menyalurkan barang dari produsen ke konsumen.',
                        'explanation' => 'Benar, distribusi menghubungkan produsen dengan konsumen.',
                        'options' => [
                            ['text' => 'Benar', 'correct' => true],
                            ['text' => 'Salah', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'fill_blank',
                        'text' => 'Orang yang memakai barang atau jasa disebut ___',
                        'answer' => 'konsumen',
                        'explanation' => 'Konsumen adalah pihak yang menggunakan barang atau jasa.',
                    ],
                ],
            ],
            [
                'join_code' => 'UMUX012',
                'title' => 'Pengetahuan Umum Indonesia',
                'slug' => 'pengetahuan-umum-indonesia',
                'description' => 'Quiz umum tentang Indonesia, simbol negara, dan wawasan kebangsaan.',
                'category' => 'umum',
                'status' => 'published',
                'difficulty' => 'easy',
                'time_limit' => 20,
                'max_attempts' => 3,
                'passing_score' => 70,
                'xp_reward' => 15,
                'tags' => ['umum', 'indonesia', 'wawasan'],
                'questions' => [
                    [
                        'type' => 'multiple_choice',
                        'text' => 'Dasar negara Indonesia adalah ...',
                        'explanation' => 'Pancasila adalah dasar negara Republik Indonesia.',
                        'options' => [
                            ['text' => 'Pancasila', 'correct' => true],
                            ['text' => 'UUD 1945', 'correct' => false],
                            ['text' => 'Bhinneka Tunggal Ika', 'correct' => false],
                            ['text' => 'Garuda Indonesia', 'correct' => false],
                        ],
                    ],
                    [
                        'type' => 'fill_blank',
                        'text' => 'Ibu kota Indonesia saat ini adalah ___',
                        'answer' => 'Jakarta',
                        'explanation' => 'Jakarta masih menjadi ibu kota pemerintahan yang umum digunakan dalam konteks administratif saat ini.',
                    ],
                    [
                        'type' => 'true_false',
                        'text' => 'Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu.',
                        'explanation' => 'Benar, semboyan ini menekankan persatuan dalam keberagaman.',
                        'options' => [
                            ['text' => 'Benar', 'correct' => true],
                            ['text' => 'Salah', 'correct' => false],
                        ],
                    ],
                ],
            ],
        ];
    }
}
