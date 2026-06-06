"use client"

import { useEffect, useState, useTransition } from "react"
import type { ChangeEvent } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGym } from "./actions"
import { gymCreateSchema } from "@/lib/schemas/gym"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cropFileTo4by3, MAX_IMAGE_BYTES, MIN_IMAGES } from "./utils"

type GymFormInput = z.input<typeof gymCreateSchema>

type SelectedImage = {
  file: File
  previewUrl: string
}

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

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    }
  }, [selectedImages])

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

  const handleImageFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) {
      return
    }

    setImageError(null)
    setIsProcessingImages(true)

    const newSelections: SelectedImage[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setImageError("Only image files are allowed.")
        continue
      }

      if (file.size > MAX_IMAGE_BYTES) {
        setImageError("Each image must be 1MB or smaller.")
        continue
      }

      try {
        const croppedFile = await cropFileTo4by3(file)
        const previewUrl = URL.createObjectURL(croppedFile)
        newSelections.push({ file: croppedFile, previewUrl })
      } catch (error) {
        setImageError(
          error instanceof Error
            ? error.message
            : "Unable to process one of the selected images."
        )
      }
    }

    setIsProcessingImages(false)
    setSelectedImages((current) => [...current, ...newSelections])
    event.currentTarget.value = ""
  }

  const removeImage = (index: number) => {
    setSelectedImages((current) => {
      const next = [...current]
      const [removed] = next.splice(index, 1)
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl)
      }
      return next
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
            {...register("feePerMonth", { valueAsNumber: true })}
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

      <div className="space-y-4 rounded-xl border border-input p-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Gym images</p>
          <p className="text-sm text-muted-foreground">
            Upload at least {MIN_IMAGES} photos. Images larger than 1MB are not
            allowed. We will crop each image to a 4:3 ratio automatically.
          </p>
        </div>
        <Input
          id="gymImages"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageFiles}
        />

        {imageError && (
          <p className="mt-3 text-sm text-destructive">{imageError}</p>
        )}

        {isProcessingImages && (
          <p className="mt-3 text-sm text-muted-foreground">
            Processing images...
          </p>
        )}

        {selectedImages.length > 0 && (
          <div className="mt-4 space-y-3">
            {selectedImages.map((image, index) => (
              <div
                key={image.previewUrl}
                className="relative overflow-hidden rounded-xl border border-input bg-background p-1"
              >
                <Image
                  src={image.previewUrl}
                  alt={`Selected gym image ${index + 1}`}
                  width={320}
                  height={240}
                  className="h-40 w-full object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 rounded-full bg-muted px-2 py-1 text-xs text-foreground transition hover:bg-muted/80"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

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
