import logo from '../../assets/logo-removebg-128.png'

type BrandProps = {
  variant?: 'navbar' | 'footer' | 'compact'
}

export function Brand({ variant = 'navbar' }: BrandProps) {
  return (
    <span className={`az-brand az-brand--${variant}`}>
      <img src={logo} alt="" className="az-brand-image" />
      <span className="az-brand-wordmark">AezCheck<span className="az-brand-dot">.</span></span>
    </span>
  )
}
