import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Shield, Phone, Hash, Link2, AlertCircle, TrendingUp, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import RiskBadge from '@/components/RiskBadge'
import { searchEntity } from '@/api'

const Home = () => {
  const [activeTab, setActiveTab] = useState('phone')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const navigate = useNavigate()

  const tabs = [
    { id: 'phone', icon: Phone, label: 'Phone Number' },
    { id: 'upi', icon: Hash, label: 'UPI ID' },
    { id: 'url', icon: Link2, label: 'URL/Link' },
  ]

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const result = await searchEntity(activeTab.toUpperCase(), searchQuery)
      if (result.entity) {
        setSearchResult(result)
        navigate(`/search?type=${activeTab}&value=${encodeURIComponent(searchQuery)}`)
      } else {
        toast.success('✅ No fraud reports found. This appears safe!')
      }
    } catch (error) {
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="cyber-gradient text-white py-32 -mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
              Stay Safe From
              <span className="block text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text drop-shadow-2xl mt-2">
                Cyber Frauds
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 opacity-90 leading-relaxed">
              Search phone numbers, UPI IDs, and links to check if they're reported for fraud, scams, or phishing.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 bg-white/10 backdrop-blur-xl rounded-2xl p-1 shadow-2xl border border-white/20">
                <div className="flex-1 min-w-0">
                  <div className="flex border-2 border-white/30 rounded-xl p-1 bg-white/5">
                    <select 
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                      className="bg-transparent border-0 p-3 text-lg font-semibold text-white focus:ring-2 focus:ring-blue-400 rounded-l-xl min-w-[140px]"
                    >
                      {tabs.map(tab => (
                        <option key={tab.id} value={tab.id} className="bg-slate-800 text-white">
                          {tab.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter phone number, UPI ID, or URL..."
                      className="flex-1 bg-transparent border-0 p-3 text-lg placeholder-slate-300 focus:ring-2 focus:ring-blue-400 outline-none"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !searchQuery.trim()}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-r-xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Search size={24} />
                      <span>{loading ? 'Searching...' : 'Search'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-16 grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-[1.02] transition-all">
                <ShieldCheck className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Verified Reports</h3>
                <p className="text-blue-100">All reports are admin-approved before public display</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-[1.02] transition-all">
                <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Real-time Risk</h3>
                <p className="text-blue-100">Smart scoring based on report recency and severity</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:scale-[1.02] transition-all">
                <Users className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Community Powered</h3>
                <p className="text-blue-100">Millions protected by your reports</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">10K+</div>
              <div className="text-lg text-gray-600 font-semibold">Fraud Reports</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">5K+</div>
              <div className="text-lg text-gray-600 font-semibold">Risky Numbers</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">2K+</div>
              <div className="text-lg text-gray-600 font-semibold">Scam UPI IDs</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">500+</div>
              <div className="text-lg text-gray-600 font-semibold">Phishing Sites</div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-16">
            Stay <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Safe Online</span>
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="group cursor-pointer hover:scale-105 transition-all">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl">
                <AlertCircle className="w-16 h-16 mx-auto mb-6 opacity-75" />
                <h3 className="text-2xl font-bold mb-4">Never share OTP</h3>
                <p>Legitimate companies never ask for OTP via call or message</p>
              </div>
            </div>
            <div className="group cursor-pointer hover:scale-105 transition-all">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl">
                <Phone className="w-16 h-16 mx-auto mb-6 opacity-75" />
                <h3 className="text-2xl font-bold mb-4">Verify caller</h3>
                <p>Call back on official numbers. Don't trust caller ID</p>
              </div>
            </div>
            <div className="group cursor-pointer hover:scale-105 transition-all">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl">
                <Link2 className="w-16 h-16 mx-auto mb-6 opacity-75" />
                <h3 className="text-2xl font-bold mb-4">Check links</h3>
                <p>Hover to see real URL. Never click suspicious links</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
