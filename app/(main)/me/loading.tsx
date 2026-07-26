import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header Section */}
      <section className="flex flex-col gap-3">
        {/* Title skeleton (text-3xl) */}
        <Skeleton className="h-9 w-64" />
        {/* Subtitle skeleton (text-sm) */}
        <Skeleton className="mt-1 h-5 w-80 max-w-full" />
      </section>

      {/* Cards Stack */}
      <div className="space-y-4">
        {/* Memberships Card */}
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="mb-4 h-7 w-32" /> {/* Heading */}
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Account Card */}
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <Skeleton className="h-7 w-24" /> {/* Heading */}
            <Skeleton className="h-5 w-72 max-w-full" /> {/* Paragraph */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Button */}
          </CardContent>
        </Card>

        {/* Your Gyms Card */}
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="mb-4 h-7 w-28" /> {/* Heading */}
            <Skeleton className="h-24 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
