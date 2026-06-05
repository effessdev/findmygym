"use server"

import { headers } from "next/headers"
import type { z } from "zod"

import db from "@/db/db"
import { auth } from "@/lib/auth"
import { gym } from "@/db/schema/gym-schema"
import { gymCreateSchema } from "@/lib/schemas/gym"

export async function createGym(values: z.input<typeof gymCreateSchema>) {
  const gymData = gymCreateSchema.parse(values)
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new Error("You must be signed in to create a gym.")
  }

  await db.insert(gym).values({
    ownerId: session.user.id,
    name: gymData.name,
    feePerMonth: gymData.feePerMonth,
    location: gymData.location,
    description: gymData.description,
    equipment: gymData.equipment,
    openingHours: gymData.openingHours,
    contactEmail: gymData.contactEmail ?? null,
    contactPhone: gymData.contactPhone,
  })
}
