import type { ImagePixelInstance, ImagePixelOptions, Quadrant } from './types'
import { Animator } from './Animator'
import { PixelEngine } from './PixelEngine'

const DEFAULTS = {
  width: 300,
  height: 300,
  quadrants: 4,
  speed: 50,
  autoplay: true,
} satisfies Partial<ImagePixelOptions>

/**
 * ImagePixel — animate an image by revealing pixel quadrants on a canvas.
 *
 * @example
 * ```js
 * const anim = new ImagePixel('#myCanvas', {
 *   src: './photo.jpg',
 *   width: 300,
 *   height: 400,
 *   quadrants: 8,
 *   speed: 40,
 *   autoplay: true,
 *   onComplete: () => console.log('done!'),
 * })
 *
 * // Manual controls
 * anim.play()
 * anim.reset()
 * anim.destroy()
 * ```
 */
export class ImagePixel implements ImagePixelInstance {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private options: Required<Omit<ImagePixelOptions, 'onStart' | 'onComplete'>> &
    Pick<ImagePixelOptions, 'onStart' | 'onComplete'>

  private engine: PixelEngine
  private animator: Animator
  private grid: Quadrant[] = []
  private image: HTMLImageElement | null = null
  private destroyed = false

  constructor(selector: string | HTMLCanvasElement, options: ImagePixelOptions) {
    // Resolve canvas element
    if (typeof selector === 'string') {
      const el = document.querySelector<HTMLCanvasElement>(selector)
      if (!el) {
        throw new Error(`[image-pixel] Canvas element not found: "${selector}"`)
      }
      this.canvas = el
    }
    else {
      this.canvas = selector
    }

    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('[image-pixel] Could not get 2D context from canvas.')
    }
    this.ctx = ctx

    this.options = {
      width: options.width ?? DEFAULTS.width,
      height: options.height ?? DEFAULTS.height,
      quadrants: options.quadrants ?? DEFAULTS.quadrants,
      speed: options.speed ?? DEFAULTS.speed,
      autoplay: options.autoplay ?? DEFAULTS.autoplay,
      src: options.src,
      onStart: options.onStart,
      onComplete: options.onComplete,
    }

    this.engine = new PixelEngine()
    this.animator = new Animator(this.ctx)

    this._init()
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /** Start (or restart) the pixel-reveal animation. */
  play(): void {
    if (this.destroyed) return
    if (this.grid.length === 0) {
      // Image may not be loaded yet — will auto-play once ready
      return
    }
    this._startAnimation()
  }

  /**
   * Reset: clear the canvas and replay the animation from scratch.
   * Re-uses the already loaded image — no extra network request.
   */
  reset(): void {
    if (this.destroyed) return
    this.animator.stop()
    this.animator.clear()

    if (this.image) {
      this.grid = this.engine.buildGrid(
        this.image,
        this.options.width,
        this.options.height,
        this.options.quadrants,
      )
      this._startAnimation()
    }
  }

  /** Stop the animation and clean up all resources. */
  destroy(): void {
    if (this.destroyed) return
    this.destroyed = true
    this.animator.stop()
    this.animator.clear()
    this.grid = []
    this.image = null
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private _init(): void {
    // Set canvas dimensions to match the display size
    this.canvas.width = this.options.width
    this.canvas.height = this.options.height

    PixelEngine.loadImage(this.options.src)
      .then((img) => {
        if (this.destroyed) return
        this.image = img
        this.grid = this.engine.buildGrid(
          img,
          this.options.width,
          this.options.height,
          this.options.quadrants,
        )
        if (this.options.autoplay) {
          this._startAnimation()
        }
      })
      .catch((err: unknown) => {
        console.error(err)
      })
  }

  private _startAnimation(): void {
    this.animator.start(this.grid, this.options.speed, {
      onStart: this.options.onStart,
      onComplete: this.options.onComplete,
    })
  }
}
