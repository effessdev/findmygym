import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function GymsPagination({
  currentPage,
  totalPages,
  buildPageUrl,
}: {
  currentPage: number
  totalPages: number
  buildPageUrl: (page: number) => string
}) {
  return (
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

            if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
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
  )
}
