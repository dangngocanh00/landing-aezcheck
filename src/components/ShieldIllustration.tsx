import { useEffect, useId, useRef, type CSSProperties } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './shield-illustration.css'

const risks = [
  ['Domain lạ', 'Unknown domain', 'Phát hiện domain không rõ nguồn gốc', 'Detect domains from unknown sources', 'globe'],
  ['Quyền truy cập bất thường', 'Unusual access', 'Đăng nhập từ thiết bị lạ, vị trí lạ', 'Sign-ins from unfamiliar devices or locations', 'user'],
  ['Chi tiêu vượt ngưỡng', 'Spending above limits', 'Dấu hiệu chi tiêu bất thường', 'Unusual spending patterns', 'coins'],
  ['Hoạt động đáng ngờ', 'Suspicious activity', 'Hành vi bất thường trên hệ thống', 'Unusual activity across your system', 'alert'],
] as const
const assets = [
  ['VIA', 'Tài khoản cá nhân', 'Personal accounts', 'user'],
  ['BM', 'Business Manager', 'Business Manager', 'business'],
  ['TKQC', 'Tài khoản quảng cáo', 'Ad accounts', 'ads'],
  ['Fanpage', 'Trang doanh nghiệp', 'Business pages', 'page'],
] as const

function SecurityIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'globe' ? <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6h14M5 18h14" /></>
      : kind === 'user' ? <><circle cx="10" cy="7" r="3" /><path d="M3 21v-3a7 7 0 0 1 14 0v3M21 7v5m0 3v.1" /></>
        : kind === 'coins' ? <><ellipse cx="10" cy="6" rx="7" ry="3" /><path d="M3 6v5c0 4 14 4 14 0V6M3 11v5c0 2 4 3 7 3M16 16h6m-3-3v8" /></>
          : kind === 'alert' ? <><path d="m12 3 10 18H2L12 3Z M12 9v5m0 3v.1" /></>
            : kind === 'business' ? <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M9 5V2h6v3M8 10h2m4 0h2M8 14h2m4 0h2M10 21v-4h4v4" /></>
              : kind === 'ads' ? <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 22h8m-4-4v4M7 13l3-3 3 2 4-5" /></>
                : <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" /></>}
  </svg>
}

