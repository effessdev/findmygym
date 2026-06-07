import { headers } from "next/headers"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import db from "@/db/db"
import { gym } from "@/db/schema/gym-schema"
import CreateGymForm from "../../create/_components/create-gym-form"

interface EditGymPageProps {
  params: {
    id: string
  }
}

export default async function EditGymPage({ params }: EditGymPageProps) {
  const session = await auth.api.getSession({ headers: await headers() })
  const { id: gymId } = await params

  if (!session) {
    redirect("/sign-in")
  }

  const gymData = await db.select().from(gym).where(eq(gym.id, gymId)).limit(1)

  if (!gymData.length) {
    redirect("/partner")
  }

  const gymRecord = gymData[0]

  // Verify the user owns this gym
  if (gymRecord.ownerId !== session.user.id) {
    redirect("/partner")
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold">Edit Gym Listing</h1>
        <p className="text-sm text-muted-foreground">
          Update your gym information below. You can modify any field and add or
          remove images as needed.
        </p>
      </div>
      <CreateGymForm
        isEditMode
        gymId={gymId}
        initialValues={{
          name: gymRecord.name,
          feePerMonth: gymRecord.feePerMonth,
          location: gymRecord.location,
          description: gymRecord.description,
          equipment: gymRecord.equipment,
          openingHours: gymRecord.openingHours,
          contactEmail: gymRecord.contactEmail || undefined,
          contactPhone: gymRecord.contactPhone,
          images: gymRecord.images || [],
        }}
      />
    </main>
  )
}
