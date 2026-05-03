import Link from 'next/link'
import type { CardItem } from '../types'

interface LargeCardProps {
  card: CardItem
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick?: () => void
}

export const LargeCard = ({ card, isHovered, onMouseEnter, onMouseLeave, onClick }: LargeCardProps) => {
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

      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="transition-all duration-500 translate-y-0 opacity-100">
          <p className="text-purple-400 text-[10px] lg:text-sm font-semibold tracking-wider mb-1 lg:mb-2">
            {card.subtitle}
          </p>
        </div>
        <h2 className="text-2xl lg:text-5xl font-bold text-white mb-2 lg:mb-3">{card.title}</h2>
        <p className="text-gray-300 text-xs lg:text-lg transition-all duration-500 translate-y-0 opacity-100">
          {card.description}
        </p>
        {card.cta && (
          <p className="text-purple-200 text-[10px] lg:text-sm mt-2 lg:mt-3 transition-all duration-500 translate-y-0 opacity-100">
            {card.cta}
          </p>
        )}
        <div className={`h-1 bg-linear-to-r from-purple-500 to-pink-500 mt-4 rounded-full transition-all duration-500 ${isHovered ? 'w-24' : 'w-0'}`} />
      </div>

      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-purple-400/50 rounded-tr-2xl transition-all duration-300 group-hover:w-16 group-hover:h-16" />
    </>
  )

  if (card.href && !onClick) {
    return (
      <Link
        href={card.href}
        className="relative w-full lg:w-[550px] aspect-square lg:aspect-auto lg:h-full rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={card.title}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      className="relative w-full lg:w-[550px] aspect-square lg:aspect-auto lg:h-full rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {content}
    </div>
  )
}