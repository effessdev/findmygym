import db from "@/db/db"
import { gym } from "@/db/schema/gym-schema"
import { SearchBar } from "./_components/search-bar"
import { and, count, eq, ilike, or } from "drizzle-orm"
import Gyms from "./_components/gyms"
import GymPagination from "./_components/gym-pagination"

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

const ITEMS_PER_PAGE = 20

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams

  const currentPage = parseInt(params.page || "1", 10)
  const offset = (currentPage - 1) * ITEMS_PER_PAGE
  const search = params.search?.trim() ?? ""

  const whereClause = search
    ? and(
        eq(gym.isApproved, true),
        or(ilike(gym.name, `%${search}%`), ilike(gym.location, `%${search}%`))
      )
    : eq(gym.isApproved, true)

  const [{ totalGyms }] = await db
    .select({
      totalGyms: count(),
    })
    .from(gym)
    .where(whereClause)

  const totalPages = Math.ceil(totalGyms / ITEMS_PER_PAGE)

  return (
    <div className="gap-4 space-y-6 px-4 py-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Gyms</h1>
        <p className="text-muted-foreground">Browse all available gyms</p>
      </div>

      <SearchBar />

      <Gyms currentPage={currentPage} offset={offset} search={search} />

      {totalPages > 1 && (
        <GymPagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildPageUrl={(page: number) => {
            const params = new URLSearchParams()
            params.set("page", page.toString())
            if (search) {
              params.set("search", search)
            }
            return `/?${params.toString()}`
          }}
        />
      )}
    </div>
  )
}
