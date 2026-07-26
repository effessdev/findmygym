"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import db from "@/db/db"
import { redirect } from "next/navigation"
import { membership } from "@/db/schema/membership-schema"
import { and, eq } from "drizzle-orm"

export async function joinGym(
  gymId: string
): Promise<{ success: true } | { success: false; message: string }> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/me")
  }

  const [existingMembership] = await db
    .select()
    .from(membership)
    .where(
      and(eq(membership.gymId, gymId), eq(membership.userId, session.user.id))
    )
    .limit(1)

  if (existingMembership) {
    return {
      success: false,
      message: "You are already a member of this gym.",
    }
  }

  try {
    await db.insert(membership).values({
      gymId: gymId,
      userId: session.user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }

  return { success: true }
}
