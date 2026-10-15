import { localizeNode, translateText } from '../i18n/localize'
import type { CSSProperties } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { analyticsPreviewCopy } from '../i18n/analytics-preview'
import './analytics-scene.css'

const statuses = [
  { key: 'active', value: 9382, color: '#78e4bd', icon: '✓' },
  { key: 'disabled', value: 25717, color: '#69afc1', icon: '−' },
  { key: 'unsettled', value: 750, color: '#af9cda', icon: '↔' },
  { key: 'pending', value: 0, color: '#d6bc83', icon: '◷' },
] as const
const trend = [
  { key: 'active', color: '#78e4bd', values: [8, 8, 8, 7, 7, 7, 7] },
  { key: 'disabled', color: '#69afc1', values: [0, 0, 0, 7, 7, 7, 7] },
  { key: 'unsettled', color: '#af9cda', values: [0, 0, 0, 0, 0, 0, 0] },
] as const
const dates = ['1-9', '5-9', '9-9', '13-9', '17-9', '21-9', '27-9']
const statusTotal = statuses.reduce((sum, status) => sum + status.value, 0)
const number = (value: number) => value.toLocaleString('en-US')

function Shield() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8 3v6c0 5-5 8-8 10-3-2-8-5-8-10V6Z" /><path d="m8 12 3 3 5-6" /></svg>
}

export function AnalyticsScene() {
  const { language } = useLanguage()
  const copy = analyticsPreviewCopy[language]
  return <div className="analytics-illustration">
    <div className="analytics-main">
      <header className="analytics-header"><div><h3>{localizeNode(copy.title)}</h3><p>{localizeNode(copy.subtitle)}</p></div><span>{localizeNode(copy.sample)}</span></header>
      <div className="analytics-summary">
        <article className="analytics-surface"><span>{localizeNode(copy.connected)}</span><div className="analytics-summary-value"><strong>{localizeNode("56")}</strong><small className="analytics-pill">{localizeNode(copy.operating)}</small></div></article>
        <article className="analytics-surface"><span>{localizeNode(copy.accounts)}</span><div className="analytics-summary-value"><strong>{localizeNode("44,604")}</strong><div className="analytics-substats"><span>{localizeNode(copy.business)}{localizeNode(": ")}<b>{localizeNode("0")}</b></span><span>{localizeNode(copy.personal)}{localizeNode(": ")}<b>{localizeNode("0")}</b></span></div></div></article>
      </div>
      <div className="analytics-status-grid">{localizeNode(statuses.map(status => <article className="analytics-surface" key={status.key} style={{ '--status-color': status.color } as CSSProperties}><span className="analytics-status-label"><i aria-hidden="true">{localizeNode(status.icon)}</i>{localizeNode(copy.statuses[status.key])}</span><strong>{localizeNode(number(status.value))}</strong></article>))}</div>
      <div className="analytics-charts">
        <section className="analytics-chart"><h4>{localizeNode(copy.trendTitle)}</h4>
          <div className="analytics-legend">{localizeNode(trend.map(series => <span key={series.key}><i style={{ background: series.color }} />{localizeNode(copy.statuses[series.key])}</span>))}</div>
          <svg className="analytics-line" viewBox="0 0 340 190" role="img" aria-label={translateText(copy.trendDescription)}>
            {localizeNode([0, 4, 8].map(value => <g key={value}><line x1="25" x2="325" y1={150-value*15} y2={150-value*15} stroke="#9fe7d015" /><text x="8" y={154-value*15}>{localizeNode(value)}</text></g>))}
            {localizeNode(trend.map(series => <g key={series.key}><polyline points={series.values.map((value, i) => `${25+i*50},${150-value*15}`).join(' ')} fill="none" stroke={series.color} strokeWidth="2" strokeLinejoin="round" strokeDasharray={series.key === 'disabled' ? '4 3' : undefined} />{localizeNode(series.values.map((value, i) => <circle key={i} cx={25+i*50} cy={150-value*15} r="2.5" fill={series.color} />))}</g>))}
            {localizeNode(dates.map((date, i) => <text key={date} x={25+i*50} y="178" textAnchor="middle">{localizeNode(date)}</text>))}
          </svg>
        </section>
        <section className="analytics-chart"><h4>{localizeNode(copy.structureTitle)}</h4><div className="analytics-donut-content">
          <svg className="analytics-donut" viewBox="0 0 160 160" role="img" aria-label={translateText(copy.structureDescription)}>
            <circle cx="80" cy="80" r="57" fill="none" stroke="#a1e7d00b" strokeWidth="15" />
            {localizeNode(statuses.map((status, i) => <circle key={status.key} cx="80" cy="80" r="57" fill="none" stroke={status.color} strokeWidth="15" pathLength="100" strokeDasharray={`${status.value/statusTotal*100} ${100-status.value/statusTotal*100}`} strokeDashoffset={-statuses.slice(0,i).reduce((sum,s)=>sum+s.value,0)/statusTotal*100} transform="rotate(-90 80 80)" />))}
            <text x="80" y="77" textAnchor="middle" className="analytics-donut-count">{localizeNode(number(statusTotal))}</text><text x="80" y="96" textAnchor="middle">{localizeNode(copy.classified)}</text>
          </svg>
          <div className="analytics-legend analytics-legend--vertical">{localizeNode(statuses.map(status => <span key={status.key}><i style={{ background: status.color }} />{localizeNode(copy.statuses[status.key])}<b>{localizeNode(number(status.value))}</b></span>))}</div>
        </div></section>
      </div>
      <section className="analytics-risk"><div className="analytics-risk-heading"><Shield /><h4>{localizeNode(copy.riskTitle)}</h4><span className="analytics-pill">{localizeNode(copy.noWarnings)}</span></div><div className="analytics-risk-stats"><span>{localizeNode(copy.lostAccess)}{localizeNode(": ")}<b>{localizeNode("0")}</b></span><span>{localizeNode(copy.hiddenAdmins)}{localizeNode(": ")}<b>{localizeNode("0")}</b></span></div></section>
    </div>
    <div className="analytics-floating">
      <article className="analytics-float analytics-float--trend"><span>{localizeNode(copy.floatingTrendTitle)}</span><strong>{localizeNode(copy.stable)}</strong><svg className="analytics-sparkline" viewBox="0 0 160 24" fill="none" aria-hidden="true"><path d="m2 19 26-5 26 2 26-7 26 2 26-6 26-2" /><circle cx="158" cy="3" r="2" /></svg><small>{localizeNode(copy.floatingTrendCaption)}</small></article>
      <article className="analytics-float analytics-float--risk"><span>{localizeNode(copy.riskTitle)}</span><div className="analytics-float-shield"><Shield /></div><strong>{localizeNode(copy.zeroWarnings)}</strong><small>{localizeNode(copy.floatingRiskCaption)}</small></article>
    </div>
  </div>
}
