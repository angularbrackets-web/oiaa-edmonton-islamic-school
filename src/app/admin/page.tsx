import AdminLayout from '@/components/admin/AdminLayout'
import DashboardStats from '@/components/admin/DashboardStats'

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <DashboardStats />
    </AdminLayout>
  )
}

