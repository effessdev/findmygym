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
import db from "@/db/db"
import { gym } from "@/db/schema/gym-schema"
import Image from "next/image"
import { and, eq, ilike, or } from "drizzle-orm"
import { JoinGym } from "./join-gym"

const ITEMS_PER_PAGE = 20

export default async function Gyms({
  offset,
  search,
}: {
  currentPage: number
  offset: number
  search: string
}) {
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

  return (
    <div className="flex flex-col gap-4">
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

              <CardDescription className="line-clamp-4">
                {g.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                <span className="font-bold">Location:</span> {g.location}
              </p>

              <p className="text-sm">
                <span className="font-bold">Opening Hours:</span>{" "}
                {g.openingHours}
              </p>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="flex w-full gap-2">
                <Button asChild variant="outline" className="shrink-0">
                  <Link href={`/gym/${g.id}`}>More details</Link>
                </Button>

                <div className="flex-1">
                  <JoinGym />
                </div>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}
