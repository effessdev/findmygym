export const MAX_IMAGE_BYTES = 1_000_000
export const MIN_IMAGES = 3

export async function cropFileTo4by3(file: File): Promise<File> {
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
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Canvas export failed."))
        }
      },
      type,
      quality
    )
  })
}
