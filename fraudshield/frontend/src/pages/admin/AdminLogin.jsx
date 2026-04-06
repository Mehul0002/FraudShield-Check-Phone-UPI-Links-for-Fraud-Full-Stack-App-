import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, ShieldCheck, Mail, Key } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminLogin } from '@/api'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const AdminLogin = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const result = await adminLogin(data)
      toast.success('Welcome back, admin!')
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-20 w-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl blur opacity-75 animate-pulse"></div>
            <ShieldCheck className="relative h-20 w-20 text-white drop-shadow-2xl" />
          </div>
          <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-lg text-gray-600">
            Sign in to your admin account
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white/50 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/30" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pr-12 pl-14 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 appearance-none placeholder-gray-500"
                  placeholder="admin@fraudshield.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Key className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  {...register('password')}
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pr-12 pl-14 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 appearance-none placeholder-gray-500"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-8 border border-transparent text-xl font-bold rounded-2xl shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-7 w-7 text-blue-300 group-hover:text-blue-200 transition-colors" />
              </span>
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
