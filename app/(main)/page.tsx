import { SearchBar } from "./_components/search-bar"
import { Gyms, GYMS_PER_PAGE } from "./_components/gyms"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams

  const currentPage = parseInt(params.page || "1", 10)
  const offset = (currentPage - 1) * GYMS_PER_PAGE
  const search = params.search?.trim() ?? ""

  return (
    <div className="gap-4 space-y-6 px-4 py-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Gyms</h1>
        <p className="text-muted-foreground">
          Browse and find the perfect fit for your fitness journey
        </p>
      </div>

      <SearchBar />

      <Suspense
        fallback={Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square w-full rounded-xl" />
        ))}
      >
        <Gyms currentPage={currentPage} offset={offset} search={search} />
      </Suspense>
    </div>
  )
}
