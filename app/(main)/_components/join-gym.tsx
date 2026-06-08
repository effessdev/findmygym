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

export function JoinGym({ className }: { className?: string }) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className={className}>
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
