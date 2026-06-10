import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import db from "@/db/db"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { membership } from "@/db/schema/membership-schema"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Memberships</CardTitle>
        <CardDescription>View and manage your memberships.</CardDescription>
      </CardHeader>
      <CardContent>
        {memberships.length > 0 ? (
          memberships.map((membership) => (
            <>
              <Separator className="my-4" />
              <div key={membership.id} className="flex flex-col gap-2">
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
                <Button asChild className="mt-2">
                  <Link href={`/gym/${membership.gym.id}`}>View</Link>
                </Button>
              </div>
            </>
          ))
        ) : (
          <p>You don&apos;t have any memberships yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
