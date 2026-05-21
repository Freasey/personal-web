import Link from 'next/link'
import type { CardItem } from '../types'

interface WideCardProps {
  card: CardItem
  onClick?: () => void
}

export const WideCard = ({ card, onClick }: WideCardProps) => {
  const content = (
    <>
      {card.backgroundSvg ? (
        <img
          src={card.backgroundSvg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : card.image ? (
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
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
        <div className="transition-all duration-500 translate-y-0 opacity-100">
          <p className="text-orange-400 text-[10px] lg:text-sm font-semibold tracking-wider mb-1 lg:mb-2">
            {card.subtitle}
          </p>
        </div>
        <h3 className="text-lg sm:text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2">
          {card.title}
        </h3>
        <p className="text-gray-300 text-xs sm:text-sm lg:text-base transition-all duration-500 translate-y-0 opacity-100 line-clamp-2 sm:line-clamp-none">
          {card.description}
        </p>
        {card.cta && (
          <div className="mt-2 sm:mt-3 flex justify-end">
            <span className="inline-flex items-center gap-1.5 text-[11px] lg:text-xs font-medium text-white bg-white/15 border border-white/25 rounded-full px-3 py-1.5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 group-hover:border-white/40">
              {card.cta}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 border-t-2 border-r-2 border-orange-400/50 rounded-tr-xl transition-all duration-300 group-hover:w-9 group-hover:h-9 sm:group-hover:w-10 sm:group-hover:h-10" />
    </>
  )

  if (card.href && !onClick) {
    return (
      <Link
        href={card.href}
        className="relative w-full h-40 sm:h-[200px] lg:h-[250px] rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
        aria-label={card.title}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      className="relative w-full h-40 sm:h-[200px] lg:h-[250px] rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
      onClick={onClick}
    >
      {content}
    </div>
  )
}