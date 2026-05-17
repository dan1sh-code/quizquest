import React from 'react'
import AppLayout from '@/Components/Layout/AppLayout'
import PremiumPlaceholder from '@/Components/ui/PremiumPlaceholder'

export default function Profile() {
    return (
        <AppLayout title="Profil Saya">
            <PremiumPlaceholder title="Pengaturan Profil" description="Pengaturan avatar dan informasi personal sedang dirakit." />
        </AppLayout>
    )
}
