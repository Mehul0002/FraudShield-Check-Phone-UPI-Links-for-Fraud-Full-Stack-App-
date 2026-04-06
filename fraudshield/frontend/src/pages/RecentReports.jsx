import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import RiskBadge from '@/components/RiskBadge'
import toast from 'react-hot-toast'
import { getRecentReports } from '@/api'

const RecentReports = () => {
  const [reports, setReports] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchReports()
  }, [page])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const { reports: data, pagination: pag } = await getRecentReports(page)
      setReports(data)
      setPagination(pag)
    } catch (error) {
      toast.error('Failed to load recent reports')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading recent reports...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-gray-900 mb-6">Recent Reports</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Latest approved fraud reports from our community. Stay informed about current threats.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-32">
            <ShieldCheck className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No reports yet</h3>
            <p className="text-gray-600 mb-8">Be the first to report fraud activity!</p>
            <Link 
              to="/report"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              Report Fraud Now
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {reports.map((report) => (
                <Link 
                  key={report.id}
                  to={`/entity/${report.entityId}`}
                  className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {report.entity.type === 'PHONE' && '📞'}
                      {report.entity.type === 'UPI' && '💳'}
                      {report.entity.type === 'URL' && '🌐'}
                      <span>{report.entity.type}</span>
                    </div>
                    <RiskBadge 
                      score={report.entity.riskScore} 
                      status={report.entity.status}
                      size="sm" 
                    />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-black text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {report.entity.value}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {report.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {report.fraudCategory.replace('_', ' ').toLowerCase()}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </button>

                <span className="px-6 py-3 bg-white rounded-xl shadow-md font-semibold">
                  Page {page} of {pagination.pages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default RecentReports
