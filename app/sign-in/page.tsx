"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SiGoogle } from "react-icons/si"
import SocialSignIn from "@/components/ui/social-sign-in"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SignInPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("signinfailed") === "1") {
      toast.error(
        "Oops! Something went wrong during sign-in. Please try again."
      )
    }
  }, [searchParams])

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 text-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="mb-2 text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Sign in to access all features, like your profile, memberships,
            partership program, and much more!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row md:justify-center md:gap-3">
            <SkipSignInDialog />

            <SocialSignIn
              provider="google"
              variant="default"
              className="w-full sm:flex-1"
            >
              <SiGoogle /> Sign in with Google
            </SocialSignIn>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SkipSignInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:flex-1">
          Skip and Go Back
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to skip sign in?</DialogTitle>
          <DialogDescription>
            Signing in is optional. However, you will loose some critical
            features of the app. We strongly recommend signing in.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="destructive" className="w-full sm:w-auto">
              Skip and Go Back
            </Button>
          </Link>
          <DialogClose asChild>
            <Button className="w-full sm:w-auto">Continue signing in</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
