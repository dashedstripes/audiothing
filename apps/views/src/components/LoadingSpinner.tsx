import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  label?: string
}

export function LoadingSpinner({ size = 'medium', label }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner-container loading-spinner-${size}`}>
      <div className="loading-spinner" />
      {label && <span className="loading-spinner-label">{label}</span>}
    </div>
  )
}
