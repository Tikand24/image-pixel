import type { Quadrant } from './types'

/**
 * Drives the pixel-reveal animation.
 * Takes a pre-built grid of quadrants and draws them one by one
 * onto the target canvas at a configurable speed.
 */
export class Animator {
  private ctx: CanvasRenderingContext2D
  private grid: Quadrant[] = []
  private intervalId: ReturnType<typeof setInterval> | null = null
  private onComplete?: () => void
  private onStart?: () => void

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  /**
   * Load a new grid and start the animation.
   * Clears any running animation before starting.
   */
  start(
    grid: Quadrant[],
    speed: number,
    callbacks: { onStart?: () => void, onComplete?: () => void },
  ): void {
    this.stop()
    // Work on a shuffled copy so the original can be re-used on reset
    this.grid = [...grid]
    this.onStart = callbacks.onStart
    this.onComplete = callbacks.onComplete

    this.onStart?.()

    this.intervalId = setInterval(() => {
      if (this.grid.length === 0) {
        this.stop()
        this.onComplete?.()
        return
      }
      this.drawRandomQuadrant()
    }, speed)
  }

  /** Stop the running interval without clearing the canvas. */
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.grid = []
  }

  /** Clear the canvas. */
  clear(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  private drawRandomQuadrant(): void {
    const index = Math.floor(Math.random() * this.grid.length)
    const quadrant = this.grid[index]
    if (!quadrant) return

    for (const particle of quadrant) {
      this.ctx.fillStyle = particle.color
      this.ctx.fillRect(particle.x, particle.y, 1, 1)
    }

    this.grid.splice(index, 1)
  }
}
