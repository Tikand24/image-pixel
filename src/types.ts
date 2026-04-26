export interface Particle {
  x: number
  y: number
  color: string
}

export type Quadrant = Particle[]

export interface ImagePixelOptions {
  /** URL of the image to animate */
  src: string
  /** Render width in pixels (default: 300) */
  width?: number
  /** Render height in pixels (default: 300) */
  height?: number
  /**
   * Number of divisions per axis.
   * quadrants: 4 creates a 4x4 grid = 16 quadrants (default: 4)
   */
  quadrants?: number
  /** Delay in milliseconds between each quadrant reveal (default: 50) */
  speed?: number
  /** Start animation automatically after image loads (default: true) */
  autoplay?: boolean
  /** Called when the animation starts */
  onStart?: () => void
  /** Called when all quadrants have been drawn */
  onComplete?: () => void
}

export interface ImagePixelInstance {
  play: () => void
  reset: () => void
  destroy: () => void
}
