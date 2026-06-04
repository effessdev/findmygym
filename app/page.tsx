import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect("/home")
  }

  return (
    <div>
      <p>Landing Page</p>
      <Link href="/sign-in">
        <Button variant="link">Sign In</Button>
      </Link>
    </div>
  )
}
