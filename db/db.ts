import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

if (process.env.DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL is not defined")

  // Don't catch the above error.
}

const db = drizzle(process.env.DATABASE_URL, { schema: schema })

export default db
