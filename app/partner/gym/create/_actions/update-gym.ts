"use server"

import { headers } from "next/headers"
import { randomUUID } from "crypto"
import { put, del } from "@vercel/blob"
import type { z } from "zod"
import { eq } from "drizzle-orm"

import db from "@/db/db"
import { auth } from "@/lib/auth"
import { gym } from "@/db/schema/gym-schema"
import { gymCreateSchema } from "@/app/partner/gym/create/_schemas/gym"

const MAX_IMAGE_BYTES = 1_000_000

export async function updateGym(
  gymId: string,
  values: z.input<typeof gymCreateSchema>,
  imageFiles: File[],
  imagesToRemove: string[] = []
) {
  const gymData = gymCreateSchema.parse(values)
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new Error("You must be signed in to update a gym.")
  }

  // Verify the user owns this gym
  const existingGym = await db
    .select()
    .from(gym)
    .where(eq(gym.id, gymId))
    .limit(1)

  if (!existingGym.length) {
    throw new Error("Gym not found.")
  }

  if (existingGym[0].ownerId !== session.user.id) {
    throw new Error("You do not have permission to update this gym.")
  }

  let imageUrls = [...(existingGym[0].images || [])]

  // Remove specified images
  for (const imageUrl of imagesToRemove) {
    if (imageUrls.includes(imageUrl)) {
      try {
        await del(imageUrl)
      } catch (error) {
        console.error("Failed to delete image:", error)
      }
      imageUrls = imageUrls.filter((url) => url !== imageUrl)
    }
  }

  // Process new images
  for (const file of imageFiles) {
    if (!file?.type?.startsWith("image/")) {
      throw new Error("Only image files are allowed.")
    }

    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error("Each image must be 1MB or smaller.")
    }

    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg"

    const upload = await put(`gyms/${randomUUID()}.${extension}`, file, {
      access: "public",
    })

    imageUrls.push(upload.url)
  }

  await db
    .update(gym)
    .set({
      name: gymData.name,
      feePerMonth: gymData.feePerMonth,
      location: gymData.location,
      description: gymData.description,
      equipment: gymData.equipment,
      openingHours: gymData.openingHours,
      contactEmail: gymData.contactEmail ?? null,
      contactPhone: gymData.contactPhone,
      images: imageUrls,
    })
    .where(eq(gym.id, gymId))
}
