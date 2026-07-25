import Link from "next/link"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import db from "@/db/db"
import { gym } from "@/db/schema/gym-schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"

export default async function YourGyms() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session === null) {
    return
  }

  const gyms = await db
    .select()
    .from(gym)
    .where(eq(gym.ownerId, session.user.id))

  if (gyms.length === 0) {
    return (
      <>
        <p>You don&apos;t have any gyms yet</p>
        <Link href="/partner/gym/create">
          <Button>Submit my Gym</Button>
        </Link>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {gyms.map((gymItem) => (
        <div key={gymItem.id} className="flex flex-col gap-2 border-t pt-4">
          <p className="text-lg font-semibold">{gymItem.name}</p>
          <div className="flex gap-2">
            <Link href={`/partner/gym/${gymItem.id}/edit`} className="flex-1">
              <Button variant="outline" className="w-full">
                Edit
              </Button>
            </Link>
            <Link
              href={`/partner/gym/${gymItem.id}/options`}
              className="flex-1"
            >
              <Button variant="default" className="w-full">
                Options
              </Button>
            </Link>
          </div>
        </div>
      ))}
      <p>Go more gyms?</p>
      <Link href="/partner/gym/create">
        <Button className="w-full">Submit Another One</Button>
      </Link>
    </div>
  )
}
