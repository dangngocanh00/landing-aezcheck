import { localizeNode, translateText } from '../i18n/localize'
import { useId, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { controlCenterStackCopy } from '../i18n/control-center-stack'
import { controlCenterScreens } from './control-center-stack-mock'
import './control-center-stack.css'

const colors = ['#7de4bb', '#6faebe', '#b1a0d8', '#d4b782']
type Props = { screens?: typeof controlCenterScreens }

function OrbitBackground({ activeIndex }: { activeIndex: number }) {
  return <div className="cc-orbit-background" data-focus={activeIndex} aria-hidden="true">
    <div className="cc-active-halo" />
    <svg viewBox="0 0 600 600" fill="none">
      <ellipse cx="300" cy="300" rx="288" ry="185" transform="rotate(-24 300 300)" />
      <ellipse cx="300" cy="300" rx="265" ry="228" transform="rotate(32 300 300)" />
      <ellipse cx="300" cy="300" rx="220" ry="278" transform="rotate(-12 300 300)" />
      <circle cx="59" cy="210" r="3" /><circle cx="522" cy="420" r="2.5" /><circle cx="374" cy="52" r="2" />
    </svg>
  </div>
}

export function ControlCenterIllustrationStack({ screens = controlCenterScreens }: Props) {
  const { language } = useLanguage()
  const copy = controlCenterStackCopy[language]
  const [activeIndex, setActiveIndex] = useState(0)
  const prefix = useId()
  return <div className="cc-stack">
    <div className="cc-stack-stage">
      <OrbitBackground activeIndex={activeIndex} />
      {localizeNode(screens.map((screen, index) => {
        const position = index === activeIndex ? 'front' : index === (activeIndex + 1) % 3 ? 'left' : 'right'
        return <div key={screen.id} id={`${prefix}-${screen.id}`} className={`cc-browser cc-browser--${position}`}>
          <div className="cc-browser-bar"><span className="cc-browser-dots" aria-hidden="true"><i /><i /><i /></span><span>{localizeNode(copy.views[index])}</span><span aria-hidden="true">{localizeNode("AEZCHECK")}</span></div>
          <div className="cc-screen" aria-hidden={index !== activeIndex}>
            <header><h3>{localizeNode(copy.titles[index])}</h3></header>
            {localizeNode(screen.id === 'overview' && <>
              <div className="cc-kpis"><div><span>{localizeNode(copy.connected)}</span><strong>{localizeNode(screen.connected)}</strong><i /></div><div><span>{localizeNode(copy.accounts)}</span><strong>{localizeNode(screen.accounts)}</strong><i /></div></div>
              <h4 className="cc-section-label">{localizeNode(copy.statusTitle)}</h4><div className="cc-status-grid">{localizeNode(screen.counts.map((value, i) => <div key={i}><span><i style={{ background: colors[i] }} />{localizeNode(copy.statuses[i])}</span><strong style={{ color: colors[i] }}>{localizeNode(value)}</strong></div>))}</div>
              <div className="cc-overview-insights"><div><span>{localizeNode(copy.disconnected)}</span><strong>{localizeNode(screen.disconnected)}</strong></div><div><span>{localizeNode(copy.stable)}</span><strong>{localizeNode(screen.stable)}</strong></div></div>
            </>)}
            {localizeNode(screen.id === 'analytics' && <>
              <div className="cc-chart-grid"><section><h4>{localizeNode(copy.trend)}</h4><div className="cc-legend">{localizeNode([0, 1].map((s, i) => <span key={s}><i style={{ background: colors[i] }} />{localizeNode(copy.statuses[s])}</span>))}</div>
                <svg className="cc-line" viewBox="0 0 260 185" role="img" aria-label={translateText(copy.trendDescription)}>
                  {localizeNode([0, 40, 80].map(v => <g key={v}><line x1="22" x2="248" y1={150-v*1.5} y2={150-v*1.5} stroke="#b8efda13" /><text x="0" y={154-v*1.5}>{localizeNode(v)}</text></g>))}
                  {localizeNode(screen.series.map((values, i) => <polyline key={i} points={values.map((v, j) => `${22+j*37.5},${150-v*1.5}`).join(' ')} fill="none" stroke={colors[i]} strokeWidth="2" strokeLinejoin="round" />))}
                  {localizeNode(['01/09', '09/09', '18/09', '27/09'].map((date, i) => <text key={date} x={22+i*75} y="175" textAnchor="middle">{localizeNode(date)}</text>))}
                </svg>
              </section><section><h4>{localizeNode(copy.breakdown)}</h4><svg className="cc-donut" viewBox="0 0 160 160" role="img" aria-label={translateText(copy.breakdown)}>
                {localizeNode(screen.composition.map((value, i) => <circle key={i} cx="80" cy="80" r="57" pathLength="100" fill="none" stroke={colors[i]} strokeWidth="16" strokeDasharray={`${value} ${100-value}`} strokeDashoffset={-screen.composition.slice(0,i).reduce((a,b)=>a+b,0)} transform="rotate(-90 80 80)" />))}
                <text x="80" y="79" textAnchor="middle" className="cc-donut-value">{localizeNode("12.8K")}</text><text x="80" y="98" textAnchor="middle">{localizeNode(copy.classified)}</text>
              </svg><div className="cc-legend"><span><i style={{ background: colors[0] }} />{localizeNode(copy.statuses[0])}</span><span><i style={{ background: colors[1] }} />{localizeNode(copy.statuses[1])}</span><span><i style={{ background: colors[2] }} />{localizeNode(copy.other)}</span></div>
                <div className="cc-risk-grid">{localizeNode(copy.risks.map((label, i) => <div key={label}><span>{localizeNode(label)}</span><strong>{localizeNode(copy.riskValues[i])}</strong></div>))}</div>
              </section></div>
            </>)}
            {localizeNode(screen.id === 'spend' && <>
              <h4 className="cc-section-label">{localizeNode(copy.billing)}</h4><div className="cc-spend-grid">{localizeNode(screen.totals.map((value, i) => <div key={i}><span>{localizeNode(copy.spendLabels[i])}</span><strong>{localizeNode(value)}</strong><svg viewBox="0 0 100 20" aria-hidden="true"><path d={`M0 17 20 ${12+i} 40 14 60 ${7+i} 80 8 100 3`} /></svg></div>))}</div>
              <div className="cc-payment"><div><span>{localizeNode(copy.progress)}</span><strong>{localizeNode(screen.paid)}{localizeNode("%")}</strong></div><div className="cc-progress"><i style={{ width: `${screen.paid}%` }} /></div></div>
              <div className="cc-small-stats">{localizeNode(screen.cards.map((value, i) => <div key={i}><span>{localizeNode(copy.cardLabels[i])}</span><strong>{localizeNode(value)}</strong></div>))}</div>
            </>)}
          </div>
          {localizeNode(index !== activeIndex && <button className="cc-layer-select" onClick={() => setActiveIndex(index)} aria-label={translateText(copy.open.replace('{view}', copy.titles[index]))}><span>{localizeNode(copy.views[index])} <b aria-hidden="true">{localizeNode("↗")}</b></span></button>)}
        </div>
      }))}
    </div>
    <div className="cc-stack-nav" role="group" aria-label={translateText(copy.navigation)} onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (activeIndex + (event.key === 'ArrowRight' ? 1 : 2)) % 3
      setActiveIndex(next)
      event.currentTarget.querySelectorAll('button')[next]?.focus()
    }}>{localizeNode(screens.map((screen, i) => <button key={screen.id} aria-pressed={activeIndex === i} aria-controls={`${prefix}-${screen.id}`} onClick={() => setActiveIndex(i)}><i aria-hidden="true" />{localizeNode(copy.views[i])}</button>))}</div>
  </div>
}
