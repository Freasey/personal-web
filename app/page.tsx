import { Dashboard } from '@/features/dashboard/components/Dashboard'
import { BlobBackground } from '@/features/dashboard/components/BlobBackground'

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full flex justify-center items-center flex-col bg-slate-950 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <BlobBackground />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center gap-6 px-3 sm:px-6 py-6 sm:py-10 lg:py-16">
        <Dashboard />
      </div>
    </div>
  )
}