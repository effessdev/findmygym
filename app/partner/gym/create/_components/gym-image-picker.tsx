"use client"

import { useEffect } from "react"
import type { ChangeEvent } from "react"
import Image from "next/image"
import { processImage } from "../_utils/process-image"
import { Button } from "@/components/ui/button"

export type SelectedImage = {
  file: File
  previewUrl: string
}

type GymImagePickerProps = {
  minImages: number
  maxImages: number
  selectedImages: SelectedImage[]
  setSelectedImages: React.Dispatch<React.SetStateAction<SelectedImage[]>>
  imageError: string | null
  setImageError: React.Dispatch<React.SetStateAction<string | null>>
  isProcessingImages: boolean
  setIsProcessingImages: React.Dispatch<React.SetStateAction<boolean>>
  existingImages?: string[]
  onRemoveExistingImage?: (url: string) => void
}

export function GymImagePicker({
  minImages,
  maxImages,
  selectedImages,
  setSelectedImages,
  imageError,
  setImageError,
  isProcessingImages,
  setIsProcessingImages,
  existingImages = [],
  onRemoveExistingImage,
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

      const processedFile = await processImage(file)

      setSelectedImages((current) => [
        ...current,
        {
          file: processedFile,
          previewUrl: URL.createObjectURL(processedFile),
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
            Upload at least {minImages} photos. Images will be cropped to a 4:3
            aspect ratio and compressed to 1MB.
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium">
            {existingImages.length + selectedImages.length} / {minImages}
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

      {(existingImages.length > 0 || selectedImages.length > 0) && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {existingImages.map((imageUrl, index) => (
            <div
              key={imageUrl}
              className="group relative overflow-hidden rounded-xl border border-input"
            >
              <Image
                src={imageUrl}
                alt={`Gym image ${index + 1}`}
                width={400}
                height={300}
                className="aspect-4/3 w-full object-cover"
              />

              <button
                type="button"
                onClick={() => onRemoveExistingImage?.(imageUrl)}
                className="absolute top-2 right-2 rounded-md bg-background/90 px-2 py-1 text-xs shadow-sm"
              >
                Remove
              </button>

              <div className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-1 text-xs">
                #{index + 1}
              </div>
            </div>
          ))}

          {selectedImages.map((image, index) => (
            <div
              key={image.previewUrl}
              className="group relative overflow-hidden rounded-xl border border-input"
            >
              <Image
                src={image.previewUrl}
                alt={`Selected gym image ${existingImages.length + index + 1}`}
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
                #{existingImages.length + index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      <label htmlFor="gymImages">
        <Button
          type="button"
          variant="outline"
          disabled={
            isProcessingImages ||
            existingImages.length + selectedImages.length >= maxImages
          }
          asChild
        >
          <span>{isProcessingImages ? "Processing..." : "Add image"}</span>
        </Button>
      </label>

      {imageError && (
        <p className="mt-2 text-sm text-destructive">{imageError}</p>
      )}
    </div>
  )
}
