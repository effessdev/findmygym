"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { and, eq } from "drizzle-orm"
import db from "@/db/db"
import { membership } from "@/db/schema/membership-schema"
import { auth } from "@/lib/auth"

export async function cancelMembership(
  membershipId: string
): Promise<{ success: true } | { success: false; message: string }> {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: "You must be signed in to cancel a membership.",
    }
  }

  const result = await db
    .delete(membership)
    .where(
      and(
        eq(membership.id, membershipId),
        eq(membership.userId, session.user.id)
      )
    )

  if (result.rowCount === 0) {
    return { success: false, message: "Membership not found." }
  }

  revalidatePath("/me")

  return { success: true }
}
