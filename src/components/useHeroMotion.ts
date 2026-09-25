import { useEffect, useRef } from 'react'

export function useHeroMotion() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const hero = ref.current
    if (!hero) return
    const enabled = matchMedia('(min-width: 1200px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = 0
    let x = 0, y = 0, targetX = 0, targetY = 0
    let visible = true
    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      x = y = targetX = targetY = 0
      hero.style.setProperty('--hero-x', '0px')
      hero.style.setProperty('--hero-y', '0px')
    }
    const tick = () => {
      x += (targetX - x) * .09
      y += (targetY - y) * .09
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < .02
      if (settled) { x = targetX; y = targetY }
      hero.style.setProperty('--hero-x', `${x.toFixed(3)}px`)
      hero.style.setProperty('--hero-y', `${y.toFixed(3)}px`)
      frame = settled ? 0 : requestAnimationFrame(tick)
    }
    const start = () => { if (!frame) frame = requestAnimationFrame(tick) }
    const move = (event: PointerEvent) => {
      if (!enabled.matches || !visible || document.hidden || event.pointerType !== 'mouse') return
      const bounds = hero.getBoundingClientRect()
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)) * 6
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)) * 6
      start()
    }
    const leave = () => { targetX = targetY = 0; if (enabled.matches && visible) start() }
    const pause = () => {
      hero.dataset.motionPaused = String(!visible || document.hidden)
      if (!visible || document.hidden) reset()
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; pause() })
    observer.observe(hero)
    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerleave', leave)
    enabled.addEventListener('change', reset)
    document.addEventListener('visibilitychange', pause)
    return () => {
      reset()
      observer.disconnect()
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
      enabled.removeEventListener('change', reset)
      document.removeEventListener('visibilitychange', pause)
    }
  }, [])
  return ref
}
