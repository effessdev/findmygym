"use client"

import { motion, useAnimationControls } from "motion/react"
import { useEffect, useRef } from "react"

type Direction = "bottom" | "top" | "left" | "right"
type OffsetSize = "sm" | "md" | "lg"
type Speed = "sm" | "md" | "lg"

type Props = {
  children: React.ReactNode
  delay?: number
  direction?: Direction
  offset?: OffsetSize
  speed?: Speed
}

const OFFSET_MAP: Record<OffsetSize, number> = {
  sm: 8,
  md: 16,
  lg: 32,
}

const SPEED_MAP: Record<Speed, number> = {
  sm: 0.4,
  md: 0.6,
  lg: 0.9,
}

function getOffset(direction: Direction, value: number) {
  switch (direction) {
    case "top":
      return { x: 0, y: -value }
    case "bottom":
      return { x: 0, y: value }
    case "left":
      return { x: -value, y: 0 }
    case "right":
      return { x: value, y: 0 }
  }
}

export function FadeInOnView({
  children,
  delay = 0,
  direction = "bottom",
  offset = "md",
  speed = "md",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const controls = useAnimationControls()

  const distance = OFFSET_MAP[offset]
  const duration = SPEED_MAP[speed]

  const initialOffset = getOffset(direction, distance)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
              duration,
              ease: "easeOut",
              delay,
            },
          })
          observer.disconnect()
        }
      },
      {
        threshold: 0.2,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [controls, delay, duration])

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...initialOffset,
      }}
      animate={controls}
    >
      {children}
    </motion.div>
  )
}
