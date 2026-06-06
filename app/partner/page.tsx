import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import db from "@/db/db"
import { redirect } from "next/navigation"
import { gym } from "@/db/schema/gym-schema"
import { eq, count } from "drizzle-orm"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function PartnerPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session === null) {
    redirect("/sign-in")
  }

  const result = await db
    .select({ value: count() })
    .from(gym)
    .where(eq(gym.ownerId, session.user.id))

  const gymCount = result[0]?.value ?? 0

  return (
    <div className="mx-auto flex flex-col gap-4 px-4 py-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-2">
        <CountDisplay label="Gyms" value={gymCount} />
        <CountDisplay label="Memberships" value={0} />
        <CountDisplay label="Views" value={30} valueUnit="k" />
        <CountDisplay label="Earned" value={gymCount} valueUnit="₹" />
      </div>
      <Link href="/partner/gym">
        <Button className="w-full">Manage Gyms</Button>
      </Link>
    </div>
  )
}

function CountDisplay({
  value,
  valueUnit,
  label,
}: {
  label: string
  value: number
  valueUnit?: string
}) {
  return (
    <div className="justify-centerrounded flex flex-col items-center bg-card p-4">
      <p className="text-6xl font-bold">
        {value}
        {valueUnit && (
          <span className="text-4xl text-muted-foreground">{valueUnit}</span>
        )}
      </p>

      <h2 className="text-lg font-semibold">{label}</h2>
    </div>
  )
}
