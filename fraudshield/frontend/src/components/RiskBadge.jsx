import { ShieldCheck } from 'lucide-react'

const RiskBadge = ({ score, status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const statusClasses = {
    SAFE: 'risk-safe',
    LOW_RISK: 'risk-low',
    SUSPICIOUS: 'risk-suspicious',
    HIGH_RISK: 'risk-high',
  }

  return (
    <div className={`risk-badge ${sizeClasses[size]} ${statusClasses[status] || 'risk-safe'} inline-flex items-center space-x-1 shadow-md`}>
      <div className={`w-2 h-2 rounded-full bg-current ${status === 'HIGH_RISK' ? 'animate-pulse' : ''}`} />
      <span>{status.replace('_', ' ')}</span>
      <span className="ml-1 font-mono text-xs">({score}/100)</span>
    </div>
  )
}

export default RiskBadge
