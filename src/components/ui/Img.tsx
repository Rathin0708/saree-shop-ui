import { useState, type CSSProperties } from 'react'
import { imgSize, imgSrc, imgSrcSet } from '../../data/images'
import type { ImageRef } from '../../data/types'

interface Props {
  image: ImageRef
  sizes?: string
  className?: string
  eager?: boolean
  /** Overrides the image's tuned object-position. */
  position?: string
  style?: CSSProperties
  decorative?: boolean
}

/** Responsive image with intrinsic dimensions (no CLS) and an on-brand fallback instead of a broken icon. */
export function Img({ image, sizes = '100vw', className = '', eager, position, style, decorative }: Props) {
  const [failed, setFailed] = useState(false)
  const { width, height } = imgSize(image)
  if (failed)
    return (
      <div
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : image.alt}
        aria-hidden={decorative}
        className={`grid place-items-center bg-parchment text-kumkum ${className}`}
        style={style}
      >
        <span className="font-display text-4xl">N</span>
      </div>
    )
  return (
    <img
      src={imgSrc(image)}
      srcSet={imgSrcSet(image)}
      sizes={sizes}
      width={width}
      height={height}
      alt={decorative ? '' : image.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchPriority: 'high' as const } : {})}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      style={{ objectPosition: position ?? image.pos ?? 'center', ...style }}
    />
  )
}
