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
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          These are your active gym memberships.
        </p>
        {memberships.map((membership) => (
          <div
            key={membership.id}
            className="flex flex-col gap-2 border-t pt-4"
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
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">No memberships yet.</p>
      <Button asChild className="w-full">
        <Link href="/">Browse gyms</Link>
      </Button>
    </div>
  )
}
