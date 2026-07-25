"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cancelMembership } from "../_actions/cancel-membership"

export default function CancelMembershipDialog({
  membershipId,
}: {
  membershipId: string
}) {
  const router = useRouter()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Cancel Membership</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-bold text-lg">
          Cancel membership?
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          This will remove your membership for this gym. This action cannot be
          undone.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Keep Membership</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async (event) => {
              const confirmButton = event.currentTarget
              confirmButton.disabled = true

              const result = await cancelMembership(membershipId)

              if (result.success) {
                router.refresh()
                toast.success("Membership cancelled")
                return
              }

              toast.error(result.message)
              confirmButton.disabled = false
            }}
          >
            Yes, Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
