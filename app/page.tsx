'use client'

import { useState } from 'react'
import { GiftCardGrid } from '@/components/gift-card-grid'
import { GiftCardSphere } from '@/components/gift-card-sphere'
import { VerifyCard } from '@/components/verify-card'
import { GiftCard } from '@/lib/gift-cards'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function Home() {
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <button
            onClick={() => setSelectedCard(null)}
            className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground"
          >
            <Image
              src="/logo.png"
              alt="Gift Card"
              width={28}
              height={28}
              className="h-7 w-7 rounded object-contain"
              priority
            />
            <span>Gift Card Verify</span>
          </button>
          <nav className="flex items-center gap-6">
            <span className="hidden text-sm text-muted-foreground md:inline">
              Verify your cards instantly
            </span>
          </nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!selectedCard ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-6xl px-6 py-16"
          >
            {/* Hero */}
            <div className="mb-16 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
              >
                Verify Your Gift Card
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto mt-6 mb-8 max-w-2xl text-lg text-muted-foreground"
              >
                Select your gift card brand below to check its balance and
                validity. Simple, fast, and secure verification.
              </motion.p>
              <GiftCardSphere />
            </div>

            {/* Card Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Choose a Gift Card
              </h2>
              <GiftCardGrid onSelect={setSelectedCard} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="verify"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-6xl px-6 py-16"
          >
            <VerifyCard
              card={selectedCard}
              onBack={() => setSelectedCard(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Secure gift card verification
          </p>
          <div className="flex gap-6">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    This website is used to help verify legitimate gift cards and
                    reduce fraud, spamming, and reprinting of cards by unauthorized
                    vendors.
                  </p>
                  <p>
                    When you submit a verification request, you provide details
                    such as the gift card brand, amount, and card number. These
                    details are stored on the server for review and verification.
                  </p>
                  <p>
                    We do not sell your information. We use the submitted details
                    only for verification, fraud prevention, security monitoring,
                    and service improvements.
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Terms of Use</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    By using this website, you agree to submit only gift card
                    details you are authorized to verify.
                  </p>
                  <p>
                    The purpose of this website is to verify legitimate gift
                    cards by matching submitted card details against validation
                    information from the respective brands where available, and
                    to help reduce misuse, spamming, and reprinting of cards by
                    unauthorized vendors.
                  </p>
                  <p>
                    Verification results may be delayed or denied. We do not
                    guarantee approval, balances, or availability.
                  </p>
                </div>
              </DialogContent>
            </Dialog>

            <a
              className="text-sm text-muted-foreground hover:text-foreground"
              href="mailto:support@example.com"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
