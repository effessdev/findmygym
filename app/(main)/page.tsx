import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import db from "@/db/db"
import { gym } from "@/db/schema/gym-schema"
import Image from "next/image"
import { SearchBar } from "./_components/search-bar"
import { and, count, eq, ilike, or } from "drizzle-orm"
import { JoinGym } from "./_components/join-gym"
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

  const gyms = await db
    .select()
    .from(gym)
    .where(whereClause)
    .limit(ITEMS_PER_PAGE)
    .offset(offset)

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
