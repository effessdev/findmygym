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
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Your Gyms</h2>
      <p className="text-sm text-muted-foreground">
        You have {gyms.length} gym{gyms.length !== 1 ? "s" : ""}. Manage them
        below or submit another one.
      </p>

      <div className="*:last:border-b">
        {gyms.map((gymItem) => (
          <div key={gymItem.id} className="flex flex-col gap-3 border-t py-4">
            <div className="space-y-1">
              <p className="text-base font-semibold">{gymItem.name}</p>
            </div>

            <div className="flex gap-2">
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
      </div>

      <Button className="w-full" asChild>
        <Link href="/gym/create">Submit another one</Link>
      </Button>
    </div>
  )
}
