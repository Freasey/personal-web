import type { ReactNode } from 'react'

interface FadeSectionProps {
  children: ReactNode
  className?: string
}

export const FadeSection = ({ children, className }: FadeSectionProps) => {
  return (
    <div className={`fade-section ${className ?? ''}`.trim()}>
      {children}
      <style jsx>{`
        .fade-section {
          animation: fadeIn 0.35s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
