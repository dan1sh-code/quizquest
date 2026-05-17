import '../css/app.css'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { Toaster } from 'react-hot-toast'
import React from 'react'

const appName = (document.querySelector('meta[name="app-name"]') as HTMLMetaElement)?.content ?? 'QuizQuest'

createInertiaApp({
    title: (title) => title ? `${title} — ${appName}` : appName,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
        const page  = pages[`./Pages/${name}.tsx`]
        if (!page) throw new Error(`Page not found: ${name}`)
        return page as any
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <React.StrictMode>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1e1b4b',
                            color: '#fff',
                            borderRadius: '12px',
                            padding: '14px 18px',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: '1px solid rgba(139,92,246,0.3)',
                        },
                        success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                        error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                    }}
                />
            </React.StrictMode>
        )
    },
    progress: {
        color: '#7c3aed',
        showSpinner: true,
    },
})
