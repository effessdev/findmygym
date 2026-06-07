"use server"

import { headers } from "next/headers"
import { randomUUID } from "crypto"
import { put } from "@vercel/blob"
import type { z } from "zod"

import db from "@/db/db"
import { auth } from "@/lib/auth"
import { gym } from "@/db/schema/gym-schema"
import { gymCreateSchema } from "@/app/partner/gym/create/_schemas/gym"

const MAX_IMAGE_BYTES = 1_000_000
const MIN_IMAGES = 3
const MAX_IMAGES = 6

export async function createGym(
  values: z.input<typeof gymCreateSchema>,
  imageFiles: File[]
) {
  const gymData = gymCreateSchema.parse(values)
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    throw new Error("You must be signed in to create a gym.")
  }

  if (!Array.isArray(imageFiles) || imageFiles.length < MIN_IMAGES) {
    throw new Error(`Please upload at least ${MIN_IMAGES} gym images.`)
  }

  if (imageFiles.length > MAX_IMAGES) {
    throw new Error(`Please upload at most ${MAX_IMAGES} gym images.`)
  }

  const imageUrls: string[] = []

  for (const file of imageFiles) {
    // TODO: Harden validation (check enforce 4:3 aspect ratio, extension, etc.)

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
    images: imageUrls,
  })
}
