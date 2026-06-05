"use server"

import db from "@/db/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { gym } from "@/db/schema/gym-schema"
import { eq } from "drizzle-orm"

export async function deleteGym(
  gymId: string
): Promise<{ success: true } | { success: false; message: string }> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return { success: false, message: "You must be signed in to delete a gym." }
  }

  const [gymToDelete] = await db
    .select()
    .from(gym)
    .where(eq(gym.ownerId, session.user.id))
    .limit(1)

  if (gymToDelete.ownerId !== session.user.id) {
    return {
      success: false,
      message: "You must be the owner of the gym to delete it.",
    }
  }

  await db.delete(gym).where(eq(gym.id, gymId))

  return { success: true }
}
