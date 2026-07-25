"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteGym } from "./delete-gym"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function DeleteGymDialog({ gymId }: { gymId: string }) {
  const router = useRouter()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Gym</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-bold text-lg">Are you sure?</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Do you want to permanently delete your gym from out listing? This
          cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async (event) => {
              const deleteBtn = event.currentTarget
              deleteBtn.disabled = true
              const result = await deleteGym(gymId)
              if (result.success) {
                router.push("/me")
                return
              }
              toast.error(result.message)
              deleteBtn.disabled = false
            }}
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
