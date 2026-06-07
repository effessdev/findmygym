import BottomNav from "@/app/_components/bottom-nav"
import { UserIcon, WrenchIcon, BicepsFlexedIcon } from "lucide-react"

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
          { name: "Me", icon: <UserIcon />, href: "/me" },
          { name: "Dashboard", icon: <WrenchIcon />, href: "/partner" },
          { name: "Gyms", icon: <BicepsFlexedIcon />, href: "/partner/gym" },
        ]}
      />
    </div>
  )
}
