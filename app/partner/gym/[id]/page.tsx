import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import db from "@/db/db"
import { gym } from "@/db/schema/gym-schema"
import { eq } from "drizzle-orm"

export default async function GymPage({ params }: { params: { id: string } }) {
  const { id } = await params

  const result = await db.select().from(gym).where(eq(gym.id, id)).limit(1)
  const thisGym = result[0]

  return (
    <div className="p-4">
      {thisGym ? (
        <Card>
          <CardHeader>
            <CardTitle>{thisGym.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage your gym here.</p>
          </CardContent>
        </Card>
      ) : (
        <p>Gym not found</p>
      )}
    </div>
  )
}
