import type { Particle, Quadrant } from './types'

/**
 * Loads an image, samples its pixels at the given display size,
 * and partitions them into a grid of quadrants.
 */
export class PixelEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('[image-pixel] Could not get 2D context from offscreen canvas.')
    }
    this.ctx = ctx
  }

  /**
   * Loads the image from `src` and returns the grid of quadrants.
   * Each quadrant is an array of particles (pixel x, y, color).
   */
  buildGrid(
    image: HTMLImageElement,
    displayWidth: number,
    displayHeight: number,
    quadrantCount: number,
  ): Quadrant[] {
    this.canvas.width = displayWidth
    this.canvas.height = displayHeight

    this.ctx.drawImage(image, 0, 0, displayWidth, displayHeight)
    const imageData = this.ctx.getImageData(0, 0, displayWidth, displayHeight)
    this.ctx.clearRect(0, 0, displayWidth, displayHeight)

    // Extract all particles from the image data
    const particles: Particle[] = []
    const { width, height, data } = imageData

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]
        particles.push({ x, y, color: `rgba(${r},${g},${b},${a / 255})` })
      }
    }

    // Partition particles into a quadrantCount x quadrantCount grid
    const cellW = Math.floor(displayWidth / quadrantCount)
    const cellH = Math.floor(displayHeight / quadrantCount)

    const grid: Quadrant[] = []

    for (let row = 0; row < quadrantCount; row++) {
      for (let col = 0; col < quadrantCount; col++) {
        const x0 = col * cellW
        const y0 = row * cellH
        const x1 = x0 + cellW
        const y1 = y0 + cellH

        const quadrant: Particle[] = particles.filter(
          p => p.x >= x0 && p.x < x1 && p.y >= y0 && p.y < y1,
        )
        grid.push(quadrant)
      }
    }

    return grid
  }

  /** Load an image from a URL and resolve when ready. */
  static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`[image-pixel] Failed to load image: ${src}`))
      img.src = src
    })
  }
}
