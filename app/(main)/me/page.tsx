import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Memberships from "./_components/memberships"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import SocialSignIn from "@/components/ui/social-sign-in"
import { SiGoogle } from "react-icons/si"
import YourGyms from "./_components/your-gyms"

export default async function MePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border/70">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Sign in to continue
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <SocialSignIn
              provider="google"
              variant="default"
              className="w-full"
            >
              <SiGoogle /> Sign in with Google
            </SocialSignIn>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Hello, {session.user.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Manage your memberships, account, and gym listings here.
        </p>
      </section>

      <div className="space-y-4">
        <Card>
          <CardContent>
            <h2 className="mb-4 text-lg font-semibold">Memberships</h2>
            <Suspense
              fallback={
                <div className="flex h-10 w-full items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <Memberships />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="text-sm text-muted-foreground">
              You can sign out to sign in with a different account.
            </p>
            <Button variant="destructive" asChild className="w-full sm:w-auto">
              <Link href="/sign-out">Sign Out</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <YourGyms />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
