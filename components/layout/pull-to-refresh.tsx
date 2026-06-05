"use client"

import { ReactNode, useEffect, useRef, useState } from "react"
import { Spinner } from "@/components/ui/spinner"

interface PullToRefreshProps {
  children: ReactNode
  threshold?: number
}

export default function PullToRefresh({
  children,
  threshold = 80,
}: PullToRefreshProps) {
  const startY = useRef<number | null>(null)

  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || refreshing) return

      startY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current === null) return
      if (window.scrollY > 0 || refreshing) return

      const currentY = e.touches[0].clientY
      const distance = currentY - startY.current

      if (distance <= 0) return

      setPullDistance(Math.min(distance, 120))
    }

    const handleTouchEnd = () => {
      if (refreshing) return

      if (pullDistance >= threshold) {
        setRefreshing(true)

        setTimeout(() => {
          window.location.reload()
        }, 300)
      }

      setPullDistance(0)
      startY.current = null
    }

    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    })

    window.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    })

    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [pullDistance, threshold, refreshing])

  const progress = Math.min(pullDistance / threshold, 1)

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        {refreshing ? (
          <div className="mx-auto mt-30 flex items-center justify-center rounded-full bg-primary p-1 text-primary-foreground shadow-lg">
            <Spinner />
          </div>
        ) : (
          <div
            style={{
              fontSize: "24px",
              transform: `
                translateY(${pullDistance}px)
                rotate(${progress * 360}deg)
              `,
              opacity: pullDistance > 0 ? progress : 0,
              transition:
                pullDistance === 0
                  ? "transform 0.25s ease-out, opacity 0.25s ease-out"
                  : "opacity 0.1s linear",
              willChange: "transform, opacity",
            }}
          >
            ↻
          </div>
        )}
      </div>

      {children}
    </>
  )
}
