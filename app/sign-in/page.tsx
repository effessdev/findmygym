"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import SignInWithGitHub from "@/components/ui/social-sign-in"
import { SiGoogle } from "react-icons/si"
import { toast } from "sonner"

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
    <SignInWithGitHub provider="google">
      <SiGoogle /> Sign in with Google
    </SignInWithGitHub>
  )
}
