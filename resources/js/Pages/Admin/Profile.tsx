import React from 'react'
import AppLayout from '@/Components/Layout/AppLayout'
import PremiumPlaceholder from '@/Components/ui/PremiumPlaceholder'

export default function Profile() {
    return (
        <AppLayout title="Profil Admin">
            <PremiumPlaceholder title="Pengaturan Keamanan Admin" description="Halaman profil dan keamanan akun 2FA sedang dirancang." />
        </AppLayout>
    )
}
