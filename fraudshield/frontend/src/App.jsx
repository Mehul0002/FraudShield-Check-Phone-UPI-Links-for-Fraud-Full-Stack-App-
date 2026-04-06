import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Pages
const Home = lazy(() => import('@/pages/Home'))
const SearchResults = lazy(() => import('@/pages/SearchResults'))
const ReportFraud = lazy(() => import('@/pages/ReportFraud'))
const RecentReports = lazy(() => import('@/pages/RecentReports'))
const EntityDetail = lazy(() => import('@/pages/EntityDetail'))
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'))

// Components
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/report" element={<ReportFraud />} />
            <Route path="/recent" element={<RecentReports />} />
            <Route path="/entity/:id" element={<EntityDetail />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
