"use client"

import { DefaultLoadingScreen } from "@/components/ui/default-loading-screen"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function SignOutPage() {
  const router = useRouter()
  const [message, setMessage] = useState("Signing out")

  useEffect(() => {
    async function signOut() {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully")
            router.push("/")
          },
          onError: () => {
            setMessage("Something went wrong")
          },
        },
      })
    }

    signOut()
  }, [router])

  return <DefaultLoadingScreen text={message} />
}
