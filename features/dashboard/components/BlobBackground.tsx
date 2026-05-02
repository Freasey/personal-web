'use client'
export const BlobBackground = () => {
  const blobs = [
    { color: 'from-red-600 to-orange-500', delay: '0s', position: 'top-0 left-0' },
    { color: 'from-purple-600 to-pink-500', delay: '2s', position: 'top-0 right-0' },
    { color: 'from-blue-600 to-cyan-500', delay: '4s', position: 'bottom-0 left-1/3' },
    { color: 'from-orange-600 to-yellow-500', delay: '6s', position: 'bottom-0 right-1/4' },
  ]

  return (
    <>
      <div className="absolute inset-0 z-0">
        {blobs.map((blob, i) => (
          <div
            key={i}
            className={`absolute ${blob.position} w-[480px] h-[480px] bg-linear-to-r ${blob.color} rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob`}
            style={{ animationDelay: blob.delay }}
          />
        ))}
      </div>

      {/* Style hanya untuk blob, bukan global */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -60px) scale(1.1); }
          50% { transform: translate(-30px, 30px) scale(0.9); }
          75% { transform: translate(60px, 60px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }
      `}</style>
    </>
  )
}