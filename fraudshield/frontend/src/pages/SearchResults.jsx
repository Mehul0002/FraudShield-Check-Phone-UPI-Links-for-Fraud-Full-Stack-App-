import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ShieldAlert, AlertCircle } from 'lucide-react'
import RiskBadge from '@/components/RiskBadge'
import toast from 'react-hot-toast'
import { searchEntity } from '@/api'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const type = searchParams.get('type')
  const value = searchParams.get('value')
  const entityTypeLabels = {
    PHONE: 'Phone Number',
    UPI: 'UPI ID',
    URL: 'URL/Link',
  }

  useEffect(() => {
    if (!type || !value) {
      navigate('/')
    }
  }, [type, value, navigate])

  // Simulate search result (in real app, fetch from API)
  useEffect(() => {
    if (type && value) {
      // In real implementation, call searchEntity(type, value)
      toast.loading('Checking fraud reports...', { id: 'search' })
      
      // Simulate delay
      const timer = setTimeout(() => {
        toast.dismiss('search')
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [type, value])

  const mockResult = {
    entity: {
      id: 'mock',
      type,
      value,
      riskScore: Math.floor(Math.random() * 90),
      status: Math.random() > 0.3 ? 'HIGH_RISK' : 'SUSPICIOUS',
    },
    reportsCount: Math.floor(Math.random() * 20) + 1,
  }

  if (!type || !value) return null

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="cyber-gradient text-white p-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                {type === 'PHONE' && <div className="text-2xl">📞</div>}
                {type === 'UPI' && <div className="text-2xl">💳</div>}
                {type === 'URL' && <div className="text-2xl">🌐</div>}
              </div>
              <div>
                <h1 className="text-3xl font-black">{entityTypeLabels[type]}</h1>
                <p className="opacity-90">{value}</p>
              </div>
            </div>
            <RiskBadge 
              score={mockResult.entity.riskScore} 
              status={mockResult.entity.status}
              size="lg" 
            />
          </div>

          <div className="p-12 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl border-l-8 border-red-500">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Risk Assessment</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-semibold">Risk Score:</span> {mockResult.entity.riskScore}/100</div>
                  <div><span className="font-semibold">Status:</span> {mockResult.entity.status.replace('_', ' ')}</div>
                  <div><span className="font-semibold">Reports:</span> {mockResult.reportsCount} approved reports</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-l-8 border-blue-500">
                <ShieldAlert className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Recommended Action</h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">⚠️ High risk detected. Exercise extreme caution.</p>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-4">
                    <li>Do not share personal info</li>
                    <li>Do not click any links</li>
                    <li>Do not send money</li>
                    <li>Block & report immediately</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Reports</h3>
              <div className="space-y-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl hover:bg-white transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 mb-1">User reported phishing attempt</p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        Received call asking for bank details and OTP. Claimed to be from RBI. 
                        Suspicious number with multiple fraud reports.
                      </p>
                      <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-gray-200">
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Phishing</span>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
              <button 
                onClick={() => navigate('/report')}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-center"
              >
                Report This Fraud
              </button>
              <Link
                to="/recent"
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-center"
              >
                View All Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResults
