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
        {memberships.map((membership) => (
          <div
            key={membership.id}
            className="flex flex-col gap-2 border-t pt-4"
          >
            <div className="flex items-center justify-between text-xl">
              <p className="font-bold">{membership.gym.name}</p>
              <p className="font-bold text-primary">
                ₹{membership.gym.feePerMonth}
              </p>
            </div>

            <p className="text-muted-foreground">
              <span className="font-bold">Expires on: </span>
              {membership.expiresAt.toDateString()}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="outline">
                <Link href={`/gym/${membership.gym.id}`}>View</Link>
              </Button>
              <CancelMembershipDialog membershipId={membership.id} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return <p>You don&apos;t have any memberships yet.</p>
}
