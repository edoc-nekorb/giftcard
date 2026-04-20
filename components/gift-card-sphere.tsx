'use client'

import React, { useEffect, useRef, useState } from 'react'
import { giftCards } from '@/lib/gift-cards'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface SpherePoint {
  x: number
  y: number
  z: number
  card: (typeof giftCards)[0]
}

export function GiftCardSphere() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [points, setPoints] = useState<SpherePoint[]>([])
  
  // Radius of the sphere
  const radius = 140

  useEffect(() => {
    // Generate points on a sphere using Fibonacci lattice
    const numPoints = giftCards.length
    const newPoints: SpherePoint[] = []
    const phi = Math.PI * (3 - Math.sqrt(5)) // golden angle in radians

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2 // y goes from 1 to -1
      const r = Math.sqrt(1 - y * y) // radius at y

      const theta = phi * i // golden angle increment

      const x = Math.cos(theta) * r
      const z = Math.sin(theta) * r

      newPoints.push({ x, y, z, card: giftCards[i] })
    }
    setPoints(newPoints)
  }, [])

  useEffect(() => {
    let animationFrameId: number
    let angleX = 0
    let angleY = 0

    const updateRotation = () => {
      angleX += 0.002
      angleY += 0.003

      if (containerRef.current) {
        containerRef.current.style.transform = `rotateX(${angleX}rad) rotateY(${angleY}rad)`
      }
      animationFrameId = requestAnimationFrame(updateRotation)
    }

    animationFrameId = requestAnimationFrame(updateRotation)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div className="relative mx-auto flex h-[350px] w-[350px] items-center justify-center overflow-visible">
      <div
        ref={containerRef}
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {points.map((p, i) => {
          return (
            <div
              key={p.card.id}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl p-2 shadow-lg transition-all hover:scale-110"
              style={{
                transform: `translate3d(${p.x * radius}px, ${p.y * radius}px, ${p.z * radius}px) rotateY(${-Math.atan2(p.x, p.z)}rad) rotateX(${Math.asin(p.y)}rad)`,
                backgroundColor: p.card.color,
                color: p.card.textColor,
                transformStyle: 'preserve-3d',
              }}
            >
              <Image
                src={p.card.logo}
                alt={`${p.card.name} logo`}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full bg-white object-contain"
              />
              <span className="mt-1 whitespace-nowrap text-xs font-semibold">
                {p.card.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
