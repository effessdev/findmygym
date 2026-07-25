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
import DeleteGymDialog from "../../../_actions/delete-gym-dialog"

export default async function GymPage({ params }: { params: { id: string } }) {
  const { id } = await params

  const result = await db.select().from(gym).where(eq(gym.id, id)).limit(1)
  const thisGym = result[0]

  return (
    <div className="px-4 py-8">
      {thisGym ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                Gym Options for{" "}
                <span className="font-bold">{thisGym.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DeleteGymDialog gymId={thisGym.id} />
            </CardContent>
          </Card>
        </>
      ) : (
        <p>Gym not found</p>
      )}
    </div>
  )
}
