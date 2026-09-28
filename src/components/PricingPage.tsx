import { useLanguage } from '../i18n/LanguageContext'
import { pricingTranslations } from '../i18n/pricing'
import { landingExperienceDestination, localizedHref } from '../landing-navigation'
import { DecorativeLogoScene } from './pricing/DecorativeLogoScene'
import { PricingIcon, type PricingIconName } from './pricing/PricingIcon'
import './pricing-page.css'

type Translate = (key: string) => string
const resources: { value: number; label: string; icon: PricingIconName }[] = [
  { value: 1, label: 'Workspace', icon: 'users' },
  { value: 2, label: 'Thành viên', icon: 'user' },
  { value: 3, label: 'VIA', icon: 'id' },
  { value: 5, label: 'BM', icon: 'building' },
  { value: 75, label: 'TKQC', icon: 'ads' },
  { value: 50, label: 'Page', icon: 'flag' },
]
const benefits = ['Không giới hạn thời gian sử dụng', 'Không yêu cầu thẻ thanh toán', 'Đầy đủ tính năng cốt lõi', 'Dễ dàng nâng cấp khi cần']

function FeatureList({ items, t, compact = false }: { items: string[]; t: Translate; compact?: boolean }) {
  return <ul className={`pricing-features${compact ? ' pricing-features--compact' : ''}`}>
    {items.map(item => <li key={item}><span className="pricing-check"><PricingIcon name="check" /></span><span>{t(item)}</span></li>)}
  </ul>
}

function ResourceCard({ resource, t }: { resource: typeof resources[number]; t: Translate }) {
  return <div className="pricing-resource">
    <span className="pricing-resource-icon"><PricingIcon name={resource.icon} /></span>
    <dl><dt>{t(resource.label)}</dt><dd>{resource.value}</dd></dl>
  </div>
}

function PricingInfoStrip({ t }: { t: Translate }) {
  return <aside className="pricing-info-strip">
    <PricingIcon name="sparkle" />
    <p>{t('AezCheck Free là bước khởi đầu hoàn hảo để bạn khám phá sức mạnh của hệ thống.')}</p>
    {/* Intentional English brand signature, invariant across both locales. */}
    <span className="pricing-signature" lang="en">Start for free<br /><em>Grow further</em></span>
  </aside>
}

function PricingPanel({ t }: { t: Translate }) {
  const { locale } = useLanguage()
  return <section className="pricing-panel" aria-labelledby="pricing-heading">
    <div className="pricing-layout">
      <div className="pricing-intro">
        <p className="pricing-eyebrow">{t('Gói miễn phí')}</p>
        <h1 id="pricing-heading">{t('AezCheck')}<br /><span>{t('Free')}</span></h1>
        <p className="pricing-subtitle">{t('Dành cho cá nhân / team nhỏ bắt đầu vận hành')}</p>
        <p className="pricing-description">{t('Trải nghiệm toàn bộ quy trình quản lý và kiểm tra tài sản với các giới hạn phù hợp. Hoàn toàn miễn phí, không giới hạn thời gian.')}</p>
        <FeatureList items={benefits} t={t} />
        <a className="pricing-cta" href={localizedHref(landingExperienceDestination, locale)}>{t('Bắt đầu trải nghiệm')}<PricingIcon name="arrow" /></a>
        <p className="pricing-launch-note">{t('Free Plan hiện được áp dụng cho toàn bộ người dùng.')}</p>
        <DecorativeLogoScene />
      </div>
      <div className="pricing-resources">
        <div className="pricing-plan-label"><PricingIcon name="gift" /><span>{t('Free Plan')}</span></div>
        <h2><PricingIcon name="layers" />{t('Giới hạn tài nguyên')}</h2>
        <div className="pricing-resource-grid">{resources.map(resource => <ResourceCard key={resource.label} resource={resource} t={t} />)}</div>
        <div className="pricing-details">
          <section><h3><PricingIcon name="info" />{t('Thông tin khác')}</h3><dl>
            <div><dt>{t('Fanpage')}</dt><dd>{t('50 Page')}</dd></div>
            <div><dt>{t('Thời hạn')}</dt><dd>{t('Vô thời hạn')}</dd></div>
          </dl></section>
          <section><h3><PricingIcon name="shield" />{t('Phù hợp với')}</h3>
            <FeatureList compact items={['Cá nhân / team nhỏ', 'Trải nghiệm hệ thống', 'Bắt đầu vận hành cơ bản']} t={t} />
          </section>
        </div>
        <PricingInfoStrip t={t} />
      </div>
    </div>
    <footer className="pricing-footnote">{['Quản lý thông minh', 'Vận hành an toàn', 'Phát triển bền vững'].map(text => <span key={text}>{t(text)}</span>)}</footer>
  </section>
}

export function PricingPage() {
  const { locale, t: fallback } = useLanguage()
  const t: Translate = key => pricingTranslations[key]?.[locale] ?? fallback(key)
  return <main className="pricing-page" id="pricing"><PricingPanel t={t} /></main>
}
