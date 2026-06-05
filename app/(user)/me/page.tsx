import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import db from "@/db/db"
import { gym } from "@/db/schema/gym-schema"
import { eq, count } from "drizzle-orm"

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
        <p className="text-muted-foreground">
          Here, you&apos;ll manage your memberships, your profile, and more.
        </p>
        <Link href="/partner">
          <Button>
            {gymCount > 0
              ? "Go to Partnership Dashboard"
              : "Join the Partner Program"}
          </Button>
        </Link>
      </div>
    </div>
  )
}
