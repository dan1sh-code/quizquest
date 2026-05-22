import React, { FormEvent } from 'react'
import { useForm } from '@inertiajs/react'
import AppLayout from '@/Components/Layout/AppLayout'
import Button from '@/Components/ui/Button'
import toast from 'react-hot-toast'

interface Props { auth: { user: any }; settings: Record<string, string> }

export default function AdminSettings({ settings }: Props) {
    const { data, setData, post, processing } = useForm({
        site_name: settings.site_name ?? 'QuizQuest',
        site_tagline: settings.site_tagline ?? 'Belajar Seru, Raih Bintang!',
        openrouter_api_key: '',
        openrouter_model: settings.openrouter_model ?? 'openrouter/free',
        ai_enabled: settings.ai_enabled === '1',
        allow_registration: settings.allow_registration !== '0',
        quiz_xp_base: settings.quiz_xp_base ?? '10',
        quiz_xp_perfect: settings.quiz_xp_perfect ?? '50',
        quiz_xp_streak: settings.quiz_xp_streak ?? '5',
    })

    const submit = (e: FormEvent) => {
        e.preventDefault()
        post('/admin/settings', { onSuccess: () => toast.success('Pengaturan tersimpan! ✅') })
    }

    const inputCls = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"

    return (
        <AppLayout title="Pengaturan Sistem">
            <div className="max-w-3xl mx-auto space-y-6">
                <form onSubmit={submit}>
                    {/* General */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 mb-5 space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">🌐 Pengaturan Umum</h3>
                        <div><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nama Situs</label>
                        <input value={data.site_name} onChange={e => setData('site_name', e.target.value)} className={inputCls} /></div>
                        <div><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tagline</label>
                        <input value={data.site_tagline} onChange={e => setData('site_tagline', e.target.value)} className={inputCls} /></div>
                        {[['allow_registration','Izinkan Registrasi Baru'],['maintenance_mode' as any,'Mode Maintenance 🚧']].map(([field, label]) => (
                            <label key={String(field)} className="flex items-center gap-3 cursor-pointer">
                                <div className="relative"><input type="checkbox" className="sr-only peer" checked={!!(data as any)[field]} onChange={e => setData(field as any, e.target.checked)} />
                                <div className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 peer-checked:bg-violet-600 transition-colors" />
                                <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-6" /></div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                            </label>
                        ))}
                    </div>

                    {/* AI */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 mb-5 space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">🤖 AI Tutor (OpenRouter API)</h3>
                        <div><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">OpenRouter API Key</label>
                        <input type="password" value={data.openrouter_api_key} onChange={e => setData('openrouter_api_key', e.target.value)}
                            placeholder="sk-or-v1-... (kosongkan jika tidak ingin mengubah)" className={inputCls} />
                        <p className="text-xs text-slate-500 mt-1.5">Dapatkan API key di <a href="https://openrouter.ai" target="_blank" rel="noopener" className="text-violet-600 hover:underline">openrouter.ai</a></p></div>
                        <div><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Model AI</label>
                        <select value={data.openrouter_model} onChange={e => setData('openrouter_model', e.target.value)} className={inputCls}>
                            {['openrouter/free','google/gemini-2.0-flash-exp:free','meta-llama/llama-3.3-70b-instruct:free'].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select></div>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div className="relative"><input type="checkbox" className="sr-only peer" checked={data.ai_enabled} onChange={e => setData('ai_enabled', e.target.checked)} />
                            <div className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 peer-checked:bg-violet-600 transition-colors" />
                            <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-6" /></div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Aktifkan AI Tutor</span>
                        </label>
                    </div>

                    {/* XP */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 mb-5">
                        <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">⚡ Konfigurasi XP</h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {[['quiz_xp_base','XP Dasar per Quiz'],['quiz_xp_perfect','Bonus XP Skor 100%'],['quiz_xp_streak','XP per Hari Streak']].map(([field, label]) => (
                                <div key={field}><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
                                <input type="number" min={0} value={(data as any)[field]} onChange={e => setData(field as any, e.target.value)} className={inputCls} /></div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" loading={processing} size="lg">💾 Simpan Semua Pengaturan</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
