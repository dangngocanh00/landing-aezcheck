import type { ReactNode } from 'react'
import './feature-floating-cards.css'

export function FeatureFloatingCard({ className, title, children }: { className: string; title: string; children: ReactNode }) {
  return <div className={`feature-floating-card ${className}`} tabIndex={0} role="group" aria-label={title}>{children}</div>
}
