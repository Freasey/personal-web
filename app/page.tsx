import { Dashboard } from '@/features/dashboard/components/Dashboard'
import { BlobBackground } from '@/features/dashboard/components/BlobBackground'

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full flex justify-center items-center flex-col bg-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <BlobBackground />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-8 py-16">
        <Dashboard />
      </div>
    </div>
  )
}