import Link from "next/link"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import db from "@/db/db"
import { gym } from "@/db/schema/gym-schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DeleteGymDialog from "../_components/delete-gym-dialog"

export default async function PartnerPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Partner access required</CardTitle>
            <CardDescription>
              Sign in to manage your gym listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const gyms = await db
    .select()
    .from(gym)
    .where(eq(gym.ownerId, session.user.id))

  return (
    <div className="container mx-auto px-4 py-8">
      {gyms.length === 0 && (
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Partner Dashboard</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              View your gym listings and submit new gyms to the partner program.
            </p>
          </div>
          <Link href="/partner/gym/create">
            <Button>Submit my Gym</Button>
          </Link>
        </div>
      )}

      {gyms.length > 0 && (
        <>
          <h1 className="text-2xl font-bold">Your Gyms</h1>
          <p className="my-4 text-muted-foreground">
            View and manage your gym listings below.
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {gyms.map((gymItem) => (
              <Card key={gymItem.id}>
                <CardHeader>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle>{gymItem.name}</CardTitle>
                    </div>
                    <CardDescription>{gymItem.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(gymItem.feePerMonth)}
                      /mo
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        Equipment:
                      </span>{" "}
                      {gymItem.equipment}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Contact:
                      </span>{" "}
                      {gymItem.contactPhone}
                    </p>
                    {gymItem.contactEmail ? (
                      <p>
                        <span className="font-medium text-foreground">
                          Email:
                        </span>{" "}
                        {gymItem.contactEmail}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
                <CardFooter>
                  <DeleteGymDialog gymId={gymItem.id} />
                </CardFooter>
              </Card>
            ))}
            <Card>
              <CardContent className="space-y-3">
                <h1 className="text-lg font-semibold">Got more gyms?</h1>
                <p>You can add many gyms as you like.</p>
                <Link href="/partner/gym/create">
                  <Button>Submit Another One</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
