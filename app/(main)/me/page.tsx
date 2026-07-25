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
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hello, {session.user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Manage your memberships and gym listings.
          </p>
        </div>
      </section>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Memberships</h2>
              <p className="text-sm text-muted-foreground">
                Your active memberships.
              </p>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="flex h-10 w-full items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <Memberships />
          </Suspense>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground">Sign out anytime.</p>
            </div>
          </div>
          <Button variant="destructive" asChild className="w-full sm:w-auto">
            <Link href="/sign-out">Sign Out</Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Your gyms</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Update your listings.
              </p>
            </div>
          </div>
          <YourGyms />
        </div>
      </div>
    </div>
  )
}
