import { useLanguage } from '../i18n/LanguageContext'
import { useEffect, useRef, type CSSProperties } from 'react'
import './product-ecosystem.css'
import './ecosystem-card-motion.css'

const stages = [
  { title: 'VIA', subtitle: 'Tài khoản cá nhân', icon: 'person' },
  { title: 'BM', subtitle: 'Business Manager', icon: 'business' },
  { title: 'TKQC', subtitle: 'Tài khoản quảng cáo', icon: 'account' },
  { title: 'Campaign', subtitle: 'Chiến dịch', icon: 'chart' },
  { title: 'Ads', subtitle: 'Quảng cáo', icon: 'ads' },
  { title: 'Khách hàng', subtitle: 'Quản lý khách hàng', icon: 'users' },
  { title: 'Chi tiêu', subtitle: 'Hiệu quả & Doanh thu', icon: 'target' },
] as const

type IconName = typeof stages[number]['icon'] | 'check'

function FlowIcon({ name }: { name: IconName }) {
  const paths = {
    person: <><circle cx="16" cy="10" r="5" /><path d="M6 28v-4a10 10 0 0 1 20 0v4Z" /></>,
    business: <><rect x="3" y="10" width="26" height="18" rx="4" /><path d="M11 10V6h10v4M3 17c8 5 18 5 26 0M14 18h4v5h-4Z" /></>,
    account: <><rect x="3" y="6" width="26" height="22" rx="4" /><path d="M3 13h26M8 21h7M23 20v3" /></>,
    chart: <><path d="M5 27V17h5v10ZM14 27V11h5v16ZM23 27V5h5v22Z" /><path d="m4 11 9-6 6 2 9-5" fill="none" /></>,
    ads: <><path d="m4 13 22-8v21L4 19Z" /><path d="m8 20 3 8h5l-3-6M26 12l4-2M27 19l3 1" fill="none" /></>,
    users: <><circle cx="12" cy="10" r="4" /><path d="M3 27v-4a9 9 0 0 1 18 0v4Z" /><path d="M22 6a4 4 0 0 1 0 8M25 18a7 7 0 0 1 4 7v2" fill="none" /></>,
    target: <><circle cx="16" cy="16" r="12" /><circle cx="16" cy="16" r="7" fill="none" /><circle cx="16" cy="16" r="2" /><path d="m16 16 13-13M23 3h6v6" fill="none" /></>,
    check: <path d="m8 16 5 5 11-11" fill="none" />,
  }
  return <svg viewBox="0 0 32 32" fill="currentColor" fillOpacity=".16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function InfoCard({ outcome = false }: { outcome?: boolean }) {
  const { t } = useLanguage()
  const lines = outcome
    ? ['Kiểm soát chi tiêu', 'Tối ưu hiệu quả', 'Tăng trưởng bền vững']
    : ['Quản lý tập trung', 'Đồng bộ dữ liệu', 'Theo dõi trạng thái']
  return <aside className={`eco-info ${outcome ? 'eco-info-outcome' : 'eco-info-intro'}`}>
    <FlowIcon name={outcome ? 'chart' : 'users'} />
    <ul>{lines.map(line => <li key={line}>{t(line)}</li>)}</ul>
  </aside>
}

export function ProductEcosystemSection() {
  const { t } = useLanguage()
  const flowRef = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const flow = flowRef.current
    if (!flow) return
    let visible = false
    const update = () => { flow.dataset.motionPaused = String(!visible || document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(flow)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  return <section className="eco-section" aria-labelledby="ecosystem-heading">
    <div className="eco-inner">
      <header className="eco-header">
        <p className="eco-eyebrow"><span aria-hidden="true" />{t('TỪ TÀI KHOẢN ĐẾN DOANH THU')}</p>
        <h2 id="ecosystem-heading" className="eco-heading">
          <span>{t('Không chỉ kiểm tra tài khoản.')}</span>
          <span><em>{t('AezCheck kết nối')}</em>{' '}{t('toàn bộ quy trình vận hành.')}</span>
        </h2>
        <p className="eco-description">{t('Toàn bộ quy trình quảng cáo trong một hệ thống — không cần chuyển tab, không mất dữ liệu.')}</p>
      </header>
      <div className="eco-flow">
        <InfoCard />
        <ol ref={flowRef} className="eco-stages" data-motion-paused="true">
          {stages.map((stage, index) => <li key={stage.title} tabIndex={0}
            style={{ '--card-delay': `${index * .6}s` } as CSSProperties}
            className={`eco-stage ${index === 0 ? 'eco-stage-source' : index === stages.length - 1 ? 'eco-stage-destination' : ''}`}>
            <span className="eco-card-light" aria-hidden="true" />
            <FlowIcon name={stage.icon} />
            <h3>{t(stage.title)}</h3>
            <p>{t(stage.subtitle)}</p>
            {index < stages.length - 1 && <span className="eco-arrow" aria-hidden="true">›</span>}
          </li>)}
        </ol>
        <InfoCard outcome />
      </div>
      <div className="eco-pathway">
        <svg className="eco-curve" viewBox="0 0 1400 150" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M20 120 Q700 -90 1380 120" />
        </svg>
        <ul className="eco-checkpoints">
          {['Liên kết liền mạch', 'Đồng bộ thời gian thực', 'Kiểm soát toàn diện'].map(label => <li key={label}>
            <span className="eco-check"><FlowIcon name="check" /></span>
            <span>{t(label)}</span>
          </li>)}
        </ul>
      </div>
    </div>
  </section>
}
