import { localizeNode, translateText } from '../i18n/localize'
import logo from '../../assets/logo-removebg-128.png'

type BrandProps = {
  variant?: 'navbar' | 'footer' | 'compact'
}

export function Brand({ variant = 'navbar' }: BrandProps) {
  return (
    <span className={`az-brand az-brand--${variant}`}>
      <img src={logo} alt={translateText("")} className="az-brand-image" />
      <span className="az-brand-wordmark">{localizeNode("AezCheck")}<span className="az-brand-dot">{localizeNode(".")}</span></span>
    </span>
  )
}
