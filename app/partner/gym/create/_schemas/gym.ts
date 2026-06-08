import { z } from "zod"
import { createInsertSchema } from "drizzle-zod"
import { gym } from "@/db/schema/gym-schema"

export const gymCreateSchema = createInsertSchema(gym)
  .omit({
    id: true,
    ownerId: true,
    images: true,
    isApproved: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    name: z.string().min(1, "Gym name is required"),
    location: z.string().min(1, "Location is required"),
    latitude: z.preprocess(
      (value) => {
        if (typeof value === "string") {
          const trimmed = value.trim()
          return trimmed === "" ? undefined : parseFloat(trimmed)
        }
        return value
      },
      z
        .number({ error: "Latitude is required" })
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
    ),
    longitude: z.preprocess(
      (value) => {
        if (typeof value === "string") {
          const trimmed = value.trim()
          return trimmed === "" ? undefined : parseFloat(trimmed)
        }
        return value
      },
      z
        .number({ error: "Longitude is required" })
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
    ),
    description: z.string().min(1, "Description is required"),
    equipment: z.string().min(1, "Equipment details are required"),
    openingHours: z.string().min(1, "Opening hours are required"),
    contactPhone: z.string().min(1, "Contact phone is required"),
    feePerMonth: z.preprocess(
      (value) => {
        if (typeof value === "string") {
          return parseFloat(value)
        }
        return value
      },
      z.number().min(0, "Monthly fee must be at least 0")
    ),
    contactEmail: z.preprocess((value) => {
      if (typeof value === "string") {
        const trimmed = value.trim()
        return trimmed === "" ? undefined : trimmed
      }
      return value
    }, z.string().email("Enter a valid email").optional()),
  })

export type GymCreateValues = z.infer<typeof gymCreateSchema>
