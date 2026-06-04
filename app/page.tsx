import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Page() {
  return (
    <div>
      <p>Landing Page</p>
      <Link href="/sign-in">
        <Button>Sign In</Button>
      </Link>
    </div>
  )
}
