"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteGym } from "../_actions/delete-gym"
import { toast } from "sonner"

export default function DeleteGymDialog({ gymId }: { gymId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Gym</Button>
      </DialogTrigger>
      <DialogContent>
        <h1 className="text-bold text-lg">Are you sure?</h1>
        <p className="text-muted-foreground">
          Do you want to permanently delete your gym from out listing? This
          cannot be undone.
        </p>
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
                window.location.reload()
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