export function ShieldIllustration() {
  const { language } = useLanguage()
  const vi = language === 'vi'
  const copy = (a: string, b: string) => vi ? a : b
  const uid = useId()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let visible = false
    const update = () => { element.dataset.paused = String(!visible || document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() }, { threshold: .1 })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  return <div className="shield-illustration" ref={ref} data-paused="true">
    <p className="shield-description">{copy('Tường lửa AezCheck chủ động phát hiện rủi ro, chặn mối đe dọa và giữ tài sản của bạn luôn an toàn.', 'AezCheck Firewall proactively detects risks, blocks threats and keeps your assets protected.')}</p>
    <div className="shield-stage">
      <svg className="shield-connections" viewBox="0 0 1000 448" preserveAspectRatio="none" fill="none" aria-hidden="true">
        {[50,166,282,398].map((y, i) => {
          const stop = 160 + i * 42
          const incoming = `M260 ${y} C340 ${y} 375 ${stop} 449 ${stop}`
          const outgoing = `M570 ${stop} C655 ${stop} 660 ${y} 740 ${y}`
          return <g key={y} style={{ '--signal-delay': `${i * -.8}s` } as CSSProperties}>
            <path className="shield-risk-line" d={incoming} /><path className="shield-risk-particle" d={incoming} pathLength="100" />
            <circle className="shield-block-impact" cx="449" cy={stop} r="5" />
            <path className="shield-safe-line" d={outgoing} /><path className="shield-safe-particle" d={outgoing} pathLength="100" />
          </g>
        })}
      </svg>
      <div className="shield-column shield-risks">
        <h3 className="shield-mobile-label">{copy('Rủi ro được phát hiện', 'Detected risks')}</h3>
        {risks.map((risk, i) => <article key={risk[0]} className="shield-risk-card" style={{ '--signal-delay': `${i * -.8}s` } as CSSProperties}>
          <span className="shield-card-icon"><SecurityIcon kind={risk[4]} /></span>
          <div><h3>{risk[vi ? 0 : 1]}</h3><p>{risk[vi ? 2 : 3]}</p></div>
        </article>)}
      </div>
      <div className="shield-core" aria-label={copy('Tường lửa chặn rủi ro, bảo vệ tài sản', 'Firewall blocks threats and protects assets')}>
        <div className="shield-core-halo" />
        <div className="shield-radar shield-radar-outer" /><div className="shield-radar shield-radar-inner" />
        <svg className="shield-core-art" viewBox="0 0 360 420" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`${uid}-body`} x1="60" y1="80" x2="280" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#164c43" /><stop offset="1" stopColor="#081c26" /></linearGradient>
            <linearGradient id={`${uid}-edge`} x1="80" y1="100" x2="270" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#a0f5ce" /><stop offset=".5" stopColor="#49d692" /><stop offset="1" stopColor="#247b6a" /></linearGradient>
            <pattern id={`${uid}-hex`} width="30" height="26" patternUnits="userSpaceOnUse"><path d="m7.5 0 15 0 7.5 13-7.5 13h-15L0 13Z" stroke="#49d692" strokeOpacity=".22" strokeWidth=".7" /></pattern>
          </defs>
          <path d="M180 62c36 27 72 40 113 46v110c0 69-44 113-113 144C111 331 67 287 67 218V108c41-6 77-19 113-46Z" fill={`url(#${uid}-body)`} stroke={`url(#${uid}-edge)`} strokeWidth="2" />
          <path d="M180 80c31 22 62 35 96 42v96c0 57-35 96-96 124-61-28-96-67-96-124v-96c34-7 65-20 96-42Z" stroke="#49d692" strokeOpacity=".25" />
          <path d="M180 111c17 12 33 19 51 22v40c0 30-18 49-51 65-33-16-51-35-51-65v-40c18-3 34-10 51-22Z" fill="#49d692" fillOpacity=".08" stroke="#76edb9" strokeWidth="1.5" />
          <path d="m159 172 15 15 29-32" stroke="#a0f5ce" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="shield-energy-field" d="m44 101 57-17v248l-57-21Z" fill={`url(#${uid}-hex)`} stroke="#49d692" strokeOpacity=".5" />
          <path d="M44 101v210" stroke="#8ef0c0" strokeWidth="2" />
        </svg>
        <div className="shield-core-wordmark"><strong>AEZCHECK</strong><span>FIREWALL</span></div>
        <span className="shield-block-label">{copy('CHẶN', 'BLOCKED')}</span>
        <div className="shield-core-labels"><span>{copy('Phát hiện sớm', 'Early detection')}</span><span>{copy('Lọc thông minh', 'Smart filtering')}</span><span>{copy('Bảo vệ liên tục', 'Always protected')}</span></div>
      </div>
      <div className="shield-column shield-assets">
        <h3 className="shield-mobile-label">{copy('Tài sản được bảo vệ', 'Protected assets')}</h3>
        {assets.map((asset, i) => <article key={asset[0]} className="shield-asset-card" style={{ '--signal-delay': `${i * -.8}s` } as CSSProperties}>
          <span className="shield-card-icon"><SecurityIcon kind={asset[3]} /></span>
          <div><h3>{asset[0]}</h3><p>{asset[vi ? 1 : 2]}</p></div>
          <svg className="shield-verified" viewBox="0 0 24 24" fill="none" role="img" aria-label={copy('Đã bảo vệ', 'Protected')}><circle cx="12" cy="12" r="10" /><path d="m7 12 3 3 7-7" /></svg>
        </article>)}
      </div>
    </div>
    <div className="shield-status">
      <div className="shield-status-signal" aria-hidden="true"><i /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></svg></div>
      <div className="shield-status-copy"><strong>{copy('Hệ thống đang được bảo vệ', 'Your system is secured')}</strong><span>{copy('Firewall đang giám sát liên tục', 'Firewall monitoring continuously')}</span></div>
      <span className="shield-status-state"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>Firewall Active</span>
    </div>
    <p className="shield-caption">{copy('An toàn hơn. Hiệu quả hơn. Phát triển bền vững hơn.', 'Safer operations. Greater efficiency. Sustainable growth.')}</p>
  </div>
}
