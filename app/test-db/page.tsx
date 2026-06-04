import { neon } from "@neondatabase/serverless"

export default async function TestDb() {
  let dbIsWorking = false

  try {
    const sql = neon(`${process.env.DATABASE_URL}`)
    await sql`SELECT 1`
    dbIsWorking = true
  } catch (e) {
    console.log(e)
  }

  return (
    <p>{dbIsWorking ? "Database is working" : "Database is not working"}</p>
  )
}
