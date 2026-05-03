import { LargeCard } from '../LargeCard'
import { SmallCard } from '../SmallCard'
import { WideCard } from '../WideCard'
import type { CardItem } from '../../types'
import { FadeSection } from '../ui/FadeSection'

interface CardsViewProps {
  cards: CardItem[]
  hoveredCard: number | null
  onHover: (id: number | null) => void
  onBio: () => void
  onProjects: () => void
  onSkills: () => void
  onContact: () => void
}

export const CardsView = ({
  cards,
  hoveredCard,
  onHover,
  onBio,
  onProjects,
  onSkills,
  onContact
}: CardsViewProps) => {
  const largeCard = cards[0]
  const smallCards = cards.slice(1, 3)
  const contactCard = cards[3]

  if (!largeCard || !contactCard) {
    return null
  }

  return (
    <FadeSection className="w-full h-full flex flex-col lg:flex-row gap-6">
      <LargeCard
        card={largeCard}
        isHovered={hoveredCard === largeCard.id}
        onMouseEnter={() => onHover(largeCard.id)}
        onMouseLeave={() => onHover(null)}
        onClick={onBio}
      />

      <div className="w-full lg:w-[550px] h-auto lg:h-full flex flex-col gap-4 lg:gap-6">
        <div className="flex flex-row gap-4 lg:gap-6 h-auto lg:h-[250px]">
          {smallCards.map((card, index) => (
            <SmallCard
              key={card.id}
              card={card}
              index={index}
              isHovered={hoveredCard === card.id}
              onMouseEnter={() => onHover(card.id)}
              onMouseLeave={() => onHover(null)}
              onClick={
                card.id === 2
                  ? onProjects
                  : card.id === 3
                  ? onSkills
                  : undefined
              }
            />
          ))}
        </div>

        <WideCard
          card={contactCard}
          isHovered={hoveredCard === contactCard.id}
          onMouseEnter={() => onHover(contactCard.id)}
          onMouseLeave={() => onHover(null)}
          onClick={onContact}
        />
      </div>
    </FadeSection>
  )
}
