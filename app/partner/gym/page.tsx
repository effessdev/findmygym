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
        <Card>
          <CardHeader>
            <CardTitle>You don&apos;t have any gyms yet</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/partner/gym/create">
              <Button>Submit my Gym</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {gyms.length > 0 && (
        <>
          <h1 className="mb-4 text-2xl font-bold">Your Gyms</h1>
          <div className="flex flex-col gap-4">
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
                <CardFooter className="flex gap-2">
                  <Link
                    href={`/partner/gym/${gymItem.id}/edit`}
                    className="flex-1"
                  >
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
