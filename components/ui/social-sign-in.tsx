"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "./button"
import { useState } from "react"
import { toast } from "sonner"
import { ReactNode } from "react"

export default function SocialSignIn({
  provider,
  children,
}: {
  provider: "google" | "github"
  children: ReactNode
}) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)

    try {
      await authClient.signIn.social({
        provider: provider,
        callbackURL: "/app/remember",
        errorCallbackURL: "/error",
        newUserCallbackURL: "/app/remember",
        disableRedirect: false,
      })
    } catch (err) {
      console.log(err)
      toast.error(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} variant="outline" disabled={loading}>
      {children}
    </Button>
  )
}
