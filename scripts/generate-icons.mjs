import sharp from 'sharp'
import { writeFileSync } from 'fs'

async function generateIcon(size) {
  const r = size * 0.18        // border radius
  const cx = size / 2
  const cy = size / 2
  const fontSize = size * 0.52
  const glowSize = size * 0.72

  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d0d0d"/>
      <stop offset="100%" style="stop-color:#0a0a0a"/>
    </linearGradient>

    <!-- Green glow filter -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${size * 0.045}" result="blur1"/>
      <feGaussianBlur stdDeviation="${size * 0.025}" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Text gradient -->
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#34d399"/>
      <stop offset="60%" style="stop-color:#10b981"/>
      <stop offset="100%" style="stop-color:#059669"/>
    </linearGradient>

    <!-- Subtle inner border -->
    <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(52,211,153,0.25)"/>
      <stop offset="100%" style="stop-color:rgba(52,211,153,0.05)"/>
    </linearGradient>

    <!-- Ambient glow behind R -->
    <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:rgba(16,185,129,0.18)"/>
      <stop offset="100%" style="stop-color:rgba(16,185,129,0)"/>
    </radialGradient>

    <clipPath id="rounded">
      <rect width="${size}" height="${size}" rx="${r}" ry="${r}"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#bg)"/>

  <!-- Ambient glow circle -->
  <ellipse cx="${cx}" cy="${cy}" rx="${glowSize * 0.5}" ry="${glowSize * 0.45}" fill="url(#ambientGlow)"/>

  <!-- Top-left subtle highlight -->
  <ellipse cx="${size * 0.2}" cy="${size * 0.15}" rx="${size * 0.35}" ry="${size * 0.25}" fill="rgba(52,211,153,0.04)"/>

  <!-- Letter R with glow -->
  <text
    x="${cx}"
    y="${cy + fontSize * 0.36}"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
    font-size="${fontSize}"
    font-weight="800"
    text-anchor="middle"
    fill="url(#textGrad)"
    filter="url(#glow)"
    letter-spacing="-2"
  >R</text>

  <!-- Inner border -->
  <rect x="1" y="1" width="${size - 2}" height="${size - 2}" rx="${r - 1}" ry="${r - 1}" fill="none" stroke="url(#border)" stroke-width="1.5"/>
</svg>`

  const buffer = Buffer.from(svg)
  await sharp(buffer).png().toFile(`public/icon-${size}.png`)
  console.log(`✓ icon-${size}.png`)
}

await generateIcon(192)
await generateIcon(512)
console.log('Icons generated!')
