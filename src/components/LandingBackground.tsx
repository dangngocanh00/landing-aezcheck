import type { CSSProperties } from 'react'

// Fixed, sparse edge coordinates: no random positions or hydration shifts.
const stars = Array.from({ length: 60 }, (_, i) => ({
  x: i % 2 === 0 ? 2 + (i * 5 % 15) : 84 + (i * 5 % 14),
  y: 1 + ((i * 37) % 98) + (i % 3) * .2,
  size: i % 9 === 0 ? 4 : i % 3 === 0 ? 2 : 1,
  opacity: .4 + (i % 5) * .07,
}))
const diamonds = [[8, 5], [93, 19], [4, 37], [96, 57], [7, 76], [91, 94], [95, 9], [3, 87]]

export function LandingBackground() {
  return <div className="az-global-background" aria-hidden="true">
    <div className="az-color-bands">{[0, 1, 2].map(i => <i key={i} className={`az-color-band az-color-band-${i}`} />)}</div>
    <div className="az-cosmic-edges">
    <div className="az-edge-beams">{[0, 1, 2, 3].map(i => <i key={i} className={`az-edge-beam az-edge-beam-${i}`} />)}</div>
    <div className="az-edge-stars">{stars.map((star, i) => <i key={i} style={{ left: `${star.x}%`, top: `${star.y}%`, '--star-size': `${star.size}px`, opacity: star.opacity } as CSSProperties} />)}</div>
    <div className="az-edge-diamonds">{diamonds.map(([x, y], i) => <i key={i} style={{ left: `${x}%`, top: `${y}%` }} />)}</div>
    </div>
  </div>
}
