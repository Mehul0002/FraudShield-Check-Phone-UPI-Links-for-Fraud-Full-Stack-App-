import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { ArrowLeft, Upload, ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { submitReport } from '@/api'

const schema = z.object({
  type: z.enum(['PHONE', 'UPI', 'URL'], { required_error: 'Select entity type' }),
  value: z.string().min(1, 'Entity value is required').max(100, 'Too long'),
  fraudCategory: z.enum(['PHISHING', 'OTP_FRAUD', 'FAKE_PAYMENT', 'LOAN_SCAM', 'DELIVERY_SCAM', 'IMPERSONATION', 'JOB_SCAM', 'INVESTMENT_SCAM', 'TECH_SUPPORT_SCAM', 'SPAM', 'OTHER'], { required_error: 'Select fraud category' }),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description too long'),
  reporterName: z.string().optional(),
  reporterEmail: z.string().email('Invalid email').optional(),
})

const ReportFraud = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [evidencePreview, setEvidencePreview] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const reportData = new FormData()
      reportData.append('type', data.type)
      reportData.append('value', data.value)
      reportData.append('fraudCategory', data.fraudCategory)
      reportData.append('description', data.description)
      
      if (data.reporterName) reportData.append('reporterName', data.reporterName)
      if (data.reporterEmail) reportData.append('reporterEmail', data.reporterEmail)
      if (data.evidence[0]) reportData.append('evidence', data.evidence[0])

      const result = await submitReport(reportData)
      toast.success(result.message)
      reset()
      setEvidencePreview(null)
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ShieldAlert className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Report Fraud</h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Help keep the community safe by reporting suspicious activity
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Entity Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">What type of fraud?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'PHONE', label: 'Phone Number', icon: '📞' },
                  { value: 'UPI', label: 'UPI ID', icon: '💳' },
                  { value: 'URL', label: 'Website/Link', icon: '🌐' },
                ].map(({ value, label, icon }) => (
                  <label key={value} className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
                    <input
                      {...register('type')}
                      type="radio"
                      value={value}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-4">{icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600">{label}</div>
                      <div className="text-sm text-gray-500">Report suspicious {label.toLowerCase()}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type.message}</p>}
            </div>

            {/* Entity Value */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Enter the {watch('type')?.toLowerCase() || 'entity'} (required)
              </label>
              <input
                {...register('value')}
                type="text"
                placeholder={
                  watch('type') === 'PHONE' ? '+91 9876543210' :
                  watch('type') === 'UPI' ? 'scammer@ybl' :
                  'phishingsite.com'
                }
                className="w-full p-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 shadow-sm transition-all text-lg"
              />
              {errors.value && <p className="text-red-500 text-sm mt-2">{errors.value.message}</p>}
            </div>

            {/* Fraud Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Fraud Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'PHISHING', 'OTP_FRAUD', 'FAKE_PAYMENT',
                  'LOAN_SCAM', 'DELIVERY_SCAM', 'IMPERSONATION',
                  'JOB_SCAM', 'INVESTMENT_SCAM', 'TECH_SUPPORT_SCAM',
                  'SPAM', 'OTHER'
                ].map(category => (
                  <label key={category} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:shadow-md transition-all cursor-pointer">
                    <input
                      {...register('fraudCategory')}
                      type="radio"
                      value={category}
                      className="mr-3 text-orange-500"
                    />
                    <span className="font-medium">{category.replace('_', ' ').toLowerCase()}</span>
                  </label>
                ))}
              </div>
              {errors.fraudCategory && <p className="text-red-500 text-sm mt-2">{errors.fraudCategory.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Description (What happened?)
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Tell us exactly what happened. Include dates, amounts, messages received etc. This helps us verify the report."
                className="w-full p-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 shadow-sm resize-vertical"
              />
              {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>}
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Screenshot/Evidence (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  {...register('evidence')}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="evidence"
                />
                <label htmlFor="evidence" className="cursor-pointer">
                  <div className="text-gray-500 mb-4">
                    <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Click to upload screenshot</p>
                    <p className="text-sm">PNG, JPG up to 5MB</p>
                  </div>
                </label>
                {evidencePreview && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <img src={evidencePreview} alt="Preview" className="max-w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Your Name (optional)</label>
                <input
                  {...register('reporterName')}
                  type="text"
                  placeholder="Anonymous"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email for updates (optional)</label>
                <input
                  {...register('reporterEmail')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
                {errors.reporterEmail && <p className="text-red-500 text-sm mt-1">{errors.reporterEmail.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-6 px-8 rounded-3xl text-xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              <ShieldAlert size={28} />
              <span>{loading ? 'Submitting Report...' : 'Submit Fraud Report'}</span>
            </button>

            <div className="text-center py-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Your report will be reviewed by admins before going public. Thank you for helping keep everyone safe!
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportFraud
