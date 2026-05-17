import React from 'react'
import AppLayout from '@/Components/Layout/AppLayout'
import PremiumPlaceholder from '@/Components/ui/PremiumPlaceholder'

export default function Logs() {
    return (
        <AppLayout title="Log Sistem">
            <PremiumPlaceholder title="Audit Trail & Logs" description="Sistem pemantauan aktivitas (audit trail) untuk keamanan server sedang diimplementasikan." />
        </AppLayout>
    )
}
