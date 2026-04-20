'use client'

import { useState, useEffect, useCallback } from 'react'
import { GiftCard } from '@/lib/gift-cards'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

interface VerifyCardProps {
  card: GiftCard
  onBack: () => void
}

export function VerifyCard({ card, onBack }: VerifyCardProps) {
  const [amount, setAmount] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [status, setStatus] = useState<'idle' | 'verifying' | 'approved' | 'rejected'>('idle')
  const [requestId, setRequestId] = useState<string | null>(null)

  const checkStatus = useCallback(async () => {
    if (!requestId) return

    try {
      const res = await fetch(`/api/verify/status/${requestId}`)
      const data = await res.json()

      if (data.status === 'approved') {
        setStatus('approved')
      } else if (data.status === 'rejected') {
        setStatus('rejected')
      }
    } catch {
      // Continue polling on error
    }
  }, [requestId])

  useEffect(() => {
    if (status !== 'verifying' || !requestId) return

    const interval = setInterval(checkStatus, 1500)
    return () => clearInterval(interval)
  }, [status, requestId, checkStatus])

  const handleValidate = async () => {
    if (!amount || !cardNumber) return
    setStatus('verifying')

    try {
      const res = await fetch('/api/verify/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: card.name,
          brandColor: card.color,
          amount,
          cardNumber,
        }),
      })
      const data = await res.json()
      setRequestId(data.id)
    } catch {
      setStatus('idle')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setRequestId(null)
    setAmount('')
    setCardNumber('')
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(' ').substring(0, 19) : cleaned
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-lg"
    >
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to Gift Cards</span>
      </button>

      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mb-6 flex h-24 w-40 items-center justify-center rounded-2xl shadow-lg"
          style={{ backgroundColor: card.color || '#ffffff' }}
        >
          <Image
            src={card.logo}
            alt={`${card.name} logo`}
            width={88}
            height={88}
            className="h-16 w-16 object-contain"
            priority
          />
        </motion.div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Verify {card.name} Gift Card
        </h2>
        <p className="mt-2 text-muted-foreground">
          Enter your card details below to validate
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Card Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\d.]/g, '')
                setAmount(val)
              }}
              className="h-14 rounded-xl border-0 bg-secondary pl-8 text-lg font-medium text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent"
              disabled={status !== 'idle'}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Gift Card Number
          </label>
          <Input
            type="text"
            placeholder="XXXX XXXX XXXX XXXX"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="h-14 rounded-xl border-0 bg-secondary text-lg font-medium tracking-widest text-foreground placeholder:text-muted-foreground placeholder:tracking-normal focus-visible:ring-2 focus-visible:ring-accent"
            maxLength={19}
            disabled={status !== 'idle'}
          />
        </div>

        <Button
          onClick={handleValidate}
          disabled={!amount || !cardNumber || status !== 'idle'}
          className="h-14 w-full rounded-xl bg-primary text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {status === 'idle' && 'Validate Card'}
          {status === 'verifying' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verifying...</span>
            </motion.div>
          )}
          {status === 'approved' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Verified!</span>
            </motion.div>
          )}
          {status === 'rejected' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <XCircle className="h-5 w-5" />
              <span>Rejected</span>
            </motion.div>
          )}
        </Button>

        {status === 'verifying' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-secondary p-6"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-accent/30"
                  style={{ borderTopColor: 'var(--accent)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Pending Verification
                </p>
                <p className="text-sm text-muted-foreground">
                  Your request is being reviewed. Please wait...
                </p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="mt-4 w-full bg-white hover:bg-green-50 text-green-700 border-green-200"
            >
              Verify Another Card
            </Button>
          </motion.div>
        )}

        {status === 'approved' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-green-50 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-900">
                  Card Verified
                </p>
                <p className="text-sm text-green-700">
                  Your ${amount} {card.name} gift card is valid.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'rejected' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-red-50 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-900">
                  Verification Failed
                </p>
                <p className="text-sm text-red-700">
                  This gift card could not be verified. Please check your details.
                </p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="mt-4 w-full"
            >
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
