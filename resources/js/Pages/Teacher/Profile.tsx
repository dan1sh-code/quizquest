import React from 'react'
import AppLayout from '@/Components/Layout/AppLayout'
import PremiumPlaceholder from '@/Components/ui/PremiumPlaceholder'

export default function Profile() {
    return (
        <AppLayout title="Profil Saya">
            <PremiumPlaceholder title="Pengaturan Profil" description="Halaman untuk mengelola avatar, password, dan detail profil sedang disiapkan." />
        </AppLayout>
    )
}
