import { LargeCard } from '../LargeCard'
import { SmallCard } from '../SmallCard'
import { WideCard } from '../WideCard'
import type { CardItem } from '../../types'
import { FadeSection } from '../ui/FadeSection'

interface CardsViewProps {
  cards: CardItem[]
  onBio: () => void
  onProjects: () => void
  onSkills: () => void
  onContact: () => void
}

export const CardsView = ({
  cards,
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
    <FadeSection className="w-full h-full flex flex-col lg:flex-row gap-4 sm:gap-6">
      <LargeCard card={largeCard} onClick={onBio} />

      <div className="w-full lg:w-[550px] h-auto lg:h-full flex flex-col gap-3 sm:gap-4 lg:gap-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:h-[250px]">
          {smallCards.map((card, index) => (
            <SmallCard
              key={card.id}
              card={card}
              index={index}
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

        <WideCard card={contactCard} onClick={onContact} />
      </div>
    </FadeSection>
  )
}
