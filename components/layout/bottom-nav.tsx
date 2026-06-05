"use client"

import Link from "next/link"

type NavItem = {
  name: string
  icon: React.ReactNode
  href: string
}
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <div className="sticky bottom-0 flex w-full items-center justify-around border-t-2 bg-background py-2 pt-3">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center",
            pathname === item.href && "text-primary"
          )}
        >
          {item.icon}
          <span className="text-xs">{item.name}</span>
        </Link>
      ))}
    </div>
  )
}
