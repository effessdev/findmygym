import db from "@/db/db"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { membership } from "@/db/schema/membership-schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import CancelMembershipDialog from "./cancel-membership-dialog"

export default async function Memberships() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session === null) {
    redirect("/sign-in")
  }

  const memberships = await db.query.membership.findMany({
    where: eq(membership.userId, session.user.id),
    with: {
      gym: true,
    },
  })

  if (memberships.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        {memberships.map((membership) => (
          <div
            key={membership.id}
            className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-2">
              <p className="text-base font-semibold">{membership.gym.name}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>
                  Fee:{" "}
                  <span className="font-medium text-foreground">
                    ₹{membership.gym.feePerMonth}/mo
                  </span>
                </span>
                <span>
                  Expires:{" "}
                  <span className="font-medium text-foreground">
                    {membership.expiresAt.toDateString()}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:min-w-45">
              <Button
                asChild
                variant="outline"
                className="w-full justify-center"
              >
                <Link href={`/gym/${membership.gym.id}`}>View gym</Link>
              </Button>
              <CancelMembershipDialog membershipId={membership.id} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-background/70 px-4 py-6 text-center">
      <p className="font-medium">No memberships yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse gyms and join the ones that fit your routine.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Explore gyms</Link>
      </Button>
    </div>
  )
}
