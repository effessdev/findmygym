import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session !== null) {
    return (
      <div>
        <p>Welcome, {session.user.name}!</p>
        <Link href="/partner">
          <Button>Join the Partner Program</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p>Landing Page</p>
      <Link href="/sign-in">
        <Button>Sign In</Button>
      </Link>
    </div>
  )
}
