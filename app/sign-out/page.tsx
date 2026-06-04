"use client"

import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function SignOutPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")

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

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      {message === "" ? <Spinner /> : <p className="text-center">{message}</p>}
    </div>
  )
}
