"use client"

import { useEffect } from "react"
import type { ChangeEvent } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { cropFileTo4by3, MAX_IMAGE_BYTES, MIN_IMAGES } from "../utils"

export type SelectedImage = {
  file: File
  previewUrl: string
}

type GymImagePickerProps = {
  selectedImages: SelectedImage[]
  setSelectedImages: React.Dispatch<React.SetStateAction<SelectedImage[]>>
  imageError: string | null
  setImageError: React.Dispatch<React.SetStateAction<string | null>>
  isProcessingImages: boolean
  setIsProcessingImages: React.Dispatch<React.SetStateAction<boolean>>
}

export function GymImagePicker({
  selectedImages,
  setSelectedImages,
  imageError,
  setImageError,
  isProcessingImages,
  setIsProcessingImages,
}: GymImagePickerProps) {
  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl))
    }
  }, [selectedImages])

  const handleImageFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setImageError(null)
    setIsProcessingImages(true)

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed.")
      }

      if (file.size > MAX_IMAGE_BYTES) {
        throw new Error("Each image must be 1MB or smaller.")
      }

      const croppedFile = await cropFileTo4by3(file)

      setSelectedImages((current) => [
        ...current,
        {
          file: croppedFile,
          previewUrl: URL.createObjectURL(croppedFile),
        },
      ])
    } catch (error) {
      setImageError(
        error instanceof Error
          ? error.message
          : "Unable to process the selected image."
      )
    } finally {
      setIsProcessingImages(false)
      event.currentTarget.value = ""
    }
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
    <div className="space-y-4 rounded-xl border border-input p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Photos</p>
          <p className="text-sm text-muted-foreground">
            Upload at least {MIN_IMAGES} photos. Images will be cropped to a 4:3
            aspect ratio.
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium">
            {selectedImages.length} / {MIN_IMAGES}
          </p>
          <p className="text-xs text-muted-foreground">uploaded</p>
        </div>
      </div>

      <input
        id="gymImages"
        type="file"
        accept="image/*"
        onChange={handleImageFile}
        className="hidden"
      />

      <label htmlFor="gymImages">
        <Button
          type="button"
          variant="outline"
          disabled={isProcessingImages}
          asChild
        >
          <span>{isProcessingImages ? "Processing..." : "Add image"}</span>
        </Button>
      </label>

      {imageError && (
        <p className="mt-2 text-sm text-destructive">{imageError}</p>
      )}

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {selectedImages.map((image, index) => (
            <div
              key={image.previewUrl}
              className="group relative overflow-hidden rounded-xl border border-input"
            >
              <Image
                src={image.previewUrl}
                alt={`Selected gym image ${index + 1}`}
                width={400}
                height={300}
                className="aspect-4/3 w-full object-cover"
                unoptimized
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 rounded-md bg-background/90 px-2 py-1 text-xs shadow-sm"
              >
                Remove
              </button>

              <div className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-1 text-xs">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
