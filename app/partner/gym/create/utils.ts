const MAX_SIZE_BYTES = 1024 * 1024 // 1MB

/**
 * Crops an image to a centered 4:3 aspect ratio, converts it to JPEG,
 * and compresses it so the resulting file is smaller than 1 MB.
 */
export async function processImage(file: File): Promise<File> {
  const image = await loadImage(file)

  const { sx, sy, sw, sh } = getCenteredCrop4by3(image.width, image.height)

  const canvas = document.createElement("canvas")
  canvas.width = sw
  canvas.height = sh

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to get canvas context")
  }

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

  let quality = 0.92
  let blob = await canvasToJpegBlob(canvas, quality)

  while (blob.size > MAX_SIZE_BYTES && quality > 0.1) {
    quality -= 0.05
    blob = await canvasToJpegBlob(canvas, quality)
  }

  // If still too large, progressively downscale
  let currentCanvas = canvas

  while (blob.size > MAX_SIZE_BYTES) {
    const scaledCanvas = document.createElement("canvas")

    scaledCanvas.width = Math.max(1, Math.round(currentCanvas.width * 0.9))
    scaledCanvas.height = Math.max(1, Math.round(currentCanvas.height * 0.9))

    const scaledCtx = scaledCanvas.getContext("2d")
    if (!scaledCtx) {
      throw new Error("Failed to get canvas context")
    }

    scaledCtx.drawImage(
      currentCanvas,
      0,
      0,
      scaledCanvas.width,
      scaledCanvas.height
    )

    currentCanvas = scaledCanvas
    blob = await canvasToJpegBlob(currentCanvas, quality)
  }

  const baseName = file.name.replace(/\.[^.]+$/, "")

  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  })
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)

    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }

    img.src = url
  })
}

function getCenteredCrop4by3(width: number, height: number) {
  const targetRatio = 4 / 3
  const currentRatio = width / height

  let sw: number
  let sh: number
  let sx: number
  let sy: number

  if (currentRatio > targetRatio) {
    // Too wide
    sh = height
    sw = height * targetRatio
    sx = (width - sw) / 2
    sy = 0
  } else {
    // Too tall
    sw = width
    sh = width / targetRatio
    sx = 0
    sy = (height - sh) / 2
  }

  return { sx, sy, sw, sh }
}

function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create JPEG"))
          return
        }

        resolve(blob)
      },
      "image/jpeg",
      quality
    )
  })
}
