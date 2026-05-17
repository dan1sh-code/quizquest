import React from 'react'
import AppLayout from '@/Components/Layout/AppLayout'
import PremiumPlaceholder from '@/Components/ui/PremiumPlaceholder'

export default function Reports() {
    return (
        <AppLayout title="Laporan & Statistik">
            <PremiumPlaceholder title="Dashboard Laporan" description="Fitur ekspor laporan ke Excel dan PDF sedang dalam pengerjaan." />
        </AppLayout>
    )
}
