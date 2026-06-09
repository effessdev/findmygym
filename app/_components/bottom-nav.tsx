"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type NavItem = {
  name: string
  icon: React.ReactNode
  href: string
}

export default function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <div className="sticky bottom-0 flex w-full items-center justify-around gap-4 border-t-2 bg-background p-4 py-2 pt-3">
      {items.map((item, index) => {
        const isActive = pathname === item.href

        return (
          <motion.div
            key={index}
            whileTap={{
              scale: 0.9,
              y: 2,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 20,
            }}
            className="flex flex-1"
          >
            <Link
              href={item.href}
              className={cn(
                "flex w-full flex-col items-center justify-center",
                isActive && "text-primary",
                "transition-colors"
              )}
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
