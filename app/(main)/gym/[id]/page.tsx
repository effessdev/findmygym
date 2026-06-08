import db from "@/db/db"
import { eq } from "drizzle-orm"
import { gym } from "@/db/schema/gym-schema"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users, IndianRupee, MapPin, Mail, Phone } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default async function SpecificGymPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params

  const result = await db.select().from(gym).where(eq(gym.id, id)).limit(1)
  const thisGym = result[0]

  if (!thisGym) {
    return (
      <div className="my-8 text-center text-destructive">Gym not found</div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="my-8 text-center text-4xl font-bold">{thisGym.name}</h1>

      {thisGym.description && (
        <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground">
          {thisGym.description}
        </p>
      )}

      {thisGym.images.length > 0 && (
        <div className="mx-auto mb-12 max-w-3xl px-12">
          <Carousel className="w-full">
            <CarouselContent>
              {thisGym.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`Gym Image ${index + 1}`}
                      className="h-64 w-full object-cover sm:h-96 md:h-[450px]"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card className="w-full">
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4">
                <IndianRupee className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm leading-none font-medium">
                    Fee Per Month
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {thisGym.feePerMonth} INR
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm leading-none font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {thisGym.location}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm leading-none font-medium">
                    Contact Email
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {thisGym.contactEmail || "N/A"}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center space-x-4">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm leading-none font-medium">
                    Contact Phone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {thisGym.contactPhone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {thisGym.equipment}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opening Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {thisGym.openingHours}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
