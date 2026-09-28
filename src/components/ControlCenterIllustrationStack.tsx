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
      {screens.map((screen, index) => {
        const position = index === activeIndex ? 'front' : index === (activeIndex + 1) % 3 ? 'left' : 'right'
        return <div key={screen.id} id={`${prefix}-${screen.id}`} className={`cc-browser cc-browser--${position}`}>
          <div className="cc-browser-bar"><span className="cc-browser-dots" aria-hidden="true"><i /><i /><i /></span><span>{copy.views[index]}</span><span aria-hidden="true">AEZCHECK</span></div>
          <div className="cc-screen" aria-hidden={index !== activeIndex}>
            <header><h3>{copy.titles[index]}</h3></header>
            {screen.id === 'overview' && <>
              <div className="cc-kpis"><div><span>{copy.connected}</span><strong>{screen.connected}</strong><i /></div><div><span>{copy.accounts}</span><strong>{screen.accounts}</strong><i /></div></div>
              <h4 className="cc-section-label">{copy.statusTitle}</h4><div className="cc-status-grid">{screen.counts.map((value, i) => <div key={i}><span><i style={{ background: colors[i] }} />{copy.statuses[i]}</span><strong style={{ color: colors[i] }}>{value}</strong></div>)}</div>
              <div className="cc-overview-insights"><div><span>{copy.disconnected}</span><strong>{screen.disconnected}</strong></div><div><span>{copy.stable}</span><strong>{screen.stable}</strong></div></div>
            </>}
            {screen.id === 'analytics' && <>
              <div className="cc-chart-grid"><section><h4>{copy.trend}</h4><div className="cc-legend">{[0, 1].map((s, i) => <span key={s}><i style={{ background: colors[i] }} />{copy.statuses[s]}</span>)}</div>
                <svg className="cc-line" viewBox="0 0 260 185" role="img" aria-label={copy.trendDescription}>
                  {[0, 40, 80].map(v => <g key={v}><line x1="22" x2="248" y1={150-v*1.5} y2={150-v*1.5} stroke="#b8efda13" /><text x="0" y={154-v*1.5}>{v}</text></g>)}
                  {screen.series.map((values, i) => <polyline key={i} points={values.map((v, j) => `${22+j*37.5},${150-v*1.5}`).join(' ')} fill="none" stroke={colors[i]} strokeWidth="2" strokeLinejoin="round" />)}
                  {['01/09', '09/09', '18/09', '27/09'].map((date, i) => <text key={date} x={22+i*75} y="175" textAnchor="middle">{date}</text>)}
                </svg>
              </section><section><h4>{copy.breakdown}</h4><svg className="cc-donut" viewBox="0 0 160 160" role="img" aria-label={copy.breakdown}>
                {screen.composition.map((value, i) => <circle key={i} cx="80" cy="80" r="57" pathLength="100" fill="none" stroke={colors[i]} strokeWidth="16" strokeDasharray={`${value} ${100-value}`} strokeDashoffset={-screen.composition.slice(0,i).reduce((a,b)=>a+b,0)} transform="rotate(-90 80 80)" />)}
                <text x="80" y="79" textAnchor="middle" className="cc-donut-value">12.8K</text><text x="80" y="98" textAnchor="middle">{copy.classified}</text>
              </svg><div className="cc-legend"><span><i style={{ background: colors[0] }} />{copy.statuses[0]}</span><span><i style={{ background: colors[1] }} />{copy.statuses[1]}</span><span><i style={{ background: colors[2] }} />{copy.other}</span></div>
                <div className="cc-risk-grid">{copy.risks.map((label, i) => <div key={label}><span>{label}</span><strong>{copy.riskValues[i]}</strong></div>)}</div>
              </section></div>
            </>}
            {screen.id === 'spend' && <>
              <h4 className="cc-section-label">{copy.billing}</h4><div className="cc-spend-grid">{screen.totals.map((value, i) => <div key={i}><span>{copy.spendLabels[i]}</span><strong>{value}</strong><svg viewBox="0 0 100 20" aria-hidden="true"><path d={`M0 17 20 ${12+i} 40 14 60 ${7+i} 80 8 100 3`} /></svg></div>)}</div>
              <div className="cc-payment"><div><span>{copy.progress}</span><strong>{screen.paid}%</strong></div><div className="cc-progress"><i style={{ width: `${screen.paid}%` }} /></div></div>
              <div className="cc-small-stats">{screen.cards.map((value, i) => <div key={i}><span>{copy.cardLabels[i]}</span><strong>{value}</strong></div>)}</div>
            </>}
          </div>
          {index !== activeIndex && <button className="cc-layer-select" onClick={() => setActiveIndex(index)} aria-label={copy.open.replace('{view}', copy.titles[index])}><span>{copy.views[index]} <b aria-hidden="true">↗</b></span></button>}
        </div>
      })}
    </div>
    <div className="cc-stack-nav" role="group" aria-label={copy.navigation} onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (activeIndex + (event.key === 'ArrowRight' ? 1 : 2)) % 3
      setActiveIndex(next)
      event.currentTarget.querySelectorAll('button')[next]?.focus()
    }}>{screens.map((screen, i) => <button key={screen.id} aria-pressed={activeIndex === i} aria-controls={`${prefix}-${screen.id}`} onClick={() => setActiveIndex(i)}><i aria-hidden="true" />{copy.views[i]}</button>)}</div>
  </div>
}
