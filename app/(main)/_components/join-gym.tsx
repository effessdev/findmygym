"use client"

import { Button } from "@/components/ui/button"
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
import { RocketIcon } from "lucide-react"
import { joinGym } from "../_actions/join-gym"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function JoinGym({ gymId }: { gymId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full">
            Join Gym <RocketIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Join this Gym</DialogTitle>
            <DialogDescription>Take a membership.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              onClick={async () => {
                setLoading(true)
                const result = await joinGym(gymId)

                if (!result.success) {
                  toast.error(result.message)
                  setLoading(false)
                  return
                }

                toast.success("Membership created successfully")
                router.push("/me")
              }}
            >
              Take Membership
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
