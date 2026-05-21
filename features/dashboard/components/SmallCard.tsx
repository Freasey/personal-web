import Link from 'next/link'
import type { CardItem } from '../types'

interface SmallCardProps {
  card: CardItem
  index: number
  onClick?: () => void
}

export const SmallCard = ({ card, index, onClick }: SmallCardProps) => {
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

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-5">
        <div className="transition-all duration-500 translate-y-0 opacity-100">
          <p className={`${index === 0 ? 'text-cyan-400' : 'text-teal-400'} text-[9px] lg:text-xs font-semibold tracking-wider mb-1`}>
            {card.subtitle}
          </p>
        </div>
        <h3 className="text-sm sm:text-lg lg:text-2xl font-bold text-white mb-1 lg:mb-2">
          {card.title}
        </h3>
        <p className="text-gray-300 text-[10px] sm:text-xs lg:text-sm line-clamp-2 lg:line-clamp-none transition-all duration-500 translate-y-0 opacity-100">
          {card.description}
        </p>
        {card.cta && (
          <div className="mt-2 sm:mt-3 flex justify-end">
            <span className="inline-flex items-center gap-1 text-[10px] lg:text-[11px] font-medium text-white bg-white/15 border border-white/25 rounded-full px-2 sm:px-2.5 py-1 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 group-hover:border-white/40">
              <span className="hidden sm:inline">{card.cta}</span>
              <span className="sm:hidden">View</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </span>
          </div>
        )}
      </div>
    </>
  )

  if (card.href && !onClick) {
    return (
      <Link
        href={card.href}
        className="relative w-full lg:w-[265px] aspect-square lg:aspect-auto lg:h-full rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.03] lg:hover:scale-[1.05] hover:z-10"
        aria-label={card.title}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      className="relative w-full lg:w-[265px] aspect-square lg:aspect-auto lg:h-full rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.03] lg:hover:scale-[1.05] hover:z-10"
      onClick={onClick}
    >
      {content}
    </div>
  )
}