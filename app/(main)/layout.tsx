import BottomNav from "@/app/_components/bottom-nav"
import { HomeIcon } from "lucide-react"
import { BellIcon, UserIcon } from "lucide-react"

export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1">{children}</main>
      <BottomNav
        items={[
          { name: "Notifications", icon: <BellIcon />, href: "/notifications" },
          { name: "Home", icon: <HomeIcon />, href: "/" },
          { name: "Account", icon: <UserIcon />, href: "/me" },
        ]}
      />
    </div>
  )
}
