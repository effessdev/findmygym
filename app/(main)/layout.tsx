import BottomNav from "@/app/_components/bottom-nav"
import { HomeIcon } from "lucide-react"
import { MapIcon, UserIcon } from "lucide-react"

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
          { name: "Me", icon: <UserIcon />, href: "/me" },
          { name: "Home", icon: <HomeIcon />, href: "/" },
          { name: "Map", icon: <MapIcon />, href: "/map" },
        ]}
      />
    </div>
  )
}
