"use client"

import { useEffect, useState, useTransition } from "react"
import type { ChangeEvent } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createGym } from "./actions"
import { gymCreateSchema } from "@/lib/schemas/gym"
import Link from "next/link"
import { useRouter } from "next/navigation"

const MAX_IMAGE_BYTES = 1_000_000
const MIN_IMAGES = 3

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
        await createGym(values, selectedImages.map((image) => image.file))
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-slate-200/80 bg-white/80 p-6 shadow-sm ring-1 ring-slate-200/80 dark:border-slate-800/80 dark:bg-slate-950/60 dark:ring-slate-800/80"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Gym name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your Awesome Gym"
            {...register("name")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="feePerMonth" className="block text-sm font-medium">
            Monthly fee (INR)
          </label>
          <input
            id="feePerMonth"
            type="number"
            step="0.01"
            min="0"
            {...register("feePerMonth", { valueAsNumber: true })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.feePerMonth && (
            <p className="text-sm text-destructive">
              {errors.feePerMonth.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="location" className="block text-sm font-medium">
            Location
          </label>
          <textarea
            id="location"
            rows={4}
            placeholder="4th Floor, Syama Business Centre, Opposite Hindu Office, Vyttila Junction, NH Bypass, Kochi, Kerala 682019, India"
            {...register("location")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.location && (
            <p className="text-sm text-destructive">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your gym and its amenities..."
            {...register("description")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="equipment" className="block text-sm font-medium">
            Equipment
          </label>
          <textarea
            id="equipment"
            rows={4}
            placeholder="Cardio Machines (8), Strength Machines (12), Squat Racks (2), Smith Machines (1), ..."
            {...register("equipment")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.equipment && (
            <p className="text-sm text-destructive">
              {errors.equipment.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="openingHours" className="block text-sm font-medium">
            Opening hours
          </label>
          <textarea
            id="openingHours"
            rows={2}
            placeholder="Mon-Fri: 6am - 10pm, Sat-Sun: 8am - 8pm"
            {...register("openingHours")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.openingHours && (
            <p className="text-sm text-destructive">
              {errors.openingHours.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="contactPhone" className="block text-sm font-medium">
            Contact phone
          </label>
          <input
            id="contactPhone"
            type="tel"
            {...register("contactPhone")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.contactPhone && (
            <p className="text-sm text-destructive">
              {errors.contactPhone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="contactEmail" className="block text-sm font-medium">
            Contact email (optional)
          </label>
          <input
            id="contactEmail"
            type="email"
            {...register("contactEmail")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.contactEmail && (
            <p className="text-sm text-destructive">
              {errors.contactEmail.message}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/80 dark:bg-slate-900/70">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Gym images</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Upload at least {MIN_IMAGES} photos. Images larger than 1MB are not allowed.
              We will crop each image to a 4:3 ratio automatically.
            </p>
          </div>
          <input
            id="gymImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageFiles}
            className="text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-white dark:text-slate-200"
          />
        </div>

        {imageError && (
          <p className="mt-3 text-sm text-destructive">{imageError}</p>
        )}

        {isProcessingImages && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Processing images...
          </p>
        )}

        {selectedImages.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {selectedImages.map((image, index) => (
              <div key={image.previewUrl} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950">
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
                  className="absolute right-2 top-2 rounded-full bg-slate-950/80 px-2 py-1 text-xs text-white transition hover:bg-slate-900/95"
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
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          {statusMessage}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Link href="/partner" className="flex-1">
          <Button variant="secondary" className="w-full">
            Go Back
          </Button>
        </Link>

        <Button type="submit" disabled={isPending || isProcessingImages} className="flex-1">
          {isPending ? "Creating..." : "Create Gym"}
        </Button>
      </div>
    </form>
  )
}

async function cropFileTo4by3(file: File): Promise<File> {
  const image = await loadImage(file)
  const aspectRatio = 4 / 3
  let cropWidth = image.width
  let cropHeight = image.height

  if (image.width / image.height > aspectRatio) {
    cropWidth = image.height * aspectRatio
  } else {
    cropHeight = image.width / aspectRatio
  }

  const cropX = Math.round((image.width - cropWidth) / 2)
  const cropY = Math.round((image.height - cropHeight) / 2)
  const maxWidth = 1200
  const maxHeight = 900
  const scale = Math.min(1, maxWidth / cropWidth, maxHeight / cropHeight)

  const canvas = document.createElement("canvas")
  canvas.width = Math.round(cropWidth * scale)
  canvas.height = Math.round(cropHeight * scale)
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Unable to process image")
  }

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height
  )

  let quality = 0.92
  let blob = await canvasToBlob(canvas, "image/jpeg", quality)

  while (blob.size > MAX_IMAGE_BYTES && quality > 0.55) {
    quality -= 0.1
    blob = await canvasToBlob(canvas, "image/jpeg", quality)
  }

  if (blob.size > MAX_IMAGE_BYTES) {
    throw new Error("Cropped image is still larger than 1MB.")
  }

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
  })
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = document.createElement("img")

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Unable to load image file."))
    }

    image.src = url
  })
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error("Canvas export failed."))
      }
    }, type, quality)
  })
}
