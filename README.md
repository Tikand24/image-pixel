# image-pixel

Animate an image by revealing it as randomized pixel quadrants on a `<canvas>`.  
Written in TypeScript, zero dependencies, works in any modern browser.

## Installation

```bash
npm install image-pixel
```

## Quick start

Add a `<canvas>` to your HTML:

```html
<canvas id="myCanvas"></canvas>
```

Then initialize the library:

```js
import { ImagePixel } from 'image-pixel'

const anim = new ImagePixel('#myCanvas', {
  src: './photo.jpg',
  width: 300,
  height: 400,
  quadrants: 8,
  speed: 40,
  autoplay: true,
  onStart: () => console.log('Animation started'),
  onComplete: () => console.log('Animation complete'),
})
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | **required** | URL of the image to animate |
| `width` | `number` | `300` | Canvas render width in pixels |
| `height` | `number` | `300` | Canvas render height in pixels |
| `quadrants` | `number` | `4` | Divisions per axis. `4` creates a 4×4 grid (16 quadrants) |
| `speed` | `number` | `50` | Delay in milliseconds between each quadrant reveal |
| `autoplay` | `boolean` | `true` | Start animation automatically after image loads |
| `onStart` | `() => void` | — | Callback fired when the animation starts |
| `onComplete` | `() => void` | — | Callback fired when all quadrants have been drawn |

## Methods

| Method | Description |
|---|---|
| `play()` | Start or resume the animation |
| `reset()` | Clear the canvas and replay from scratch |
| `destroy()` | Stop the animation and release all resources |

## Examples

### Manual control

```js
const anim = new ImagePixel('#myCanvas', {
  src: './photo.jpg',
  autoplay: false,
})

document.getElementById('btn-play').addEventListener('click', () => {
  anim.play()
})

document.getElementById('btn-reset').addEventListener('click', () => {
  anim.reset()
})
```

### Trigger on scroll (Intersection Observer)

```js
const anim = new ImagePixel('#myCanvas', {
  src: './photo.jpg',
  autoplay: false,
  onComplete: () => console.log('done!'),
})

const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    anim.reset()
    observer.disconnect()
  }
})

observer.observe(document.getElementById('myCanvas'))
```

## TypeScript

Full type definitions are included. The main types you may want to use:

```ts
import type { ImagePixelOptions, ImagePixelInstance } from 'image-pixel'
```

## Local development

Clone the repo and install dependencies:

```bash
git clone https://github.com/Tikand24/image-pixel.git
cd image-pixel
npm install
```

Build the library:

```bash
npm run build
```

Watch mode (rebuilds on file changes):

```bash
npm run dev
```

Type check without building:

```bash
npm run typecheck
```

### Testing locally in another project

```bash
# 1. In this repo — register globally
npm run build
npm link

# 2. In your project — link the package
cd ../your-project
npm link image-pixel
```

After making changes to the library, run `npm run build` again — the linked project will pick up the updates automatically.

## License

MIT
