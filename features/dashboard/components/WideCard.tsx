import Link from 'next/link'
import type { CardItem } from '../types'

interface WideCardProps {
  card: CardItem
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick?: () => void
}

export const WideCard = ({ card, isHovered, onMouseEnter, onMouseLeave, onClick }: WideCardProps) => {
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
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="transition-all duration-500 translate-y-0 opacity-100">
          <p className="text-orange-400 text-sm font-semibold tracking-wider mb-2">
            {card.subtitle}
          </p>
        </div>
        <h3 className="text-3xl font-bold text-white mb-2">
          {card.title}
        </h3>
        <p className="text-gray-300 transition-all duration-500 translate-y-0 opacity-100">
          {card.description}
        </p>
        {card.cta && (
          <p className="text-gray-200 text-sm mt-2 transition-all duration-500 translate-y-0 opacity-100">
            {card.cta}
          </p>
        )}
        <div className={`h-0.5 bg-linear-to-r from-orange-500 to-red-500 mt-3 rounded-full transition-all duration-500 ${isHovered ? 'w-20' : 'w-0'}`} />
      </div>

      <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-orange-400/50 rounded-tr-xl transition-all duration-300 group-hover:w-10 group-hover:h-10" />
    </>
  )

  if (card.href && !onClick) {
    return (
      <Link
        href={card.href}
        className="relative w-full h-[250px] rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
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
      className="relative w-full h-[250px] rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {content}
    </div>
  )
}