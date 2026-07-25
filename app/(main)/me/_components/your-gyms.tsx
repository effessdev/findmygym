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
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center">
        <p className="font-medium">No gyms yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first listing and start welcoming members.
        </p>
        <Button asChild className="mt-4">
          <Link href="/gym/create">Submit my gym</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {gyms.map((gymItem) => (
        <div
          key={gymItem.id}
          className="flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <p className="text-base font-semibold">{gymItem.name}</p>
            <p className="text-sm text-muted-foreground">
              Update your listing and manage member options.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:min-w-56 sm:flex-row">
            <Link href={`/gym/${gymItem.id}/edit`} className="flex-1">
              <Button variant="outline" className="w-full">
                Edit
              </Button>
            </Link>
            <Link href={`/gym/${gymItem.id}/options`} className="flex-1">
              <Button variant="default" className="w-full">
                Options
              </Button>
            </Link>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Want to add another gym?</p>
          <p className="text-sm text-muted-foreground">
            Keep your portfolio growing with a new listing.
          </p>
        </div>
        <Link href="/gym/create">
          <Button className="w-full sm:w-auto">Submit another one</Button>
        </Link>
      </div>
    </div>
  )
}
