export interface User {
    id: number
    name: string
    username?: string
    email: string
    avatar?: string | null
    avatar_url: string
    bio?: string
    xp: number
    level: number
    streak_days: number
    last_active?: string
    is_active: boolean
    school?: string
    grade?: string
    roles: Role[]
    level_data?: Level
    next_level_data?: Level
    xp_progress_percent: number
    achievements_count?: number
    created_at: string
}

export interface Role {
    id: number
    name: string
}

export interface Level {
    level_number: number
    name: string
    badge_emoji: string
    badge_color: string
    xp_required: number
}

export interface Category {
    id: number
    name: string
    slug: string
    icon?: string
    color?: string
    description?: string
    quizzes_count?: number
}

export interface ClassRoom {
    id: number
    teacher_id: number
    teacher?: User
    name: string
    code: string
    description?: string
    subject?: string
    grade_level?: string
    is_active: boolean
    students_count?: number
    quizzes_count?: number
    created_at: string
}

export interface Quiz {
    id: number
    teacher_id: number
    teacher?: User
    class_id?: number | null
    class?: ClassRoom | null
    category_id?: number | null
    category?: Category | null
    title: string
    slug: string
    description?: string
    cover_image?: string | null
    join_code: string
    status: 'draft' | 'published' | 'scheduled' | 'closed'
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
    time_limit?: number | null
    time_per_question: boolean
    question_time_limit?: number | null
    max_attempts: number
    shuffle_questions: boolean
    shuffle_options: boolean
    show_result_immediately: boolean
    show_answer_after: boolean
    is_public: boolean
    passing_score: number
    xp_reward: number
    starts_at?: string | null
    ends_at?: string | null
    tags?: string[] | null
    questions?: Question[]
    questions_count?: number
    attempts_count?: number
    average_score?: number
    created_at: string
}

export interface Question {
    id: number
    quiz_id: number
    question_text: string
    question_image?: string | null
    type: 'multiple_choice' | 'true_false' | 'essay' | 'fill_blank' | 'matching'
    explanation?: string | null
    has_ai_discussion: boolean
    points: number
    order: number
    difficulty: string
    options?: QuestionOption[]
    matching_pairs?: MatchingPair[]
}

export interface QuestionOption {
    id: number
    question_id: number
    option_text: string
    option_image?: string | null
    is_correct: boolean
    order: number
}

export interface MatchingPair {
    id: number
    question_id: number
    left_item: string
    right_item: string
    order: number
}

export interface QuizAttempt {
    id: number
    quiz_id: number
    quiz?: Quiz
    user_id: number
    user?: User
    status: 'in_progress' | 'completed' | 'abandoned' | 'grading'
    score: number
    max_score: number
    percentage: number
    passed: boolean
    correct_answers: number
    wrong_answers: number
    skipped_answers: number
    time_taken?: number
    xp_earned: number
    started_at: string
    completed_at?: string
    attempt_number: number
    answers?: AttemptAnswer[]
}

export interface AttemptAnswer {
    id: number
    attempt_id: number
    question_id: number
    question?: Question
    selected_option_id?: number | null
    selected_option?: QuestionOption | null
    essay_answer?: string | null
    fill_answer?: string | null
    matching_answer?: Record<string, string> | null
    is_correct?: boolean | null
    points_earned: number
    time_spent?: number
    teacher_feedback?: string | null
    grade_status: 'pending' | 'graded' | 'auto_graded'
}

export interface Achievement {
    id: number
    name: string
    slug: string
    description: string
    badge_emoji: string
    type: string
    threshold: number
    xp_reward: number
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    is_active: boolean
    pivot?: { earned_at: string }
}

export interface XpTransaction {
    id: number
    user_id: number
    amount: number
    type: string
    description: string
    balance_after: number
    created_at: string
}

export interface Announcement {
    id: number
    title: string
    content: string
    type: 'info' | 'warning' | 'success' | 'danger'
    target_role: string
    is_active: boolean
    expires_at?: string
    creator?: User
    created_at: string
}

export interface Setting {
    key: string
    value: string
    group: string
    label?: string
}

export interface AiMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export interface AiDiscussion {
    id: number
    question_id: number
    attempt_id: number
    user_id: number
    conversation: AiMessage[]
    model_used?: string
    created_at: string
}

export interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
    links: { url: string | null; label: string; active: boolean }[]
}

export interface PageProps {
    auth: { user: User }
    flash?: { success?: string; error?: string }
    ziggy?: { location: string; url: string }
    [key: string]: unknown
}
