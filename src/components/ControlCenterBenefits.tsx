import { useId } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { controlCenterBenefitsCopy, type ControlBenefitId } from '../i18n/control-center-benefits'
import './control-center-benefits.css'

const benefits: ControlBenefitId[] = ['live', 'trend', 'risk', 'network']

function BenefitDecoration({ kind }: { kind: ControlBenefitId }) {
  const gradientId = useId()
  return <div className="ccb-visual" aria-hidden="true"><div className="ccb-ambient" /><svg className="ccb-decoration" viewBox="0 0 120 70" fill="none">
    {kind === 'live' && <>
      <g className="ccb-rings">{[9,17,25,32].map(r => <circle key={r} cx="80" cy="34" r={r} />)}</g>
      <path className="ccb-radar-sweep" d="M80 34V9a25 25 0 0 1 22 13Z" fill="currentColor" fillOpacity=".16" />
      <circle className="ccb-ripple" cx="80" cy="34" r="24" />
      <circle className="ccb-live-dot" cx="80" cy="34" r="3" />
      <path className="ccb-secondary" d="M10 16h23m-23 5h14M10 51h12l5-8 6 15 5-7h10" />
      <circle cx="42" cy="16" r="2" fill="currentColor" />
    </>}
    {kind === 'trend' && <>
      <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop stopColor="currentColor" stopOpacity=".3" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
      <path className="ccb-secondary" d="M10 22h100M10 42h100M30 10v50M70 10v50" />
      <path className="ccb-trend-fill" d="M10 54 30 43 50 46 70 30 90 25 110 12V66H10Z" fill={`url(#${gradientId})`} stroke="none" />
      <path className="ccb-trend-line" d="M10 54 30 43 50 46 70 30 90 25 110 12" pathLength="100" />
      <path className="ccb-trend-shimmer" d="M10 54 30 43 50 46 70 30 90 25 110 12" pathLength="100" />
      {[[10,54],[30,43],[50,46],[70,30],[90,25],[110,12]].map(([cx,cy],i)=><circle key={i} className={i===5?'ccb-endpoint':`ccb-trend-node ccb-trend-node-${i}`} cx={cx} cy={cy} r={i===5?3:2} />)}
    </>}
    {kind === 'risk' && <>
      <circle className="ccb-ripple" cx="75" cy="34" r="25" />
      <path className="ccb-secondary" d="M43 14a36 36 0 0 1 66 34" strokeDasharray="2 4" />
      <g className="ccb-shield"><path d="m75 10 19 7v15c0 12-11 21-19 26-8-5-19-14-19-26V17Z" /><path d="m75 15 14 5v12c0 9-7 17-14 21-7-4-14-12-14-21V20Z" opacity=".35" /><path d="M75 23v14m0 7v2" /></g>
      {[[107,18],[36,47],[104,57]].map(([cx,cy],i)=><circle className={i===0?'ccb-risk-dot ccb-risk-blink':'ccb-risk-dot'} key={i} cx={cx} cy={cy} r={i===0?3:2} />)}
    </>}
    {kind === 'network' && <>
      <path className="ccb-secondary" d="m18 8 17 7 60 42 17-5M35 15l-11 44" />
      <path className="ccb-connectors" d="m28 18 44 16 32-22M72 34l29 25M72 34 29 58" />
      <circle className="ccb-network-halo" cx="72" cy="34" r="12" />
      {[[28,18],[72,34],[104,12],[101,59],[29,58]].map(([cx,cy],i)=><circle className={`ccb-node ccb-node-${i}`} key={i} cx={cx} cy={cy} r={i===1?6:3.5} />)}
    </>}
  </svg></div>
}

export function ControlCenterBenefits() {
  const { language } = useLanguage()
  const prefix = useId()
  return <div className="ccb-grid">{benefits.map((kind, index) => {
    const copy = controlCenterBenefitsCopy[language][kind]
    return <article key={kind} className={`ccb-card ccb-card--${kind}`} tabIndex={0} aria-labelledby={`${prefix}-${kind}`}>
      <BenefitDecoration kind={kind} />
      <span className="ccb-index">{String(index+1).padStart(2,'0')}</span>
      <h3 id={`${prefix}-${kind}`}>{copy.title}</h3>
      <p>{copy.description}</p>
    </article>
  })}</div>
}
