'use client'

import { giftCards, GiftCard } from '@/lib/gift-cards'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface GiftCardGridProps {
  onSelect: (card: GiftCard) => void
}

export function GiftCardGrid({ onSelect }: GiftCardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {giftCards.map((card, index) => (
        <motion.button
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          onClick={() => onSelect(card)}
          className="group relative flex aspect-[4/3] flex-col items-center justify-center rounded-2xl p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          style={{ backgroundColor: card.color }}
        >
          <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
            <Image
              src={card.logo}
              alt={`${card.name} logo`}
              width={52}
              height={52}
              className="h-13 w-13 rounded-full object-cover"
            />
          </div>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ color: card.textColor }}
          >
            {card.name}
          </span>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5" />
        </motion.button>
      ))}
    </div>
  )
}
