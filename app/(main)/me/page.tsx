import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import db from "@/db/db"
import { gym } from "@/db/schema/gym-schema"
import { eq, count } from "drizzle-orm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function MePage() {
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
    <div>
      <div className="flex flex-col gap-4 px-4 py-8">
        <h1 className="text-4xl font-bold">Hello, {session.user.name}</h1>
        <p className="text-muted-foreground">Manage your profile here.</p>

        <Card>
          <CardHeader>
            <CardTitle>Your Memberships</CardTitle>
            <CardDescription>View and manage your memberships.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You don&apos;t have any memberships yet.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partnership Program</CardTitle>
            <CardDescription>
              Join our partnership program to display your gym in our apps. We
              will handle discovery and payment for you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/partner">
              <Button>
                {gymCount > 0
                  ? "Go to Partnership Dashboard"
                  : "Join the Partnership Program"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
