import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { user } from "./auth-schema"
import { gym } from "./gym-schema"

export const membership = pgTable(
  "membership",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    gymId: uuid("gym_id")
      .notNull()
      .references(() => gym.id, { onDelete: "cascade" }),

    joinedAt: timestamp("joined_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => [uniqueIndex("membership_user_gym_unique").on(t.userId, t.gymId)]
)
