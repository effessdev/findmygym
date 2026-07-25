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
import SocialSignIn from "@/components/ui/social-sign-in"
import { SiGoogle } from "react-icons/si"
import YourGyms from "./_components/your-gyms"

export default async function MePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return (
      <div className="flex flex-col gap-4 px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="mb-2 text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Sign in to access all features, like your profile, memberships,
              partership program, and much more!
            </CardDescription>
          </CardHeader>
          <CardContent>
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
    <div className="flex flex-col gap-4 px-4 py-8">
      <h1 className="text-4xl font-bold">Hello, {session.user.name}</h1>
      <p className="text-muted-foreground">Manage your account here.</p>

      <Card>
        <CardHeader>
          <CardTitle>Your Memberships</CardTitle>
          <CardDescription>View and manage your memberships.</CardDescription>
        </CardHeader>
        <CardContent>
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
          <CardTitle>Your gyms</CardTitle>
        </CardHeader>
        <CardContent>
          <YourGyms />
        </CardContent>
      </Card>
    </div>
  )
}
