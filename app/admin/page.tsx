'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface VerificationRequest {
  id: string
  brand: string
  brandColor: string
  amount: string
  cardNumber: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: number
}

export default function AdminPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/requests')
      const data = await res.json()
      setRequests(data.requests)
    } catch {
      // Handle error silently
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 2000)
    return () => clearInterval(interval)
  }, [fetchRequests])

  const handleApprove = async (id: string) => {
    setProcessing(id)
    try {
      await fetch(`/api/admin/approve/${id}`, { method: 'POST' })
      await fetchRequests()
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    try {
      await fetch(`/api/admin/reject/${id}`, { method: 'POST' })
      await fetchRequests()
    } finally {
      setProcessing(null)
    }
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Admin Dashboard
            </h1>
            {pendingCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-2 text-xs font-semibold text-accent-foreground">
                {pendingCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchRequests}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">
                View Store
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Verification Requests
          </h2>
          <p className="mt-1 text-muted-foreground">
            Review and approve gift card verification requests
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-accent" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border">
            <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">
              No verification requests yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Requests will appear here when users submit gift cards
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <div className="flex items-center gap-6 p-6">
                    <div
                      className="flex h-16 w-24 items-center justify-center rounded-xl text-2xl text-white"
                      style={{ backgroundColor: request.brandColor }}
                    >
                      {request.brand.charAt(0)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {request.brand}
                        </h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <div className="mt-2 flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          ${request.amount}
                        </span>
                        <span className="font-mono tracking-wider">
                          {request.cardNumber}
                        </span>
                        <span>
                          {new Date(request.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          disabled={processing === request.id}
                          className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          disabled={processing === request.id}
                          className="gap-2 bg-green-600 text-white hover:bg-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}
