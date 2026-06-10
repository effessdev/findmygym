import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Memberships from "./_components/memberships"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"

export default async function MePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div>
      <div className="flex flex-col gap-4 px-4 py-8">
        <h1 className="text-center text-4xl font-bold">
          Hello, {session.user.name}
        </h1>
        <p className="text-center text-muted-foreground">
          Manage your profile here.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Your Memberships</CardTitle>
            <CardDescription>View and manage your memberships.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex h-20 w-full items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <Memberships />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" asChild>
              <Link href="/sign-out">Sign Out</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partnership Program</CardTitle>
            <CardDescription>
              Join our partnership program to display your gym in this app. We
              will handle discovery and payment for you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/partner">
              <Button>Go to Partnership Program</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
