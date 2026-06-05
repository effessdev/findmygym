import {
  pgTable,
  text,
  timestamp,
  boolean,
  doublePrecision,
  uuid,
} from "drizzle-orm/pg-core"

import { user } from "./auth-schema"

export const gym = pgTable("gym", {
  id: uuid("id").defaultRandom().primaryKey(),

  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  feePerMonth: doublePrecision("fee_per_month").notNull(), // INR

  location: text("location").notNull(),

  latitude: doublePrecision("latitude"),

  longitude: doublePrecision("longitude"),

  description: text("description").notNull(),

  equipment: text("equipment").notNull(),

  openingHours: text("opening_hours").notNull(),

  contactEmail: text("contact_email"),

  contactPhone: text("contact_phone").notNull(),

  images: text("images").array().notNull().default([]),

  isApproved: boolean("is_approved").notNull().default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})
