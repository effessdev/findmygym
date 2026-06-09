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
import { cn } from "@/lib/utils"

export function JoinGym() {
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
            <DialogDescription>
              Pay now and take a membership.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Pay Now</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
