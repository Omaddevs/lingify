import { useState } from 'react'

// 8-color palette — deterministic from name hash
const PALETTE = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#14b8a6', // teal
]

function hashName(name) {
  let h = 0
  for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % PALETTE.length
}

function getInitials(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Avatar
 * Props:
 *   src    — image URL (optional). Falls back to initials if null or on error.
 *   name   — used for initials + accessible alt text (required)
 *   size   — pixel size for width/height (default 36)
 *   className — extra Tailwind classes
 */
function Avatar({ src, name, size = 36, className = '' }) {
  const [imgError, setImgError] = useState(false)
  const showInitials = !src || imgError

  const bg    = PALETTE[hashName(name)]
  const style = { width: size, height: size, fontSize: size * 0.38, flexShrink: 0 }

  if (showInitials) {
    return (
      <span
        role="img"
        aria-label={`${name} avatar`}
        className={`inline-flex items-center justify-center rounded-full font-bold text-white select-none ${className}`}
        style={{ ...style, background: bg }}
      >
        {getInitials(name)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={`${name} avatar`}
      width={size}
      height={size}
      onError={() => setImgError(true)}
      className={`rounded-full object-cover ${className}`}
      style={style}
    />
  )
}

export default Avatar
