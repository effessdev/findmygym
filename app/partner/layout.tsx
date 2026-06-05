import BottomNav from "@/components/layout/bottom-nav"
import { ArrowLeftIcon, WrenchIcon } from "lucide-react"

export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <main className="flex-1">{children}</main>
      <BottomNav
        items={[
          { name: "Back", icon: <ArrowLeftIcon />, href: "/me" },
          { name: "Dashboard", icon: <WrenchIcon />, href: "/partner" },
        ]}
      />
    </div>
  )
}
