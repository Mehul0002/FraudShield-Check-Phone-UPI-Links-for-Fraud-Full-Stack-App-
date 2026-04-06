import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, Phone, Hash, Link2, ShieldCheck, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.startsWith('/admin')

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/')
  }

  return (
    <header className="cyber-gradient shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Shield className="w-10 h-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              Fraud<span className="text-red-400">Shield</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {!isAdmin ? (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`hover:text-blue-200 transition-colors font-medium ${location.pathname === '/' ? 'text-blue-200' : 'text-white/80'}`}>
                Home
              </Link>
              <Link to="/recent" className={`hover:text-blue-200 transition-colors font-medium ${location.pathname === '/recent' ? 'text-blue-200' : 'text-white/80'}`}>
                Recent Reports
              </Link>
              <Link 
                to="/report" 
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Report Fraud
              </Link>
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/admin/dashboard" className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/admin/dashboard' ? 'bg-blue-600 text-white' : 'text-white/80 hover:text-white'}`}>
                Dashboard
              </Link>
              <Link to="/admin/reports" className={`px-4 py-2 rounded-lg font-medium ${location.pathname === '/admin/reports' ? 'bg-blue-600 text-white' : 'text-white/80 hover:text-white'}`}>
                Reports
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {(mobileOpen || isAdmin) && (
          <div className={`md:hidden ${mobileOpen ? 'block' : 'hidden'} pb-4`}>
            {!isAdmin ? (
              <div className="flex flex-col space-y-2">
                <Link to="/" className="py-2 px-4 rounded-lg hover:bg-white/10 font-medium" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
                <Link to="/recent" className="py-2 px-4 rounded-lg hover:bg-white/10 font-medium" onClick={() => setMobileOpen(false)}>
                  Recent Reports
                </Link>
                <Link to="/report" className="py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg font-semibold text-center" onClick={() => setMobileOpen(false)}>
                  Report Fraud
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/admin/dashboard" className="py-2 px-4 rounded-lg hover:bg-white/10 font-medium" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/admin/reports" className="py-2 px-4 rounded-lg hover:bg-white/10 font-medium" onClick={() => setMobileOpen(false)}>
                  Reports
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-700 font-medium w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
