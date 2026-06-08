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
    name: z
      .string()
      .min(1, "Gym name is required")
      .max(100, "Gym name must be 100 characters or fewer"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(200, "Location must be 200 characters or fewer"),
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
    description: z
      .string()
      .min(1, "Description is required")
      .max(2000, "Description must be 2000 characters or fewer"),
    equipment: z
      .string()
      .min(1, "Equipment details are required")
      .max(2000, "Equipment details must be 2000 characters or fewer"),
    openingHours: z
      .string()
      .min(1, "Opening hours are required")
      .max(200, "Opening hours must be 200 characters or fewer"),
    contactPhone: z
      .string()
      .min(1, "Contact phone is required")
      .max(20, "Phone number must be 20 characters or fewer")
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    feePerMonth: z.preprocess(
      (value) => {
        if (typeof value === "string") {
          const trimmed = value.trim()
          return trimmed === "" ? undefined : parseFloat(trimmed)
        }
        return value
      },
      z
        .number({ error: "Monthly fee is required" })
        .min(0, "Monthly fee must be at least 0")
        .max(1_000_000, "Monthly fee must be 1,000,000 or less")
    ),
    contactEmail: z.preprocess((value) => {
      if (typeof value === "string") {
        const trimmed = value.trim()
        return trimmed === "" ? undefined : trimmed
      }
      return value
    }, z.string().email("Enter a valid email").max(254, "Email must be 254 characters or fewer").optional()),
  })

export type GymCreateValues = z.infer<typeof gymCreateSchema>
