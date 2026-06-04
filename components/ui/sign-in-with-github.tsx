"use client"

import { authClient } from "@/lib/auth-client"
import { SiGithub } from "react-icons/si"
import { Button } from "./button"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "./spinner"
import { cn } from "@/lib/utils"

export default function SignInWithGitHub() {
  const [showLoading, setShowLoading] = useState(false)

  async function handleClick() {
    setShowLoading(true)

    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/home",
        errorCallbackURL: "/error",
        newUserCallbackURL: "/welcome",
        disableRedirect: false,
      })
    } catch (err) {
      console.log(err)
      toast.error(err instanceof Error ? err.message : "Something went wrong")
      setShowLoading(false)
    }
  }

  return (
    <Button
      className="w-full"
      onClick={handleClick}
      variant="outline"
      disabled={showLoading}
    >
      <SiGithub />
      Sign in with GitHub
      <Spinner className={cn(!showLoading && "hidden")} />
    </Button>
  )
}
