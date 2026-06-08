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

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()

    params.set("page", page.toString())

    if (search) {
      params.set("search", search)
    }

    return `/?${params.toString()}`
  }

  return (
    <div className="space-y-6 px-4 py-8">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Gyms</h1>
          <p className="text-muted-foreground">Browse all available gyms</p>
        </div>

        <SearchBar />

        {gyms.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No gyms found matching &quot;{search}&quot;
              </p>
            </CardContent>
          </Card>
        ) : (
          gyms.map((g) => (
            <Card key={g.id} className="flex flex-col">
              {g.images.length > 0 && (
                <Image
                  src={g.images[0]}
                  alt={g.name}
                  width={400}
                  height={300}
                  className="aspect-4/3 w-full object-cover"
                />
              )}

              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  <div className="flex justify-between gap-4">
                    <p>{g.name}</p>
                    <p className="text-primary">₹{g.feePerMonth}/mo</p>
                  </div>
                </CardTitle>

                <CardDescription>{g.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Location:</span> {g.location}
                </p>

                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Opening Hours:</span>{" "}
                  {g.openingHours}
                </p>
              </CardContent>

              <CardFooter className="pt-0">
                <Link href={`/gym/${g.id}`}>
                  <Button variant="outline" className="ml-auto">
                    More details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={buildPageUrl(currentPage - 1)} />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1

                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1

                if (!showPage) {
                  if (pageNum === 2 && currentPage > 3) {
                    return (
                      <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  if (
                    pageNum === totalPages - 1 &&
                    currentPage < totalPages - 2
                  ) {
                    return (
                      <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return null
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={buildPageUrl(pageNum)}
                      isActive={pageNum === currentPage}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext href={buildPageUrl(currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
