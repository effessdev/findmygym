"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { ReactNode, ComponentPropsWithoutRef } from "react"

export default function SocialSignIn({
  provider,
  children,
  ...buttonProps
}: {
  provider: "google" | "github"
  children: ReactNode
} & Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "onClick" | "disabled" | "children"
>) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)

    try {
      await authClient.signIn.social({
        provider: provider,
        callbackURL: "/me",
        errorCallbackURL: "/me?signinfailed=1",
        newUserCallbackURL: "/me?newuser=1",
        disableRedirect: false,
      })
    } catch (err) {
      console.log(err)
      toast.error(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} {...buttonProps}>
      {children}
    </Button>
  )
}
