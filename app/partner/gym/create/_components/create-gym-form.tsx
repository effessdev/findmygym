"use client"

import { useState, useTransition } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGym } from "../actions"
import { gymCreateSchema } from "@/lib/schemas/gym"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MIN_IMAGES } from "../utils"
import { GymImagePicker, type SelectedImage } from "./gym-image-picker"

type GymFormInput = z.input<typeof gymCreateSchema>

export default function CreateGymForm() {
  const [isPending, startTransition] = useTransition()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const [imageError, setImageError] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [isProcessingImages, setIsProcessingImages] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GymFormInput>({
    resolver: zodResolver(gymCreateSchema),
    defaultValues: {
      name: "",
      feePerMonth: 0,
      location: "",
      description: "",
      equipment: "",
      openingHours: "",
      contactEmail: "",
      contactPhone: "",
    },
  })

  const onSubmit: SubmitHandler<GymFormInput> = (values) => {
    setSubmissionError(null)
    setStatusMessage(null)
    setImageError(null)

    if (selectedImages.length < MIN_IMAGES) {
      setImageError(`Please upload at least ${MIN_IMAGES} images.`)
      return
    }

    startTransition(async () => {
      try {
        await createGym(
          values,
          selectedImages.map((image) => image.file)
        )

        reset()
        setSelectedImages([])

        setStatusMessage("Gym created successfully.")
        router.push("/partner")
      } catch (error) {
        setSubmissionError(
          error instanceof Error ? error.message : "Unable to create gym."
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
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        imageError={imageError}
        setImageError={setImageError}
        isProcessingImages={isProcessingImages}
        setIsProcessingImages={setIsProcessingImages}
      />

      {submissionError ? (
        <p className="text-sm text-destructive">{submissionError}</p>
      ) : statusMessage ? (
        <p className="text-sm text-muted-foreground">{statusMessage}</p>
      ) : null}

      <div className="flex gap-2">
        <Link href="/partner" className="flex-1">
          <Button variant="secondary" className="w-full">
            Go Back
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={isPending || isProcessingImages}
          className="flex-1"
        >
          {isPending ? "Creating..." : "Create Gym"}
        </Button>
      </div>
    </form>
  )
}
