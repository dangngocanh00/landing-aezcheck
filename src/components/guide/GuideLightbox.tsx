import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { GuideImage } from './GuideFigure'
import { useGuideLabels } from '../../i18n/guide-ui'

export function GuideLightbox({ image, onClose }: { image: GuideImage; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const labels = useGuideLabels()
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const modal = dialog.current
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modal?.showModal()
    return () => { modal?.close(); document.body.style.overflow = overflow; previousFocus?.focus({ preventScroll: true }) }
  }, [])
  return createPortal(<dialog ref={dialog} className="guide-lightbox" aria-label={labels.image} onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <button className="guide-lightbox-close" onClick={onClose} aria-label={labels.close}>×</button>
    <img src={image.src} alt={image.alt} />
  </dialog>, document.body)
}
