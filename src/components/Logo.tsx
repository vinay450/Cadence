import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface LogoProps {
  className?: string
  variant?: 'primary' | 'dark'
}

export default function Logo({ className, variant = 'primary' }: LogoProps) {
  const navigate = useNavigate()

  return (
    <svg 
      width="360" 
      height="100" 
      viewBox="0 0 320 100" 
      className={cn("cursor-pointer", className)}
      onClick={() => navigate('/')}
    >
      <defs>
        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      
      {/* Data bars */}
      <g className="pulse-logo">
        <rect className={cn("bar", variant === 'primary' ? 'primary-bars' : 'dark-bars')} x="20" y="55" width="6" height="25" rx="3" />
        <rect className={cn("bar", variant === 'primary' ? 'primary-bars' : 'dark-bars')} x="28" y="45" width="6" height="35" rx="3" />
        <rect className={cn("bar", variant === 'primary' ? 'primary-bars' : 'dark-bars')} x="36" y="35" width="6" height="45" rx="3" />
        <rect className={cn("bar", variant === 'primary' ? 'primary-bars' : 'dark-bars')} x="44" y="50" width="6" height="30" rx="3" />
        <rect className={cn("bar", variant === 'primary' ? 'primary-bars' : 'dark-bars')} x="52" y="40" width="6" height="40" rx="3" />
        <rect className={cn("bar", variant === 'primary' ? 'primary-bars' : 'dark-bars')} x="60" y="60" width="6" height="20" rx="3" />
        <rect className={cn("bar", variant === 'primary' ? 'primary-bars' : 'dark-bars')} x="68" y="45" width="6" height="35" rx="3" />
      </g>
      
      {/* Company name */}
      <text className="logo-text" x="90" y="50">Cadence</text>
      <text className="tagline-text" x="90" y="67">Data Analysis Platform</text>

      <style>
        {`
          .primary-bars {
            fill: url(#primaryGradient);
          }
          .dark-bars {
            fill: #818cf8;
          }
          .logo-text {
            font-size: 24px;
            font-weight: bold;
            fill: currentColor;
          }
          .tagline-text {
            font-size: 14px;
            fill: currentColor;
            opacity: 0.8;
          }
          .bar {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .bar:nth-child(1) { animation-delay: 0.0s; }
          .bar:nth-child(2) { animation-delay: 0.2s; }
          .bar:nth-child(3) { animation-delay: 0.4s; }
          .bar:nth-child(4) { animation-delay: 0.6s; }
          .bar:nth-child(5) { animation-delay: 0.8s; }
          .bar:nth-child(6) { animation-delay: 1.0s; }
          .bar:nth-child(7) { animation-delay: 1.2s; }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </svg>
  )
} 