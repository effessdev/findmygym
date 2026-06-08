import db from "@/db/db"
import { eq } from "drizzle-orm"
import { gym } from "@/db/schema/gym-schema"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Users, IndianRupee, MapPin, Mail, Phone } from "lucide-react"

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
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm leading-none font-medium">Owner ID</p>
                  <p className="text-sm text-muted-foreground">
                    {thisGym.ownerId}
                  </p>
                </div>
              </div>
              <Separator />
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
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {thisGym.description}
              </p>
            </CardContent>
          </Card>

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
      {thisGym.images.length > 0 && (
        <div className="my-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Gallery</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {thisGym.images.map((image, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={index}
                  src={image}
                  alt={`Gym Image ${index + 1}`}
                  className="h-48 w-full rounded-md object-cover"
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
