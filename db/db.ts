import { drizzle } from "drizzle-orm/neon-http"

if (process.env.DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL is not defined")

  // Don't catch the above error.
}

const db = drizzle(process.env.DATABASE_URL)

export default db
