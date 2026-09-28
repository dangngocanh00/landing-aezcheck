import { useLanguage } from '../i18n/LanguageContext'
import { agencyWorkspaceCards } from '../i18n/agency-workspace-cards'
import { FeatureFloatingCard } from './FeatureFloatingCard'

export function AgencyWorkspaceSpendCard() {
  const { language } = useLanguage()
  const copy = agencyWorkspaceCards[language].spend
  return <FeatureFloatingCard className="aw-metric-card aw-metric-card--spend" title={copy.title}>
    <div className="aw-metric-heading"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M15 8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9m3-10v12" /></svg><h4>{copy.title}</h4></div>
    <strong className="aw-metric-value">{copy.value}</strong>
    <p>{copy.subtitle}</p>
    <svg className="aw-spend-chart" viewBox="0 0 120 72" aria-hidden="true">
      <g className="aw-chart-bars"><rect x="8" y="52" width="15" height="18" rx="2" /><rect x="34" y="42" width="15" height="28" rx="2" /><rect x="60" y="30" width="15" height="40" rx="2" /><rect x="86" y="12" width="15" height="58" rx="2" /></g>
      <path className="aw-chart-trend" d="m9 43 29-11 27-9 35-20m-17 1 17-1-2 17" />
    </svg>
  </FeatureFloatingCard>
}

export function AgencyWorkspaceReconcileCard() {
  const { language } = useLanguage()
  const copy = agencyWorkspaceCards[language].reconcile
  return <FeatureFloatingCard className="aw-metric-card aw-metric-card--reconcile" title={copy.title}>
    <div className="aw-metric-heading"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 0 1 14-4l2 2m0-5v5h-5M20 14a8 8 0 0 1-14 4l-2-2m0 5v-5h5" /></svg><h4>{copy.title}</h4></div>
    <strong className="aw-metric-value">{copy.value}</strong>
    <p>{copy.subtitle}</p>
    <svg className="aw-reconcile-shield" viewBox="0 0 88 96" aria-hidden="true">
      <rect className="aw-shield-back" x="17" y="14" width="60" height="70" rx="14" transform="rotate(9 47 49)" />
      <rect className="aw-shield-panel" x="8" y="19" width="60" height="70" rx="14" transform="rotate(-6 38 54)" />
      <path className="aw-shield-body" d="m43 17 24 10v20c0 16-10 27-24 34C29 74 19 63 19 47V27Z" />
      <path className="aw-shield-check" d="m31 47 9 9 17-19" />
    </svg>
  </FeatureFloatingCard>
}
