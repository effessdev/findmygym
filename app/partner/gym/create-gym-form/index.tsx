"use client"

import { useState, useTransition } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGym } from "../create/actions"
import { updateGym } from "../[id]/edit/actions"
import { gymCreateSchema } from "@/app/partner/gym/create/schemas"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GymImagePicker, type SelectedImage } from "./gym-image-picker"

type GymFormInput = z.input<typeof gymCreateSchema>

const MIN_IMAGES = 3
const MAX_IMAGES = 6

interface GymFormProps {
  isEditMode?: boolean
  gymId?: string
  initialValues?: {
    name: string
    feePerMonth: number
    location: string
    latitude?: number
    longitude?: number
    description: string
    equipment: string
    openingHours: string
    contactEmail?: string
    contactPhone: string
    images: string[]
  }
}

export default function CreateGymForm({
  isEditMode = false,
  gymId,
  initialValues,
}: GymFormProps) {
  const [isPending, startTransition] = useTransition()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [isFetchingLocation, setIsFetchingLocation] = useState(false)

  const [imageError, setImageError] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(
    initialValues?.images || []
  )
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
  const [isProcessingImages, setIsProcessingImages] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GymFormInput>({
    resolver: zodResolver(gymCreateSchema),
    defaultValues: {
      name: initialValues?.name || "",
      feePerMonth: initialValues?.feePerMonth || 0,
      location: initialValues?.location || "",
      latitude: initialValues?.latitude ?? undefined,
      longitude: initialValues?.longitude ?? undefined,
      description: initialValues?.description || "",
      equipment: initialValues?.equipment || "",
      openingHours: initialValues?.openingHours || "",
      contactEmail: initialValues?.contactEmail || "",
      contactPhone: initialValues?.contactPhone || "",
    },
  })

  const onSubmit: SubmitHandler<GymFormInput> = (values) => {
    setSubmissionError(null)
    setStatusMessage(null)
    setImageError(null)

    const totalImages =
      existingImages.length - imagesToRemove.length + selectedImages.length
    if (totalImages < MIN_IMAGES) {
      setImageError(`Please upload at least ${MIN_IMAGES} images.`)
      return
    }

    startTransition(async () => {
      try {
        if (isEditMode && gymId) {
          await updateGym(
            gymId,
            values,
            selectedImages.map((image) => image.file),
            imagesToRemove
          )
          toast.success("Gym updated successfully.")
        } else {
          // Create mode - validate minimum images
          if (selectedImages.length < MIN_IMAGES) {
            setImageError(`Please upload at least ${MIN_IMAGES} images.`)
            return
          }
          await createGym(
            values,
            selectedImages.map((image) => image.file)
          )
          reset()
          setSelectedImages([])
          toast.success("Gym created successfully.")
        }

        router.push(`/partner/gym`)
      } catch (error) {
        setSubmissionError(
          error instanceof Error ? error.message : "Unable to save gym."
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Gym name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your Awesome Gym"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="feePerMonth">Monthly fee (INR)</Label>
          <Input
            id="feePerMonth"
            type="number"
            step="0.01"
            min="0"
            {...register("feePerMonth", {
              valueAsNumber: true,
            })}
          />
          {errors.feePerMonth && (
            <p className="text-sm text-destructive">
              {errors.feePerMonth.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Textarea
            id="location"
            rows={4}
            placeholder="4th Floor, Syama Business Centre, Opposite Hindu Office, Vyttila Junction, NH Bypass, Kochi, Kerala 682019, India"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-sm text-destructive">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>GPS coordinates</Label>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  placeholder="Latitude"
                  {...register("latitude", {
                    valueAsNumber: true,
                  })}
                />
                {errors.latitude && (
                  <p className="text-sm text-destructive">
                    {errors.latitude.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  placeholder="Longitude"
                  {...register("longitude", {
                    valueAsNumber: true,
                  })}
                />
                {errors.longitude && (
                  <p className="text-sm text-destructive">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                setGeoError(null)
                setIsFetchingLocation(true)

                if (!navigator.geolocation) {
                  setGeoError("Geolocation is not supported by your browser.")
                  setIsFetchingLocation(false)
                  return
                }

                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const latitude = Number(position.coords.latitude.toFixed(6))
                    const longitude = Number(
                      position.coords.longitude.toFixed(6)
                    )
                    setValue("latitude", latitude)
                    setValue("longitude", longitude)
                    setIsFetchingLocation(false)
                  },
                  (error) => {
                    setGeoError(
                      error.message || "Unable to retrieve current location."
                    )
                    setIsFetchingLocation(false)
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 10000,
                  }
                )
              }}
              disabled={isFetchingLocation}
            >
              {isFetchingLocation
                ? "Getting location..."
                : "Use current location"}
            </Button>
          </div>
          {geoError && <p className="text-sm text-destructive">{geoError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Describe your gym and its amenities..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipment">Equipment</Label>
          <Textarea
            id="equipment"
            rows={4}
            placeholder="Cardio Machines (8), Strength Machines (12), Squat Racks (2), Smith Machines (1), ..."
            {...register("equipment")}
          />
          {errors.equipment && (
            <p className="text-sm text-destructive">
              {errors.equipment.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="openingHours">Opening hours</Label>
          <Textarea
            id="openingHours"
            rows={2}
            placeholder="Mon-Fri: 6am - 10pm, Sat-Sun: 8am - 8pm"
            {...register("openingHours")}
          />
          {errors.openingHours && (
            <p className="text-sm text-destructive">
              {errors.openingHours.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact phone</Label>
          <Input id="contactPhone" type="tel" {...register("contactPhone")} />
          {errors.contactPhone && (
            <p className="text-sm text-destructive">
              {errors.contactPhone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact email (optional)</Label>
          <Input id="contactEmail" type="email" {...register("contactEmail")} />
          {errors.contactEmail && (
            <p className="text-sm text-destructive">
              {errors.contactEmail.message}
            </p>
          )}
        </div>
      </div>

      <GymImagePicker
        minImages={MIN_IMAGES}
        maxImages={MAX_IMAGES}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        imageError={imageError}
        setImageError={setImageError}
        isProcessingImages={isProcessingImages}
        setIsProcessingImages={setIsProcessingImages}
        existingImages={existingImages}
        onRemoveExistingImage={(url) => {
          setExistingImages((current) => current.filter((img) => img !== url))
          setImagesToRemove((current) => [...current, url])
        }}
      />

      {submissionError ? (
        <p className="text-sm text-destructive">{submissionError}</p>
      ) : statusMessage ? (
        <p className="text-sm text-muted-foreground">{statusMessage}</p>
      ) : null}

      <div className="flex gap-2">
        <Link
          href={isEditMode ? `/partner/gym` : "/partner"}
          className="flex-1"
        >
          <Button variant="secondary" className="w-full">
            Go Back
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={isPending || isProcessingImages}
          className="flex-1"
        >
          {isPending
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Gym"
              : "Create Gym"}
        </Button>
      </div>
    </form>
  )
}
