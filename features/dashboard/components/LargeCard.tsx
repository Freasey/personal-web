import Link from 'next/link'
import type { CardItem } from '../types'

interface LargeCardProps {
  card: CardItem
  onClick?: () => void
}

export const LargeCard = ({ card, onClick }: LargeCardProps) => {
  const content = (
    <>
      {card.image ? (
        <img
          src={card.image}
          alt={card.imageAlt ?? card.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-linear-to-br ${card.bgClass ?? 'from-slate-900 via-slate-800 to-slate-700'}`}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
        <div className="transition-all duration-500 translate-y-0 opacity-100">
          <p className="text-purple-400 text-[10px] lg:text-sm font-semibold tracking-wider mb-1 lg:mb-2">
            {card.subtitle}
          </p>
        </div>
        <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 lg:mb-3">{card.title}</h2>
        <p className="text-gray-300 text-xs sm:text-sm lg:text-lg transition-all duration-500 translate-y-0 opacity-100 line-clamp-3 sm:line-clamp-none">
          {card.description}
        </p>
        {card.cta && (
          <div className="mt-3 sm:mt-4 flex justify-end">
            <span className="inline-flex items-center gap-1.5 text-[11px] lg:text-xs font-medium text-white bg-white/15 border border-white/25 rounded-full px-3 py-1.5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 group-hover:border-white/40">
              {card.cta}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        )}
      </div>

      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 border-t-2 border-r-2 border-purple-400/50 rounded-tr-2xl transition-all duration-300 group-hover:w-14 group-hover:h-14 sm:group-hover:w-16 sm:group-hover:h-16" />
    </>
  )

  if (card.href && !onClick) {
    return (
      <Link
        href={card.href}
        className="relative w-full lg:w-[550px] h-[280px] sm:h-[360px] lg:h-full rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
        aria-label={card.title}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      className="relative w-full lg:w-[550px] h-[280px] sm:h-[360px] lg:h-full rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
      onClick={onClick}
    >
      {content}
    </div>
  )
}